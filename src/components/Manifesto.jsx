import { useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { manifesto } from '../data/site';

/**
 * Scroll-scrubbed statement: every word starts faded and resolves to full ink
 * as the section passes through the viewport. One effect, whole section.
 */
export default function Manifesto() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const words = el.querySelectorAll('[data-mw]');

    if (reduced) {
      gsap.set(words, { opacity: 1, color: '#100F0D' });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.5,
          scrollTrigger: {
            trigger: el,
            start: 'top 74%',
            end: 'bottom 62%',
            scrub: 0.55,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      className="gutter relative py-[clamp(96px,18vh,200px)]"
      aria-label="Statement"
    >
      <p className="t-mono mb-[clamp(32px,6vh,72px)] text-ash">Index / Statement</p>
      <p
        className="max-w-[16ch] font-display font-medium leading-[1.06] tracking-tighter sm:max-w-[20ch]"
        style={{ fontSize: 'clamp(30px, 5.4vw, 88px)' }}
      >
        {manifesto.map((line, i) => (
          <span key={i} className="block">
            {line.split(' ').map((w, j) => (
              <span key={j} data-mw className="inline-block" style={{ opacity: 0.14 }}>
                {w}
                {' '}
              </span>
            ))}
          </span>
        ))}
      </p>
    </section>
  );
}
