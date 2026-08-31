import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { Reveal } from '../components/Reveal';
import { cursorProps } from '../lib/hooks';

export default function NotFound() {
  return (
    <PageShell>
      <section
        className="gutter flex flex-col justify-center"
        style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
      >
        <p className="t-mono mb-8 text-ash">Error / 404</p>
        <Reveal
          as="h1"
          lines={['Nothing', 'filed here']}
          className="t-display"
          style={{ fontSize: 'clamp(48px, 13vw, 200px)' }}
          trigger="mount"
          delay={0.5}
        />
        <p className="t-body mt-8 max-w-[46ch]">
          The page you asked for does not exist — which is at least an unambiguous answer, and
          those are rare around here.
        </p>
        <Link
          to="/"
          className="t-mono mt-10 inline-block w-max border-b border-terra pb-1 text-terra-deep"
          {...cursorProps('hover')}
        >
          Back to index
        </Link>
      </section>
    </PageShell>
  );
}
