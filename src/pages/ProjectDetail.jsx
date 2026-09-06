import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProjectBySlug } from '../data/projectsData';
import Model3DViewer from '../components/Model3DViewer';
import Model3DModal from '../components/Model3DModal';
import GalleryLightbox from '../components/GalleryLightbox';
import '../styles/ProjectDetail.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  // Three-step reveal, all gated behind the visitor's own click so the
  // 23MB model never touches page-load performance: photo + "View 3D
  // Model" pill -> click loads it inline, right in the same header slot
  // -> a small expand button on the inline view is the (separate, opt-in)
  // path to the fullscreen modal.
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  // Gallery lightbox — null (closed) or the open image's index, so the
  // same state doubles as "which image" without a separate open flag.
  const [lightboxIndex, setLightboxIndex] = useState(null);

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

  const { title, subtitle, subtitle2, tagline, description = [], objectives = [], outcomes = [], gallery = [], status, pi, tags = [], image, model, modelTexture, modelLabel } = project;
  const hasMedia = Boolean(image || model);

  return (
    <div className="project-detail">
      <div className={`page-header project-detail__header ${hasMedia ? 'project-detail__header--media' : ''}`}>
        <div className="page-header__accent" />
        <div className="project-detail__header-content">
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

        {model && modelLoaded ? (
          <div className="project-detail__header-media project-detail__header-media--live">
            <Model3DViewer src={model} texture={modelTexture} label={modelLabel} fill />
            <button
              type="button"
              className="project-detail__model-expand"
              onClick={() => setModelOpen(true)}
              aria-label="View 3D model fullscreen"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
              </svg>
            </button>
          </div>
        ) : model ? (
          <button
            type="button"
            className="project-detail__header-media project-detail__header-media--model"
            onClick={() => setModelLoaded(true)}
            aria-label={`View interactive 3D model — ${modelLabel || title}`}
          >
            {image && <img src={image} alt="" loading="lazy" />}
            <span className="project-detail__model-cta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16.5V7.5a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 7.5v9a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z" />
                <path d="M3.27 6.96 12 12.01l8.73-5.05" />
                <path d="M12 22.08V12" />
              </svg>
              View 3D Model
            </span>
          </button>
        ) : image ? (
          <div className="project-detail__header-media">
            <img src={image} alt="" loading="lazy" />
          </div>
        ) : null}
      </div>

      <section className="project-detail__section">
        <h2 className="section-title">Overview</h2>
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

      <section className="project-detail__section project-detail__pair">
        {pi && (
          <div>
            <h3>Team</h3>
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
            <h3>Tags</h3>
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

      {model && (
        <Model3DModal
          isOpen={modelOpen}
          onClose={() => setModelOpen(false)}
          src={model}
          texture={modelTexture}
          label={modelLabel}
        />
      )}

      <GalleryLightbox
        images={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
