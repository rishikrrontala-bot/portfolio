# Rishik Rontala — Portfolio

A single-page portfolio in the vein of [Unseen Studio](https://unseen.co): an entry gate,
enormous type, one accent colour, a generative hero set-piece, a drag-to-explore plane, and
motion that
is used to direct attention rather than to decorate.

Bone `#F4F1EA` · Ink `#100F0D` · Terracotta `#DA532C`.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # → dist/
npm run preview      # serve the production build
npm run build:single # → dist-single/index.html, one self-contained file
```

Node 18+.

---

## Change what it says — one file

Everything the site displays lives in **`src/data/site.js`**. Nothing else needs editing to
make this yours.

| Export | What it drives |
| --- | --- |
| `identity` | Name, headline lines, discipline, proposition, email, location, availability, social links |
| `manifesto` | The scroll-scrubbed statement, one array entry per line |
| `about` | About heading, paragraphs, and the facts table |
| `capabilities` | The marquee strip |
| `categories` | The five filter chips on the work index — fixed, see below |
| `work` | One object per project: the work index, the drag plane, and one full page per entry |
| `worldFragments` | The statements and stats interleaved into the drag plane |
| `nav` | Menu items |

### Completed projects only

The portfolio is a curated list, not an automatic list of repositories. Add a project only when its implementation is working and its README or handoff documents the delivered scope. A deployment URL or an expired deadline is not completion evidence. Check the current README: repository descriptions can retain old “in progress” text.

Keep placeholder repositories and partially integrated builds out. A completed prototype may be listed when its intended interaction works; label its scope and limitations explicitly. Do not claim submission just because a build is finished. For a private repository, link only its public app.

The October 7, 2026 review retained eight verified existing projects and added Scent Shelf, Stillwarm, In Its Place, Sightline, Withheld, Submitline, Returnline and Patchline. Muslin remains excluded because its photo pipeline is not integrated. Emoji → Emotion was removed because its completion could not be verified from the account. Remaining hackathon placeholder repositories are excluded.

The October 28, 2026 review went through every repository on the account. It added Elsewhen (Congressional App Challenge 2026; private repository, so only its live app and demo video are linked), RunoffLab, Set Room and Offcut, and folded Patchline Lab and Patchline Bench into the existing Patchline entry rather than giving one idea three tiles. It also replaced eighteen free-form tags with five fixed categories, and listed every repository that is deliberately left off — with the reason — in `sync/curation.json`.

### Five categories, no more

The work index filters by **AI & ML · Health & Science · Education · Tools · Interactive** —
the `categories` export. Every project picks exactly one. The list is fixed on purpose: the site
used to build its chips from free-form tags, and twenty projects produced eighteen chips. If a
new project seems to need a sixth category, it goes in the closest of these five. `npm test`
fails on a category that is not in the list, on an empty category, and on any `tags` field.

### Adding a project

Add an object anywhere in `work`. The site sorts projects newest first by `date` and numbers
them, so there is no `index` or `year` to keep in step. Everything else — the index tile, the
hover preview, a tile on the drag plane, its own route at `/#/work/<slug>`, the "next project"
link, the `01 / 20` counter and its category filter — updates itself.

```js
{
  slug: 'thing',                       // becomes /#/work/thing
  title: 'The Thing',
  titleLines: ['The', 'Thing'],        // explicit line breaks for the display setting
  kicker: 'Python · Solo',
  date: '2026-11-02',                  // finished or submitted; sets order, number and year
  role: 'What you actually did',
  status: 'Shipped',                   // Shipped · Submitted · Published · Completed prototype
  category: 'Tools',                   // exactly one of `categories`
  hue: 150,                            // 0–359; picks the generated cover art
  summary: 'One sentence for the index row.',
  lead: 'The line that lands at the top of the page.',
  body: ['Paragraph.', 'Paragraph.'],
  highlights: [['Label', 'Value'], ['Label', 'Value'], ['Label', 'Value'], ['Label', 'Value']],
  links: [
    { label: 'Live demo', href: 'https://…' },
    { label: 'GitHub', href: 'https://github.com/…' },
    { label: 'Lab demo', href: 'https://…', secondary: true }, // project page only
  ],
}
```

Tiles sit two to a row, so `npm test` checks that each project's `hue` is at least 30° from the
projects beside and below it; if it complains, move the new hue until it passes.

**Covers are split by context** (`src/components/ProjectPlate.jsx`). On the index — the work
grid, the hover preview, the drag plane — every project gets generated artwork: deterministic
warped contour rings over a hue-shifted ground, seeded from the `slug`, so the front of the site
reads as one set of objects rather than a row of screenshots at a row of different densities.
Same slug, same artwork, every time, and nothing to download until you open a project.

The project page uses the real thing instead: a screenshot of that project's own app,
from `src/assets/work/<slug>.jpg` at 1600×1000. Drop a file in, add it to the `covers` map, and
that page picks it up; a project with no screenshot falls back to its generated plate. `npm test`
checks that every cover belongs to a real slug and is exactly 1600×1000. `hue` recolours the generated art — pick one well away from its neighbours,
since the plates sit side by side in the grid.

---

## The motion system

Five effects, used deliberately, plus one house easing curve (`0.16, 1, 0.3, 1`) applied to
everything so the whole site moves with one accent.

| Where | What | File |
| --- | --- | --- |
| Entry | Load counter → click-and-hold ring → curtain lifts | `components/Preloader.jsx` |
| Everywhere | Line-masked word reveal on scroll | `components/Reveal.jsx` |
| Statement | Word-by-word opacity scrubbed to scroll position | `components/Manifesto.jsx` |
| Hero | Generative flow field: particles advected through simplex noise | `components/HeroField.jsx` |
| World | Infinite drag plane, tiles wrapped modulo the grid | `components/WorldGrid.jsx` |
| Pointer | Morphing cursor + magnetic attraction | `components/Atmosphere.jsx`, `lib/hooks.js` |
| Routes | Two curtains — one drops, one lifts | `components/PageShell.jsx` |

Lenis drives scroll and is synced to GSAP's ticker, so ScrollTrigger and smooth scrolling never
fight each other (`lib/hooks.js` → `useSmoothScroll`).

### The hero, and the one canvas gotcha worth knowing

The hero is a flow field: a few thousand particles advected through two octaves of seeded
simplex noise, each leaving an ink trail, with one slowly travelling region of *coherence*
inside which the strokes align, sharpen and take terracotta. The legible form is made of the
same strokes as the noise around it — which is the manifesto's claim, drawn.

Trails decay by **erasing alpha**, not by painting a translucent background colour:

```js
ctx.globalCompositeOperation = 'destination-out';
ctx.fillStyle = 'rgba(0,0,0,0.011)';
ctx.fillRect(0, 0, w, h);
ctx.globalCompositeOperation = 'source-over';
```

Painting bone over the canvas each frame would work, but it would also hide the procedural
gradient wash the canvas is layered over. Strokes are batched into eight paths by coherence, so
a frame costs eight `stroke()` calls rather than a few thousand. Under `prefers-reduced-motion`
there is no animation frame at all: a bounded number of simulation steps runs once at mount and
the finished still stays on screen.

---

## Accessibility

Verified by `npm run verify`, not assumed:

- **WCAG 2.2 AA contrast** on every text pair, checked numerically. Small text on bone uses
  `terra-deep` `#B33F1C` (5.11:1); `#DA532C` is reserved for display type and non-text UI.
  The scroll counter uses `mix-blend-mode: difference` because no single colour clears 4.5:1
  against both the bone and the ink sections.
- **`prefers-reduced-motion`** — the custom cursor is removed, the entry gate opens on a single
  click, scrubbed text renders at full opacity, and every reveal resolves to its end state.
- **Keyboard** — the site can be entered without a mouse; the gate takes focus and the page
  behind it is `inert`; the drag plane responds to arrow keys; a skip link jumps to the work.
- **Semantics** — one `h1`, no skipped heading levels, real landmarks, accessible names on every
  control, JSON-LD `Person`.

Touch devices get the drag plane on a `pan-y` axis so vertical page scrolling still works, and
the cursor and magnetic effects are gated behind `(hover: hover) and (pointer: fine)`.

---

## Performance

Lighthouse against the production build:

| | |
| --- | --- |
| Performance | **91** |
| Accessibility | **100** |
| Best Practices | **96** |
| SEO | **100** |
| CLS | **0** |

The hero artwork is code-split, fetched on an idle callback while the visitor is looking at the
entry gate, and mounted only once the gate opens — so it never sits in front of first paint.
Fonts load non-blocking. Only `transform` and `opacity` are animated. The index requests no
images at all — its cover art is SVG and CSS, and the grain and hero are canvas — so the only
image request on the site is the one lazy-loaded screenshot on a project page you have opened.

---

## Deploy

### GitHub Pages — one command

```bash
./deploy.sh
```

Creates the repo, pushes it, and switches Pages on. The site is live at
`https://<you>.github.io/portfolio/` about two minutes later, and
`.github/workflows/deploy.yml` rebuilds it on every push after that.

Pass a different repo name if you want one: `./deploy.sh my-site`.

Without the GitHub CLI (`brew install gh`) the script tells you to create the empty repo at
[github.com/new](https://github.com/new) and then takes its URL:

```bash
./deploy.sh https://github.com/<you>/portfolio
```

Either way GitHub's own browser login handles the sign-in — the script never sees a password
or a token.

### Keeping the work index in step with GitHub

Every Monday `.github/workflows/github-sync.yml` runs `scripts/fetch-github.mjs`, which
writes the account's public repos — description, homepage, topics, languages, README — to
`sync/github.json` and commits it only when something changed. An hour later a scheduled
Claude Code routine reads that file, writes a `projects` entry for any repo not yet in
`site.js`, and opens a pull request. Merging it deploys. Nothing is added to the site
without a review, and nothing in the entry can come from anywhere but the repo's own README.

`sync/curation.json` records every public repository that is deliberately *not* on the site —
placeholders, unfinished builds — with the reason, plus the private repositories that are linked
only through their live apps. `npm test` lists any repository in the snapshot that is neither on
the site nor in that file, as a to-do rather than a failure, so a brand-new repo never blocks a
deploy but never goes unnoticed either.

The snapshot is fetched here rather than by the routine because the routine's sandbox can
only reach this repository. Run it by hand with `GITHUB_TOKEN=$(gh auth token) node
scripts/fetch-github.mjs`.

### Vercel

Import the repo at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Vite;
`vercel.json` pins the build command, output directory and asset caching. Add a custom domain
under **Project → Domains** and Vercel provisions SSL once DNS resolves.

Both work without rewrite rules: `base: './'` keeps asset URLs relative, and `HashRouter`
keeps project pages resolvable on a static host — including a subpath like `/portfolio/`.

---

## Verify before shipping

```bash
npm test                           # content: categories, order, links, hues, covers, GitHub coverage
npm run build && npm run preview   # in one terminal
npm run verify                     # contrast, reduced motion, keyboard, semantics, overflow, filters
npm run shots                      # screenshots of every section at 1440px and 390px → shots/
```

`npm test` runs in the deploy workflow before the build, so a malformed entry never reaches the
live site. `npm run verify` exits non-zero on any failure; it also clicks through all five
category chips and checks each one shows exactly its projects. Set `CHROMIUM_PATH` to point it at
a local Chromium when Playwright's own browser download is not available.

---

## Structure

```
src/
  data/site.js          ← all content
  lib/gsap.js           registered plugins + the house easing curve
  lib/hooks.js          smooth scroll, magnetics, cursor bus, media queries
  components/
    Preloader.jsx       entry gate
    Nav.jsx             bar + fullscreen menu (inverts over dark sections)
    Hero.jsx            kinetic headline + the hero set-piece
    HeroField.jsx       Canvas 2D flow field, seeded simplex noise
    Manifesto.jsx       scrubbed statement
    WorkIndex.jsx       filterable image-tile grid + cursor-following preview
    WorldGrid.jsx       infinite drag plane
    About.jsx           about + capabilities marquee
    Contact.jsx         contact + oversized wordmark footer
    ProjectPlate.jsx    project cover: screenshot, or generated art
    Reveal.jsx          the reveal primitives
    Atmosphere.jsx      grain, cursor, scroll progress
    PageShell.jsx       route transitions
  pages/                Home, Project, NotFound
tests/
  site.test.mjs         content checks for site.js (npm test)
scripts/
  verify.mjs            the accessibility + semantics suite
  shoot.mjs             screenshot every section at two viewports
  fetch-github.mjs      snapshot the GitHub profile into sync/github.json
sync/
  github.json           the account's public repos, metadata and READMEs
  curation.json         repos deliberately left off the site, and why
```
