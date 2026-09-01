import { Link, useParams } from 'react-router-dom';
import { getProjectBySlug } from '../data/projectsData';
import '../styles/ProjectDetail.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="page-header" style={{ textAlign: 'center' }}>
        <div className="page-header__accent" />
        <ol className="project-detail__breadcrumb" style={{ justifyContent: 'center' }}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li aria-current="page">Not found</li>
        </ol>
        <h1>Project not found</h1>
        <p style={{ margin: '0 auto' }}>This project doesn&rsquo;t have a page yet, or the link is out of date.</p>
      </div>
    );
  }

  const { title, subtitle, subtitle2, tagline, description = [], objectives = [], outcomes = [], gallery = [], status, pi, tags = [], image } = project;

  return (
    <div className="project-detail">
      <div className="page-header project-detail__header">
        <div className="page-header__accent" />
        <ol className="project-detail__breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li aria-current="page">{title}</li>
        </ol>
        {status && (
          <div className="project-detail__meta-row">
            <span className="project-detail__status">{status}</span>
          </div>
        )}
        <h1>{title}</h1>
        {subtitle && <p className="project-detail__subtitle">{subtitle}</p>}
        {subtitle2 && <p className="project-detail__subtitle">{subtitle2}</p>}
      </div>

      {image && (
        <div className="project-detail__hero-image">
          <img src={image} alt="" loading="lazy" />
        </div>
      )}

      <section className="project-detail__section">
        <p className="section-label">Overview</p>
        <h2 className="section-title">About this project</h2>
        {description.map((p, i) => (
          <p className="project-detail__body" key={i}>{p}</p>
        ))}
      </section>

      {(objectives.length > 0 || outcomes.length > 0) && (
        <section className="project-detail__section project-detail__pair">
          {objectives.length > 0 && (
            <div>
              <h3>Objectives</h3>
              <ul className="project-detail__list">
                {objectives.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </div>
          )}
          {outcomes.length > 0 && (
            <div>
              <h3>Outcomes</h3>
              {outcomes.map((o, i) => (
                <p className="project-detail__card-p" key={i}>{o}</p>
              ))}
            </div>
          )}
        </section>
      )}

      {gallery.length > 0 && (
        <section className="project-detail__section">
          <p className="section-label">Gallery</p>
          <h2 className="section-title">In the field</h2>
          <div className="project-detail__gallery">
            {gallery.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>
        </section>
      )}

      <section className="project-detail__section project-detail__pair">
        {pi && (
          <div>
            <p className="section-label">Team</p>
            <div className="project-detail__team">
              <Link className="project-detail__team-card" to={`/people/${pi.slug}`}>
                <span className="project-detail__team-name">{pi.name}</span>
                <span className="project-detail__team-role">Principal Investigator</span>
              </Link>
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div>
            <p className="section-label">Tags</p>
            <div className="project-detail__tags">
              {tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        )}
      </section>

      <section className="project-detail__cta">
        <h2>Interested in collaborating on this work?</h2>
        <Link className="pill-cta" to="/contact">
          Get in touch
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
