import { useEffect, useRef, lazy, Suspense } from 'react';
import { gsap } from '../lib/gsap';
import { cursorProps, scrollTo, useReducedMotion } from '../lib/hooks';
import { identity } from '../data/site';

const HeroField = lazy(() => import('./HeroField'));

/* Layered procedural wash the field is drawn over. Built from gradients rather
   than an image so it costs nothing and stays exactly on the palette. */
const WASH =
  'radial-gradient(78% 66% at 79% 16%, rgba(218,83,44,0.30) 0%, rgba(218,83,44,0) 62%),' +
  'radial-gradient(58% 54% at 97% 58%, rgba(179,63,28,0.24) 0%, rgba(179,63,28,0) 70%),' +
  'radial-gradient(70% 60% at 62% 78%, rgba(115,109,99,0.20) 0%, rgba(115,109,99,0) 68%),' +
  'radial-gradient(120% 96% at 46% 2%, #F8F5EF 0%, #EFEAE0 52%, #E6E1D4 100%)';

/* Keeps the headline and the mono meta readable over the artwork: bone from the
   bottom and the left, clear by the time it reaches the top right. */
const SCRIM =
  'linear-gradient(to top, rgba(244,241,234,0.94) 0%, rgba(244,241,234,0.76) 24%,' +
  ' rgba(244,241,234,0.22) 52%, rgba(244,241,234,0) 76%),' +
  'linear-gradient(to right, rgba(244,241,234,0.80) 0%, rgba(244,241,234,0.34) 32%,' +
  ' rgba(244,241,234,0) 62%)';

export default function Hero({ ready }) {
  const root = useRef(null);
  const canvasWrap = useRef(null);
  const veil = useRef(null);
  const reduced = useReducedMotion();

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
          { autoAlpha: 0, scale: 1.08 },
          { autoAlpha: 1, scale: 1, duration: 2.4, ease: 'house' },
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

  /* Scroll — the headline drifts up, the artwork pushes in and settles back
     under a rising veil rather than simply sliding away. The veil is its own
     element so the scrub never fights the entry timeline over opacity. */
  useEffect(() => {
    if (reduced || !root.current) return undefined;
    const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 };
    const ctx = gsap.context(() => {
      gsap.to('[data-hero-type]', { yPercent: -22, ease: 'none', scrollTrigger: st });
      gsap.to(canvasWrap.current, {
        yPercent: 9,
        scale: 1.16,
        ease: 'none',
        scrollTrigger: st,
      });
      gsap.fromTo(
        veil.current,
        { opacity: 0 },
        { opacity: 0.62, ease: 'none', scrollTrigger: st },
      );
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
      {/* Generative set-piece, full bleed behind the type. */}
      <div
        ref={canvasWrap}
        className="pointer-events-none absolute inset-0 z-0 will-change-transform"
        style={{ opacity: 0, background: WASH }}
        aria-hidden="true"
      >
        {/* Mounted only after the gate opens: the simulation must never sit in
            front of first paint. */}
        {ready && (
          <Suspense fallback={null}>
            <HeroField active />
          </Suspense>
        )}
      </div>

      {/* Legibility scrim, then the scroll veil on top of it. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: SCRIM }}
        aria-hidden="true"
      />
      <div
        ref={veil}
        className="pointer-events-none absolute inset-0 z-[2] bg-bone"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />

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
