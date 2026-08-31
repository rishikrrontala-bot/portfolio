import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../lib/gsap';
import {
  cursorProps,
  lockScroll,
  scrollTo,
  useLocalTime,
  useMagnetic,
  useReducedMotion,
  useFinePointer,
} from '../lib/hooks';
import { identity, nav as navItems } from '../data/site';

/* ── The bar ─────────────────────────────────────────────────────────────── */

export default function Nav({ ready }) {
  const bar = useRef(null);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const time = useLocalTime(identity.timezone);
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();

  /* Invert the bar while it sits over an ink-coloured section, otherwise the
     ink-on-ink text disappears. Re-created per route because the sections do. */
  useEffect(() => {
    if (!ready) return undefined;
    let triggers = [];
    const id = setTimeout(() => {
      const targets = ['#world', '#contact']
        .map((s) => document.querySelector(s))
        .filter(Boolean);
      triggers = targets.map((t) =>
        ScrollTrigger.create({
          trigger: t,
          start: 'top 58px',
          end: 'bottom 58px',
          onToggle: (self) => setDark(self.isActive),
        }),
      );
    }, 400);
    return () => {
      clearTimeout(id);
      triggers.forEach((t) => t.kill());
      setDark(false);
    };
  }, [ready, location.pathname]);

  // Reveal the bar once the preloader has lifted.
  useEffect(() => {
    if (!ready || !bar.current) return;
    gsap.fromTo(
      bar.current,
      { yPercent: -120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.1, delay: 0.35, ease: 'house' },
    );
  }, [ready]);

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    if (!ready || reduced) return undefined;
    const el = bar.current;
    let last = 0;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        if (Math.abs(y - last) < 8) return;
        const down = y > last && y > 160;
        gsap.to(el, { yPercent: down ? -140 : 0, duration: 0.65, ease: 'house' });
        last = y;
      },
    });
    return () => st.kill();
  }, [ready, reduced]);

  const go = useCallback(
    (item) => {
      setOpen(false);
      const jump = () => scrollTo(item.hash === '#top' ? 'body' : item.hash);
      if (location.pathname !== item.to) {
        navigate(item.to);
        setTimeout(jump, 700);
      } else {
        setTimeout(jump, reduced ? 0 : 620);
      }
    },
    [location.pathname, navigate, reduced],
  );

  return (
    <>
      <header
        ref={bar}
        className={`fixed left-0 top-0 z-[80] w-full transition-colors duration-500 ${
          dark || open ? 'text-bone' : 'text-ink mix-blend-multiply'
        }`}
        style={{ opacity: 0 }}
      >
        <div className="gutter flex items-center justify-between py-6">
          <button
            type="button"
            onClick={() => go({ to: '/', hash: '#top' })}
            className="t-mono flex items-center gap-2"
            {...cursorProps('hover')}
            title="Back to top"
          >
            <span
              className="inline-block h-[7px] w-[7px] rounded-full bg-terra"
              aria-hidden="true"
            />
            {identity.name}
          </button>

          <div
            className={`t-mono hidden items-center gap-8 transition-opacity duration-500 md:flex ${
              dark || open ? 'text-bone/55' : 'text-ash'
            } ${open ? 'opacity-0' : 'opacity-100'}`}
          >
            <span>{identity.location}</span>
            <span className="tabular-nums">{time}</span>
          </div>

          <MenuButton open={open} onClick={() => setOpen((v) => !v)} />
        </div>
      </header>

      <Menu open={open} items={navItems} onNavigate={go} onClose={() => setOpen(false)} />
    </>
  );
}

/* ── Trigger ─────────────────────────────────────────────────────────────── */

