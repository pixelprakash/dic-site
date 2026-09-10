import { Link } from 'react-router-dom';
import '../styles/Home.css';

// ─────────────────────────────────────────────────────────────────────
// The full home page is PARKED while it's being redesigned — not
// deleted. The complete implementation (Hero, StoryFlow story sections,
// Gallery, Testimonials, FAQ) and its imports are preserved verbatim in
// the commented block below. To restore: un-comment that block, delete
// the under-construction return, and drop this Home.css import if the
// old page doesn't need it.
// ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <section className="home-construction">
      <div className="home-construction__inner">
        <p className="home-construction__eyebrow">Design Innovation Centre · IIT Hyderabad</p>
        <h1 className="home-construction__title">This page is under construction</h1>
        <p className="home-construction__body">
          We&rsquo;re redesigning the home page. In the meantime, the rest of the site is live —
          explore our research, projects, people, and courses.
        </p>
        <nav className="home-construction__links" aria-label="Site sections">
          <Link to="/research">Research</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/people">People</Link>
          <Link to="/education">Education</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </section>
  );
}

// ─── PARKED: full home page ──────────────────────────────────────────
// Restore these imports at the top of the file:
//
// import Hero from '../components/Hero';
// // import NewsHighlights from '../components/NewsHighlights';
// import StoryFlow, { StorySection } from '../components/StoryFlow';
// import ImageStack from '../components/ImageStack';
// import Collaborators from '../components/Collaborators';
// import ResearchDomainsNav from '../components/ResearchDomainsNav';
// import Gallery from '../components/Gallery';
// import Testimonials from '../components/Testimonials';
// import FAQ from '../components/FAQ';
// import { STATS, ABOUT_STACK_IMAGES } from '../data/siteData';
// import { Link } from 'react-router-dom';
//
// ...and use this as the component body:
//
//   return (
//     <>
//       <Hero />
//       {/* NewsHighlights — parked; its role is covered by Hero's own
//           "Announcements & Notifications" panel. */}
//
//       <StoryFlow aria-label="DIC story">
//         {/* 01 — About + Collaborators */}
//         <StorySection
//           aria-label="About the Centre"
//           className="story-section--intro"
//           style={{ background: 'var(--color-dic-red-text-safe)', color: '#fff' }}
//         >
//           <div className="story-about__grid">
//             <div className="story-about__text">
//               <h2 className="story-headline">
//                 Where design
//                 <br />
//                 meets innovation
//               </h2>
//               <p className="story-copy">
//                 The Design Innovation Centre (DIC) Nodal at IIT Hyderabad drives innovation
//                 through design and technology, working alongside partnering institutions on
//                 mutually beneficial innovation activities.
//               </p>
//               <p className="story-copy">
//                 DIC brings a holistic, inter-disciplinary approach to design — cutting across
//                 cultural heritage, digital humanities, autonomous mobility, and sustainable
//                 product development.
//               </p>
//             </div>
//             <ImageStack images={ABOUT_STACK_IMAGES} />
//           </div>
//           <Collaborators />
//         </StorySection>
//
//         {/* 02 — Research domains. Ink text, not white — white on this
//             orange only measures 2.88:1, under WCAG AA. */}
//         <StorySection
//           aria-label="Research domains"
//           className="story-section--domains"
//           style={{ background: 'var(--color-dic-orange)', color: 'var(--color-ink)' }}
//         >
//           <h2 className="story-headline">Research Domains</h2>
//           <ResearchDomainsNav />
//         </StorySection>
//
//         {/* 03 — Get involved */}
//         <StorySection
//           aria-label="Get involved"
//           style={{ background: 'var(--color-dic-blue)', color: '#fff' }}
//         >
//           <h2 className="story-headline">
//             Let's build
//             <br />
//             what's next
//           </h2>
//           <p className="story-copy">
//             Interested in partnering with DIC for research, design innovation, or academic
//             collaboration? We'd love to hear from you.
//           </p>
//           <div className="story-stats">
//             {STATS.map((s) => (
//               <div className="story-stat" key={s.label}>
//                 <div className="story-stat__number">{s.number}</div>
//                 <div className="story-stat__label">{s.label}</div>
//               </div>
//             ))}
//           </div>
//           <Link to="/contact" className="pill-cta">
//             Get in touch
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//               <path d="M5 12h14M12 5l7 7-7 7" />
//             </svg>
//           </Link>
//         </StorySection>
//       </StoryFlow>
//
//       <Gallery />
//       <Testimonials />
//       <FAQ />
//     </>
//   );
// ────────────────────────────────────────────────────────────────────
