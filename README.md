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
| `projects` | The work index, the drag plane, and one full page per entry |
| `worldFragments` | The statements and stats interleaved into the drag plane |
| `nav` | Menu items |

### Adding a project

Append an object to `projects`. Everything else — the index row, the hover preview, a tile on
the drag plane, its own route at `/#/work/<slug>`, the "next project" link, the `01 / 04`
counter, the filter chips — updates itself.

```js
{
  slug: 'thing',                       // becomes /#/work/thing
  index: '03',
  title: 'The Thing',
  titleLines: ['The', 'Thing'],        // explicit line breaks for the display setting
  kicker: 'Python · Solo',
  year: '2026',
  role: 'What you actually did',
  status: 'Shipped',
  tags: ['AI', 'Tooling'],             // these become the filter chips
  hue: 150,                            // 0–360; picks the generated cover art
  summary: 'One sentence for the index row.',
  lead: 'The line that lands at the top of the page.',
  body: ['Paragraph.', 'Paragraph.'],
  highlights: [['Label', 'Value'], ['Label', 'Value']],
}
```

**There are no image files.** Every project cover is generated from its `slug` and `hue` —
deterministic warped contour rings over a hue-shifted ground (`src/components/ProjectPlate.jsx`).
Same slug, same artwork, every time, and nothing to download. Change `hue` to recolour a project.

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
Fonts load non-blocking. Only `transform` and `opacity` are animated. The only image requests on
the site are the three lazy-loaded project screenshots; the grain, the hero and the remaining
cover art are canvas, SVG and CSS.

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

### Vercel

Import the repo at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Vite;
`vercel.json` pins the build command, output directory and asset caching. Add a custom domain
under **Project → Domains** and Vercel provisions SSL once DNS resolves.

Both work without rewrite rules: `base: './'` keeps asset URLs relative, and `HashRouter`
keeps project pages resolvable on a static host — including a subpath like `/portfolio/`.

---

## Verify before shipping

```bash
npm run build && npm run preview   # in one terminal
npm run verify                     # contrast, reduced motion, keyboard, semantics, overflow
npm run shots                      # screenshots of every section at 1440px and 390px → shots/
```

`npm run verify` exits non-zero on any failure, so it drops straight into CI.

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
scripts/
  verify.mjs            the accessibility + semantics suite
  shoot.mjs             screenshot every section at two viewports
```
