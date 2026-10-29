// Content checks for src/data/site.js — the one file every edit goes through.
// Run with `npm test`. No dependencies: Node's own test runner.
//
// These exist so a hand edit or the weekly GitHub sync cannot quietly bring
// back the problems this file has already had: twenty one-off filter chips,
// hand-numbered indexes that drift, neighbouring tiles in the same colour,
// covers pointing at slugs that no longer exist, and repos that are on GitHub
// but nowhere on the site with no record of why.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { categories, projects, worldFragments, identity } from '../src/data/site.js';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const siteSource = read('src/data/site.js');

const STATUSES = ['Shipped', 'Submitted', 'Published', 'Completed prototype'];
const MIN_HUE_GAP = 30;

/* ── categories ─────────────────────────────────────────────────────────── */

test('there are exactly five categories, all distinct', () => {
  assert.equal(categories.length, 5);
  assert.equal(new Set(categories).size, 5);
  for (const c of categories) assert.ok(typeof c === 'string' && c.trim() === c && c.length > 0);
});

test('every project sits in exactly one of the five categories', () => {
  for (const p of projects) {
    assert.equal(typeof p.category, 'string', `${p.slug} has no category`);
    assert.ok(categories.includes(p.category), `${p.slug}: "${p.category}" is not one of ${categories.join(', ')}`);
  }
});

test('every category has at least one project, so no filter chip comes up empty', () => {
  for (const c of categories) {
    assert.ok(projects.some((p) => p.category === c), `no project in "${c}"`);
  }
});

