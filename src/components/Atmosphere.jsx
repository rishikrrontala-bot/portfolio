import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { onCursor, useFinePointer, useReducedMotion } from '../lib/hooks';

/* Film grain, generated once as an SVG turbulence tile — no image request. */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;

export function Grain() {
  return (
    <>
      <div className="grain" style={{ '--grain-url': GRAIN }} aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  );
}

/* ── Custom cursor ───────────────────────────────────────────────────────── */

export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef(null);
  const ring = useRef(null);
  const labelRef = useRef(null);
  const [state, setState] = useState({ mode: 'default', label: '' });

  useEffect(() => onCursor(setState), []);

  useEffect(() => {
    if (!fine || reduced) return undefined;
    document.documentElement.classList.add('has-custom-cursor');

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' });

    let visible = false;
    const move = (e) => {
      if (!visible) {
        visible = true;
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.4 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const leave = () => {
      visible = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };
    const down = () => gsap.to(ring.current, { scale: 0.72, duration: 0.3 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.5 });

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [fine, reduced]);

  // Morph the ring for each cursor mode.
  useEffect(() => {
    if (!fine || reduced || !ring.current) return;
    const sizes = { default: 34, hover: 74, drag: 96, view: 92, text: 12 };
    const size = sizes[state.mode] ?? 34;
    gsap.to(ring.current, {
      width: size,
      height: size,
      backgroundColor:
        state.mode === 'default' ? 'rgba(16,15,13,0)' : 'rgba(218,83,44,1)',
      borderColor: state.mode === 'default' ? 'rgba(16,15,13,0.42)' : 'rgba(218,83,44,0)',
      duration: 0.55,
      ease: 'house',
    });
    gsap.to(dot.current, {
      scale: state.mode === 'default' ? 1 : 0,
      duration: 0.4,
      ease: 'house',
    });
    gsap.to(labelRef.current, {
      autoAlpha: state.label ? 1 : 0,
      duration: 0.3,
    });
  }, [state, fine, reduced]);

  if (!fine || reduced) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border will-change-transform"
        style={{
          width: 34,
          height: 34,
          marginLeft: -17,
          marginTop: -17,
          borderColor: 'rgba(16,15,13,0.42)',
          opacity: 0,
          visibility: 'hidden',
          mixBlendMode: 'normal',
        }}
      >
        <span
          ref={labelRef}
          className="t-mono select-none whitespace-nowrap text-bone"
          style={{ opacity: 0, fontSize: 9, letterSpacing: '0.18em' }}
        >
          {state.label}
        </span>
      </div>
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-ink will-change-transform"
        style={{ width: 6, height: 6, marginLeft: -3, marginTop: -3, opacity: 0, visibility: 'hidden' }}
      />
    </>
  );
}

/* ── Scroll progress ─────────────────────────────────────────────────────── */

export function ScrollProgress() {
  const bar = useRef(null);
  const num = useRef(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return undefined;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        gsap.set(el, { scaleX: self.progress });
        if (num.current) {
          num.current.textContent = String(Math.round(self.progress * 100)).padStart(3, '0');
          // Step aside for the footer's own bottom rule rather than colliding.
          gsap.set(num.current, { opacity: self.progress > 0.965 ? 0 : 1 });
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    // Ash + terracotta read against both the bone and the ink sections, so this
    // needs no blend mode and no per-section inversion.
    <div className="pointer-events-none fixed bottom-0 left-0 z-[70] w-full">
      <div className="gutter flex items-end justify-end pb-3">
        {/* No single ink or bone value clears 4.5:1 on both grounds, so let
            difference blending derive the contrast per section instead. */}
        <span
          ref={num}
          className="t-mono tabular-nums"
          style={{ color: '#F4F1EA', mixBlendMode: 'difference' }}
        >
          000
        </span>
      </div>
      <div className="h-px w-full" style={{ background: 'rgba(115,109,99,0.42)' }}>
        <div
          ref={bar}
          className="h-px w-full origin-left bg-terra"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  );
}
