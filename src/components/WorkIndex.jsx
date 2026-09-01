import { useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import {
  cursorProps,
  useFinePointer,
  useIsoLayoutEffect,
  useReducedMotion,
} from '../lib/hooks';
import { projects } from '../data/site';
import ProjectPlate from './ProjectPlate';
import { Reveal, DrawRule } from './Reveal';

const ALL = 'All';

export default function WorkIndex() {
  const [filter, setFilter] = useState(ALL);
  const [active, setActive] = useState(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const previewRef = useRef(null);
  const listRef = useRef(null);

  const filters = useMemo(
    () => [ALL, ...Array.from(new Set(projects.flatMap((p) => p.tags)))],
    [],
  );

  const shown = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter))),
    [filter],
  );

  /* Cursor-following preview plate (desktop only). */
  useIsoLayoutEffect(() => {
    if (!fine || reduced || !previewRef.current) return undefined;
    const el = previewRef.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'house' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'house' });
    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [fine, reduced]);

  useIsoLayoutEffect(() => {
    if (!fine || reduced || !previewRef.current) return;
    gsap.to(previewRef.current, {
      autoAlpha: active ? 1 : 0,
      scale: active ? 1 : 0.86,
      duration: 0.65,
      ease: 'house',
    });
  }, [active, fine, reduced]);

  /* Tiles rise in on scroll. */
  useIsoLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    const rows = el.querySelectorAll('[data-row]');
    if (reduced) {
      gsap.set(rows, { autoAlpha: 1, y: 0 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { autoAlpha: 0, y: 46 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.09,
          ease: 'house',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, filter]);

  const onEnter = useCallback((p) => setActive(p), []);
  const onLeave = useCallback(() => setActive(null), []);

  return (
    <section id="work" className="relative py-[clamp(80px,14vh,160px)]" aria-label="Selected work">
      <div className="gutter">
        <div className="mb-[clamp(28px,5vh,56px)] flex flex-wrap items-end justify-between gap-6">
          <Reveal
            as="h2"
            lines={['Selected', 'work']}
            className="t-display"
            lineClassName=""
            stagger={0.06}
          />
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <span className="t-mono text-ash">
              {String(shown.length).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <ul className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <li key={f}>
                  <button
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                    className={`t-mono rounded-full border px-4 py-2 transition-colors duration-500 ${
                      filter === f
                        ? 'border-ink bg-ink text-bone'
                        : 'border-ink/25 text-ash hover:border-ink/55 hover:text-ink'
                    }`}
                    {...cursorProps('hover')}
                  >
                    {f}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DrawRule />

        <ul
          ref={listRef}
          className="relative mt-[clamp(32px,6vh,72px)] grid gap-x-[clamp(16px,2.6vw,44px)] gap-y-[clamp(44px,7vh,92px)] sm:grid-cols-2"
        >
          {shown.map((p) => (
            <li key={p.slug} data-row style={{ opacity: 0 }}>
              <Link
                to={`/work/${p.slug}`}
                onMouseEnter={() => onEnter(p)}
                onMouseLeave={onLeave}
                onFocus={() => onEnter(p)}
                onBlur={onLeave}
                className="group block"
                {...cursorProps('view', 'VIEW')}
              >
                <div className="relative overflow-hidden rounded-[3px] bg-ink">
                  <ProjectPlate
                    project={p}
                    showIndex={false}
                    className="aspect-[8/5] w-full transition-transform duration-[1100ms] ease-expo group-hover:scale-[1.045]"
                  />

                  {/* Corner arrow — appears on hover, and on keyboard focus so
                      the affordance is not pointer-only. Bottom right, clear of
                      the year stamped in the plate's top corner. */}
                  <span
                    className="pointer-events-none absolute bottom-4 right-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full border border-bone/45 bg-ink/70 opacity-0 backdrop-blur-[2px] transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:border-terra group-hover:bg-terra group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                    aria-hidden="true"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M1 11L11 1M11 1H3.5M11 1v7.5"
                        stroke="#F4F1EA"
                        strokeWidth="1.1"
                      />
                    </svg>
                  </span>
                </div>

                <div className="mt-[clamp(16px,2vh,24px)] flex items-baseline justify-between gap-5">
                  <h3
                    className="t-display transition-colors duration-500 group-hover:text-terra"
                    style={{ fontSize: 'clamp(26px, 3.2vw, 52px)' }}
                  >
                    {p.title}
                  </h3>
                  <span className="t-mono shrink-0 text-ash">{p.index}</span>
                </div>
                <p className="t-mono mt-2.5 text-ash">{p.kicker}</p>
              </Link>

              {/* External links live outside the card link — an anchor cannot
                  nest inside another anchor. */}
              {p.links?.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  {p.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="t-mono text-terra-deep transition-colors duration-500 hover:text-ink"
                        {...cursorProps('hover')}
                      >
                        {l.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {shown.length === 0 && (
          <p className="t-mono py-16 text-ash">Nothing filed under “{filter}” yet.</p>
        )}
      </div>

      {/* Floating hover preview */}
      {fine && !reduced && (
        <div
          ref={previewRef}
          className="pointer-events-none fixed left-0 top-0 z-[60] -ml-[150px] -mt-[94px] h-[188px] w-[300px] will-change-transform"
          style={{ opacity: 0, visibility: 'hidden' }}
          aria-hidden="true"
        >
          {active && (
            <ProjectPlate project={active} className="h-full w-full rounded-[3px] shadow-2xl" />
          )}
        </div>
      )}
    </section>
  );
}
