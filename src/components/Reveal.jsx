import { useRef, useMemo } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';

const splitWords = (line) => String(line).split(/(\s+)/).filter((s) => s.length);

/**
 * Line-masked word reveal. Each line clips its own overflow, words rise into
 * it on a short stagger. This is the single most load-bearing effect on the
 * site, so it is deliberately the only text animation used.
 */
export function Reveal({
  as: Tag = 'div',
  lines,
  text,
  className = '',
  lineClassName = '',
  style,
  delay = 0,
  stagger = 0.035,
  duration = 1.15,
  y = '108%',
  rotate = 0,
  start = 'top 88%',
  trigger = 'scroll', // 'scroll' | 'mount' | 'none'
  once = true,
  onDone,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const rows = useMemo(() => {
    if (Array.isArray(lines)) return lines;
    return String(text ?? '').split('\n');
  }, [lines, text]);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || trigger === 'none') return undefined;
    const words = el.querySelectorAll('[data-w]');
    if (!words.length) return undefined;

    if (reduced) {
      gsap.set(words, { yPercent: 0, opacity: 1, rotate: 0 });
      onDone?.();
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: parseFloat(y), rotate, opacity: 1 });
      const anim = {
        yPercent: 0,
        rotate: 0,
        duration,
        delay,
        stagger,
        ease: 'house',
        onComplete: onDone,
      };
      if (trigger === 'mount') {
        gsap.to(words, anim);
      } else {
        gsap.to(words, {
          ...anim,
          scrollTrigger: { trigger: el, start, once },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [rows, reduced, trigger, delay, stagger, duration, y, rotate, start, once]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {rows.map((line, i) => (
        <span key={i} className={`line-mask ${lineClassName}`}>
          {splitWords(line).map((w, j) =>
            /^\s+$/.test(w) ? (
              <span key={j}> </span>
            ) : (
              <span key={j} data-w className="word">
                {w}
              </span>
            ),
          )}
        </span>
      ))}
    </Tag>
  );
}

/** Generic block reveal — opacity + small rise, for anything that is not type. */
export function FadeUp({
  as: Tag = 'div',
  children,
  className = '',
  delay = 0,
  y = 34,
  start = 'top 90%',
  duration = 1.1,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'house',
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, delay, y, start, duration]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** A hairline that draws itself in from the left. */
export function DrawRule({ className = '', delay = 0 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduced) {
      gsap.set(el, { scaleX: 1 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          delay,
          ease: 'house',
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, delay]);

  return (
    <div
      ref={ref}
      className={`rule origin-left ${className}`}
      style={{ transform: 'scaleX(0)' }}
      aria-hidden="true"
    />
  );
}

export { ScrollTrigger };
