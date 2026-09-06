import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getResearchProjectBySlug } from '../data/researchProjectsData';
import GalleryLightbox from '../components/GalleryLightbox';
import '../styles/ProjectDetail.css';

export default function ResearchDetail() {
  const { slug } = useParams();
  const project = getResearchProjectBySlug(slug);
  const [lightboxIndex, setLightboxIndex] = useState(null);

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
    title, tagline, venue, image, gallery = [],
    sections = [], researchers = [], pi, partners = [],
    publications = [], patents = [], tags = [],
  } = project;

  return (
    <div className="project-detail">
      <div className={`page-header project-detail__header ${image ? 'project-detail__header--media' : ''}`}>
        <div className="page-header__accent" />
        <div className="project-detail__header-content">
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
          <div className="project-detail__header-media">
            <img src={image} alt="" loading="lazy" />
          </div>
        )}
      </div>

      {sections.map((s, i) => (
        <section className="project-detail__section" key={i}>
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

      {gallery.length > 0 && (
        <section className="project-detail__section">
          <h2 className="section-title">Gallery</h2>
          <div className="project-detail__gallery">
            {gallery.map((src, i) => (
              <button
                type="button"
                key={src}
                onClick={() => setLightboxIndex(i)}
                aria-label={`View image ${i + 1} of ${gallery.length} full size`}
              >
                <img src={src} alt="" loading="lazy" />
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
                </svg>
              </button>
            ))}
          </div>
        </section>
      )}

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
              <h3>Team</h3>
              <div className="project-detail__team">
                {pi && (
                  <Link className="project-detail__team-card" to={`/people/${pi.slug}`}>
                    <span className="project-detail__team-name">{pi.name}</span>
                    <span className="project-detail__team-role">Principal Investigator</span>
                  </Link>
                )}
                {researchers.map((r) => (
                  r.slug ? (
                    <Link className="project-detail__team-card" to={`/people/${r.slug}`} key={r.slug}>
                      <span className="project-detail__team-name">{r.name}</span>
                      <span className="project-detail__team-role">{r.role || 'Researcher'}</span>
                    </Link>
                  ) : (
                    <div className="project-detail__team-card" key={r.name}>
                      <span className="project-detail__team-name">{r.name}</span>
                      <span className="project-detail__team-role">{r.role || 'Researcher'}</span>
                    </div>
                  )
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
              <h3>Keywords</h3>
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

      <GalleryLightbox
        images={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
