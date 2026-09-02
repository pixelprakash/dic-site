import { useReveal } from '../hooks/useReveal';
import { DIC_COURSES, DIC_IMPACT_STATS } from '../data/siteData';

const FUTURE_PROGRAMS = [
  'Design Certification Program (1 Year)',
  'Design Curriculum in Schools',
  'Prototyping & Testing Hub',
  'Mixed Reality in Design Education',
  'Digital Museum at Public Places',
  'Design Intervention in Healthcare',
  'Design Intervention in Traditional Toy Industry',
  'Design Consultancy Agency',
];

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

      {/* About DIC courses — from the Academic exhibition poster. First
          line pulled out as a lede so the section opens with one clear
          statement instead of dropping straight into a wall of body text. */}
      <section className={`about reveal ${aboutVis ? 'visible' : ''}`} ref={aboutRef}>
        <div className="about__intro">
          <h2 className="section-title">Design Innovation Centre (DIC) Courses</h2>
          <p className="about__lede">
            The Design Innovation Centre (DIC) offers a diverse and interdisciplinary range of
            design courses that foster creativity, innovation, and design thinking among students
            from multiple disciplines.
          </p>
          <p>
            These courses are designed to merge design and technology, nurturing future-ready
            professionals capable of solving real-world challenges through creativity,
            experimentation, and collaboration. DIC courses encompass both broad foundational
            areas and advanced specializations, including Graphic Design, Illustration, Interior
            Design, Product Design, Animation, Furniture Design, Aesthetic Design, Game Design,
            Theatre Design, Virtual Reality (VR), Mixed Reality (MR), and Digital Preservation.
          </p>
          <p>
            Each course is carefully curated to align with emerging trends in Design Tech
            collaboration, emphasizing the integration of design process learning, rapid
            prototyping, and experiential pedagogy. The curriculum combines 3D materials and
            fabrication technologies, computer-aided design and manufacturing, digital image
            production and manipulation, and filmmaking with the fundamental principles of
            typography and graphic layout. Students are trained in both analog and digital tools,
            developing proficiency in design theory, sketching, visualization, and real-time
            problem-solving through hands-on projects.
          </p>
          <p>
            DIC courses aim to bridge academic learning with industry applications through
            interdisciplinary research, innovation labs, and experiential modules. Each program
            encourages students to explore sustainability, ergonomics, universal design, and
            user-centric approaches, while fostering entrepreneurship and innovation culture
            across domains.
          </p>
          <p>
            In addition, DIC conducts Creative Art and Design Workshops that attract more than 150
            students from diverse departments every year. These two-day workshops introduce
            participants to focused design areas such as Elements of Design, Film Appreciation,
            Digital Fabrication, UI/UX, Creative Coding, and Typography, promoting creativity and
            collaborative learning.
          </p>
        </div>
      </section>

      {/* Course catalogue — a wrapping pill list rather than a grid of
          bordered, shadow-on-hover cards; 23 near-identical short labels
          in interchangeable boxes is the generic-template look already
          fixed elsewhere on this page and on Research. A tag list reads
          as a catalogue, not a feature grid, and matches the pill
          language used for tags elsewhere on the site. */}
      <section className="courses">
        <div
          className={`courses__group reveal ${catalogueVis ? 'visible' : ''}`}
          ref={catalogueRef}
        >
          <h2 className="section-title">Course Catalogue</h2>
          <div className="course-pills">
            {DIC_COURSES.map((c) => (
              <span className="course-pill" key={c}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Achievements */}
      <section className={`stats reveal ${statsVis ? 'visible' : ''}`} ref={statsRef}>
        <h2 className="stats__title">Impact &amp; Achievements</h2>
        <div className="stats__grid">
          {DIC_IMPACT_STATS.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat__number">{s.number}</div>
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="stats__closing">
          The Design Innovation Centre at IIT Hyderabad continues to lead by example, bridging
          the gap between design, innovation, and technology. Through its cutting-edge courses
          and labs, DIC cultivates a new generation of designers and innovators equipped to
          address future challenges in emerging domains such as Digital Heritage, VR/MR, and
          Sustainable Product Design.
        </p>
      </section>

      {/* Roadmap */}
      <section className={`courses reveal ${roadVis ? 'visible' : ''}`} ref={roadRef}>
        <h2 className="section-title">Future Programs</h2>
        <ol className="roadmap-list">
          {FUTURE_PROGRAMS.map((item, i) => (
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
