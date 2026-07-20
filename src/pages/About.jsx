import { useReveal } from '../hooks/useReveal';
import { STATS, PARTNERS } from '../data/siteData';

export default function About() {
  const [introRef, introVis] = useReveal();
  const [spacesRef, spacesVis] = useReveal();
  const [statsRef, statsVis] = useReveal();

  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <p className="section-label" style={{ color: 'var(--color-terracotta-light)' }}>About</p>
        <h1>Designing the future through innovation</h1>
        <p>
          Hub &amp; Nodal Centre at IIT Hyderabad, fostering interdisciplinary
          design research and development since inception.
        </p>
      </div>

      {/* Vision & Mission */}
      <section
        className={`about reveal ${introVis ? 'visible' : ''}`}
        ref={introRef}
      >
        <div className="about__grid">
          <div className="about__text">
            <p className="section-label">Vision</p>
            <h2 className="section-title">Holistic design praxis</h2>
            <p>
              Design Innovation Center (DIC) Nodal at IIT Hyderabad is engaged in
              innovation through design and technology. The Department of Design along
              with partnering institutions engages in mutually beneficial innovation activities.
            </p>
            <p>
              DIC aims at creating a holistic and inter-disciplinary nature of design to cut
              across research and move projects from research to development. Diverse range
              of projects in domains such as cultural heritage, architecture, digital humanities,
              pedagogy, autonomous mobility, and sustainable product design.
            </p>
            <p>
              Our innovation hub and partnering spokes incubate meaningful projects which are
              in line with contemporary trends in the design discipline — encouraging design
              praxis as a convergence of multiple interests across diverse contexts.
            </p>
          </div>
          <div className="about__image">
            <img src="/images/image103.jpeg" alt="IIT Hyderabad Design building" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Physical Spaces */}
      <section
        className={`domains reveal ${spacesVis ? 'visible' : ''}`}
        ref={spacesRef}
      >
        <p className="section-label">Facilities</p>
        <h2 className="section-title">Lab spaces</h2>
        <div className="domains__grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {[
            'DIC Lab', 'AV Lab', '3D Printing Lab', 'Rapid Prototyping Lab',
            'VR Cave', 'Publishing Lab', 'Printing Lab', 'Prototyping Lab'
          ].map((lab) => (
            <div key={lab} className="course-card" style={{ textAlign: 'center' }}>
              {lab}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section
        className={`stats reveal-stagger ${statsVis ? 'visible' : ''}`}
        ref={statsRef}
      >
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat__number">{s.number}</div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Staff */}
      <section className="about" style={{ paddingBottom: 0 }}>
        <p className="section-label">People</p>
        <h2 className="section-title">Team</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          <div className="course-card">
            <h4 style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', marginBottom: 4 }}>Prof. Deepak John Mathew</h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-stone)', margin: 0 }}>Principal Investigator</p>
          </div>
          <div className="course-card">
            <h4 style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', marginBottom: 4 }}>2 Project Staff</h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-stone)', margin: 0 }}>Full-time researchers</p>
          </div>
          <div className="course-card">
            <h4 style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', marginBottom: 4 }}>4 Outsource Agency</h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-stone)', margin: 0 }}>External collaborators</p>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="partners">
        <p className="section-label">Collaborations &amp; MoUs</p>
        <h2 className="section-title">Partners</h2>
        <div className="partners__logos">
          {PARTNERS.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </section>
    </>
  );
}
