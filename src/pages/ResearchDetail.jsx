import { Link, useParams } from 'react-router-dom';
import { getResearchProjectBySlug } from '../data/researchProjectsData';
import '../styles/ProjectDetail.css';

export default function ResearchDetail() {
  const { slug } = useParams();
  const project = getResearchProjectBySlug(slug);

  if (!project) {
    return (
      <div className="page-header" style={{ textAlign: 'center' }}>
        <div className="page-header__accent" />
        <ol className="project-detail__breadcrumb" style={{ justifyContent: 'center' }}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/research">Research</Link></li>
          <li aria-current="page">Not found</li>
        </ol>
        <h1>Research project not found</h1>
        <p style={{ margin: '0 auto' }}>This research project doesn&rsquo;t have a page yet, or the link is out of date.</p>
      </div>
    );
  }

  const {
    title, tagline, venue, image,
    sections = [], researchers = [], pi, partners = [],
    publications = [], patents = [], tags = [],
  } = project;

  return (
    <div className="project-detail">
      <div className="page-header project-detail__header">
        <div className="page-header__accent" />
        <ol className="project-detail__breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/research">Research</Link></li>
          <li aria-current="page">{title}</li>
        </ol>
        <h1>{title}</h1>
        {tagline && <p className="project-detail__subtitle">{tagline}</p>}
        {venue && <p className="project-detail__subtitle">{venue}</p>}
      </div>

      {image && (
        <div className="project-detail__hero-image">
          <img src={image} alt="" loading="lazy" />
        </div>
      )}

      {sections.map((s, i) => (
        <section className="project-detail__section" key={i}>
          {i === 0 && <p className="section-label">Overview</p>}
          <h2 className="section-title">{s.title}</h2>
          {(s.paragraphs || []).map((p, j) => (
            <p className="project-detail__body" key={j}>{p}</p>
          ))}
          {s.list && s.list.length > 0 && (
            <ul className="project-detail__list">
              {s.list.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          )}
        </section>
      ))}

      {(publications.length > 0 || patents.length > 0) && (
        <section className="project-detail__section project-detail__pair">
          {publications.length > 0 && (
            <div>
              <h3>Publications</h3>
              <ul className="project-detail__list">
                {publications.map((p, i) => (
                  <li key={i}>
                    {p.title}
                    {p.venue && <> — {p.venue}</>}
                    {p.doi && (
                      <>
                        {' '}
                        <a href={p.doi} target="_blank" rel="noopener noreferrer">{p.doi}</a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {patents.length > 0 && (
            <div>
              <h3>Patents</h3>
              <ul className="project-detail__list">
                {patents.map((p, i) => (
                  <li key={i}>{p.id} — {p.name}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {(pi || researchers.length > 0 || partners.length > 0 || tags.length > 0) && (
        <section className="project-detail__section project-detail__pair">
          {(pi || researchers.length > 0) && (
            <div>
              <p className="section-label">Team</p>
              <div className="project-detail__team">
                {pi && (
                  <Link className="project-detail__team-card" to={`/people/${pi.slug}`}>
                    <span className="project-detail__team-name">{pi.name}</span>
                    <span className="project-detail__team-role">Principal Investigator</span>
                  </Link>
                )}
                {researchers.map((r) => (
                  <div className="project-detail__team-card" key={r}>
                    <span className="project-detail__team-name">{r}</span>
                    <span className="project-detail__team-role">Researcher</span>
                  </div>
                ))}
              </div>
              {partners.length > 0 && (
                <p className="project-detail__body" style={{ marginTop: 16 }}>
                  <strong>Partners: </strong>{partners.join(', ')}
                </p>
              )}
            </div>
          )}

          {tags.length > 0 && (
            <div>
              <p className="section-label">Keywords</p>
              <div className="project-detail__tags">
                {tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="project-detail__cta">
        <h2>Interested in collaborating on this research?</h2>
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