function MenuButton({ open, onClick }) {
  const fine = useFinePointer();
  const ref = useMagnetic({ strength: 0.4, disabled: !fine });

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="t-mono relative z-[95] flex items-center gap-3"
      {...cursorProps('hover')}
    >
      <span className="relative block h-[10px] w-[26px]" aria-hidden="true">
        <span
          className="absolute left-0 block h-px w-full bg-current transition-transform duration-500 ease-expo"
          style={{ top: 0, transform: open ? 'translateY(5px) rotate(19deg)' : 'none' }}
        />
        <span
          className="absolute left-0 block h-px w-full bg-current transition-transform duration-500 ease-expo"
          style={{ top: 9, transform: open ? 'translateY(-4px) rotate(-19deg)' : 'none' }}
        />
      </span>
      <span className="hidden sm:inline">{open ? 'Close' : 'Menu'}</span>
    </button>
  );
}

/* ── Fullscreen overlay ──────────────────────────────────────────────────── */

function Menu({ open, items, onNavigate, onClose }) {
  const root = useRef(null);
  const panel = useRef(null);
  const reduced = useReducedMotion();
  const tl = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;

    const rows = el.querySelectorAll('[data-menu-row]');
    const meta = el.querySelectorAll('[data-menu-meta]');

    tl.current?.kill();
    if (reduced) {
      gsap.set(el, { autoAlpha: open ? 1 : 0 });
      gsap.set([rows, meta], { yPercent: 0, autoAlpha: 1 });
      lockScroll(open);
      return undefined;
    }

    if (open) {
      lockScroll(true);
      tl.current = gsap
        .timeline()
        .set(el, { autoAlpha: 1, pointerEvents: 'auto' })
        .fromTo(
          panel.current,
          { yPercent: -101 },
          { yPercent: 0, duration: 1.0, ease: 'house' },
        )
        .fromTo(
          rows,
          { yPercent: 118 },
          { yPercent: 0, duration: 1.0, stagger: 0.055, ease: 'house' },
          '-=0.62',
        )
        .fromTo(meta, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.05 }, '-=0.7');
    } else {
      tl.current = gsap
        .timeline({
          onComplete: () => {
            gsap.set(el, { autoAlpha: 0, pointerEvents: 'none' });
            lockScroll(false);
          },
        })
        .to(meta, { autoAlpha: 0, duration: 0.3 })
        .to(rows, { yPercent: -118, duration: 0.6, stagger: 0.03, ease: 'houseIn' }, '-=0.2')
        .to(panel.current, { yPercent: -101, duration: 0.8, ease: 'house' }, '-=0.35');
    }
    return undefined;
  }, [open, reduced]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90]"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
      aria-hidden={!open}
    >
      <div ref={panel} className="absolute inset-0 bg-ink" />
      <nav className="gutter relative flex h-full flex-col justify-between pb-10 pt-28">
        <ul className="mt-auto">
          {items.map((item, i) => (
            <li key={item.label} className="line-mask">
              <button
                data-menu-row
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => onNavigate(item)}
                className="group flex w-full items-start gap-5 py-[0.5vh] text-left text-bone"
                {...cursorProps('hover')}
              >
                <span className="t-mono w-8 shrink-0 pt-[0.55em] text-bone/55">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="t-display block transition-[color,transform] duration-700 ease-expo group-hover:translate-x-3 group-hover:text-terra"
                  style={{ fontSize: 'clamp(34px, min(9.4vw, 9.6vh), 128px)' }}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-8">
          <div data-menu-meta className="max-w-sm">
            <p className="t-mono mb-3 text-bone/55">Contact</p>
            <a
              href={`mailto:${identity.email}`}
              tabIndex={open ? 0 : -1}
              className="text-bone underline decoration-bone/25 underline-offset-4 transition-colors duration-500 hover:text-terra"
              style={{ fontSize: 'clamp(15px, 1.4vw, 20px)' }}
              {...cursorProps('hover')}
            >
              {identity.email}
            </a>
          </div>
          <ul data-menu-meta className="flex flex-wrap gap-x-7 gap-y-2">
            {identity.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  tabIndex={open ? 0 : -1}
                  className="t-mono text-bone/60 transition-colors duration-500 hover:text-terra"
                  {...cursorProps('hover')}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
