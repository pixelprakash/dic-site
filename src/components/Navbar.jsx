import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, CONTACT_LINK } from '../data/siteData';
import SearchBar from './SearchBar';
// Page scroll-progress bar — parked for now, undecided whether to keep it.
// Not deleted: uncomment this import and the <ScrollProgress /> below to
// bring it back.
// import ScrollProgress from './ScrollProgress';
import '../styles/Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const closeTimer = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
    setMobileExpanded(null);
    // A hash in the destination (search's FAQ jump, People's category
    // anchors, a profile page's breadcrumb) means something else on the
    // page is about to scroll to a specific spot — resetting to the top
    // here would immediately fight that.
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const openMenuFor = (path) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(path);
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const cancelClose = () => clearTimeout(closeTimer.current);

  const activeLink = NAV_LINKS.find((link) => link.path === openMenu);

  return (
    <>
    {/* <ScrollProgress /> */}
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${openMenu ? 'mega-open' : ''}`}>
      <Link to="/" className="navbar__logo">
        <img src="/images/diclogo.webp" alt="DIC — Design Innovation Centre, IIT Hyderabad" />
      </Link>

      <div className="navbar__links" onMouseLeave={scheduleClose}>
        {NAV_LINKS.map((link) => (
          <div
            key={link.path}
            className="navbar__item"
            onMouseEnter={() => link.menu && openMenuFor(link.path)}
          >
            <Link
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'active' : ''} ${openMenu === link.path ? 'menu-open' : ''}`}
            >
              {link.label}
              {link.menu && (
                <svg className="navbar__chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            </Link>
          </div>
        ))}
      </div>

      <SearchBar />

      <Link to={CONTACT_LINK.path} className="navbar__contact">
        {CONTACT_LINK.label}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>

      <button
        className={`navbar__toggle ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* Mega menu backdrop + panel (desktop) */}
      <div
        className={`navbar__mega-backdrop ${openMenu ? 'open' : ''}`}
        onClick={() => setOpenMenu(null)}
      />
      <div
        className={`navbar__mega ${openMenu ? 'open' : ''}`}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {activeLink?.menu && (
          <div className="navbar__mega-inner">
            <div className="navbar__mega-columns">
              {activeLink.menu.columns.map((col) => (
                <div className="navbar__mega-col" key={col.heading}>
                  <p className="navbar__mega-heading">{col.heading}</p>
                  {col.items.map((item) => (
                    <Link key={item.label} to={item.path} className="navbar__mega-item">
                      <span className="navbar__mega-item-label">{item.label}</span>
                      <span className="navbar__mega-item-desc">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <Link to={activeLink.menu.featured.path} className="navbar__mega-featured">
              <div className="navbar__mega-featured-image">
                <img src={activeLink.menu.featured.image} alt="" loading="lazy" />
              </div>
              <div className="navbar__mega-featured-body">
                <h4 className="navbar__mega-featured-title">{activeLink.menu.featured.label}</h4>
                <p className="navbar__mega-featured-desc">{activeLink.menu.featured.desc}</p>
                <span className="navbar__mega-featured-cta">
                  {activeLink.menu.featured.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile full-screen menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="navbar__mobile-list">
          {NAV_LINKS.map((link) => (
            <div className="navbar__mobile-item" key={link.path}>
              <div className="navbar__mobile-row">
                <Link
                  to={link.path}
                  className="navbar__link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
                {link.menu && (
                  <button
                    className={`navbar__mobile-chevron ${mobileExpanded === link.path ? 'open' : ''}`}
                    onClick={() => setMobileExpanded(mobileExpanded === link.path ? null : link.path)}
                    aria-label={`Toggle ${link.label} submenu`}
                    aria-expanded={mobileExpanded === link.path}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                )}
              </div>
              {link.menu && (
                <div className={`navbar__mobile-submenu ${mobileExpanded === link.path ? 'open' : ''}`}>
                  <div className="navbar__mobile-submenu-inner">
                    {link.menu.columns.flatMap((col) => col.items).map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        className="navbar__mobile-subitem"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Link
          to={CONTACT_LINK.path}
          className="navbar__link navbar__mobile-contact"
          onClick={() => setMenuOpen(false)}
        >
          {CONTACT_LINK.label}
        </Link>
      </div>
    </nav>
    </>
  );
}
