import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from './lib/gsap';
import { useSmoothScroll, useViewportUnit, scrollTo } from './lib/hooks';
import Preloader from './components/Preloader';
import Nav from './components/Nav';
import { Grain, Cursor, ScrollProgress } from './components/Atmosphere';
import Home from './pages/Home';
import Project from './pages/Project';
import NotFound from './pages/NotFound';

export default function App() {
  const [opened, setOpened] = useState(false);
  const location = useLocation();

  useViewportUnit();
  useSmoothScroll(true);

  // Deep links (/work/...) skip the entry gate — only the index is gated, so
  // this is derived during render rather than synced in an effect.
  const gated = location.pathname === '/';
  const entered = opened || !gated;

  useEffect(() => {
    if (!entered) return undefined;
    const id = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(id);
  }, [entered]);

  return (
    <>
      {/* A real anchor would collide with HashRouter, so this scrolls directly.
          It only exists once the gate is open — nothing behind the gate should
          be tabbable. */}
      {entered && (
        <button
          type="button"
          onClick={() => scrollTo('#work')}
          className="sr-only fixed left-4 top-4 z-[9999] rounded-full bg-ink px-5 py-3 text-bone focus:not-sr-only"
        >
          Skip to work
        </button>
      )}
      <Grain />
      <Cursor />
      {entered && (
        <>
          <Nav ready={entered} />
          <ScrollProgress />
        </>
      )}

      {/* While the gate is up the page behind it must not be reachable by tab
          or announced by a screen reader. */}
      <div style={{ display: 'contents' }} inert={gated && !entered ? true : undefined}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home ready={entered} />} />
            <Route path="/work/:slug" element={<Project />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>

      {gated && !entered && <Preloader onEnter={() => setOpened(true)} />}
    </>
  );
}
