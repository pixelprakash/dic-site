import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setPageMeta } from '../lib/seo';
import { NAV_LINKS } from '../data/siteData';

// Any address the site doesn't have. The page says so plainly, offers the main
// sections, and (see lib/seo.js) is marked noindex so it never appears in search.
export default function NotFound() {
  useEffect(() => {
    setPageMeta({ title: 'Page not found — DIC · IITH', description: 'This page does not exist.', noindex: true });
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <h1>Page not found</h1>
        <p>That address doesn&rsquo;t exist on this site. It may have moved, or the link may be mistyped.</p>
      </div>
      <section className="section">
        <p className="lede">Try one of the main sections:</p>
        <ul className="notfound-links">
          {NAV_LINKS.map((l) => (
            <li key={l.path}>
              <Link className="btn btn--ghost" to={l.path}>{l.label}</Link>
            </li>
          ))}
          <li><Link className="btn" to="/">Go to the home page</Link></li>
        </ul>
      </section>
    </>
  );
}
