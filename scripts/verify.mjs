import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:4173';
const OUT = new URL('../shots/', import.meta.url).pathname;
const fails = [];
const ok = (m) => console.log('  ✓', m);
const bad = (m) => {
  fails.push(m);
  console.log('  ✗', m);
};

/* ── contrast maths (WCAG 2.2) ───────────────────────────────────────────── */
const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

console.log('\n── colour contrast (WCAG 2.2 AA) ──');
const pairs = [
  ['ink on bone (body)', '#100F0D', '#F4F1EA', 4.5],
  ['ink-soft on bone (paragraphs)', '#2A2724', '#F4F1EA', 4.5],
  ['ash on bone (mono labels)', '#736D63', '#F4F1EA', 4.5],
  ['terra-deep on bone (accent text)', '#B33F1C', '#F4F1EA', 4.5],
  ['bone on ink (dark sections)', '#F4F1EA', '#100F0D', 4.5],
  ['terra on ink (footer link)', '#DA532C', '#100F0D', 4.5],
  // bone at 55% over ink — the mono labels inside every dark section.
  ['bone/55 on ink (dark-section labels)', '#8D8B86', '#100F0D', 4.5],
  // Non-text UI: the scroll-progress bar against the page.
  ['terra on bone (progress bar, UI)', '#DA532C', '#F4F1EA', 3],
];
for (const [name, fg, bg, min] of pairs) {
  const r = ratio(hex(fg), hex(bg));
  const line = `${name}: ${r.toFixed(2)}:1 (needs ${min}:1)`;
  if (r >= min) ok(line);
  else bad(line);
}

/* ── runtime checks ──────────────────────────────────────────────────────── */
const browser = await chromium.launch();

console.log('\n── reduced motion ──');
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.locator('button[aria-label="Click & hold to enter the site"]').click();
  await page.waitForTimeout(1200);

  const gate = await page.evaluate(() => {
    const pre = document.querySelector('[aria-label="Click & hold to enter the site"]');
    return !pre || !pre.offsetParent;
  });
  gate ? ok('entry gate opens on a single click') : bad('entry gate still blocking');

  const hero = await page.locator('h1').first().boundingBox();
  hero && hero.height > 50 ? ok('hero headline rendered') : bad('hero headline missing');

  const cursorCount = await page.locator('div.fixed.z-\\[9999\\].rounded-full').count();
  cursorCount === 0 ? ok('custom cursor disabled') : bad('custom cursor still active');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}a11y-reduced-motion.png` });

  const faded = await page.evaluate(() => {
    const words = [...document.querySelectorAll('[data-mw]')];
    return words.length ? words.every((w) => parseFloat(getComputedStyle(w).opacity) > 0.9) : true;
  });
  faded ? ok('scrubbed statement is fully legible (no faded words)') : bad('statement words stuck faded');

  errs.length ? bad(`page errors: ${errs.join('; ')}`) : ok('no runtime errors');
  await page.close();
}

console.log('\n── keyboard ──');
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);

  // Enter via keyboard alone — tab until the hold button has focus.
  for (let i = 0; i < 6; i += 1) {
    await page.keyboard.press('Tab');
    const onGate = await page.evaluate(
      () =>
        document.activeElement?.getAttribute('aria-label') ===
        'Click & hold to enter the site',
    );
    if (onGate) break;
  }
  await page.keyboard.down('Enter');
  await page.waitForTimeout(1400);
  await page.keyboard.up('Enter');
  await page.waitForTimeout(2200);
  const entered = await page.evaluate(() => {
    const pre = document.querySelector('[aria-label="Click & hold to enter the site"]');
    return !pre || !pre.offsetParent;
  });
  entered ? ok('site can be entered with the keyboard alone') : bad('keyboard cannot pass the gate');

  const reach = [];
  for (let i = 0; i < 26; i += 1) {
    await page.keyboard.press('Tab');
    reach.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        if (!a || a === document.body) return null;
        const s = getComputedStyle(a);
        return {
          tag: a.tagName,
          label: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 26),
          outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0,
        };
      }),
    );
  }
  const hits = reach.filter(Boolean);
  hits.length >= 12 ? ok(`${hits.length} focusable stops reached`) : bad(`only ${hits.length} focus stops`);
  const noRing = hits.filter((h) => !h.outline);
  noRing.length === 0
    ? ok('every focused element shows a visible focus ring')
    : bad(`no focus ring on: ${noRing.map((h) => h.label).join(', ')}`);

  await page.screenshot({ path: `${OUT}a11y-focus-ring.png` });
  await page.close();
}

console.log('\n── semantics & SEO ──');
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.locator('button[aria-label="Click & hold to enter the site"]').click();
  await page.mouse.down();
  await page.waitForTimeout(1300);
  await page.mouse.up();
  await page.waitForTimeout(2000);

  const doc = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content ?? '',
    viewport: !!document.querySelector('meta[name="viewport"]'),
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
    headings: [...document.querySelectorAll('h1,h2,h3')].map((h) => +h.tagName[1]),
    imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
    landmarks: {
      header: document.querySelectorAll('header').length,
      main: document.querySelectorAll('main').length,
      nav: document.querySelectorAll('nav').length,
      footer: document.querySelectorAll('footer').length,
    },
    unlabelledButtons: [...document.querySelectorAll('button')].filter(
      (b) => !b.getAttribute('aria-label') && !b.textContent.trim(),
    ).length,
    jsonld: !!document.querySelector('script[type="application/ld+json"]'),
  }));

  doc.lang === 'en' ? ok('html lang set') : bad('missing html lang');
  doc.title.length > 10 ? ok(`title: “${doc.title}”`) : bad('weak title');
  doc.desc.length > 50 ? ok('meta description present') : bad('meta description missing/short');
  doc.viewport ? ok('viewport meta present') : bad('viewport meta missing');
  doc.h1.length === 1 ? ok(`exactly one h1: “${doc.h1[0]}”`) : bad(`h1 count = ${doc.h1.length}`);
  const jumps = doc.headings.filter((v, i) => i && v - doc.headings[i - 1] > 1);
  jumps.length === 0 ? ok('no skipped heading levels') : bad(`heading level jumps: ${jumps.length}`);
  doc.imgsNoAlt === 0 ? ok('no <img> without alt') : bad(`${doc.imgsNoAlt} images missing alt`);
  doc.unlabelledButtons === 0
    ? ok('every button has an accessible name')
    : bad(`${doc.unlabelledButtons} buttons unlabelled`);
  doc.landmarks.main >= 1 && doc.landmarks.footer >= 1
    ? ok(`landmarks: ${JSON.stringify(doc.landmarks)}`)
    : bad(`landmarks incomplete: ${JSON.stringify(doc.landmarks)}`);
  doc.jsonld ? ok('structured data (JSON-LD) present') : bad('no JSON-LD');

  // No horizontal overflow at any breakpoint.
  for (const w of [375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(700);
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    over <= 1 ? ok(`no horizontal overflow at ${w}px`) : bad(`overflow ${over}px at ${w}px`);
  }
  await page.close();
}

await browser.close();

console.log(
  fails.length ? `\n❌ ${fails.length} check(s) failed\n` : '\n✅ all verification checks passed\n',
);
process.exitCode = fails.length ? 1 : 0;
