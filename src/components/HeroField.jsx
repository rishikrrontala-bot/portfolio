import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/hooks';

/* ─────────────────────────────────────────────────────────────────────────────
   FIELD — the hero set-piece.

   The manifesto claims ambiguity is the signal. This draws that literally: a
   noise field that nothing in it agrees about, and one slow travelling region
   of coherence inside which the strokes line up, sharpen and take colour. The
   legible form is never separate from the noise — it is made of the same
   strokes, briefly agreeing, and it comes apart again as the region moves on.

   Everything is constructed at runtime. A few thousand particles are advected
   through simplex-noise flow and leave ink trails that erase slowly, so density
   accumulates into something closer to engraving than to a particle demo. The
   ground underneath is a layered procedural wash (CSS, in Hero.jsx).
   ───────────────────────────────────────────────────────────────────────────*/

/* ── 2D simplex noise (Gustavson's formulation, seeded) ──────────────────── */

const GRAD = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

function makeNoise(seed) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) p[i] = i;
  // Deterministic shuffle: the composition is the same on every load, which is
  // what makes it a piece of art direction rather than a lottery.
  let s = seed >>> 0;
  const rnd = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = 255; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i += 1) perm[i] = p[i & 255];

  return function noise2(xin, yin) {
    const sk = (xin + yin) * F2;
    const i = Math.floor(xin + sk);
    const j = Math.floor(yin + sk);
    const t0 = (i + j) * G2;
    const x0 = xin - (i - t0);
    const y0 = yin - (j - t0);
    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    let n = 0;

    let t = 0.5 - x0 * x0 - y0 * y0;
    if (t > 0) {
      const g = GRAD[perm[ii + perm[jj]] & 7];
      t *= t;
      n += t * t * (g[0] * x0 + g[1] * y0);
    }
    t = 0.5 - x1 * x1 - y1 * y1;
    if (t > 0) {
      const g = GRAD[perm[ii + i1 + perm[jj + j1]] & 7];
      t *= t;
      n += t * t * (g[0] * x1 + g[1] * y1);
    }
    t = 0.5 - x2 * x2 - y2 * y2;
    if (t > 0) {
      const g = GRAD[perm[ii + 1 + perm[jj + 1]] & 7];
      t *= t;
      n += t * t * (g[0] * x2 + g[1] * y2);
    }
    return 70 * n;
  };
}

/* ── palette + helpers ───────────────────────────────────────────────────── */

const INK = [16, 15, 13];
const TERRA = [218, 83, 44];
const BUCKETS = 8; // strokes are batched by coherence: one path per bucket.
const TAU = Math.PI * 2;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mixHex = (c) => {
  const r = Math.round(INK[0] + (TERRA[0] - INK[0]) * c);
  const g = Math.round(INK[1] + (TERRA[1] - INK[1]) * c);
  const b = Math.round(INK[2] + (TERRA[2] - INK[2]) * c);
  return `rgb(${r},${g},${b})`;
};

/**
 * The hero artwork. `active` mirrors the old WebGL canvas' prop: when false the
 * simulation is never started.
 */
