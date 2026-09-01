import { useEffect, useRef } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { cursorProps, scrollTo, useReducedMotion } from '../lib/hooks';
import { projects, identity } from '../data/site';
import ProjectPlate from '../components/ProjectPlate';
import PageShell from '../components/PageShell';
import Contact from '../components/Contact';
import { Reveal, FadeUp, DrawRule } from '../components/Reveal';

export default function Project() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const plateRef = useRef(null);
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  useEffect(() => {
    if (project) document.title = `${project.title} — ${identity.name}`;
    return () => {
      document.title = `${identity.name} — Computer Science & AI`;
    };
  }, [project]);

  useEffect(() => {
    const el = plateRef.current;
    if (!el || reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector('[data-plate]'),
        { yPercent: -10, scale: 1.14 },
        {
          yPercent: 8,
          scale: 1.14,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, slug]);

  if (!project) return <Navigate to="/404" replace />;

  return (
    <PageShell>
      <article>
        {/* Header */}
        <header className="gutter pb-[clamp(32px,6vh,72px)] pt-[clamp(120px,20vh,220px)]">
          <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* Not an anchor: under HashRouter a "/#work" href would be parsed
                as a route, not an in-page target. */}
            <button
              type="button"
              onClick={() => {
                navigate('/');
                setTimeout(() => scrollTo('#work'), 750);
              }}
              className="t-mono text-ash transition-colors duration-500 hover:text-terra-deep"
              {...cursorProps('hover', 'BACK')}
            >
              ← Index
            </button>
            <span className="t-mono text-ash">{project.index}</span>
            <span className="t-mono text-ash">{project.year}</span>
            <span className="t-mono text-terra-deep">{project.status}</span>
          </div>

          <Reveal
            as="h1"
            lines={project.titleLines ?? [project.title]}
            className="t-display"
            style={{ fontSize: 'clamp(44px, 10.5vw, 168px)' }}
            stagger={0.06}
            trigger="mount"
            delay={0.55}
          />

          <FadeUp className="mt-[clamp(24px,4vh,48px)] max-w-[36ch]" delay={0.7}>
            <p className="t-lead text-balance">{project.lead}</p>
          </FadeUp>
        </header>

        {/* Plate */}
        <div ref={plateRef} className="gutter">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[3px] bg-ink max-sm:aspect-[4/5]">
            <div data-plate className="absolute inset-0">
              <ProjectPlate project={project} showIndex={false} className="h-full w-full" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="gutter grid gap-[clamp(36px,6vw,110px)] py-[clamp(56px,11vh,140px)] lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <DrawRule className="mb-6" />
            <dl>
              {project.highlights.map(([k, v]) => (
                <div key={k} className="border-b border-ink/12 py-4">
                  <dt className="t-mono mb-1.5 text-ash">{k}</dt>
                  <dd className="text-[15px] font-medium leading-snug tracking-tighter">{v}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <li
                  key={t}
                  className="t-mono rounded-full border border-ink/20 px-3 py-1.5 text-ash"
                >
                  {t}
                </li>
              ))}
            </ul>

            {project.links?.length > 0 && (
              <ul className="mt-8 flex flex-col gap-3">
                {project.links.map((l) => (
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
          </aside>

          <div className="max-w-[64ch]">
            <p className="t-mono mb-8 text-ash">Overview</p>
            {project.body.map((p, i) => (
              <FadeUp
                as="p"
                key={i}
                className={
                  i === 0
                    ? 'mb-7 text-[clamp(19px,1.9vw,28px)] font-medium leading-[1.32] tracking-tighter'
                    : 't-body mb-6'
                }
                delay={i * 0.04}
              >
                {p}
              </FadeUp>
            ))}

            <FadeUp className="mt-10">
              <p className="t-mono mb-3 text-ash">Role</p>
              <p className="text-[15px] leading-snug">{project.role}</p>
            </FadeUp>
          </div>
        </div>

        {/* Next */}
        <nav className="gutter border-t border-ink/12 py-[clamp(48px,9vh,120px)]" aria-label="Next project">
          <p className="t-mono mb-6 text-ash">Next</p>
          <Link
            to={`/work/${next.slug}`}
            className="group flex items-center justify-between gap-8"
            {...cursorProps('view', 'VIEW')}
          >
            <h2
              className="t-display transition-[transform,color] duration-700 ease-expo group-hover:translate-x-3 group-hover:text-terra"
              style={{ fontSize: 'clamp(32px, 7.5vw, 130px)' }}
            >
              {next.title}
            </h2>
            <ProjectPlate
              project={next}
              showIndex={false}
              className="hidden aspect-[4/5] w-[140px] shrink-0 rounded-[3px] transition-transform duration-700 ease-expo group-hover:scale-105 sm:block"
            />
          </Link>
        </nav>
      </article>

      <Contact />
    </PageShell>
  );
}
