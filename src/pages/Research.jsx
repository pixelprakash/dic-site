import { useReveal } from '../hooks/useReveal';
import { RESEARCH_AREAS, PATENTS, DIC_LAB_FACILITIES } from '../data/siteData';
import { RESEARCH_PROJECTS } from '../data/researchProjectsData';
import ProjectCard from '../components/ProjectCard';

function ResearchItem({ item, index }) {
  const [ref, vis] = useReveal();
  return (
    <div className={`research-item reveal ${vis ? 'visible' : ''}`} ref={ref}>
      <div className="research-item__image">
        <img src={item.image} alt={item.title} loading="lazy" />
      </div>
      <div className="research-item__content">
        <p className="section-label">Domain {String(index + 1).padStart(2, '0')}</p>
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
        <div className="research-item__tags">
          {item.tags.map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Research() {
  const [rpRef, rpVis] = useReveal();
  const [labRef, labVis] = useReveal();
  const [patRef, patVis] = useReveal();

  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <h1>Research</h1>
        <p>
          Ongoing research projects, publications, and lab facilities at the
          Design Innovation Centre, IIT Hyderabad.
        </p>
      </div>

      {/* Research domains (Digital Preservation of Indian Heritage, Gond
          Tribal Heritage, etc.) — parked for now. Not deleted: the
          RESEARCH_AREAS data and ResearchItem component above are still
          intact, so uncommenting this section brings it straight back. */}
      {/* <section className="research-list">
        {RESEARCH_AREAS.map((item, i) => (
          <ResearchItem key={item.title} item={item} index={i} />
        ))}
      </section> */}

      {/* Research projects — individual research studies/posters presented
          at DIC exhibitions and conferences, transcribed verbatim from
          their own posters. Each links through to a full detail page. */}
      <section className={`research-projects reveal ${rpVis ? 'visible' : ''}`} ref={rpRef}>
        <h2 className="section-title">Research projects &amp; publications</h2>
        {RESEARCH_PROJECTS.map((r) => (
          <ProjectCard key={r.slug} project={r} basePath="/research" ctaLabel="View Research" />
        ))}
      </section>

      {/* Lab & Facilities — from the Fifth All India DIC Meet 2025 (IIT
          Delhi) "Facilities" exhibition poster, transcribed verbatim. */}
      <section className={`lab-facilities reveal ${labVis ? 'visible' : ''}`} ref={labRef}>
        <h2 className="section-title">Design Innovation Centre (DIC) — Nodal Centre Lab, IIT Hyderabad</h2>
        <div className="lab-facilities__grid">
          <div>
            <p className="lab-facilities__intro">
              The Design Innovation Centre (DIC) Lab at IIT Hyderabad, designated as the Nodal
              Centre for the National DIC Network, is one of India&rsquo;s most advanced design and
              innovation facilities. Spanning over 3,000+ square feet, the lab embodies a perfect
              blend of design thinking, technological excellence, and interdisciplinary research,
              fostering innovation across domains such as digital preservation, mixed reality,
              product design, and rapid prototyping.
            </p>
            <p className="lab-facilities__intro" style={{ fontStyle: 'italic' }}>
              The lab is equipped with cutting-edge tools and technologies that support ideation,
              experimentation, and fabrication under one roof.
            </p>
            <div className="lab-facilities__list">
              {DIC_LAB_FACILITIES.map((f) => (
                <div className="lab-facility" key={f.name}>
                  <h4>{f.name}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lab-facilities__col">
            <h4>Advanced Fabrication Facilities</h4>
            <p>
              Including large-format commercial 3D printers, CNC routers, vacuum forming setups,
              and laser-cutting machines, allowing end-to-end manufacturing within the lab.
            </p>

            <h4>In-House Production and Expertise</h4>
            <p>
              All DIC projects ranging from prototypes to full-scale exhibits are manufactured
              in-house under the supervision of expert consultants, designers, and engineers. This
              ensures precision, quality control, and seamless integration between design and
              production stages. The lab&rsquo;s ecosystem promotes cross-disciplinary collaboration,
              bringing together design, engineering, and technology under a unified workflow.
            </p>

            <h4>Academic and Research Integration</h4>
            <p>
              Beyond fabrication, the DIC Lab also serves as a learning and research environment
              for students and researchers. It hosts specialized DIC courses, workshops, and
              design innovation programs, enabling hands-on learning in areas like digital
              fabrication, immersive design, and design thinking. The space encourages
              experimentation and fosters an entrepreneurial mindset among students and
              innovators.
            </p>

            <h4>India&rsquo;s Finest Design Innovation Facility</h4>
            <p>
              The DIC IIT Hyderabad Nodal Centre Lab stands as one of India&rsquo;s finest design
              laboratories, bridging creativity, technology, and innovation. It not only supports
              national-level projects and academic collaborations but also sets a benchmark for
              how design infrastructure can catalyze a new generation of problem solvers and
              creative thinkers for the nation.
            </p>
          </div>
        </div>
      </section>

      {/* Patents */}
      <section
        className={`courses reveal ${patVis ? 'visible' : ''}`}
        ref={patRef}
      >
        <h2 className="section-title">Patents</h2>
        <div className="courses__grid">
          {PATENTS.map((p) => (
            <div className="course-card" key={p.name}>
              <strong style={{ display: 'block', marginBottom: 4, fontSize: 'var(--text-sm)' }}>{p.name}</strong>
              {p.desc && (
                <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-stone)', marginBottom: 4 }}>
                  {p.desc}
                </span>
              )}
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-stone)' }}>
                {p.inventor}{p.type ? ` · ${p.type}` : ''}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
