import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:4173';
const OUT = new URL('../shots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const errors = [];

async function enter(page) {
  // Wait for the hold button, then press and hold past the 900ms threshold.
  const btn = page.locator('button[aria-label="Click & hold to enter the site"]');
  await btn.waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(2600); // counter finishes
  const box = await btn.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1400);
  await page.mouse.up();
  await page.waitForTimeout(2600);
}

async function shoot(page, name) {
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log('·', name);
}

async function run(label, viewport, opts = {}) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, ...opts });
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${label}] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[${label}] PAGEERROR ${e.message}`));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await shoot(page, `${label}-00-preloader`);
  await enter(page);
  await shoot(page, `${label}-01-hero`);

  const H = viewport.height;
  const stops = [0.9, 1.9, 2.9, 3.9, 4.9, 5.9, 6.9, 7.9, 8.9, 9.9];
  for (let i = 0; i < stops.length; i += 1) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'auto' }), stops[i] * H);
    await page.waitForTimeout(1300);
    await shoot(page, `${label}-${String(i + 2).padStart(2, '0')}-scroll`);
  }

  // Menu
  // Wheel, not scrollTo — Lenis owns the scroll position and the nav only
  // re-shows on an upward wheel gesture.
  await page.mouse.move(viewport.width / 2, viewport.height / 2);
  for (let i = 0; i < 40; i += 1) await page.mouse.wheel(0, -1200);
  await page.waitForTimeout(2500);
  await page.locator('button[aria-label="Open menu"]').click();
  await page.waitForTimeout(1600);
  await shoot(page, `${label}-20-menu`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1200);

  // Project page
  await page.goto(`${BASE}/#/work/emotion-engine`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await shoot(page, `${label}-30-project`);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.3));
  await page.waitForTimeout(1400);
  await shoot(page, `${label}-31-project-body`);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2.6));
  await page.waitForTimeout(1400);
  await shoot(page, `${label}-32-project-next`);

  // 404
  await page.goto(`${BASE}/#/nope`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await shoot(page, `${label}-40-404`);

  await browser.close();
}

await run('desktop', { width: 1440, height: 900 });
await run('mobile', { width: 390, height: 844 }, { isMobile: true, hasTouch: true });

if (errors.length) {
  console.log('\n⚠️  CONSOLE ERRORS');
  errors.forEach((e) => console.log('  ', e));
  process.exitCode = 1;
} else {
  console.log('\n✓ no console errors');
}
