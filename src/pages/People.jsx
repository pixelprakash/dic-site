import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MEMBER_CATEGORIES, MEMBERS } from '../data/peopleData';
import MemberCard from '../components/MemberCard';
import '../styles/People.css';

export default function People() {
  const location = useLocation();
  const headerRef = useRef(null);
  const [navH, setNavH] = useState(84);
  const [offset, setOffset] = useState(160);
  const [activeId, setActiveId] = useState(MEMBER_CATEGORIES[0].id);
  const [revealedIds, setRevealedIds] = useState(() => new Set());

  // Sticky header sits directly under the navbar, and each section needs to
  // stop scrolling right where the sticky header's bottom edge is — both
  // measured live so this keeps working if the navbar or tag row ever
  // wraps to a different height (e.g. mobile).
  useLayoutEffect(() => {
    const measure = () => {
      const navbar = document.querySelector('.navbar');
      const measuredNavH = navbar ? navbar.getBoundingClientRect().height : 84;
      const headerH = headerRef.current ? headerRef.current.offsetHeight : 0;
      setNavH(measuredNavH);
      setOffset(measuredNavH + headerH);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Scrollspy — the active tag is whichever section's top has most
  // recently scrolled past the sticky header's bottom edge. Walking the
  // sections in order and taking the last one that qualifies is simpler
  // and more robust than an IntersectionObserver margin here, since it
  // doesn't depend on tuning a detection band against unknown section
  // heights (some categories may have very few placeholder cards).
  useEffect(() => {
    const sections = MEMBER_CATEGORIES.map((c) => document.getElementById(c.id)).filter(Boolean);
    if (!sections.length) return undefined;

    let ticking = false;
    const update = () => {
      ticking = false;
      let current = sections[0].id;
      for (const s of sections) {
        if (s.getBoundingClientRect().top - offset <= 1) {
          current = s.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [offset]);

  // Reveal — each category fades and lifts into place, with its cards
  // staggering in behind it, the first time it scrolls into view. Reuses
  // the site's existing .reveal / .reveal-stagger language (Home, Nodal)
  // rather than a page-specific effect.
  useEffect(() => {
    const sections = MEMBER_CATEGORIES.map((c) => document.getElementById(c.id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setRevealedIds((prev) => {
            if (prev.has(entry.target.id)) return prev;
            const next = new Set(prev);
            next.add(entry.target.id);
            return next;
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Arriving here with a #category-id hash — e.g. from a profile page's
  // breadcrumb — is a client-side route change, so the browser's native
  // "jump to anchor on load" never fires. Do it ourselves once the header
  // height (and therefore each section's scroll-margin-top) is known.
  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    el?.scrollIntoView({ block: 'start' });
  }, [location.hash, offset]);

  return (
    <>
      <div className="people-header" ref={headerRef} style={{ top: navH }}>
        <h1 className="people-header__title">Members of DIC</h1>
        <nav className="people-tags" aria-label="Member categories">
          {MEMBER_CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="people-tag"
              aria-current={activeId === c.id ? 'true' : undefined}
            >
              {c.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="people-body">
        {MEMBER_CATEGORIES.map((c) => {
          const members = MEMBERS[c.id] || [];
          const revealed = revealedIds.has(c.id);
          return (
            <section
              key={c.id}
              id={c.id}
              className={`people-section reveal ${revealed ? 'visible' : ''}`}
              style={{ scrollMarginTop: offset }}
            >
              <h2 className="people-section__title">{c.label}</h2>
              {members.length > 0 ? (
                <div className={`people-grid reveal-stagger ${revealed ? 'visible' : ''}`}>
                  {members.map((m) => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                </div>
              ) : (
                <p className="people-empty">No {c.label.toLowerCase()} listed yet.</p>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
