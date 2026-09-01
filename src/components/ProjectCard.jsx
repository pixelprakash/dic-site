import { Link } from 'react-router-dom';
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

export default function ProjectCard({ project, basePath = '/projects', ctaLabel = 'View Project' }) {
  const { slug, title, tagline, abstract, domain, tags = [], image } = project;

  return (
    <article className="project-card">
      <div className="project-card__image">
        {image ? (
          <img src={image} alt="" loading="lazy" />
        ) : (
          <div className="project-card__fallback" aria-hidden="true">
            <span>{initials(title)}</span>
          </div>
        )}
      </div>
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
