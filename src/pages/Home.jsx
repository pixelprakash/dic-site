import { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import { useReveal } from '../hooks/useReveal';
import {
  STATS, DOMAINS, VIDEOS, PARTNERS, MARQUEE_IMAGES,
} from '../data/siteData';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { Link } from 'react-router-dom';

export default function Home() {
  const [statsRef, statsVis] = useReveal(0.2);
  const [aboutRef, aboutVis] = useReveal();
  const [domainsRef, domainsVis] = useReveal();
  const [projectsRef, projectsVis] = useReveal();
  const [partnersRef, partnersVis] = useReveal();

  return (
    <>
      <Hero />

      {/* Stats */}
      <section
        className={`stats reveal-stagger ${statsVis ? 'visible' : ''}`}
        ref={statsRef}
      >
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat__number">{s.number}</div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* About */}
      <section
        className={`about reveal ${aboutVis ? 'visible' : ''}`}
        ref={aboutRef}
      >
        <div className="about__grid">
          <div className="about__text">
            <p className="section-label">About the Centre</p>
            <h2 className="section-title">Where design meets innovation</h2>
            <p>
              The Design Innovation Centre (DIC) Nodal at IIT Hyderabad drives innovation
              through design and technology. The Department of Design along with partnering
              institutions engages in mutually beneficial innovation activities.
            </p>
            <p>
              DIC creates a holistic and inter-disciplinary nature of design to cut across
              research domains — from cultural heritage and architecture to digital humanities,
              autonomous mobility, and sustainable product development.
            </p>
          </div>
          <div className="about__image">
            <img src="/images/image7.jpg" alt="DIC Lab workspace at IIT Hyderabad" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Domains */}
      <section
        className={`domains reveal ${domainsVis ? 'visible' : ''}`}
        ref={domainsRef}
      >
        <p className="section-label">Fields of Expertise</p>
        <h2 className="section-title">Research domains</h2>
        <div className={`domains__grid reveal-stagger ${domainsVis ? 'visible' : ''}`}>
          {DOMAINS.map((d) => (
            <Link to="/research" className="domain-card" key={d.title}>
              <img src={d.image} alt={d.title} loading="lazy" />
              <div className="domain-card__overlay">
                <h4 className="domain-card__title">{d.title}</h4>
                <p className="domain-card__desc">{d.desc}</p>
              </div>
              <div className="domain-card__arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Image Marquee */}
      <section className="marquee">
        <div className="marquee__track">
          {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section
        className={`projects reveal ${projectsVis ? 'visible' : ''}`}
        ref={projectsRef}
        id="projects"
      >
        <div className="projects__header">
          <div>
            <p className="section-label">Featured Work</p>
            <h2 className="section-title">Project films</h2>
          </div>
          <Link to="/projects" className="hero__cta" style={{ fontSize: '0.85rem', padding: '12px 24px' }}>
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="video-grid">
          {VIDEOS.slice(0, 4).map((v) => (
            <YouTubeEmbed key={v.id} videoId={v.id} title={v.title} />
          ))}
        </div>
      </section>

      {/* Partners */}
      <section
        className={`partners reveal ${partnersVis ? 'visible' : ''}`}
        ref={partnersRef}
      >
        <p className="section-label">Collaborations</p>
        <h2 className="section-title">Partners &amp; supporters</h2>
        <div className="partners__logos">
          {PARTNERS.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div>
          <h2>Let's collaborate</h2>
          <p>
            Interested in partnering with DIC for research, design innovation,
            or academic collaboration?
          </p>
        </div>
        <Link to="/contact" className="contact-cta__link">
          Get in touch
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </>
  );
}
