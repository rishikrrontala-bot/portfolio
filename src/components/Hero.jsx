import { useEffect, useRef, lazy, Suspense } from 'react';
import { gsap } from '../lib/gsap';
import { cursorProps, scrollTo, useReducedMotion, useIsDesktop } from '../lib/hooks';
import { identity } from '../data/site';

const HeroCanvas = lazy(() => import('./HeroCanvas'));

export default function Hero({ ready }) {
  const root = useRef(null);
  const canvasWrap = useRef(null);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();

  /* Entry choreography — fires once the preloader has lifted. */
  useEffect(() => {
    if (!ready || !root.current) return undefined;
    const el = root.current;

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll('[data-hero-word]');
      const meta = el.querySelectorAll('[data-hero-meta]');

      if (reduced) {
        gsap.set([words, meta, canvasWrap.current], { yPercent: 0, autoAlpha: 1, scale: 1 });
        return;
      }

      gsap
        .timeline({ delay: 0.15 })
        .fromTo(
          words,
          { yPercent: 115 },
          { yPercent: 0, duration: 1.5, stagger: 0.08, ease: 'house' },
        )
        .fromTo(
          canvasWrap.current,
          { autoAlpha: 0, scale: 0.72 },
          { autoAlpha: 1, scale: 1, duration: 1.9, ease: 'house' },
          '-=1.35',
        )
        .fromTo(
          meta,
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 },
          '-=1.35',
        );
    }, el);

    return () => ctx.revert();
  }, [ready, reduced]);

  /* Scroll parallax — headline drifts up slowly, the blob sinks and shrinks. */
  useEffect(() => {
    if (reduced || !root.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.to('[data-hero-type]', {
        yPercent: -22,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to(canvasWrap.current, {
        yPercent: 16,
        scale: 0.86,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="top"
      ref={root}
      className="relative flex w-full flex-col justify-end overflow-hidden"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* WebGL object */}
      <div
        ref={canvasWrap}
        className="pointer-events-none absolute z-0"
        style={{
          opacity: 0,
          right: desktop ? '-5vw' : '-16vw',
          top: desktop ? '4vh' : '5vh',
          width: desktop ? '56vw' : '92vw',
          height: desktop ? '70vh' : '42vh',
        }}
        aria-hidden="true"
      >
        {/* Mounted only after the gate opens: the WebGL chunk is the heaviest
            thing on the site and must never sit in front of first paint. */}
        {ready && (
          <Suspense fallback={null}>
            <HeroCanvas active />
          </Suspense>
        )}
      </div>

      {/* Type */}
      <div data-hero-type className="gutter relative z-10 pb-[clamp(88px,12vh,140px)] pt-32 sm:pt-40">
        <p
          data-hero-meta
          className="t-mono mb-[clamp(24px,5vh,56px)] max-w-[34ch] text-ash"
          style={{ opacity: 0 }}
        >
          {identity.discipline}
        </p>

        <h1 className="t-display" style={{ fontSize: 'clamp(58px, 15.4vw, 260px)' }}>
          {identity.headline.map((w) => (
            <span key={w} className="line-mask">
              <span data-hero-word className="word" style={{ display: 'block' }}>
                {w}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-[clamp(28px,5vh,64px)] flex flex-wrap items-end justify-between gap-8">
          <p
            data-hero-meta
            className="t-lead max-w-[24ch] text-balance"
            style={{ opacity: 0 }}
          >
            {identity.proposition}
          </p>

          <button
            data-hero-meta
            type="button"
            onClick={() => scrollTo('#work')}
            className="group flex items-center gap-4"
            style={{ opacity: 0 }}
            {...cursorProps('hover')}
          >
            <span className="t-mono text-ash transition-colors duration-500 group-hover:text-ink">
              Selected work
            </span>
            <span
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/25 transition-colors duration-500 group-hover:border-terra group-hover:bg-terra"
              aria-hidden="true"
            >
              <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
                <path
                  d="M5.5 0v12M1 8l4.5 4.5L10 8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className="transition-colors duration-500 group-hover:stroke-bone"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
