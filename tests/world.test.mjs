// The World drag plane's layout (src/lib/world.js). Run with `npm test`.
//
// The plane used to be a fixed 4×4 grid, which held only the six newest
// projects. These checks make sure every project is on it, now and as more
// are added.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planeCells, planeSize, MIN_COLS, MIN_ROWS } from '../src/lib/world.js';
import { projects, worldFragments } from '../src/data/site.js';

const fakeProjects = (n) => Array.from({ length: n }, (_, i) => ({ slug: `p${i}` }));
const fakeFragments = (n) => Array.from({ length: n }, (_, i) => ({ kind: 'statement', text: `f${i}` }));

function check(ps, fs) {
  const { cols, rows, cells } = planeCells(ps, fs);
  const label = `${ps.length} projects, ${fs.length} fragments → ${cols}×${rows}`;

  assert.equal(cells.length, cols * rows, label);
  assert.ok(cols >= MIN_COLS && rows >= MIN_ROWS, `${label}: smaller than the minimum`);
  assert.equal(cols % 2, 0, `${label}: odd column count breaks the pattern at the seam`);
  assert.equal(rows % 2, 0, `${label}: odd row count breaks the pattern at the seam`);
  assert.ok(cells.every(Boolean), `${label}: empty cell`);

  // Every project exactly once, newest first in reading order.
  const placed = cells.filter((c) => c.kind === 'project').map((c) => c.project);
  assert.deepEqual(placed, ps, `${label}: projects missing, repeated or out of order`);

  // Every fragment at least once.
  for (const f of fs) assert.ok(cells.includes(f), `${label}: fragment "${f.text}" missing`);

  // No two projects share an edge, including where the plane wraps onto itself.
  const isProject = (r, c) => cells[((r + rows) % rows) * cols + ((c + cols) % cols)].kind === 'project';
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (!isProject(r, c)) continue;
      assert.ok(!isProject(r, c + 1), `${label}: projects touch at row ${r}, columns ${c}/${(c + 1) % cols}`);
      assert.ok(!isProject(r + 1, c), `${label}: projects touch at column ${c}, rows ${r}/${(r + 1) % rows}`);
    }
  }
  return { cols, rows };
}

test('the real site: all 20 projects are on the plane, not just the first six', () => {
  const { cols, rows, cells } = planeCells(projects, worldFragments);
  const slugs = cells.filter((c) => c.kind === 'project').map((c) => c.project.slug);
  assert.deepEqual(slugs, projects.map((p) => p.slug));
  assert.equal(slugs.length, projects.length);
  check(projects, worldFragments);
  assert.ok(cols * rows >= projects.length + worldFragments.length);
});

test('the first tile is the newest project', () => {
  const { cells } = planeCells(projects, worldFragments);
  assert.equal(cells[0].kind, 'project');
  assert.equal(cells[0].project.slug, projects[0].slug);
});

test('the grid grows as projects are added — 1 to 80 projects', () => {
  for (let n = 1; n <= 80; n += 1) check(fakeProjects(n), fakeFragments(worldFragments.length));
});

test('works with very few fragments, or none', () => {
  for (const f of [0, 1, 3]) {
    for (const n of [1, 6, 20, 41]) check(fakeProjects(n), fakeFragments(f));
  }
});

test('the plane is wider than it is tall', () => {
  for (const n of [6, 20, 40, 80]) {
    const { cols, rows } = planeSize(n, 22);
    assert.ok(cols >= rows, `${n} projects → ${cols}×${rows}`);
  }
});

test('fragments repeat only when the grid has more squares than fragments', () => {
  const fs = fakeFragments(60);
  const { cells } = planeCells(fakeProjects(20), fs);
  const used = cells.filter((c) => c.kind !== 'project');
  assert.equal(new Set(used).size, used.length, 'a fragment repeated although there were enough');
});
