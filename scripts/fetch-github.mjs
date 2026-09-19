// Snapshot the public GitHub profile into sync/github.json.
//
// Run weekly by .github/workflows/github-sync.yml, then read by the cloud
// routine that keeps src/data/site.js in step with what is actually on GitHub.
// The routine's sandbox can only reach this repository, so the discovery has
// to happen here, where GITHUB_TOKEN can list the account's repos.
//
// Only fields that change when a project meaningfully changes are kept — no
// timestamps, stars or push dates — so the file is byte-stable between runs
// and the workflow commits nothing when nothing happened.

import { mkdir, writeFile } from 'node:fs/promises';

const USER = process.env.GITHUB_USER || 'rishikrrontala-bot';
const OUT = new URL('../sync/github.json', import.meta.url);
const API = 'https://api.github.com';

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'portfolio-sync',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function get(path, accept) {
  const res = await fetch(`${API}${path}`, { headers: accept ? { ...headers, Accept: accept } : headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return accept ? res.text() : res.json();
}

const user = await get(`/users/${USER}`);
const all = await get(`/users/${USER}/repos?per_page=100&type=owner&sort=full_name`);

const repos = [];
for (const r of all) {
  // Forks are not this account's work, and the site does not describe itself.
  if (r.fork || r.name === 'portfolio') continue;
  const [languages, readme] = await Promise.all([
    get(`/repos/${USER}/${r.name}/languages`),
    get(`/repos/${USER}/${r.name}/readme`, 'application/vnd.github.raw+json'),
  ]);
  repos.push({
    name: r.name,
    url: r.html_url,
    description: r.description,
    homepage: r.homepage || null,
    has_pages: r.has_pages,
    pages_url: r.has_pages ? `https://${USER}.github.io/${r.name}/` : null,
    default_branch: r.default_branch,
    archived: r.archived,
    created_at: r.created_at,
    topics: r.topics ?? [],
    language: r.language,
    languages: languages ?? {},
    license: r.license?.spdx_id ?? null,
    readme,
  });
}

const snapshot = {
  profile: {
    login: user.login,
    name: user.name,
    bio: user.bio,
    blog: user.blog || null,
    location: user.location,
    company: user.company,
    twitter: user.twitter_username,
    url: user.html_url,
  },
  repos,
};

await mkdir(new URL('../sync/', import.meta.url), { recursive: true });
await writeFile(OUT, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`sync/github.json — ${repos.length} repos: ${repos.map((r) => r.name).join(', ')}`);
