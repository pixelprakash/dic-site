import { Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, matchPath, useLocation } from 'react-router-dom';
import { lazyPage } from './lib/lazyPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlassReveal from './components/GlassReveal';
import PageTransition from './components/PageTransition';
// Design switcher (1 Redesign / 2 Current / 3 Soft) — hidden while the site is
// locked to one design (see lib/designVariant.js). To bring it back: un-comment
// this import and the <DesignToggle /> below, and unlock the design.
// import DesignToggle from './components/DesignToggle';
import { useDesign } from './lib/designVariant';
import { setPageMeta } from './lib/seo';
import { ROUTE_META } from './data/seoData';
// Cursor dot with a fading pen trail (after dschool.stanford.edu) — redesign only.
import CustomCursor from './components/CustomCursor';
// Site switcher (DIC Nodal / DIC · IITH toggle bar) — parked for now, it
// read as an odd extra bar above the navbar. Not deleted: uncomment this
// import and the <SiteSwitcher /> below to bring it back. DIC Nodal is
// still reachable — it's now a regular navbar item instead.
// import SiteSwitcher from './components/SiteSwitcher';
import { NAV_LINKS, CONTACT_LINK } from './data/siteData';
import { useMembers, useFeed } from './lib/cms';
import './styles/global.css';
import './styles/sections.css';
import './styles/Loader.css';
import './styles/redesign.css';
import './styles/redesign-pages.css';
import './styles/redesign-c.css';

/* Code-split pages for fast initial load */
const Home = lazyPage(() => import('./pages/Home'));
const About = lazyPage(() => import('./pages/About'));
const NotFound = lazyPage(() => import('./pages/NotFound'));
const People = lazyPage(() => import('./pages/People'));
const PersonProfile = lazyPage(() => import('./pages/PersonProfile'));
const Research = lazyPage(() => import('./pages/Research'));
const Projects = lazyPage(() => import('./pages/Projects'));
const Education = lazyPage(() => import('./pages/Education'));
const Contact = lazyPage(() => import('./pages/Contact'));
const Nodal = lazyPage(() => import('./pages/Nodal'));
// All India DIC Meet '26 page — parked for now (pages/AllIndiaDicMeet26.jsx is
// kept). Un-comment this import, the <Route> below and the nav item in
// data/siteData.js to bring it back.
// const AllIndiaDicMeet26 = lazy(() => import('./pages/AllIndiaDicMeet26'));
const ProjectDetail = lazyPage(() => import('./pages/ProjectDetail'));
const ResearchDetail = lazyPage(() => import('./pages/ResearchDetail'));
const News = lazyPage(() => import('./pages/News'));
const NewsPost = lazyPage(() => import('./pages/NewsPost'));
const Conferences = lazyPage(() => import('./pages/Conferences'));
const FourthDicMeet = lazyPage(() => import('./pages/FourthDicMeet'));
const Events = lazyPage(() => import('./pages/Events'));
const Workshops = lazyPage(() => import('./pages/Workshops'));
const Blogs = lazyPage(() => import('./pages/Blogs'));
const BlogDetail = lazyPage(() => import('./pages/BlogDetail'));
const WikiThesisBlog = lazyPage(() => import('./pages/WikiThesisBlog'));
const NaturalIntelligenceBlog = lazyPage(() => import('./pages/NaturalIntelligenceBlog'));
const BlogPost = lazyPage(() => import('./pages/BlogPost'));
const Practices = lazyPage(() => import('./pages/Practices'));

// Every address on the site. The DIC Meet '26 page is parked (see its import
// above): add ['/all-india-dic-meet-26', AllIndiaDicMeet26] to bring it back.
const PAGE_ROUTES = [
  ['/', Home],
  ['/people', People],
  ['/people/:slug', PersonProfile],
  ['/about', About],
  ['/research', Research],
  ['/research/:slug', ResearchDetail],
  ['/projects', Projects],
  ['/projects/:slug', ProjectDetail],
  ['/education', Education],
  ['/contact', Contact],
  ['/practices', Practices],
  ['/news', News],
  ['/news/:slug', NewsPost],
  ['/nodal', Nodal],
  ['/conferences', Conferences],
  ['/conferences/fourth-all-india-dic-meet', FourthDicMeet],
  ['/events', Events],
  ['/workshops', Workshops],
  ['/blogs', Blogs],
  ['/blogs/reimagining-formative-assessment-art-education', BlogDetail],
  ['/blogs/wiki-thesis-research-assessment-ai', WikiThesisBlog],
  ['/blogs/how-intelligent-are-we-about-natural-intelligence', NaturalIntelligenceBlog],
  ['/blogs/:slug', BlogPost],
  ['*', NotFound],
];

