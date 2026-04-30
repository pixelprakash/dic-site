import YouTubeEmbed from '../components/YouTubeEmbed';
import { VIDEOS, MARQUEE_IMAGES } from '../data/siteData';
import { useReveal } from '../hooks/useReveal';

export default function Projects() {
  const [vidRef, vidVis] = useReveal();

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
