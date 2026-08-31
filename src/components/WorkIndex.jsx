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

  /* Rows rise in on scroll. */
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
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {filters.map((f) => (
                <li key={f}>
                  <button
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                    className={`t-mono border-b pb-1 transition-colors duration-500 ${
                      filter === f
                        ? 'border-terra text-terra-deep'
                        : 'border-transparent text-ash hover:text-ink'
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

        <ul ref={listRef} className="relative">
          {shown.map((p) => (
            <li key={p.slug} data-row style={{ opacity: 0 }}>
              <Link
                to={`/work/${p.slug}`}
                onMouseEnter={() => onEnter(p)}
                onMouseLeave={onLeave}
                onFocus={() => onEnter(p)}
                onBlur={onLeave}
                className="group block border-b border-ink/12 py-[clamp(20px,3.4vh,40px)]"
                {...cursorProps('view', 'VIEW')}
              >
                <div className="flex items-start gap-5 sm:items-center">
                  <span className="t-mono w-8 shrink-0 pt-2 text-ash transition-colors duration-500 group-hover:text-terra-deep sm:pt-0">
                    {p.index}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="t-display transition-[transform,color] duration-700 ease-expo group-hover:translate-x-2 group-hover:text-terra"
                      style={{ fontSize: 'clamp(30px, 6.2vw, 96px)' }}
                    >
                      {p.title}
                    </h3>
                    <p className="t-mono mt-3 text-ash sm:hidden">{p.kicker}</p>
                  </div>

                  {/* Inline plate on touch / narrow screens. */}
                  <ProjectPlate
                    project={p}
                    showIndex={false}
                    className="ml-auto hidden aspect-[4/5] w-[92px] shrink-0 rounded-[2px] sm:block lg:hidden"
                  />

                  <div className="ml-auto hidden shrink-0 items-center gap-10 lg:flex">
                    <span className="t-mono text-ash">{p.kicker}</span>
                    <span className="t-mono w-24 text-right text-ash">{p.status}</span>
                    <span
                      className="grid h-10 w-10 place-items-center rounded-full border border-ink/20 transition-all duration-500 group-hover:border-terra group-hover:bg-terra"
                      aria-hidden="true"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M1 11L11 1M11 1H3.5M11 1v7.5"
                          stroke="currentColor"
                          strokeWidth="1.1"
                          className="transition-colors duration-500 group-hover:stroke-bone"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <p className="t-body mt-4 max-w-[62ch] text-ink-soft/80 sm:mt-5">{p.summary}</p>
              </Link>
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
          className="pointer-events-none fixed left-0 top-0 z-[60] -ml-[130px] -mt-[165px] h-[330px] w-[260px] will-change-transform"
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
