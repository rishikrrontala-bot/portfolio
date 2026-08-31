import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollTrigger } from '../lib/gsap';
import { useReducedMotion, getLenis, setCursor } from '../lib/hooks';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Route wrapper. Two curtains: one lifts off the incoming page, one drops over
 * the outgoing page. With AnimatePresence mode="wait" they never run at once,
 * so a route change reads as a single continuous wipe.
 */
export default function PageShell({ children, className = '' }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    // The element that was hovered when navigation started no longer exists,
    // so its mouseleave never fires — reset the cursor by hand.
    setCursor({ mode: 'default', label: '' });
    const l = getLenis();
    if (l) l.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // Layout has changed under ScrollTrigger — recompute all start/end points.
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, []);

  if (reduced) return <main className={className}>{children}</main>;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[85] bg-ink"
        style={{ transformOrigin: 'top' }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.85, ease: EASE } }}
        exit={{ scaleY: 0, transition: { duration: 0 } }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[86] bg-ink"
        style={{ transformOrigin: 'bottom' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.6, ease: EASE } }}
      />
      <motion.main
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.25 } }}
        exit={{ opacity: 1 }}
      >
        {children}
      </motion.main>
    </>
  );
}