test('free-form tags are gone for good — they are what turned five filters into eighteen', () => {
  for (const p of projects) assert.equal(p.tags, undefined, `${p.slug} still has tags`);
  assert.doesNotMatch(siteSource, /^\s+['"]?tags['"]?\s*:/m);
});

/* ── order and numbering ────────────────────────────────────────────────── */

test('projects run newest first and are numbered 01, 02, … with no gaps', () => {
  projects.forEach((p, i) => {
    assert.equal(p.index, String(i + 1).padStart(2, '0'));
    if (i) assert.ok(projects[i - 1].date >= p.date, `${projects[i - 1].slug} is listed before newer ${p.slug}`);
  });
});

test('index and year are derived, never written by hand', () => {
  assert.doesNotMatch(siteSource, /^\s+['"]?index['"]?\s*:\s*['"]\d/m);
  assert.doesNotMatch(siteSource, /^\s+['"]?year['"]?\s*:\s*['"]\d/m);
  for (const p of projects) assert.equal(p.year, p.date.slice(0, 4));
});

/* ── each entry ─────────────────────────────────────────────────────────── */

test('slugs are unique and safe to put in a URL', () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate slug');
  for (const s of slugs) assert.match(s, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});

for (const p of projects) {
  test(`${p.slug}: complete and well-formed`, () => {
    for (const k of ['title', 'kicker', 'role', 'summary', 'lead']) {
      assert.ok(typeof p[k] === 'string' && p[k].trim().length > 0, `missing ${k}`);
      assert.doesNotMatch(p[k], /\b(TODO|TBD|lorem|undefined|null)\b|\s{2,}/i, `${k} looks unfinished`);
    }

    assert.match(p.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(Date.parse(`${p.date}T00:00:00Z`)), `bad date ${p.date}`);
    assert.equal(new Date(`${p.date}T00:00:00Z`).toISOString().slice(0, 10), p.date, `impossible date ${p.date}`);

    assert.ok(STATUSES.includes(p.status), `status "${p.status}" is not one of ${STATUSES.join(', ')}`);

    // titleLines are the display line breaks of the title, nothing more.
    assert.ok(Array.isArray(p.titleLines) && p.titleLines.length >= 1 && p.titleLines.length <= 3);
    const squash = (s) => s.replace(/\s+/g, '').toLowerCase();
    assert.equal(squash(p.titleLines.join('')), squash(p.title), 'titleLines do not spell the title');

    assert.ok(Array.isArray(p.body) && p.body.length >= 1 && p.body.length <= 5, 'body needs 1–5 paragraphs');
    for (const para of p.body) {
      assert.ok(typeof para === 'string' && para.trim().length > 40, 'empty or stub paragraph');
      assert.doesNotMatch(para, /\b(TODO|TBD|lorem)\b|\s{2,}/i);
    }

    assert.equal(p.highlights.length, 4, 'exactly four highlights');
    const labels = p.highlights.map(([k]) => k);
    assert.equal(new Set(labels).size, 4, 'highlight labels repeat');
    for (const pair of p.highlights) {
      assert.equal(pair.length, 2);
      for (const s of pair) assert.ok(typeof s === 'string' && s.trim().length > 0);
    }

    assert.ok(Number.isInteger(p.hue) && p.hue >= 0 && p.hue < 360, `hue ${p.hue}`);
  });

  test(`${p.slug}: links are real, labelled once, with one on the card`, () => {
    assert.ok(Array.isArray(p.links) && p.links.length > 0, 'no links');
    assert.ok(p.links.some((l) => !l.secondary), 'every link is secondary, so the card shows none');
    const labels = p.links.map((l) => l.label);
    assert.equal(new Set(labels).size, labels.length, 'two links share a label');
    for (const l of p.links) {
      assert.ok(typeof l.label === 'string' && l.label.length > 0);
      const url = new URL(l.href);
      assert.equal(url.protocol, 'https:', `${l.href} is not https`);
      assert.ok(l.secondary === undefined || l.secondary === true);
    }
  });
}

/* ── the grid ───────────────────────────────────────────────────────────── */

test('neighbouring tiles never share a colour', () => {
  // Two tiles to a row: a project touches the next one (beside it, and next
  // in reading order) and the one after that (directly below it).
  const gap = (a, b) => {
    const d = Math.abs(a - b) % 360;
    return Math.min(d, 360 - d);
  };
  for (let i = 0; i < projects.length; i += 1) {
    for (const j of [i + 1, i + 2]) {
      if (j >= projects.length) continue;
      const d = gap(projects[i].hue, projects[j].hue);
      assert.ok(
        d >= MIN_HUE_GAP,
        `${projects[i].slug} (${projects[i].hue}) and ${projects[j].slug} (${projects[j].hue}) are only ${d}° apart — need ${MIN_HUE_GAP}°`,
      );
    }
  }
});

/* ── covers ─────────────────────────────────────────────────────────────── */

function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

test('every cover belongs to a real project and is a 1600×1000 screenshot', () => {
  const plate = read('src/components/ProjectPlate.jsx');
  const imports = Object.fromEntries(
    [...plate.matchAll(/import (\w+) from '\.\.\/assets\/work\/([\w-]+\.jpg)';/g)].map(([, name, file]) => [name, file]),
  );
  const block = plate.slice(plate.indexOf('const covers = {'), plate.indexOf('};', plate.indexOf('const covers = {')));
  const entries = [...block.matchAll(/^\s+'?([\w-]+)'?: (\w+),$/gm)].map(([, slug, name]) => [slug, name]);
  assert.ok(entries.length > 0, 'could not read the covers map');

  const slugs = new Set(projects.map((p) => p.slug));
  for (const [slug, name] of entries) {
    assert.ok(slugs.has(slug), `cover for "${slug}", which is not a project`);
    const file = imports[name];
    assert.ok(file, `${name} is not imported`);
    const path = new URL(`src/assets/work/${file}`, root);
    assert.ok(existsSync(path), `missing ${file}`);
    assert.deepEqual(jpegSize(readFileSync(path)), { width: 1600, height: 1000 }, `${file} is not 1600×1000`);
  }
});

// A project page without a screenshot still works (it falls back to the
// generated plate), so a missing cover is a to-do, not a failure.
{
  const plate = read('src/components/ProjectPlate.jsx');
  const block = plate.slice(plate.indexOf('const covers = {'), plate.indexOf('};', plate.indexOf('const covers = {')));
  const withCover = new Set([...block.matchAll(/^\s+'?([\w-]+)'?: \w+,$/gm)].map(([, slug]) => slug));
  const without = projects.filter((p) => !withCover.has(p.slug)).map((p) => p.slug);
  test(
    'every project page shows a real screenshot',
    without.length ? { todo: `no cover yet: ${without.join(', ')}` } : {},
    () => assert.deepEqual(without, []),
  );
}

/* ── GitHub coverage ────────────────────────────────────────────────────── */

const curation = JSON.parse(read('sync/curation.json'));
const snapshot = JSON.parse(read('sync/github.json'));
const linked = projects.flatMap((p) => p.links.map((l) => l.href.replace(/\/+$/, '')));
const covers = (repoUrl) => linked.some((h) => h === repoUrl || h.startsWith(`${repoUrl}/`));

test('no project links to a repo the curation list excludes', () => {
  for (const name of Object.keys(curation.excluded)) {
    const url = `https://github.com/${snapshot.profile.login}/${name}`;
    assert.ok(!covers(url), `${name} is excluded in sync/curation.json but linked from the site`);
  }
});

test('private repositories are linked only through their live apps', () => {
  for (const name of Object.keys(curation.privateLiveOnly)) {
    const url = `https://github.com/${snapshot.profile.login}/${name}`;
    assert.ok(!covers(url), `${name} is private; its GitHub link would 404 for visitors`);
  }
});

// A repo that is new on GitHub and not yet triaged should be visible, but it
// should not block a deploy — so it is reported as a to-do rather than a failure.
const untriaged = snapshot.repos
  .filter((r) => !r.archived)
  .filter((r) => !covers(r.url.replace(/\/+$/, '')) && !(r.name in curation.excluded))
  .map((r) => r.name);

test(
  'every public repo on GitHub is either on the site or listed with a reason',
  untriaged.length ? { todo: `untriaged: ${untriaged.join(', ')}` } : {},
  () => assert.deepEqual(untriaged, []),
);

/* ── the rest of the page ───────────────────────────────────────────────── */

test('world fragments are well-formed', () => {
  assert.ok(worldFragments.length >= 8);
  for (const f of worldFragments) {
    if (f.kind === 'statement') assert.ok(typeof f.text === 'string' && f.text.length > 0);
    else if (f.kind === 'stat') assert.ok(f.label && f.value);
    else assert.fail(`unknown fragment kind ${f.kind}`);
  }
});

test('contact links point somewhere', () => {
  for (const s of identity.socials) assert.match(s.href, /^(https:\/\/|mailto:)/);
});
