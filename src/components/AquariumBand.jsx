import { useLayoutEffect, useRef, useState } from 'react';
import '../styles/AquariumBand.css';

const FISH = [
  { top: '#8A7A5E', bottom: '#D9CBA9', tail: '#BEE3F8', size: 1.15, speed: 1 },
  { top: '#1E1B17', bottom: '#4A4640', tail: '#DCEFFB', size: 0.85, speed: 1.25 },
  { top: '#A6926C', bottom: '#E4D6B4', tail: '#9FD8EA', size: 1.3, speed: 0.8 },
  { top: '#2A2723', bottom: '#57534B', tail: '#EAF6FB', size: 0.7, speed: 1.4 },
  { top: '#95815F', bottom: '#DBCBA3', tail: '#8FCBE0', size: 1.05, speed: 1.05 },
  { top: '#211E1A', bottom: '#4E4A42', tail: '#CFEAF5', size: 0.78, speed: 1.3 },
  { top: '#B39B72', bottom: '#EBDDB9', tail: '#B7E0F2', size: 0.95, speed: 1.1 },
  { top: '#847354', bottom: '#CFC09A', tail: '#A6DCEE', size: 1.2, speed: 0.9 },
  { top: '#26221D', bottom: '#524D44', tail: '#E3F3FA', size: 0.65, speed: 1.5 },
  { top: '#9C8862', bottom: '#E0D2AE', tail: '#B2DEEF', size: 1.0, speed: 1.15 },
];

let fishGradId = 0;

