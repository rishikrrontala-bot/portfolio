import Hero from '../components/Hero';
import Manifesto from '../components/Manifesto';
import WorkIndex from '../components/WorkIndex';
import WorldGrid from '../components/WorldGrid';
import About from '../components/About';
import Contact from '../components/Contact';
import PageShell from '../components/PageShell';

export default function Home({ ready }) {
  return (
    <PageShell>
      <Hero ready={ready} />
      <Manifesto />
      <WorkIndex />
      <WorldGrid />
      <About />
      <Contact />
    </PageShell>
  );
}
