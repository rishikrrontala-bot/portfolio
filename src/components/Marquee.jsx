import { useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';

/**
 * Seamless marquee. Duplicated track, translateX 0 → -50%, plus a scroll-velocity
 * skew so it reacts to the page instead of just looping obliviously.
 */
export default function Marquee({
  items = [],
  speed = 26,
  reverse = false,
  className = '',
  itemClassName = '',
  separator = '·',
}) {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return undefined;
    const track = el.querySelector('[data-track]');

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: reverse ? 0 : -50,
        startAt: { xPercent: reverse ? -50 : 0 },
        duration: speed,
        ease: 'none',
        repeat: -1,
      });

      let last = 0;
      const st = gsap.ticker.add(() => {
        const y = window.scrollY;
        const v = gsap.utils.clamp(-2.4, 2.4, (y - last) * 0.08);
        last = y;
        gsap.set(track, { skewX: v });
        tween.timeScale(gsap.utils.clamp(0.4, 5, 1 + Math.abs(v) * 0.9));
      });
      return () => gsap.ticker.remove(st);
    }, el);
    return () => ctx.revert();
  }, [reduced, speed, reverse]);

  const row = (key) => (
    <span key={key} className="flex shrink-0 items-center" aria-hidden={key === 'b'}>
      {items.map((it, i) => (
        <span key={i} className={`flex shrink-0 items-center ${itemClassName}`}>
          {it}
          <span className="mx-[clamp(16px,2.4vw,44px)] text-terra">{separator}</span>
        </span>
      ))}
    </span>
  );

  return (
    <div ref={root} className={`w-full overflow-hidden ${className}`}>
      <div data-track className="flex w-max will-change-transform">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
