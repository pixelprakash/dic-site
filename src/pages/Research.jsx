import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { RESEARCH_AREAS, PATENTS } from '../data/siteData';
import { useResearchProjects } from '../lib/cms';
import ProjectCard from '../components/ProjectCard';
import '../styles/About.css';

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
  const { researchProjects: RESEARCH_PROJECTS } = useResearchProjects();
  const [rpRef, rpVis] = useReveal();
  const [patRef, patVis] = useReveal();

  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <h1>Research</h1>
        <p>
          Ongoing research projects, publications and patents at the
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
        <p className="lede research-projects__lede">
          Individual research studies from the Centre, presented at DIC meets and conferences.
        </p>
        {RESEARCH_PROJECTS.filter((r) => !r.hidden).map((r) => (
          <ProjectCard key={r.slug} project={r} basePath="/research" ctaLabel="View Research" />
        ))}
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

      {/* The lab facilities moved to the About page. */}
      <section className="section section--tint research-lab-note">
        <p className="lede">
          Looking for the lab, its equipment and how to visit?{' '}
          <Link to="/about#lab">See Lab Facilities on the About page</Link>.
        </p>
      </section>
    </>
  );
}
