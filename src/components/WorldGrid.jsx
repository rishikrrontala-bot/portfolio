import { useEffect, useRef, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { cursorProps, useFinePointer, useReducedMotion } from '../lib/hooks';
import { projects, worldFragments } from '../data/site';
import ProjectPlate from './ProjectPlate';
import { Reveal } from './Reveal';

const COLS = 4;
const ROWS = 4;

/**
 * Drag-to-explore infinite plane. Tiles are laid out on a COLS×ROWS grid and
 * wrapped modulo the grid size, so the plane never ends in any direction.
 * Desktop drags in 2D; touch drags horizontally only so the page can still
 * scroll vertically through it.
 */
export default function WorldGrid() {
  const wrap = useRef(null);
  const plane = useRef(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [hint, setHint] = useState(true);

  /* Interleave work and thinking so the plane reads as an index, not a gallery. */
  const cells = useMemo(() => {
    const pool = [];
    const frags = [...worldFragments];
    projects.forEach((p) => {
      pool.push({ kind: 'project', project: p });
      pool.push(frags.shift() ?? { kind: 'statement', text: '—' });
      pool.push(frags.shift() ?? { kind: 'statement', text: '—' });
    });
    while (frags.length) pool.push(frags.shift());
    const out = [];
    for (let i = 0; i < COLS * ROWS; i += 1) out.push(pool[i % pool.length]);
    return out;
  }, []);

  useEffect(() => {
    const wrapEl = wrap.current;
    const planeEl = plane.current;
    if (!wrapEl || !planeEl) return undefined;

    const tiles = Array.from(planeEl.children);
    const state = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      tileW: 0,
      tileH: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      idle: 0,
    };

    const measure = () => {
      const w = wrapEl.clientWidth;
      state.tileW = w < 720 ? 232 : Math.min(400, Math.max(280, w / 3.15));
      state.tileH = state.tileW * 1.22;
      tiles.forEach((t) => {
        t.style.width = `${state.tileW - 16}px`;
        t.style.height = `${state.tileH - 16}px`;
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapEl);

    const gridW = () => state.tileW * COLS;
    const gridH = () => state.tileH * ROWS;

    const render = () => {
      const wrapX = gsap.utils.wrap(-state.tileW, gridW() - state.tileW);
      const wrapY = gsap.utils.wrap(-state.tileH, gridH() - state.tileH);
      tiles.forEach((t, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const px = wrapX(col * state.tileW + state.x);
        const py = wrapY(row * state.tileH + state.y);
        t.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      });
    };

    let raf = 0;
    const loop = () => {
      if (!state.dragging && !reduced) {
        // Gentle drift when nobody is touching it — the plane stays alive.
        state.idle += 1;
        if (state.idle > 90) {
          state.tx -= 0.28;
          state.ty -= 0.09;
        }
      }
      state.x += (state.tx - state.x) * 0.085;
      state.y += (state.ty - state.y) * 0.085;
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* ── pointer ── */
    const down = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      state.dragging = true;
      state.idle = 0;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      wrapEl.setPointerCapture?.(e.pointerId);
      planeEl.style.transition = 'none';
      setHint(false);
    };
    const move = (e) => {
      if (!state.dragging) return;
      const dx = e.clientX - state.lastX;
      const dy = e.clientY - state.lastY;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      state.tx += dx;
      if (fine) state.ty += dy;
      state.idle = 0;
    };
    const up = (e) => {
      if (!state.dragging) return;
      state.dragging = false;
      wrapEl.releasePointerCapture?.(e.pointerId);
    };

    wrapEl.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);

    /* Keyboard nudge, so the plane is not mouse-only. */
    const key = (e) => {
      const step = 120;
      const map = {
        ArrowLeft: [step, 0],
        ArrowRight: [-step, 0],
        ArrowUp: [0, step],
        ArrowDown: [0, -step],
      };
      if (!map[e.key]) return;
      e.preventDefault();
      state.tx += map[e.key][0];
      state.ty += map[e.key][1];
      state.idle = 0;
      setHint(false);
    };
    wrapEl.addEventListener('keydown', key);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrapEl.removeEventListener('pointerdown', down);
      wrapEl.removeEventListener('keydown', key);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [fine, reduced]);

  return (
    <section id="world" className="relative bg-ink py-[clamp(72px,12vh,132px)] text-bone">
      <div className="gutter mb-[clamp(24px,5vh,52px)] flex flex-wrap items-end justify-between gap-6">
        <Reveal as="h2" lines={['World']} className="t-display text-bone" />
        <p className="t-mono max-w-[34ch] text-bone/60">
          Work and the thinking around it, on one plane. Drag it.
        </p>
      </div>

      <div
        ref={wrap}
        role="region"
        aria-label="Draggable index of work and notes. Use arrow keys to move."
        tabIndex={0}
        className="relative w-full overflow-hidden select-none"
        style={{
          height: 'clamp(420px, 74vh, 760px)',
          touchAction: fine ? 'none' : 'pan-y',
          cursor: fine ? 'none' : 'grab',
        }}
        {...cursorProps('drag', 'DRAG')}
      >
        <div ref={plane} className="absolute inset-0">
          {cells.map((cell, i) => (
            <div key={i} className="absolute left-0 top-0 m-2 will-change-transform">
              <Cell cell={cell} />
            </div>
          ))}
        </div>

        {/* Edge fades so tiles dissolve rather than getting guillotined. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, #100F0D 0%, transparent 12%, transparent 88%, #100F0D 100%),' +
              'linear-gradient(to bottom, #100F0D 0%, transparent 14%, transparent 86%, #100F0D 100%)',
          }}
          aria-hidden="true"
        />

        <div
          className={`pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-700 ${
            hint ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="t-mono rounded-full border border-bone/25 px-4 py-2 text-bone/70">
            Drag to explore
          </span>
        </div>
      </div>
    </section>
  );
}

function Cell({ cell }) {
  if (cell.kind === 'project') {
    return (
      <Link
        to={`/work/${cell.project.slug}`}
        className="group block h-full w-full"
        {...cursorProps('view', 'VIEW')}
        draggable={false}
      >
        <ProjectPlate
          project={cell.project}
          className="h-[76%] w-full rounded-[3px] transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
        />
        <div className="pt-3">
          <p className="font-display text-[15px] font-semibold uppercase tracking-tighter text-bone transition-colors duration-500 group-hover:text-terra">
            {cell.project.title}
          </p>
          <p className="t-mono mt-1 text-bone/55">{cell.project.kicker}</p>
        </div>
      </Link>
    );
  }

  if (cell.kind === 'stat') {
    return (
      <div className="flex h-full w-full flex-col justify-between rounded-[3px] border border-bone/15 p-5">
        <span className="t-mono text-bone/55">{cell.label}</span>
        <span
          className="t-display text-terra"
          style={{ fontSize: 'clamp(28px, 3.2vw, 46px)' }}
        >
          {cell.value}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center rounded-[3px] bg-bone/[0.04] p-5">
      <p
        className="font-display font-medium leading-[1.08] tracking-tighter text-bone/90"
        style={{ fontSize: 'clamp(18px, 1.7vw, 26px)' }}
      >
        {cell.text}
      </p>
    </div>
  );
}
