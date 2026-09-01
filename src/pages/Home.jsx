import Hero from '../components/Hero';
// NewsHighlights (the "Latest News and Highlights" carousel) — parked.
// Its role is now covered by Hero's own "Announcements & Notifications"
// panel, per the new wireframe layout, so keeping both would duplicate
// the same news items twice on one page. Not deleted: uncomment this
// import and the <NewsHighlights /> usage below to bring the full
// carousel back if the two are ever meant to coexist.
// import NewsHighlights from '../components/NewsHighlights';
import StoryFlow, { StorySection } from '../components/StoryFlow';
import ImageStack from '../components/ImageStack';
import Collaborators from '../components/Collaborators';
import ResearchDomainsNav from '../components/ResearchDomainsNav';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import { STATS, ABOUT_STACK_IMAGES } from '../data/siteData';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <Hero />
      {/* <NewsHighlights /> — parked, see import comment above */}

      <StoryFlow aria-label="DIC story">
        {/* 01 — About + Collaborators */}
        <StorySection
          aria-label="About the Centre"
          className="story-section--intro"
          style={{ background: 'var(--color-dic-red)', color: '#fff' }}
        >
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
          <Collaborators />
        </StorySection>

        {/* 02 — Research domains */}
        <StorySection
          aria-label="Research domains"
          className="story-section--domains"
          style={{ background: 'var(--color-dic-orange)', color: '#fff' }}
        >
          <h2 className="story-headline">Research Domains</h2>
          <ResearchDomainsNav />
        </StorySection>

        {/* 03 — Get involved */}
        <StorySection
          aria-label="Get involved"
          style={{ background: 'var(--color-dic-blue)', color: '#fff' }}
        >
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

      <Gallery />
      <Testimonials />
      <FAQ />
    </>
  );
}
