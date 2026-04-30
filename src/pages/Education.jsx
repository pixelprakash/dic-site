import { useReveal } from '../hooks/useReveal';
import { COURSES_FOUNDATION, COURSES_CORE, COURSES_ADVANCED } from '../data/siteData';

export default function Education() {
  const [foundRef, foundVis] = useReveal();
  const [coreRef, coreVis] = useReveal();
  const [advRef, advVis] = useReveal();
  const [roadRef, roadVis] = useReveal();

  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <p className="section-label" style={{ color: 'var(--color-terracotta-light)' }}>Education</p>
        <h1>Learning through making</h1>
        <p>
          150+ students from various departments enroll every year.
          228 workshops conducted across design thinking and creative arts.
        </p>
      </div>

      <section className="courses">
        <div
          className={`courses__group reveal ${foundVis ? 'visible' : ''}`}
          ref={foundRef}
        >
          <p className="section-label">Semester 1–2</p>
          <h3>Foundation courses</h3>
          <div className="courses__grid">
            {COURSES_FOUNDATION.map((c) => (
              <div className="course-card" key={c}>{c}</div>
            ))}
          </div>
        </div>

        <div
          className={`courses__group reveal ${coreVis ? 'visible' : ''}`}
          ref={coreRef}
        >
          <p className="section-label">Semester 3–4</p>
          <h3>Core design courses</h3>
          <div className="courses__grid">
            {COURSES_CORE.map((c) => (
              <div className="course-card" key={c}>{c}</div>
            ))}
          </div>
        </div>

        <div
          className={`courses__group reveal ${advVis ? 'visible' : ''}`}
          ref={advRef}
        >
          <p className="section-label">Semester 5+</p>
          <h3>Advanced &amp; electives</h3>
          <div className="courses__grid">
            {COURSES_ADVANCED.map((c) => (
              <div className="course-card" key={c}>{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section
        className={`courses reveal ${roadVis ? 'visible' : ''}`}
        ref={roadRef}
        style={{ paddingTop: 0 }}
      >
        <p className="section-label">Future Programs</p>
        <h2 className="section-title">Roadmap</h2>
        <div className="courses__grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {[
            'Design Certification Program (1 Year)',
            'Design Curriculum in Schools',
            'Prototyping & Testing Hub',
            'Mixed Reality in Design Education',
            'Digital Museum at Public Places',
            'Design Intervention in Healthcare',
            'Design Intervention in Traditional Toy Industry',
            'Design Consultancy Agency',
          ].map((item) => (
            <div className="course-card" key={item} style={{ borderLeft: '3px solid var(--color-terracotta)' }}>
              {item}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