/* Loads the code for one address, ahead of showing it. */
export function preloadRoute(pathname) {
  const path = pathname.replace(/(.)\/+$/, '$1');
  // exact addresses win over the ones with a :slug
  const exact = PAGE_ROUTES.find(([p]) => p === path);
  const [, Page] = exact || PAGE_ROUTES.find(([p]) => p !== '*' && matchPath(p, path)) || PAGE_ROUTES.at(-1);
  return Page.preload();
}

// Once the first page has loaded and the browser is idle, quietly fetch the
// main sections' code, so clicking through the navbar swaps pages instantly
// instead of showing the loader while each one downloads.
const PREFETCH = [People, Research, Projects, Education, Nodal, News, Contact];
function usePrefetchRoutes() {
  useEffect(() => {
    const run = () => PREFETCH.forEach((Page) => Page.preload().catch(() => {}));
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(run, 2500);
    return () => clearTimeout(id);
  }, []);
}

const DEFAULT_TITLE = 'DIC · IITH — Design Innovation Centre, IIT Hyderabad';

// Every page's tab title is derived from its own navbar label — People,
// Publications, etc. — rather than a separately-maintained name, so the
// two stay in sync automatically if the nav copy ever changes.
const PAGE_TITLES = {
  [CONTACT_LINK.path]: `${CONTACT_LINK.label} — DIC · IITH`,
  ...Object.fromEntries(NAV_LINKS.map((link) => [link.path, `${link.label} — DIC · IITH`])),
  // The Events & Insights mega-menu's four sub-pages each have their own
  // path, distinct from the parent nav item's own — not covered by the
  // NAV_LINKS spread above, which only maps each top-level item's path.
  '/conferences': 'DIC Hosted Conferences — DIC · IITH',
  '/conferences/fourth-all-india-dic-meet': 'Fourth All India DIC Meet — DIC · IITH',
  '/practices': 'DIC Practices — DIC · IITH',
  '/news': 'News & Updates — DIC · IITH',
  '/events': 'Events — DIC · IITH',
  '/workshops': 'Workshops — DIC · IITH',
  '/blogs': 'Blogs & Articles — DIC · IITH',
  '/blogs/reimagining-formative-assessment-art-education': 'Reimagining Formative Assessment in Art Education — DIC · IITH',
  '/blogs/wiki-thesis-research-assessment-ai': "Time for the 'Wiki-Thesis' — DIC · IITH",
  '/blogs/how-intelligent-are-we-about-natural-intelligence': 'How Intelligent Are We About Our Natural Intelligence? — DIC · IITH',
  // Overrides the generic templated title the spread above gives '/nodal' —
  // this one needs to come last to win.
  '/nodal': 'DIC Nodal — India’s National Design Innovation Network',
};

const PEOPLE_PREFIX = '/people/';
const NEWS_PREFIX = '/news/';

/* Keeps the browser tab title in sync with which of the two sites —
   DIC · IITH or DIC Nodal — is currently on screen. A person's profile
   page gets its own name in the title (for sharing/bookmarking), looked
   up from the same slug the route and the card link use. */
// Each route type is its own component so a page only asks the CMS for what
// its title needs — a person's profile loads people, a news post loads news,
// everything else loads nothing.
function PersonTitle({ slug }) {
  const { all: members } = useMembers();
  useEffect(() => {
    const member = members.find((m) => m.id === slug && !m.placeholder);
    if (member) {
      setPageMeta({
        title: `${member.name} — DIC · IITH`,
        description: member.bio || `${member.role} at the Design Innovation Centre, IIT Hyderabad.`,
        path: `${PEOPLE_PREFIX}${slug}`,
        image: member.photo || undefined,
      });
    } else {
      setPageMeta({ title: PAGE_TITLES['/people'], path: '/people' });
    }
  }, [members, slug]);
  return null;
}

