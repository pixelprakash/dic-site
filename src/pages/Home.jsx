import Hero from '../components/Hero';
import StoryFlow, { StorySection } from '../components/StoryFlow';
import ImageStack from '../components/ImageStack';
import { useReveal } from '../hooks/useReveal';
import {
  STATS, DOMAINS, VIDEOS, PARTNERS, MARQUEE_IMAGES, ABOUT_STACK_IMAGES,
} from '../data/siteData';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { Link } from 'react-router-dom';

export default function Home() {
  const [projectsRef, projectsVis] = useReveal();
  const [partnersRef, partnersVis] = useReveal();

  return (
    <>
      <Hero />

      <StoryFlow aria-label="DIC story">
        {/* 01 — About */}
        <StorySection
          aria-label="About the Centre"
          style={{ background: 'var(--color-dic-red)', color: '#fff' }}
        >
          <p className="story-label">01 — Who We Are</p>
          <hr className="story-divider" />
          <div className="story-about__grid">
            <div className="story-about__text">
              <h2 className="story-headline">
                Where design
                <br />
                meets innovation
              </h2>
              <p className="story-copy">
                The Design Innovation Centre (DIC) Nodal at IIT Hyderabad drives innovation
                through design and technology, working alongside partnering institutions on
                mutually beneficial innovation activities.
              </p>
              <p className="story-copy">
                DIC brings a holistic, inter-disciplinary approach to design — cutting across
                cultural heritage, digital humanities, autonomous mobility, and sustainable
                product development.
              </p>
            </div>
            <ImageStack images={ABOUT_STACK_IMAGES} />
          </div>
        </StorySection>

        {/* 02 — What we do */}
        <StorySection
          aria-label="Research domains"
          style={{ background: 'var(--color-dic-orange)', color: '#fff' }}
        >
          <p className="story-label">02 — What We Do</p>
          <hr className="story-divider" />
          <h2 className="story-headline">Research domains</h2>
          <p className="story-copy">
            Four fields of expertise, one design-led mission — from preserving heritage to
            prototyping the future of mobility and learning.
          </p>
          <div className="domains__grid">
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
        </StorySection>

        {/* 03 — Get involved */}
        <StorySection
          aria-label="Get involved"
          style={{ background: 'var(--color-dic-blue)', color: '#fff' }}
        >
          <p className="story-label">03 — Get Involved</p>
          <hr className="story-divider" />
          <h2 className="story-headline">
            Let's build
            <br />
            what's next
          </h2>
          <p className="story-copy">
            Interested in partnering with DIC for research, design innovation, or academic
            collaboration? We'd love to hear from you.
          </p>
          <div className="story-stats">
            {STATS.map((s) => (
              <div className="story-stat" key={s.label}>
                <div className="story-stat__number">{s.number}</div>
                <div className="story-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
          <Link to="/contact" className="pill-cta">
            Get in touch
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </StorySection>
      </StoryFlow>

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
          <Link to="/projects" className="pill-cta" style={{ fontSize: '0.85rem', padding: '12px 24px' }}>
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
    </>
  );
}
