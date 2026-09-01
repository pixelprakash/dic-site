import { useReveal } from '../hooks/useReveal';
import { RESEARCH_AREAS, PATENTS, DIC_LAB_FACILITIES } from '../data/siteData';
import { RESEARCH_PROJECTS } from '../data/researchProjectsData';
import ProjectCard from '../components/ProjectCard';

// Lab & Facilities "Capabilities" copy — from the same Fifth All India DIC
// Meet 2025 poster as the equipment list below, transcribed verbatim. Kept
// as data rather than four repeated heading+paragraph blocks in the JSX so
// they render through the same numbered-list treatment as the equipment
// list and the Education page's roadmap, instead of a stack of orange
// eyebrow-style labels.
const LAB_CAPABILITIES = [
  {
    title: 'Advanced Fabrication Facilities',
    body: 'Including large-format commercial 3D printers, CNC routers, vacuum forming setups, and laser-cutting machines, allowing end-to-end manufacturing within the lab.',
  },
  {
    title: 'In-House Production and Expertise',
    body: 'All DIC projects ranging from prototypes to full-scale exhibits are manufactured in-house under the supervision of expert consultants, designers, and engineers. This ensures precision, quality control, and seamless integration between design and production stages. The lab’s ecosystem promotes cross-disciplinary collaboration, bringing together design, engineering, and technology under a unified workflow.',
  },
  {
    title: 'Academic and Research Integration',
    body: 'Beyond fabrication, the DIC Lab also serves as a learning and research environment for students and researchers. It hosts specialized DIC courses, workshops, and design innovation programs, enabling hands-on learning in areas like digital fabrication, immersive design, and design thinking. The space encourages experimentation and fosters an entrepreneurial mindset among students and innovators.',
  },
  {
    title: 'India’s Finest Design Innovation Facility',
    body: 'The DIC IIT Hyderabad Nodal Centre Lab stands as one of India’s finest design laboratories, bridging creativity, technology, and innovation. It not only supports national-level projects and academic collaborations but also sets a benchmark for how design infrastructure can catalyze a new generation of problem solvers and creative thinkers for the nation.',
  },
];

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
          Delhi) "Facilities" exhibition poster, transcribed verbatim. One
          full-width column rather than two lists side by side (see the
          note in sections.css) — intro copy, then the equipment grid,
          then the capabilities feature grid. */}
      <section className={`lab-facilities reveal ${labVis ? 'visible' : ''}`} ref={labRef}>
        <h2 className="section-title">Lab Facilities</h2>

        <div className="lab-facilities__intro">
          <p>
            The Design Innovation Centre (DIC) Lab at IIT Hyderabad, designated as the Nodal
            Centre for the National DIC Network, is one of India&rsquo;s most advanced design and
            innovation facilities. Spanning over 3,000+ square feet, the lab embodies a perfect
            blend of design thinking, technological excellence, and interdisciplinary research,
            fostering innovation across domains such as digital preservation, mixed reality,
            product design, and rapid prototyping.
          </p>
          <p style={{ fontStyle: 'italic' }}>
            The lab is equipped with cutting-edge tools and technologies that support ideation,
            experimentation, and fabrication under one roof.
          </p>
        </div>

        <h3 className="lab-facilities__group-title">Equipment &amp; Spaces</h3>
        <div className="lab-equipment">
          {DIC_LAB_FACILITIES.map((f) => (
            <div className="lab-equipment__item" key={f.name}>
              <h4>{f.name}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="lab-facilities__group-title">Capabilities</h3>
        <div className="lab-capabilities">
          {LAB_CAPABILITIES.map((c, i) => (
            <div className="lab-capabilities__item" key={c.title}>
              <span className="lab-capabilities__index">{String(i + 1).padStart(2, '0')}</span>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Patents — a register, not a card wall: entries vary a lot in
          length (some have a description and a patent number, some are
          just a name and inventor), and a grid of identically-sized boxes
          made the short ones look like empty placeholders. A divided list
          lets each row take exactly the space its own content needs. */}
      <section
        className={`patents reveal ${patVis ? 'visible' : ''}`}
        ref={patRef}
      >
        <h2 className="section-title">Patents</h2>
        <ol className="patents-list">
          {PATENTS.map((p, i) => (
            <li className="patents-item" key={p.name}>
              <span className="patents-item__index">{String(i + 1).padStart(2, '0')}</span>
              <div className="patents-item__body">
                <h3>{p.name}</h3>
                {p.desc && <p>{p.desc}</p>}
              </div>
              <div className="patents-item__meta">
                <span className="patents-item__inventor">{p.inventor}</span>
                {p.type && <span className="patents-item__type">{p.type}</span>}
                {p.id && <span className="patents-item__id">Patent No. {p.id}</span>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
