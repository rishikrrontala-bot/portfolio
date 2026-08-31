import { useMemo } from 'react';

/* Deterministic pseudo-random from a string, so a project's artwork is stable
   across reloads but unique per slug. No image assets, nothing to download. */
function seeded(slug) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i += 1) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generative cover art for a project. Concentric warped rings over a hue-shifted
 * ground — a contour map of something that will not sit still, which is on the
 * nose for the work but reads as abstract.
 */
export default function ProjectPlate({ project, className = '', showIndex = true }) {
  const { rings, ground } = useMemo(() => {
    const rnd = seeded(project.slug);
    const h = project.hue ?? 18;
    const list = [];
    const count = 16;
    for (let i = 0; i < count; i += 1) {
      const t = i / (count - 1);
      const r = 8 + t * 42;
      const wob = 1.4 + rnd() * 5.2;
      const phase = rnd() * Math.PI * 2;
      const pts = [];
      const steps = 84;
      for (let s = 0; s <= steps; s += 1) {
        const a = (s / steps) * Math.PI * 2;
        const rr =
          r +
          Math.sin(a * 3 + phase) * wob * (0.4 + t) +
          Math.cos(a * 5 - phase * 1.7) * wob * 0.34;
        pts.push(`${(50 + Math.cos(a) * rr).toFixed(2)},${(50 + Math.sin(a) * rr * 0.92).toFixed(2)}`);
      }
      list.push({
        d: `M${pts.join('L')}Z`,
        o: 0.16 + (1 - t) * 0.55,
        w: 0.22 + (1 - t) * 0.42,
      });
    }
    return {
      rings: list,
      ground: `radial-gradient(72% 68% at 34% 26%, hsl(${h} 62% 52%) 0%, hsl(${h} 58% 38%) 38%, hsl(${h} 40% 16%) 72%, #141311 100%)`,
    };
  }, [project.slug, project.hue]);

  return (
    <div
      className={`relative overflow-hidden bg-ink ${className}`}
      style={{ background: ground }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <g fill="none" stroke="#F4F1EA">
          {rings.map((r, i) => (
            <path key={i} d={r.d} strokeOpacity={r.o} strokeWidth={r.w} />
          ))}
        </g>
      </svg>

      {showIndex && (
        <span
          className="t-display absolute bottom-[6%] left-[6%] text-bone/85"
          style={{ fontSize: 'clamp(28px, 4.4vw, 64px)', lineHeight: 1 }}
        >
          {project.index}
        </span>
      )}
      <span className="t-mono absolute right-[6%] top-[7%] text-bone/70">{project.year}</span>
    </div>
  );
}
