import { Link } from 'react-router-dom';
import '../styles/ProjectDetail.css';

/* DEMO PAGE — a worked example of the proposed project-detail template,
   built with real DIC content (Autonomous Urban Air Mobility) so it can
   be judged as a real page rather than a wireframe. Not linked from the
   live Projects listing yet — reachable only at /projects/demo. */

const TEAM = [
  { name: 'Prof. Deepak John Mathew', role: 'Principal Investigator', slug: 'deepak-john-mathew' },
];

const GALLERY = ['/images/image84.jpg', '/images/image85.jpg', '/images/image7.jpg'];

const PATENTS = [
  { name: 'Autonomous UAM Aircraft', type: 'Design Patent' },
  { name: 'Autonomous Advanced Air Mobility', type: 'Design Patent' },
  { name: 'Autonomous UAM for Intra-city', type: 'Design Patent' },
];

export default function ProjectDemo() {
  return (
    <div className="project-detail">
      {/* 1 — Header: category, status, title, tagline */}
      <div className="page-header project-detail__header">
        <div className="page-header__accent" />
        <ol className="project-detail__breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li aria-current="page">Autonomous Urban Air Mobility</li>
        </ol>
        <div className="project-detail__meta-row">
          <p className="section-label" style={{ color: 'var(--color-terracotta-light)', marginBottom: 0 }}>
            Air Mobility
          </p>
          <span className="project-detail__status">Ongoing</span>
        </div>
        <h1>Autonomous Urban Air Mobility</h1>
        <p>
          Design and development of autonomous passenger drones as air taxis — a full-scale
          eVTOL prototype, interior design and user experience study, backed by DST funding.
        </p>
      </div>

      {/* 2 — Overview */}
      <section className="project-detail__section">
        <p className="section-label">Overview</p>
        <h2 className="section-title">Reimagining how cities move, from the cabin out.</h2>
        <p className="project-detail__body">
          Urban air mobility promises to cut commute times in half across congested Indian
          cities — but only if the experience inside the cabin feels safe, legible, and
          trustworthy to a first-time flyer. This project pairs a full-scale eVTOL prototype
          with a structured perception-and-safety study, so the interior design is shaped by
          how people actually respond to autonomous flight, not just by what's aerodynamically
          possible.
        </p>
      </section>

      {/* 3 — Challenge + Approach */}
      <section className="project-detail__section project-detail__pair">
        <div className="project-detail__card">
          <h3>The challenge</h3>
          <p>
            Autonomous air taxis remove the one thing passengers currently trust most — a
            visible human pilot. Without it, cabin design has to do the work of building
            confidence: how the seat is angled, what the passenger sees out the window, how
            controls (or their absence) are communicated.
          </p>
        </div>
        <div className="project-detail__card">
          <h3>Our approach</h3>
          <p>
            A full-scale interior mockup was built and paired with a VR-based perception study
            — putting participants through a simulated autonomous flight and measuring comfort,
            trust, and motion response before any physical flight testing began.
          </p>
        </div>
      </section>

      {/* 4 — Outcomes / impact */}
      <section className="project-detail__section">
        <p className="section-label">Outcomes</p>
        <h2 className="section-title">What came out of it.</h2>
        <div className="project-detail__stats">
          <div className="project-detail__stat">
            <b>103</b>
            <span>participants in VR perception &amp; safety trials</span>
          </div>
          <div className="project-detail__stat">
            <b>1</b>
            <span>full-scale eVTOL cabin prototype</span>
          </div>
          <div className="project-detail__stat">
            <b>4</b>
            <span>design patents filed</span>
          </div>
        </div>
      </section>

      {/* 5 — Media gallery */}
      <section className="project-detail__section">
        <p className="section-label">Gallery</p>
        <h2 className="section-title">From mockup to trial.</h2>
        <div className="project-detail__gallery">
          {GALLERY.map((src) => (
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>
      </section>

      {/* 6 — Team + Tags side by side, 7 — Related patents */}
      <section className="project-detail__section project-detail__pair">
        <div>
          <p className="section-label">Team</p>
          <div className="project-detail__team">
            {TEAM.map((m) => (
              <Link className="project-detail__team-card" to={`/people/${m.slug}`} key={m.slug}>
                <span className="project-detail__team-name">{m.name}</span>
                <span className="project-detail__team-role">{m.role}</span>
              </Link>
            ))}
          </div>

          <p className="section-label" style={{ marginTop: 32 }}>Tags</p>
          <div className="project-detail__tags">
            {['eVTOL', 'Drone Design', 'UX Study', 'DST Funded'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label">Related patents</p>
          <ul className="project-detail__patents">
            {PATENTS.map((p) => (
              <li key={p.name}>
                <span>{p.name}</span>
                <small>{p.type}</small>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 — CTA */}
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
