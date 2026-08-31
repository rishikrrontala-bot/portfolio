# Rishik Rontala — Portfolio

A single-page portfolio in the vein of [Unseen Studio](https://unseen.co): an entry gate,
enormous type, one accent colour, a WebGL object, a drag-to-explore plane, and motion that
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
| Hero | Noise-displaced WebGL object, normals rebuilt per frame | `components/HeroCanvas.jsx` |
| World | Infinite drag plane, tiles wrapped modulo the grid | `components/WorldGrid.jsx` |
| Pointer | Morphing cursor + magnetic attraction | `components/Atmosphere.jsx`, `lib/hooks.js` |
| Routes | Two curtains — one drops, one lifts | `components/PageShell.jsx` |

Lenis drives scroll and is synced to GSAP's ticker, so ScrollTrigger and smooth scrolling never
fight each other (`lib/hooks.js` → `useSmoothScroll`).

### The one WebGL gotcha worth knowing

`<shaderMaterial uniforms={obj} />` does **not** guarantee the renderer keeps your object
reference. Mutating the object you passed in silently does nothing. Read uniforms off the live
material instead:

```jsx
const mat = useRef(null);
useFrame((_, dt) => {
  const u = mat.current?.uniforms;
  if (u) u.uTime.value += dt;
});
// …
<shaderMaterial ref={mat} uniforms={uniforms} … />
```

The vertex shader also rebuilds its normals by finite difference after displacement. Without
that step the lighting keeps describing the original sphere and the displacement reads as a flat
gradient rather than as geometry.

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

The WebGL chunk (`three` + `@react-three/fiber`) is code-split, fetched on an idle callback
while the visitor is looking at the entry gate, and mounted only once the gate opens — so it
never sits in front of first paint. Fonts load non-blocking. Only `transform` and `opacity`
are animated. There are no image requests at all: the grain, the covers and the fallback poster
are SVG and CSS.

---

## Deploy

```bash
git init && git add -A && git commit -m "Portfolio"
gh repo create rishik-portfolio --public --source=. --push
```

Then import the repo at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Vite;
`vercel.json` pins the build command, output directory and asset caching. Add a custom domain
under **Project → Domains** and Vercel provisions SSL once DNS resolves.

Routing uses `HashRouter`, so project pages work on any static host with no rewrite rules —
including a plain `dist/index.html` opened from disk.

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
    Hero.jsx            kinetic headline + WebGL object
    HeroCanvas.jsx      R3F scene, simplex-noise displacement shader
    Manifesto.jsx       scrubbed statement
    WorkIndex.jsx       filterable index + cursor-following preview
    WorldGrid.jsx       infinite drag plane
    About.jsx           about + capabilities marquee
    Contact.jsx         contact + oversized wordmark footer
    ProjectPlate.jsx    generated cover art
    Reveal.jsx          the reveal primitives
    Atmosphere.jsx      grain, cursor, scroll progress
    PageShell.jsx       route transitions
  pages/                Home, Project, NotFound
scripts/
  verify.mjs            the accessibility + semantics suite
  shoot.mjs             screenshot every section at two viewports
```
