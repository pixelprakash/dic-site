import { useReveal } from '../hooks/useReveal';
import { RESEARCH_AREAS, PATENTS } from '../data/siteData';

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
  const [patRef, patVis] = useReveal();

  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <p className="section-label" style={{ color: 'var(--color-terracotta-light)' }}>Research</p>
        <h1>Exploring through design</h1>
        <p>
          From digital heritage preservation to autonomous air mobility —
          our research spans the full spectrum of design innovation.
        </p>
      </div>

      <section className="research-list">
        {RESEARCH_AREAS.map((item, i) => (
          <ResearchItem key={item.title} item={item} index={i} />
        ))}
      </section>

      {/* Patents */}
      <section
        className={`courses reveal ${patVis ? 'visible' : ''}`}
        ref={patRef}
      >
        <p className="section-label">Intellectual Property</p>
        <h2 className="section-title">Patents</h2>
        <div className="courses__grid">
          {PATENTS.map((p) => (
            <div className="course-card" key={p.name}>
              <strong style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>{p.name}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-stone)' }}>
                {p.inventor}{p.type ? ` · ${p.type}` : ''}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
