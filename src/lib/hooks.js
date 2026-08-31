import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

export const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ── environment ─────────────────────────────────────────────────────────── */

const mq = (q) => (typeof window === 'undefined' ? false : window.matchMedia(q).matches);

export function useMediaQuery(query) {
  const [match, setMatch] = useState(() => mq(query));
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
/** A real pointer — not a touchscreen. Gates the cursor + magnetics. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

/** Real viewport height on mobile, where 100vh lies about the toolbar. */
export function useViewportUnit() {
  useEffect(() => {
    const set = () =>
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    set();
    window.addEventListener('resize', set);
    window.addEventListener('orientationchange', set);
    return () => {
      window.removeEventListener('resize', set);
      window.removeEventListener('orientationchange', set);
    };
  }, []);
}

/* ── smooth scroll ───────────────────────────────────────────────────────── */

let lenisSingleton = null;
export const getLenis = () => lenisSingleton;

export function useSmoothScroll(enabled = true) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!enabled || reduced) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.95,
    });
    lenisSingleton = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisSingleton = null;
    };
  }, [enabled, reduced]);
}

export function lockScroll(locked) {
  const l = getLenis();
  if (l) (locked ? l.stop : l.start).call(l);
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

export function scrollTo(target, opts = {}) {
  const l = getLenis();
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (l) l.scrollTo(el, { offset: 0, duration: 1.4, ...opts });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── magnetic pointer attraction ─────────────────────────────────────────── */

export function useMagnetic({ strength = 0.32, radius = 1.5, disabled = false } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return undefined;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'house' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'house' });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const within =
        Math.abs(dx) < (r.width * radius) / 2 + 40 &&
        Math.abs(dy) < (r.height * radius) / 2 + 40;
      if (within) {
        xTo(dx * strength);
        yTo(dy * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, radius, disabled]);

  return ref;
}

/* ── cursor state bus ────────────────────────────────────────────────────── */

const cursorListeners = new Set();
export function setCursor(state) {
  cursorListeners.forEach((fn) => fn(state));
}
export function onCursor(fn) {
  cursorListeners.add(fn);
  return () => cursorListeners.delete(fn);
}
/** Spread onto any element to change the cursor while hovering it. */
export function cursorProps(mode = 'hover', label = '') {
  return {
    onMouseEnter: () => setCursor({ mode, label }),
    onMouseLeave: () => setCursor({ mode: 'default', label: '' }),
  };
}

/* ── misc ────────────────────────────────────────────────────────────────── */

export function useLocalTime(timeZone) {
  const [t, setT] = useState('');
  useEffect(() => {
    const fmt = () => {
      try {
        setT(
          new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone,
          }).format(new Date()),
        );
      } catch {
        setT('');
      }
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return t;
}
