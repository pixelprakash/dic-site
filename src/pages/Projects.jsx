import ProjectCard from '../components/ProjectCard';
import { MARQUEE_IMAGES, DIC_SELECTED_WORKS } from '../data/siteData';
import { useProjects } from '../lib/cms';
import { useReveal } from '../hooks/useReveal';

export default function Projects() {
  const { projects: PROJECTS } = useProjects();
  const [listRef, listVis] = useReveal();
  const [worksRef, worksVis] = useReveal();

  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <h1>Projects</h1>
        <p>
          921 products delivered, improved, or initiated across heritage,
          mobility, education, and sustainable design.
        </p>
      </div>

      <section className={`project-list reveal ${listVis ? 'visible' : ''}`} ref={listRef}>
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} headingLevel={2} />
        ))}
      </section>

      {/* Selected works — from the Fifth All India DIC Meet 2025 (IIT
          Delhi) "Innovation" exhibition poster. Titles only, no further
          detail was given for these, so they're listed rather than built
          out as full project pages. */}
      <section className={`selected-works reveal ${worksVis ? 'visible' : ''}`} ref={worksRef}>
        <h2 className="section-title">Selected works from the DIC Archive</h2>
        <ul className="selected-works__list">
          {DIC_SELECTED_WORKS.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </section>

      {/* Image Marquee */}
      <section className="marquee" style={{ paddingBottom: 'var(--section-gap)' }}>
        <div className="marquee__track">
          {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" />
          ))}
        </div>
      </section>
    </>
  );
}
