// Layout for the World drag plane.
//
// The plane is a grid that wraps in both directions, so it never ends. Its size
// is worked out from the content: every project appears exactly once per
// period, the thinking fragments fill the squares between them, and the grid
// grows when a project is added. (It used to be a fixed 4×4, which held only
// the six newest projects.)
//
// Projects sit on the light squares of a chessboard and fragments on the dark
// ones. With an even number of rows and columns the colouring also holds
// across the wrap seams, so no two projects ever touch along an edge, even
// where the plane joins itself.

// The fewest columns and rows. The component also widens tiles on very wide
// screens, so the plane never shows an empty band at its edge.
export const MIN_COLS = 6;
export const MIN_ROWS = 4;

// Columns per row relative to rows: the plane is wider than it is tall.
const ASPECT = 1.3;

const even = (n) => n + (n % 2);

export function planeSize(projectCount, fragmentCount) {
  // A chessboard has as many light squares as dark ones, so a board with room
  // for every project on a light square needs at least twice as many squares.
  const needed = Math.max(projectCount + fragmentCount, projectCount * 2, 1);
  const rows = Math.max(MIN_ROWS, even(Math.ceil(Math.sqrt(needed / ASPECT))));
  const cols = Math.max(MIN_COLS, even(Math.ceil(needed / rows)));
  return { cols, rows };
}

export function planeCells(projects, fragments) {
  const { cols, rows } = planeSize(projects.length, fragments.length);
  const total = cols * rows;

  const light = [];
  for (let i = 0; i < total; i += 1) {
    if ((Math.floor(i / cols) + (i % cols)) % 2 === 0) light.push(i);
  }

  // Spread the projects evenly over the light squares, newest first in
  // reading order, so 01 is the first tile in the top-left corner.
  const cells = new Array(total).fill(null);
  projects.forEach((project, k) => {
    cells[light[Math.floor((k * light.length) / projects.length)]] = { kind: 'project', project };
  });

  // Fragments fill everything else in reading order, starting again from the
  // first one if the grid has more squares than there are fragments.
  let f = 0;
  for (let i = 0; i < total; i += 1) {
    if (cells[i]) continue;
    cells[i] = fragments.length ? fragments[f % fragments.length] : { kind: 'blank' };
    f += 1;
  }

  return { cols, rows, cells };
}
