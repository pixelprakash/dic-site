import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SiteSwitcher from './components/SiteSwitcher';
import './styles/global.css';
import './styles/sections.css';

/* Code-split pages for fast initial load */
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Research = lazy(() => import('./pages/Research'));
const Projects = lazy(() => import('./pages/Projects'));
const Education = lazy(() => import('./pages/Education'));
const Contact = lazy(() => import('./pages/Contact'));
const Nodal = lazy(() => import('./pages/Nodal'));

const DEFAULT_TITLE = 'DIC · IITH — Design Innovation Centre, IIT Hyderabad';
const PAGE_TITLES = {
  '/nodal': 'DIC Nodal — India’s National Design Innovation Network',
};

/* Keeps the browser tab title in sync with which of the two sites —
   DIC · IITH or DIC Nodal — is currently on screen. */
function DocumentTitle() {
  const location = useLocation();
  useEffect(() => {
    document.title = PAGE_TITLES[location.pathname] || DEFAULT_TITLE;
  }, [location.pathname]);
  return null;
}

function Loader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-heading)',
      fontStyle: 'italic',
      fontSize: '1.2rem',
      color: 'var(--color-stone)',
    }}>
      Loading…
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
      <SiteSwitcher />
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/research" element={<Research />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/nodal" element={<Nodal />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