export default function HeroField({ active = true }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !active) return undefined;
    const ctx = cv.getContext('2d');
    if (!ctx) return undefined;

    const noise = makeNoise(19781104);
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let count = 0;
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let plife = new Float32Array(0);
    let pmax = new Float32Array(0);
    let time = 0;
    let intro = reduced ? 1 : 0;

    // Pointer nudges where the coherent region wants to be, so the piece
    // acknowledges the reader without becoming a toy.
    const aim = { x: 0.5, y: 0.5 };
    const at = { x: 0.72, y: 0.3 };

    const onPointer = (e) => {
      aim.x = e.clientX / window.innerWidth;
      aim.y = e.clientY / window.innerHeight;
    };

    /* Density falls away toward the bottom-left, where the headline sits. */
    const mask = (x, y) => {
      const d = x / w - y / h; // -1 (bottom-left) … 1 (top-right)
      return 0.1 + 0.9 * smoothstep(-0.95, 0.35, d);
    };

    const spawn = (i) => {
      // Weighted toward the upper right: the composition has a subject, and the
      // lower left has to stay quiet enough to set type on.
      if (Math.random() < 0.62) {
        px[i] = (0.32 + Math.random() * 0.68) * w;
        py[i] = Math.random() * 0.72 * h;
      } else {
        px[i] = Math.random() * w;
        py[i] = Math.random() * h;
      }
      plife[i] = 0;
      pmax[i] = 40 + Math.random() * 180;
    };

    const allocate = () => {
      const area = w * h;
      count = Math.max(600, Math.min(2400, Math.round(area / 900)));
      px = new Float32Array(count);
      py = new Float32Array(count);
      plife = new Float32Array(count);
      pmax = new Float32Array(count);
      for (let i = 0; i < count; i += 1) spawn(i);
    };

    /* One simulation + draw step. */
    const step = (dt, erase) => {
      time += dt;

      // The coherent region drifts on its own slow orbit, leaning toward the
      // pointer but never actually arriving.
      const ox = 0.62 + Math.cos(time * 0.09) * 0.16;
      const oy = 0.3 + Math.sin(time * 0.13) * 0.13;
      at.x += (ox * 0.72 + aim.x * 0.28 - at.x) * 0.02;
      at.y += (oy * 0.72 + aim.y * 0.28 - at.y) * 0.02;
      const ax = at.x * w;
      const ay = at.y * h;
      const ar = Math.min(w, h) * 0.46;
      const lead = time * 0.22 + Math.sin(time * 0.07) * 0.9;

      if (erase) {
        // Trails decay by erasing alpha, so the procedural ground behind the
        // canvas keeps showing through instead of being painted over.
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.011)';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
      }

      const paths = [];
      for (let b = 0; b < BUCKETS; b += 1) paths.push(new Path2D());

      const S = 0.0016;
      for (let i = 0; i < count; i += 1) {
        const x = px[i];
        const y = py[i];

        const dx = (x - ax) / ar;
        const dy = (y - ay) / ar;
        const c = smoothstep(1, 0.12, Math.sqrt(dx * dx + dy * dy));

        // Disagreement: two octaves of noise nobody reconciles.
        const n =
          noise(x * S + time * 0.05, y * S) +
          noise(x * S * 2.3 - time * 0.035, y * S * 2.3) * 0.42;
        const wild = n * TAU * 1.35;
        // Agreement: inside the region the strokes take one direction.
        const calm = lead + Math.atan2(dy, dx) * 0.32;
        const ang = wild * (1 - c) + calm * c;

        const sp = (0.95 + c * 1.25) * dt * 60;
        const nx = x + Math.cos(ang) * sp;
        const ny = y + Math.sin(ang) * sp;

        const a = clamp01(mask(x, y)) * (0.3 + 0.7 * c) * intro;
        if (a > 0.02) {
          const b = Math.min(BUCKETS - 1, Math.round(c * (BUCKETS - 1)));
          paths[b].moveTo(x, y);
          paths[b].lineTo(nx, ny);
        }

        px[i] = nx;
        py[i] = ny;
        plife[i] += 1;
        if (
          plife[i] > pmax[i] ||
          nx < -60 ||
          nx > w + 60 ||
          ny < -60 ||
          ny > h + 60
        ) {
          spawn(i);
        }
      }

      ctx.lineCap = 'round';
      for (let b = 0; b < BUCKETS; b += 1) {
        const c = b / (BUCKETS - 1);
        ctx.strokeStyle = mixHex(c);
        ctx.lineWidth = 0.62 + c * 1.5;
        ctx.globalAlpha = (0.026 + c * 0.062) * intro;
        ctx.stroke(paths[b]);
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = cv.getBoundingClientRect();
      const nw = Math.max(1, Math.round(r.width));
      const nh = Math.max(1, Math.round(r.height));
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      allocate();
      if (reduced) still();
    };

    /* Reduced motion: no loop at all. Run a bounded number of steps once to
       accumulate a finished still, then stop — the same artwork, frozen. */
    function still() {
      count = Math.min(count, 900);
      intro = 1;
      for (let k = 0; k < 190; k += 1) step(1 / 60, false);
    }

    let last = 0;
    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 1 / 60;
      last = t;
      intro += (1 - intro) * Math.min(1, dt * 0.75); // gentle build-in on load
      step(dt, true);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();

    if (!reduced) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
    };
  }, [active, reduced]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
