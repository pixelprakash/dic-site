// The page-switch sheet (components/PageTransition.jsx) is part of the
// redesign (Design 1) only, and is skipped for visitors who prefer reduced
// motion — they just get the new page. Navbar uses this too, so it doesn't
// scroll the old page to the top while the sheet is still covering it.
export function curtainEnabled(design) {
  if (design !== 'a') return false;
  if (typeof window === 'undefined') return false;
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

// What the title block says while the sheet covers the screen: the section being opened.
const NAMES = {
  '': 'Home',
  about: 'About',
  research: 'Research',
  projects: 'Projects',
  people: 'People',
  education: 'Education',
  practices: 'Practices',
  nodal: 'DIC Nodal',
  contact: 'Contact',
  news: 'News',
  events: 'Events',
  workshops: 'Workshops',
  blogs: 'Blogs',
  conferences: 'Conferences',
};

export function curtainLabel(pathname) {
  const seg = pathname.split('/')[1] || '';
  if (seg in NAMES) return NAMES[seg];
  const words = seg.replace(/-/g, ' ');
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : '';
}
