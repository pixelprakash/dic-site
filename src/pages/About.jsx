import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { DIC_LAB_FACILITIES } from '../data/siteData';
import { NODAL_SEALS } from '../data/nodalData';
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
    title: 'National Projects and Collaboration',
    body: 'As the Nodal Centre Lab, DIC IIT Hyderabad supports national-level projects and academic collaborations, bringing together creativity, technology and innovation to develop a new generation of problem solvers and creative thinkers.',
  },
];

const EXPLORE = [
  { to: '/research', label: 'Research', text: 'Studies and publications from the Centre.' },
  { to: '/projects', label: 'Projects', text: 'Products and programmes delivered across heritage, mobility and education.' },
  { to: '/people', label: 'People', text: 'Faculty, scholars, project staff and alumni.' },
  { to: '/nodal', label: 'DIC Nodal', text: 'The national network: nodes, events, and how to join.' },
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

      {/* The Centre — what it is and does, in three short paragraphs (the
          facts are the lab and network figures already used on the Education,
          Nodal and lab copy), then the main places to go next. The network
          itself — directory, events, how to join — lives on the DIC Nodal page. */}
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
            <p>
              The Design Innovation Centre is part of the Department of Design at IIT Hyderabad.
              It works as a design lab and a teaching space at once: research projects and
              products on one side, courses and workshops on the other.
            </p>
            <p>
              The Centre builds its projects in-house, from first prototype to full-scale exhibit,
              in its own <a className="about-netlink" href="#lab">fabrication and mixed-reality lab</a>.
            </p>
            <p>
              The Centre is also the Nodal Centre for the National DIC Network:{' '}
              {NODAL_SEALS[0].value} DIC hubs at IITs, IISc, SPA and universities, linked to{' '}
              {NODAL_SEALS[1].value} spoke institutions across India.{' '}
              <Link className="about-netlink" to="/nodal">Explore the DIC network &rarr;</Link>
            </p>
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
            The Design Innovation Centre (DIC) Lab at IIT Hyderabad spans over 3,000 square feet.
            It brings design thinking, technology and interdisciplinary research together across
            digital preservation, mixed reality, product design and rapid prototyping.
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