function NewsTitle({ slug }) {
  const { data: feed } = useFeed();
  useEffect(() => {
    const post = feed.find((p) => p.slug === slug);
    if (post) {
      const heading = post.title || post.text.split('\n')[0];
      setPageMeta({
        title: `${heading} — DIC · IITH`,
        description: post.text.replace(/\s+/g, ' ').slice(0, 200),
        path: `${NEWS_PREFIX}${slug}`,
        image: post.images?.[0]?.src,
      });
    } else {
      setPageMeta({ title: PAGE_TITLES['/news'], path: '/news' });
    }
  }, [feed, slug]);
  return null;
}

function DocumentTitle() {
  const { pathname } = useLocation();
  // Entrance fades are for moving between pages. The page a visitor lands on
  // is already on screen as HTML, so fading it would only blink it.
  const landedOn = useRef(pathname);
  useEffect(() => {
    if (pathname !== landedOn.current) document.documentElement.dataset.navigated = '';
  }, [pathname]);
  // The first path segment (home, research, people…), so a design can colour
  // each page's header differently (Design 3 does).
  useEffect(() => {
    document.documentElement.dataset.route = pathname.split('/')[1] || 'home';
  }, [pathname]);
  useEffect(() => {
    if (pathname.startsWith(PEOPLE_PREFIX) || pathname.startsWith(NEWS_PREFIX)) return;
    // Known pages: their own title and description. Detail pages set theirs
    // when their content loads (a project, a research study, a blog post).
    setPageMeta({ title: ROUTE_META[pathname]?.title || PAGE_TITLES[pathname] || DEFAULT_TITLE, path: pathname });
  }, [pathname]);
  if (pathname.startsWith(PEOPLE_PREFIX)) return <PersonTitle slug={pathname.slice(PEOPLE_PREFIX.length)} />;
  if (pathname.startsWith(NEWS_PREFIX)) return <NewsTitle slug={pathname.slice(NEWS_PREFIX.length)} />;
  return null;
}

// Scrolls to #section after a route change — react-router doesn't on its own,
// and the target may not be on screen yet while a lazy page is still loading.
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
        clearInterval(timer);
      } else if (++tries > 30) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [pathname, hash]);
  return null;
}

// Page-transition loader, one per site design (see lib/designVariant.js):
// design 1 — a black panel with a giant "DIC" that fills red from the bottom,
// then wipes away, under a thin red progress line; design 2 — the glass reveal.
function Loader() {
  const design = useDesign();

  if (design === 'a') {
    return (
      <div className="dic-loader dic-loader--a" role="status" aria-label="Loading">
        <span className="dic-loader__line" aria-hidden="true" />
        <span className="dic-loader__word" data-text="DIC" aria-hidden="true">DIC</span>
        <span className="dic-loader__caption" aria-hidden="true">Design Innovation Centre · IIT Hyderabad</span>
      </div>
    );
  }

  return (
    <div className="dic-loader" role="status" aria-label="Loading">
      <GlassReveal
        logo="/images/diclogo.webp"
        originalColors
        background="#FFF9F3"
        logoScale={0.95}
        finalScale={0.9}
        className="dic-loader__glass"
        aria-hidden="true"
        role="presentation"
      />
    </div>
  );
}

// The cursor is part of the redesign (Design 1) only.
function Cursor() {
  return useDesign() === 'a' ? <CustomCursor /> : null;
}

/* Everything inside the router. The build renders this too, with a router
   that is given the address instead of reading it from the browser. */
export function AppShell() {
  usePrefetchRoutes();
  return (
    <>
      <DocumentTitle />
      <ScrollToHash />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* <SiteSwitcher /> */}
      <Cursor />
      <Navbar />
      <PageTransition>
        {(loc) => (
          <main id="main-content">
            <Suspense fallback={<Loader />}>
              <Routes location={loc}>
                {PAGE_ROUTES.map(([path, Page]) => (
                  <Route key={path} path={path} element={<Page />} />
                ))}
              </Routes>
            </Suspense>
          </main>
        )}
      </PageTransition>
      <Footer />
      {/* <DesignToggle /> */}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
