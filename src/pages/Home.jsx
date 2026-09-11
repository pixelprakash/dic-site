import { useState } from 'react';
import { Link } from 'react-router-dom';
import GondMuseumModal from '../components/GondMuseumModal';
import '../styles/Home.css';

// ─────────────────────────────────────────────────────────────────────
// The full home page is PARKED while it's being redesigned — not
// deleted. The complete implementation (Hero, StoryFlow story sections,
// Gallery, Testimonials, FAQ) and its imports are preserved verbatim in
// the commented block below. To restore: un-comment that block, delete
// the under-construction return, and drop this Home.css import if the
// old page doesn't need it.
// ─────────────────────────────────────────────────────────────────────

// The 3D library + a multi-MB glTF file should never load on a page visit
// that doesn't actually want them — same click-gated pattern as the
// Kateshwara Temple viewer on the project pages (see Model3DViewer usage
// in ProjectDetail.jsx). GondMuseumModal (and the three.js it pulls in via
// GondMuseumViewer) only mounts once `open` flips true. It launches straight
// into a full-viewport takeover rather than an inline embed — this is a
// walkable room, and a small on-page box undersells that; full screen (plus
// Enter VR on a headset) is the point.
function GondMuseumSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="home-gond" aria-label="Gond Virtual Museum">
      <p className="home-gond__eyebrow">New · WebXR preview</p>
      <h2 className="home-gond__title">Step into the Gond Virtual Museum</h2>
      <p className="home-gond__body">
        A room of Gond folk art — tiger, horse, bird, and dancer motifs rendered as a walkable
        3D diorama — rebuilt from DIC&rsquo;s original Oculus experience for the browser. Look
        around on desktop, or put on a headset and use Enter&nbsp;VR for the full experience.
      </p>

      <button
        type="button"
        className="home-gond__launch"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(20,18,15,0.1), rgba(20,18,15,0.55)), url(/images/projects/telangana-heritage.webp)` }}
        onClick={() => setOpen(true)}
        aria-label="Launch the Gond Virtual Museum experience, full screen"
      >
        <span className="home-gond__launch-cta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16.5V7.5a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 7.5v9a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z" />
            <path d="M3.27 6.96 12 12.01l8.73-5.05" />
            <path d="M12 22.08V12" />
          </svg>
          Launch the experience
        </span>
      </button>

      <GondMuseumModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}

export default function Home() {
  return (
    <>
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

      <GondMuseumSection />
    </>
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