function FishShape({ top, bottom, tail, gradId }) {
  const bodyGrad = `${gradId}-body`;
  const tailGrad = `${gradId}-tail`;
  const shineGrad = `${gradId}-shine`;

  return (
    <svg viewBox="0 0 60 32" width="60" height="32" className="fish__svg" aria-hidden="true">
      <defs>
        <linearGradient id={bodyGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="52%" stopColor={bottom} />
          <stop offset="100%" stopColor={top} stopOpacity="0.9" />
        </linearGradient>
        {/* Tail fades toward the tip instead of a flat fill — real fins are
            thin enough to be semi-translucent at the edges. */}
        <linearGradient id={tailGrad} x1="1" y1="0.5" x2="0" y2="0.5">
          <stop offset="0%" stopColor={tail} stopOpacity="0.92" />
          <stop offset="100%" stopColor={tail} stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id={shineGrad} cx="0.4" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* caudal (tail) fin — forked, gradient fade toward the tip */}
      <g className="fish__tail" style={{ transformOrigin: '20px 16px' }}>
        <path d="M20 16 C10 9 2 6 0 2 C4 10 6 14 10 16 C6 18 4 22 0 30 C2 26 10 23 20 16 Z" fill={`url(#${tailGrad})`} />
      </g>

      {/* anal fin */}
      <path d="M24 23 C22 27 24 29 28 29 C26 27 26 25 26 22 Z" fill={tail} opacity="0.6" />

      {/* dorsal fin */}
      <path d="M26 9 C24 3 27 1 32 2 C29 4 28 6 29 10 Z" fill={tail} opacity="0.68" className="fish__dorsal" />

      {/* body — tapered fish-like silhouette (a plain ellipse reads flat;
          this narrows toward the caudal peduncle like a real fish body) */}
      <path
        d="M16.5 16 C16.5 10.2 24 5.6 34 5.6 C42.8 5.6 49.8 9.2 52.8 13.4 C54.4 15 54.4 17 52.8 18.6 C49.8 22.8 42.8 26.4 34 26.4 C24 26.4 16.5 21.8 16.5 16 Z"
        fill={`url(#${bodyGrad})`}
      />

      {/* subtle vertical scale lines for texture, not a flat gradient fill */}
      <g opacity="0.16" stroke={top} strokeWidth="0.6" fill="none">
        <path d="M24 8.5 C22.5 12 22.5 20 24 23.5" />
        <path d="M30 6.5 C28 11 28 21 30 25.5" />
        <path d="M37 7 C35.5 11.5 35.5 20.5 37 25" />
      </g>

      {/* top-of-body shine, like light catching wet scales */}
      <ellipse cx="30" cy="11" rx="12" ry="4" fill={`url(#${shineGrad})`} />

      {/* belly shading */}
      <ellipse cx="33" cy="21.5" rx="13" ry="3" fill="#04141c" opacity="0.14" />

      {/* pectoral fin */}
      <path className="fish__pectoral" style={{ transformOrigin: '38px 18px' }} d="M38 18 C36 23 34 25 30 26 C34 24 36 21 37 17 Z" fill={tail} opacity="0.48" />

      {/* gill mark */}
      <path d="M43.5 9.5 C42.3 12.2 42.3 15.8 43.5 18.5" stroke={top} strokeWidth="0.9" strokeOpacity="0.4" fill="none" strokeLinecap="round" />

      {/* head shading */}
      <ellipse cx="47" cy="14" rx="6.8" ry="6.2" fill={`url(#${bodyGrad})`} />

      {/* eye */}
      <circle cx="50.3" cy="13" r="2.15" fill="#12100d" />
      <circle cx="51.1" cy="12.1" r="0.65" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

export default function AquariumBand() {
  const containerRef = useRef(null);
  const fishRefs = useRef([]);
  const stateRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const foodRef = useRef([]);
  const rafRef = useRef(null);
  const gradIds = useRef(FISH.map(() => `fish-grad-${fishGradId++}`));
  const [food, setFood] = useState([]);

  useLayoutEffect(() => {
    foodRef.current = food;
  }, [food]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const footer = container.closest('.footer') || container;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getBounds = () => container.getBoundingClientRect();
    const bounds = getBounds();

    stateRef.current = FISH.map((f) => ({
      x: 24 + Math.random() * Math.max(1, bounds.width - 48),
      y: 30 + Math.random() * Math.max(1, bounds.height - 60),
      vx: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.3) * f.speed,
      vy: (Math.random() - 0.5) * 0.15,
      speed: f.speed,
    }));

    const applyTransform = (i, s) => {
      const el = fishRefs.current[i];
      if (!el) return;
      const facing = s.vx < 0 ? -1 : 1;
      const angle = Math.max(-16, Math.min(16, s.vy * 14));
      el.style.transform = `translate(${s.x}px, ${s.y}px) scaleX(${facing}) rotate(${facing * angle}deg)`;
    };

    stateRef.current.forEach((s, i) => applyTransform(i, s));

    if (reduceMotion) return undefined;

    const onMove = (e) => {
      const r = getBounds();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    const onClick = (e) => {
      if (e.target.closest('a, button, input, select, textarea, label')) return;
      const r = getBounds();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (y < 0 || y > r.height) return;
      const id = `${Date.now()}-${Math.random()}`;
      setFood((prev) => [...prev, { id, x, y }]);
      window.setTimeout(() => {
        setFood((prev) => prev.filter((p) => p.id !== id));
      }, 5200);
    };

    footer.addEventListener('mousemove', onMove);
    footer.addEventListener('mouseleave', onLeave);
    footer.addEventListener('click', onClick);

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(32, now - last);
      last = now;
      const r = getBounds();
      const mouse = mouseRef.current;
      const activeFood = foodRef.current;

      stateRef.current.forEach((s, i) => {
        s.vx += (Math.random() - 0.5) * 0.03;
        s.vy += (Math.random() - 0.5) * 0.02;

        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const radius = 85;
          if (dist < radius && dist > 0.001) {
            const force = (radius - dist) / radius;
            s.vx += (dx / dist) * force * 0.85;
            s.vy += (dy / dist) * force * 0.45;
          }
        }

        if (activeFood.length) {
          let nearest = null;
          let nearestDist = Infinity;
          activeFood.forEach((f) => {
            const d = Math.hypot(s.x - f.x, s.y - f.y);
            if (d < nearestDist) {
              nearestDist = d;
              nearest = f;
            }
          });
          if (nearest && nearestDist < 320) {
            const dx = nearest.x - s.x;
            const dy = nearest.y - s.y;
            const dist = Math.max(1, nearestDist);
            const pull = nearestDist < 30 ? 0 : 0.55;
            s.vx += (dx / dist) * pull;
            s.vy += (dy / dist) * pull * 0.7;
          }
        }

        const speed = Math.hypot(s.vx, s.vy);
        const maxSpeed = 1.5 * s.speed;
        if (speed > maxSpeed) {
          s.vx = (s.vx / speed) * maxSpeed;
          s.vy = (s.vy / speed) * maxSpeed;
        }
        const minSpeed = 0.22 * s.speed;
        if (speed < minSpeed) {
          s.vx += (Math.random() - 0.5) * 0.2;
          s.vy += (Math.random() - 0.5) * 0.1;
        }

        s.x += s.vx * (dt / 16);
        s.y += s.vy * (dt / 16);

        const pad = 28;
        if (s.x < pad) {
          s.x = pad;
          s.vx = Math.abs(s.vx);
        }
        if (s.x > r.width - pad) {
          s.x = r.width - pad;
          s.vx = -Math.abs(s.vx);
        }
        if (s.y < 24) {
          s.y = 24;
          s.vy = Math.abs(s.vy) * 0.6;
        }
        if (s.y > r.height - 34) {
          s.y = r.height - 34;
          s.vy = -Math.abs(s.vy) * 0.6;
        }

        applyTransform(i, s);
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      footer.removeEventListener('mousemove', onMove);
      footer.removeEventListener('mouseleave', onLeave);
      footer.removeEventListener('click', onClick);
    };
  }, []);

  return (
    // Not aria-hidden at this level any more — it now contains a real,
    // meaningful link (the aquaponics CTA below), so only the decorative
    // children are individually hidden from assistive tech instead.
    <div className="aquarium" ref={containerRef}>
      <div className="aquarium__glow" aria-hidden="true" />
      <div className="aquarium__surface" aria-hidden="true" />
      <div className="aquarium__shimmer" aria-hidden="true" />
      <div className="aquarium__rays" aria-hidden="true">
        <span className="aquarium__ray aquarium__ray--1" />
        <span className="aquarium__ray aquarium__ray--2" />
        <span className="aquarium__ray aquarium__ray--3" />
      </div>
      <div className="aquarium__bubbles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="aquarium__bubble"
            style={{
              left: `${4 + i * 8}%`,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${7 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      {food.map((f) => (
        <span key={f.id} className="aquarium__food" aria-hidden="true" style={{ left: `${f.x}px`, top: `${f.y}px` }} />
      ))}

      {FISH.map((f, i) => (
        <div
          key={i}
          className="aquarium__fish"
          aria-hidden="true"
          ref={(el) => (fishRefs.current[i] = el)}
          style={{
            '--fish-scale': f.size,
            '--wag-duration': `${0.42 / f.speed}s`,
            '--wag-delay': `${(i * 0.13) % 1}s`,
          }}
        >
          <FishShape top={f.top} bottom={f.bottom} tail={f.tail} gradId={gradIds.current[i]} />
        </div>
      ))}

      <div className="aquarium__sand" aria-hidden="true" />
      <p className="aquarium__caption" aria-hidden="true">Inspired by the guppy tank in our studio — click to feed them</p>

      {/* The aquaponics teaser link used to live here as a hover-only
          overlay. It's now a permanent card in the footer's own bento
          grid (see Footer.jsx / .footer__project-card) instead — this
          component is back to being pure decoration. */}
    </div>
  );
}
