import { useRef } from 'react';
import { gsap } from '../lib/gsap';
import {
  cursorProps,
  useFinePointer,
  useIsoLayoutEffect,
  useLocalTime,
  useMagnetic,
  useReducedMotion,
} from '../lib/hooks';
import { identity } from '../data/site';
import { Reveal, FadeUp } from './Reveal';

export default function Contact() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const magnetic = useMagnetic({ strength: 0.22, radius: 1.1, disabled: !fine || reduced });
  const time = useLocalTime(identity.timezone);
  const wordmark = useRef(null);

  /* The wordmark rises out of the footer as you reach the bottom. */
  useIsoLayoutEffect(() => {
    const el = wordmark.current;
    if (!el || reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: 30 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 0.7 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer id="contact" className="relative overflow-hidden bg-ink text-bone">
      <div className="gutter pt-[clamp(80px,14vh,170px)]">
        <p className="t-mono mb-[clamp(28px,5vh,60px)] text-bone/55">Index / Contact</p>

        <Reveal
          as="h2"
          lines={['Tell me what', 'you are actually', 'trying to solve.']}
          className="t-display text-bone"
          stagger={0.05}
        />

        <FadeUp className="mt-[clamp(40px,8vh,96px)]">
          <a
            ref={magnetic}
            href={`mailto:${identity.email}`}
            className="group inline-flex max-w-full items-center gap-4 break-all text-terra"
            {...cursorProps('hover', 'MAIL')}
          >
            <span
              className="font-display font-semibold tracking-tighter underline decoration-terra/30 decoration-1 underline-offset-[0.18em] transition-colors duration-500 group-hover:decoration-terra"
              style={{ fontSize: 'clamp(18px, 3.4vw, 54px)' }}
            >
              {identity.email}
            </span>
            <span
              className="hidden h-12 w-12 shrink-0 place-items-center rounded-full border border-terra/40 transition-colors duration-500 group-hover:bg-terra sm:grid"
              aria-hidden="true"
            >
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 11L11 1M11 1H3.5M11 1v7.5"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  className="transition-colors duration-500 group-hover:stroke-ink"
                />
              </svg>
            </span>
          </a>
        </FadeUp>

        <FadeUp className="mt-[clamp(40px,7vh,90px)] grid gap-8 border-t border-bone/12 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="t-mono mb-2 text-bone/55">Availability</p>
            <p className="text-[15px] leading-snug text-bone/85">{identity.availability}</p>
          </div>
          <div>
            <p className="t-mono mb-2 text-bone/55">Local time</p>
            <p className="text-[15px] tabular-nums text-bone/85">
              {time} — {identity.location}
            </p>
          </div>
          <div>
            <p className="t-mono mb-2 text-bone/55">Elsewhere</p>
            <ul className="flex flex-col gap-1">
              {identity.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer noopener"
                    className="text-[15px] text-bone/85 transition-colors duration-500 hover:text-terra"
                    {...cursorProps('hover')}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-mono mb-2 text-bone/55">Discipline</p>
            <p className="text-[15px] leading-snug text-bone/85">{identity.discipline}</p>
          </div>
        </FadeUp>
      </div>

      {/* Oversized wordmark, cropped by the bottom edge. */}
      <div className="gutter mt-[clamp(48px,9vh,120px)] overflow-hidden">
        <h2
          ref={wordmark}
          className="t-display w-full text-bone/90"
          style={{ fontSize: 'clamp(52px, 15.5vw, 300px)', lineHeight: 0.8 }}
          aria-hidden="true"
        >
          {identity.name}
        </h2>
      </div>

      <div className="gutter flex flex-wrap items-center justify-between gap-3 border-t border-bone/12 py-5">
        <span className="t-mono text-bone/55">
          © {new Date().getFullYear()} {identity.name}
        </span>
        <span className="t-mono text-bone/55">Built with intent, not templates</span>
      </div>
    </footer>
  );
}
