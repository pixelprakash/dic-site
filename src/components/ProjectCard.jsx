import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import '../styles/ProjectCard.css';

function initials(title) {
  return title
    .split(' ')
    .filter((w) => w.length > 2 && !/^(and|the|of|for|in|to|their)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// Respect the user's motion preference once, not per-event — checked at
// module scope rather than inside the handler so a rapid flurry of
// pointermove events doesn't re-query matchMedia every time.
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ProjectCard({ project, basePath = '/projects', ctaLabel = 'View Project' }) {
  const { slug, title, tagline, abstract, domain, tags = [], image } = project;
  const imageRef = useRef(null);
  const rafRef = useRef(null);
  const magnetRef = useRef(null);
  const quickRef = useRef(null);

  // GSAP needs to own the whole transform recipe (position + scale) from
  // the start rather than inheriting one from a plain CSS transform —
  // xPercent/yPercent center the button on its own tracked x/y position
  // (set per-frame in handleMouseMove) regardless of the button's actual
  // pixel size, and the initial scale/opacity give it a hidden resting
  // state to entrance-tween from on hover.
  useEffect(() => {
    if (!magnetRef.current || prefersReducedMotion) return;
    gsap.set(magnetRef.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
  }, []);

  // The floating "View Project" pill doesn't just fade in on hover — it
  // follows the cursor around inside the photo (a "magnetic" button, the
  // same idea awwwards-style agency sites use). GSAP's quickTo builds one
  // reusable, hardware-accelerated tween per axis instead of spinning up
  // a new tween on every mousemove, which is what makes this feel like a
  // smooth trailing follow rather than a jittery snap-to-cursor.
  const ensureQuickTo = () => {
    if (quickRef.current || !magnetRef.current) return;
    quickRef.current = {
      x: gsap.quickTo(magnetRef.current, 'x', { duration: 0.5, ease: 'power3' }),
      y: gsap.quickTo(magnetRef.current, 'y', { duration: 0.5, ease: 'power3' }),
    };
  };

  const handleMouseMove = (e) => {
    const el = imageRef.current;
    if (!el) return;
    const { clientX, clientY } = e;
    const rect = el.getBoundingClientRect();

    if (!prefersReducedMotion) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        el.style.setProperty('--tilt-x', `${(0.5 - y) * 8}deg`);
        el.style.setProperty('--tilt-y', `${(x - 0.5) * 10}deg`);
      });

      ensureQuickTo();
      if (quickRef.current) {
        quickRef.current.x(clientX - rect.left);
        quickRef.current.y(clientY - rect.top);
      }
    }
  };

  const handleMouseEnter = () => {
    if (!prefersReducedMotion && magnetRef.current) {
      gsap.to(magnetRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
    }
  };

  const handleMouseLeave = () => {
    const el = imageRef.current;
    if (el) {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    }
    if (!prefersReducedMotion && magnetRef.current) {
      gsap.to(magnetRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  };

  return (
    <article className="project-card">
      <Link
        to={`${basePath}/${slug}`}
        className="project-card__image"
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`View ${title}`}
      >
        {image ? (
          <img src={image} alt="" loading="lazy" />
        ) : (
          <div className="project-card__fallback" aria-hidden="true">
            <span>{initials(title)}</span>
          </div>
        )}

        {!prefersReducedMotion && (
          <span className="project-card__magnet" ref={magnetRef} aria-hidden="true">
            {ctaLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </Link>
      <div className="project-card__content">
        <p className="section-label">{domain}</p>
        <h3>{title}</h3>
        <p>{tagline || abstract}</p>
        {tags.length > 0 && (
          <div className="project-card__tags">
            {tags.slice(0, 4).map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        )}
        <Link to={`${basePath}/${slug}`} className="project-card__cta">
          {ctaLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
