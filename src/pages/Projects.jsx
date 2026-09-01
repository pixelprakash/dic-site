import YouTubeEmbed from '../components/YouTubeEmbed';
import ProjectCard from '../components/ProjectCard';
import { VIDEOS, MARQUEE_IMAGES, DIC_SELECTED_WORKS } from '../data/siteData';
import { PROJECTS } from '../data/projectsData';
import { useReveal } from '../hooks/useReveal';

export default function Projects() {
  const [vidRef, vidVis] = useReveal();
  const [listRef, listVis] = useReveal();
  const [worksRef, worksVis] = useReveal();

  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <p className="section-label" style={{ color: 'var(--color-terracotta-light)' }}>Projects</p>
        <h1>Work that matters</h1>
        <p>
          921 innovative products delivered, improved, or initiated across heritage,
          mobility, education, and sustainable design.
        </p>
      </div>

      <section className={`project-list reveal ${listVis ? 'visible' : ''}`} ref={listRef}>
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </section>

      {/* Selected works — from the Fifth All India DIC Meet 2025 (IIT
          Delhi) "Innovation" exhibition poster. Titles only, no further
          detail was given for these, so they're listed rather than built
          out as full project pages. */}
      <section className={`selected-works reveal ${worksVis ? 'visible' : ''}`} ref={worksRef}>
        <p className="section-label">From the DIC Archive</p>
        <h2 className="section-title">Selected works</h2>
        <ul className="selected-works__list">
          {DIC_SELECTED_WORKS.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </section>

      <section
        className={`projects reveal ${vidVis ? 'visible' : ''}`}
        ref={vidRef}
      >
        <p className="section-label">Project Films</p>
        <h2 className="section-title">Watch our work</h2>
        <div className="video-grid">
          {VIDEOS.map((v) => (
            <YouTubeEmbed key={v.id} videoId={v.id} title={v.title} />
          ))}
        </div>
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
