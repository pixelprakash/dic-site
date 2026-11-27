import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { responsive } from '../lib/img';
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

// Cards without a photo get one of three soft brand washes (picked from the
// title, so a card keeps the same colour between visits) instead of a flat
// dark box.
const FALLBACK_TONES = ['warm', 'cool', 'teal'];

// Respect the user's motion preference once, not per-event — checked at
// module scope rather than inside the handler so a rapid flurry of
// pointermove events doesn't re-query matchMedia every time.
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ProjectCard({ project, basePath = '/projects', ctaLabel = 'View Project', headingLevel = 3, priority = false }) {
  const { slug, title, tagline, abstract, domain, tags = [], image } = project;
  const Heading = `h${headingLevel}`;
  const imageRef = useRef(null);
  const rafRef = useRef(null);

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
    }
  };

  const handleMouseLeave = () => {
    const el = imageRef.current;
    if (el) {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    }
  };

  return (
    <article className="project-card">
      <Link
        to={`${basePath}/${slug}`}
        className="project-card__image"
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-hidden="true"
        tabIndex={-1}
      >
        {image ? (
          <img {...responsive(image)} sizes="(max-width: 768px) 100vw, 45vw" alt="" loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : undefined} decoding="async" />
        ) : (
          <div className={`project-card__fallback project-card__fallback--${FALLBACK_TONES[title.length % FALLBACK_TONES.length]}`} aria-hidden="true">
            <span>{initials(title)}</span>
          </div>
        )}
      </Link>
      <div className="project-card__content">
        <Heading><Link to={`${basePath}/${slug}`} className="project-card__title-link">{title}</Link></Heading>
        <p>{tagline || abstract}</p>
        {(domain || tags.length > 0) && (
          <div className="project-card__tags">
            {domain && <span className="tag tag--accent">{domain}</span>}
            {tags.filter((t) => t !== domain).slice(0, domain ? 3 : 4).map((t) => (
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
