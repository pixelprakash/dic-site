import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
// Site switcher (DIC Nodal / DIC · IITH toggle bar) — parked for now, it
// read as an odd extra bar above the navbar. Not deleted: uncomment this
// import and the <SiteSwitcher /> below to bring it back. DIC Nodal is
// still reachable — it's now a regular navbar item instead.
// import SiteSwitcher from './components/SiteSwitcher';
import { NAV_LINKS, CONTACT_LINK } from './data/siteData';
import { getMemberBySlug } from './data/peopleData';
import './styles/global.css';
import './styles/sections.css';
import './styles/Loader.css';

/* Code-split pages for fast initial load */
const Home = lazy(() => import('./pages/Home'));
const People = lazy(() => import('./pages/People'));
const PersonProfile = lazy(() => import('./pages/PersonProfile'));
const Research = lazy(() => import('./pages/Research'));
const Projects = lazy(() => import('./pages/Projects'));
const Education = lazy(() => import('./pages/Education'));
const Contact = lazy(() => import('./pages/Contact'));
const Nodal = lazy(() => import('./pages/Nodal'));
const AllIndiaDicMeet26 = lazy(() => import('./pages/AllIndiaDicMeet26'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

const DEFAULT_TITLE = 'DIC · IITH — Design Innovation Centre, IIT Hyderabad';

// Every page's tab title is derived from its own navbar label — People,
// Publications, etc. — rather than a separately-maintained name, so the
// two stay in sync automatically if the nav copy ever changes.
const PAGE_TITLES = {
  [CONTACT_LINK.path]: `${CONTACT_LINK.label} — DIC · IITH`,
  ...Object.fromEntries(NAV_LINKS.map((link) => [link.path, `${link.label} — DIC · IITH`])),
  // Overrides the generic templated title the spread above gives '/nodal' —
  // this one needs to come last to win.
  '/nodal': 'DIC Nodal — India’s National Design Innovation Network',
};

const PEOPLE_PREFIX = '/people/';

/* Keeps the browser tab title in sync with which of the two sites —
   DIC · IITH or DIC Nodal — is currently on screen. A person's profile
   page gets its own name in the title (for sharing/bookmarking), looked
   up from the same slug the route and the card link use. */
function DocumentTitle() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith(PEOPLE_PREFIX)) {
      const member = getMemberBySlug(location.pathname.slice(PEOPLE_PREFIX.length));
      document.title = member ? `${member.name} — DIC · IITH` : PAGE_TITLES['/people'];
      return;
    }
    document.title = PAGE_TITLES[location.pathname] || DEFAULT_TITLE;
  }, [location.pathname]);
  return null;
}

function Loader() {
  return (
    <div className="dic-loader" role="status" aria-label="Loading">
      <div className="dic-loader__mark" aria-hidden="true">
        <span className="dic-loader__letter" style={{ '--dic-loader-delay': '0s' }}>D</span>
        <span className="dic-loader__letter" style={{ '--dic-loader-delay': '0.15s' }}>I</span>
        <span className="dic-loader__letter" style={{ '--dic-loader-delay': '0.3s' }}>C</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DocumentTitle />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* <SiteSwitcher /> */}
      <CustomCursor />
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/people" element={<People />} />
            <Route path="/people/:slug" element={<PersonProfile />} />
            {/* Old path, kept working in case it's bookmarked or linked anywhere */}
            <Route path="/about" element={<Navigate to="/people" replace />} />
            <Route path="/research" element={<Research />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/nodal" element={<Nodal />} />
            <Route path="/all-india-dic-meet-26" element={<AllIndiaDicMeet26 />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
