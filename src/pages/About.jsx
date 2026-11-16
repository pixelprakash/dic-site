import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { DIC_LAB_FACILITIES } from '../data/siteData';
import { NODAL_ABOUT } from '../data/nodalData';
import '../styles/About.css';

// Lab & Facilities "Capabilities" copy — from the Fifth All India DIC Meet 2025
// "Facilities" poster, transcribed verbatim (moved here from the Research page,
// along with the equipment list in data/siteData.js). Kept as data so it
// renders through the same numbered-list treatment as the equipment list.
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

const EXPLORE = [
  { to: '/research', label: 'Research', text: 'Studies and publications from the Centre.' },
  { to: '/projects', label: 'Projects', text: 'Products and programmes delivered across heritage, mobility and education.' },
  { to: '/people', label: 'People', text: 'Faculty, scholars, project staff and alumni.' },
  { to: '/nodal', label: 'DIC Nodal', text: 'The national network of Design Innovation Centres.' },
];

export default function About() {
  const [aboutRef, aboutVis] = useReveal();
  const [labRef, labVis] = useReveal();
  const [visitRef, visitVis] = useReveal();

  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <h1>About DIC</h1>
        <p>
          The Nodal Centre of India&rsquo;s National Design Innovation Network, in the Department
          of Design at IIT Hyderabad.
        </p>
      </div>

      {/* Who we are — the Centre in two paragraphs (the same text as the DIC
          Nodal page), then the main places to go next. */}
      <section className={`section about-intro reveal ${aboutVis ? 'visible' : ''}`} ref={aboutRef}>
        <div className="split">
          <div className="split__head">
            <h2 className="section-title">The Centre</h2>
            <p className="lede">
              Interdisciplinary design research across cultural heritage, autonomous mobility,
              immersive education, and sustainable innovation.
            </p>
          </div>
          <div className="split__body">
            {NODAL_ABOUT.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ul className="about-explore">
              {EXPLORE.map((e) => (
                <li key={e.to}>
                  <Link to={e.to}>
                    <strong>{e.label}</strong>
                    <span>{e.text}</span>
                    <i aria-hidden="true">&rarr;</i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Lab & Facilities — from the Fifth All India DIC Meet 2025 (IIT
          Delhi) "Facilities" exhibition poster, transcribed verbatim:
          intro copy, then the equipment grid, then the capabilities. */}
      <section className={`lab-facilities reveal ${labVis ? 'visible' : ''}`} ref={labRef} id="lab">
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

      {/* Visit — the address and the one thing most visitors want to do. */}
      <section className={`section section--ink about-visit reveal ${visitVis ? 'visible' : ''}`} ref={visitRef}>
        <div className="split">
          <div className="split__head">
            <h2 className="section-title">Visit the lab</h2>
            <p className="lede">
              To arrange a visit or appointment at the DIC lab, write to us with your preferred
              dates and the purpose of your visit.
            </p>
          </div>
          <div className="split__body">
            <address className="about-address">
              Design Innovation Centre<br />
              Department of Design<br />
              IIT Hyderabad<br />
              Kandi, Sangareddy,<br />
              Telangana 502284, India
            </address>
            <div className="about-visit__actions">
              <a className="btn" href="mailto:dic@des.iith.ac.in?subject=Lab%20Visit%20Request">Request a visit</a>
              <Link className="btn btn--on-dark" to="/contact">Contact the team</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
