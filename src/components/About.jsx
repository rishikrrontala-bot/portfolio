import { about, capabilities } from '../data/site';
import { Reveal, FadeUp, DrawRule } from './Reveal';
import Marquee from './Marquee';

export default function About() {
  return (
    <section id="about" className="relative py-[clamp(88px,15vh,180px)]" aria-label="About">
      <div className="gutter">
        <p className="t-mono mb-[clamp(28px,5vh,64px)] text-ash">{about.kicker}</p>

        <Reveal
          as="h2"
          lines={about.title}
          className="t-display"
          stagger={0.05}
          style={{ fontSize: 'clamp(38px, 9vw, 150px)' }}
        />

        <div className="mt-[clamp(40px,8vh,110px)] grid gap-[clamp(32px,6vw,96px)] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-[62ch]">
            {about.paragraphs.map((p, i) => (
              <FadeUp as="p" key={i} className="t-body mb-6 last:mb-0" delay={i * 0.04}>
                {p}
              </FadeUp>
            ))}
          </div>

          <div className="lg:pt-2">
            <DrawRule className="mb-7" />
            <dl>
              {about.facts.map(([k, v], i) => (
                <FadeUp
                  key={k}
                  className="flex items-start justify-between gap-8 border-b border-ink/12 py-4"
                  delay={i * 0.05}
                >
                  <dt className="t-mono shrink-0 text-ash">{k}</dt>
                  <dd className="text-right text-[15px] font-medium leading-snug tracking-tighter">
                    {v}
                  </dd>
                </FadeUp>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-[clamp(56px,10vh,130px)] border-y border-ink/12 py-5">
        <Marquee
          items={capabilities}
          speed={34}
          itemClassName="font-display text-[clamp(20px,2.6vw,40px)] font-semibold uppercase tracking-tighter"
        />
      </div>
    </section>
  );
}
