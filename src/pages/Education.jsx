import { useReveal } from '../hooks/useReveal';
import { DIC_COURSES, DIC_IMPACT_STATS } from '../data/siteData';

export default function Education() {
  const [aboutRef, aboutVis] = useReveal();
  const [catalogueRef, catalogueVis] = useReveal();
  const [statsRef, statsVis] = useReveal();
  const [roadRef, roadVis] = useReveal();

  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <h1>Education</h1>
        <p>
          4,688 students enrolled in DIC courses. 214 workshops conducted across
          design thinking and creative arts.
        </p>
      </div>

      {/* About DIC courses — from the Academic exhibition poster */}
      <section className={`about reveal ${aboutVis ? 'visible' : ''}`} ref={aboutRef}>
        <div style={{ maxWidth: '80ch' }}>
          <h2 className="section-title">Design Innovation Centre (DIC) Courses</h2>
          <p style={{ marginBottom: 20, fontSize: 'var(--text-md)' }}>
            The Design Innovation Centre (DIC) offers a diverse and interdisciplinary range of
            design courses that foster creativity, innovation, and design thinking among students
            from multiple disciplines. These courses are designed to merge design and technology,
            nurturing future-ready professionals capable of solving real-world challenges through
            creativity, experimentation, and collaboration.
          </p>
          <p style={{ marginBottom: 20, fontSize: 'var(--text-md)' }}>
            DIC courses encompass both broad foundational areas and advanced specializations,
            including Graphic Design, Illustration, Interior Design, Product Design, Animation,
            Furniture Design, Aesthetic Design, Game Design, Theatre Design, Virtual Reality (VR),
            Mixed Reality (MR), and Digital Preservation. Each course is carefully curated to align
            with emerging trends in Design Tech collaboration, emphasizing the integration of
            design process learning, rapid prototyping, and experiential pedagogy. The curriculum
            combines 3D materials and fabrication technologies, computer-aided design and
            manufacturing, digital image production and manipulation, and filmmaking with the
            fundamental principles of typography and graphic layout. Students are trained in both
            analog and digital tools developing proficiency in design theory, sketching,
            visualization, and real-time problem-solving through hands-on projects.
          </p>
          <p style={{ marginBottom: 20, fontSize: 'var(--text-md)' }}>
            DIC courses aim to bridge academic learning with industry applications through
            interdisciplinary research, innovation labs, and experiential modules. Each program
            encourages students to explore sustainability, ergonomics, universal design, and
            user-centric approaches, while fostering entrepreneurship and innovation culture across
            domains.
          </p>
          <p style={{ fontSize: 'var(--text-md)' }}>
            In addition, DIC conducts Creative Art and Design Workshops that attract more than 150
            students from diverse departments every year. These two-day workshops introduce
            participants to focused design areas such as Elements of Design, Film Appreciation,
            Digital Fabrication, UI/UX, Creative Coding, and Typography, promoting creativity and
            collaborative learning.
          </p>
        </div>
      </section>

      {/* Course catalogue */}
      <section className="courses">
        <div
          className={`courses__group reveal ${catalogueVis ? 'visible' : ''}`}
          ref={catalogueRef}
        >
          <h3>Course Catalogue</h3>
          <div className="courses__grid">
            {DIC_COURSES.map((c) => (
              <div className="course-card" key={c}>{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Achievements */}
      <section
        className={`stats reveal ${statsVis ? 'visible' : ''}`}
        ref={statsRef}
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
      >
        {DIC_IMPACT_STATS.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat__number">{s.number}</div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </section>

      <p
        style={{
          maxWidth: '70ch',
          margin: '0 auto',
          padding: '48px var(--margin-x) 0',
          textAlign: 'center',
          fontStyle: 'italic',
          color: 'var(--color-stone)',
        }}
      >
        The Design Innovation Centre at IIT Hyderabad continues to lead by example bridging the
        gap between design, innovation, and technology. Through its cutting-edge courses and labs,
        DIC cultivates a new generation of designers and innovators equipped to address future
        challenges in emerging domains such as Digital Heritage, VR/MR, and Sustainable Product
        Design.
      </p>

      {/* Roadmap */}
      <section
        className={`courses reveal ${roadVis ? 'visible' : ''}`}
        ref={roadRef}
      >
        <h2 className="section-title">Future Programs</h2>
        <ol className="roadmap-list">
          {[
            'Design Certification Program (1 Year)',
            'Design Curriculum in Schools',
            'Prototyping & Testing Hub',
            'Mixed Reality in Design Education',
            'Digital Museum at Public Places',
            'Design Intervention in Healthcare',
            'Design Intervention in Traditional Toy Industry',
            'Design Consultancy Agency',
          ].map((item, i) => (
            <li className="roadmap-item" key={item}>
              <span className="roadmap-item__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="roadmap-item__text">{item}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
