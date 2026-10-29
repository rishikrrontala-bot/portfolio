# Working on this portfolio

Read `README.md` first. The short version, for any AI session making changes here:

- **All content is in `src/data/site.js`.** Projects are objects in the `work` array.
- **Five categories, fixed:** `AI & ML`, `Health & Science`, `Education`, `Tools`, `Interactive`.
  Every project has exactly one `category` from that list. Never add a category, and never add a
  `tags` field — that is what once turned the filter into eighteen chips.
- **Do not write `index` or `year`.** Projects are sorted newest first by `date` (`YYYY-MM-DD`)
  and numbered automatically.
- **Pick a `hue` that passes `npm test`** — neighbouring tiles must be at least 30° apart.
- **Only finished projects go on the site.** A placeholder or unfinished repo goes in
  `sync/curation.json` under `excluded`, with a one-line reason. Private repos (listed under
  `privateLiveOnly`) are linked by their live app only, never by a GitHub link.
- A new edition of a project already on the site becomes `secondary: true` links on that
  project, not a new tile.
- Every fact in an entry comes from that project's own README. Do not invent numbers or events.
- Before committing: `npm test`, `npm run lint`, `npm run build`. Tests must pass; a test marked
  TODO (an untriaged repo, a missing cover) is information, not a failure.
