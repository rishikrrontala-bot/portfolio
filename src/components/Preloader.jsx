import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from '../lib/gsap';
import { cursorProps, lockScroll, useReducedMotion, setCursor } from '../lib/hooks';
import { identity } from '../data/site';

const HOLD_MS = 900;

/**
 * The entry gate: a load counter, then a click-and-hold ring that has to be
 * completed before the site opens. It is a deliberate one-second cost that
 * makes the reveal feel earned — the Unseen move.
 */
export default function Preloader({ onEnter }) {
  const reduced = useReducedMotion();
  const root = useRef(null);
  const counterRef = useRef(null);
  const ringRef = useRef(null);
  const promptRef = useRef(null);
  const wordmarkRef = useRef(null);
  const btnRef = useRef(null);
  const holdTween = useRef(null);

  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    lockScroll(true);
    return () => lockScroll(false);
  }, []);

  /* Count 000 → 100, gated on fonts actually being ready so the hero never
     reflows after the reveal. */
  useEffect(() => {
    const obj = { v: 0 };
    const node = counterRef.current;
    const tween = gsap.to(obj, {
      v: 100,
      duration: reduced ? 0.4 : 1.9,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (node) node.textContent = String(Math.floor(obj.v)).padStart(3, '0');
      },
    });

    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
    };
    Promise.all([fonts, tween.then?.() ?? new Promise((r) => setTimeout(r, 1900))]).then(
      finish,
    );
    const safety = setTimeout(finish, 4200);
    return () => {
      clearTimeout(safety);
      tween.kill();
    };
  }, [reduced]);

  useEffect(() => {
    if (!ready) return;
    gsap.to(promptRef.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'house' });
    // The gate covers the page, so keyboard focus has to start here rather than
    // tabbing through the content hidden behind it.
    btnRef.current?.focus({ preventScroll: true });
    // Fetch the hero artwork's chunk during the hold, so the field is there the
    // instant the curtain lifts, without it ever blocking first paint.
    const warm = () => import('./HeroField');
    const idle = typeof window.requestIdleCallback === 'function';
    const id = idle ? window.requestIdleCallback(warm) : setTimeout(warm, 200);
    return () => {
      if (idle) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, [ready]);

  const enter = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    setCursor({ mode: 'default', label: '' });

    const tl = gsap.timeline({
      onComplete: () => {
        lockScroll(false);
        onEnter?.();
      },
    });

    if (reduced) {
      tl.to(root.current, { autoAlpha: 0, duration: 0.3 });
      return;
    }

    tl.to([promptRef.current, counterRef.current?.parentNode], {
      autoAlpha: 0,
      y: -24,
      duration: 0.5,
      ease: 'houseIn',
    })
      .to(
        wordmarkRef.current,
        { yPercent: -110, duration: 0.9, ease: 'house' },
        '-=0.25',
      )
      .to(
        root.current,
        { yPercent: -100, duration: 1.15, ease: 'house' },
        '-=0.6',
      )
      .set(root.current, { display: 'none' });
  }, [leaving, onEnter, reduced]);

  /* Press-and-hold: a ring fills; release early and it rewinds. */
  const startHold = useCallback(
    (e) => {
      if (!ready || leaving) return;
      if (e?.type === 'keydown' && !['Enter', ' '].includes(e.key)) return;
      if (e?.repeat) return;
      if (reduced) {
        enter();
        return;
      }
      setCursor({ mode: 'drag', label: 'HOLD' });
      holdTween.current?.kill();
      holdTween.current = gsap.to(ringRef.current, {
        strokeDashoffset: 0,
        duration: HOLD_MS / 1000,
        ease: 'none',
        onComplete: enter,
      });
    },
    [ready, leaving, reduced, enter],
  );

  const endHold = useCallback(() => {
    if (leaving) return;
    setCursor({ mode: 'hover', label: 'HOLD' });
    holdTween.current?.kill();
    gsap.to(ringRef.current, { strokeDashoffset: 289, duration: 0.45, ease: 'house' });
  }, [leaving]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[9990] flex flex-col justify-between bg-ink text-bone"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <div className="gutter flex items-start justify-between pt-8">
        <div className="overflow-hidden">
          <span ref={wordmarkRef} className="t-mono block text-bone/70">
            {identity.name} — Portfolio
          </span>
        </div>
        <span className="t-mono text-bone/55">© {new Date().getFullYear()}</span>
      </div>

      <div className="gutter flex flex-1 items-center justify-center">
        <button
          ref={btnRef}
          type="button"
          aria-label="Click & hold to enter the site"
          disabled={!ready}
          className="relative grid h-[220px] w-[220px] place-items-center rounded-full disabled:cursor-default"
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onKeyDown={startHold}
          onKeyUp={endHold}
          {...cursorProps('hover', 'HOLD')}
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(244,241,234,0.14)" strokeWidth="0.6" />
            <circle
              ref={ringRef}
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#DA532C"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="289"
              strokeDashoffset="289"
            />
          </svg>
          <span
            ref={promptRef}
            className="t-mono text-center leading-relaxed text-bone/85"
            style={{ opacity: 0, transform: 'translateY(12px)' }}
          >
            Click
            <br />&amp; hold
          </span>
        </button>
      </div>

      <div className="gutter flex items-end justify-between pb-8">
        <span className="t-mono text-bone/55">{identity.discipline}</span>
        <div className="flex items-baseline gap-3">
          <span className="t-mono text-bone/55">Loading</span>
          <span
            ref={counterRef}
            className="t-display text-bone"
            style={{ fontSize: 'clamp(38px, 7vw, 92px)', fontStretch: '118%' }}
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
