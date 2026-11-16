import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS, SEARCH_INDEX, buildSearchIndex } from '../data/siteData';
import { useMembers, useProjects, useResearchProjects, useBlogPosts, useConferences, useNodalEvents, useNodalCentres, useFeed } from '../lib/cms';
import '../styles/SearchBar.css';

function highlight(text, query) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

// Mounted only while the search box is open, so the site's content (people,
// projects, news...) isn't downloaded for visitors who never search.
function SearchIndexLoader({ onReady }) {
  const { members } = useMembers();
  const { projects } = useProjects();
  const { researchProjects } = useResearchProjects();
  const { posts: blogs } = useBlogPosts();
  const { conferences } = useConferences();
  const { events } = useNodalEvents();
  const { centres } = useNodalCentres();
  const { data: feed } = useFeed();

  useEffect(() => {
    onReady(buildSearchIndex({ members, projects, researchProjects, blogs, conferences, centres, events, feed }));
  }, [members, projects, researchProjects, blogs, conferences, centres, events, feed, onReady]);
  return null;
}

// Search opens as a bar that covers the whole navbar (so it can never run
// over the logo or the links, at any width) with the results hanging beneath
// it, full width, over a dimmed page. Empty, it offers the main sections.
export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Live content is only fetched once the search box is actually opened;
  // until then (and if the CMS is slow) the built-in index is used.
  const [liveIndex, setLiveIndex] = useState(null);
  const searchIndex = liveIndex || SEARCH_INDEX;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.desc?.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query, searchIndex]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery('');
      setActiveIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Keep the page from scrolling away behind the results while searching.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  };

  const goTo = (item) => {
    if (!item) return;
    setOpen(false);
    // A handful of indexed items (e.g. an externally-hosted conference)
    // point off-site — react-router's navigate() treats any string as an
    // in-app path, so an absolute URL here needs a real page load instead.
    if (/^https?:\/\//.test(item.path)) {
      window.open(item.path, '_blank', 'noopener,noreferrer');
      return;
    }
    const finishScroll = () => {
      if (!item.hash) return;
      requestAnimationFrame(() => {
        const el = document.querySelector(item.hash);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };
    if (item.path !== location.pathname) {
      navigate(item.path);
      if (item.hash) setTimeout(finishScroll, 120);
    } else {
      finishScroll();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
      return;
    }
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      goTo(results[activeIndex] ?? results[0]);
    }
  };

  const showPanel = open;

  return (
    <div className={`search ${open ? 'search--open' : ''}`} ref={wrapperRef}>
      {open && <SearchIndexLoader onReady={setLiveIndex} />}
      <button
        ref={toggleRef}
        type="button"
        className="search__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close search' : 'Search this site'}
        aria-expanded={open}
        aria-controls="site-search-listbox"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      <div className="search__backdrop" onClick={() => close()} aria-hidden="true" />

      <div className="search__bar" role="search">
        <svg className="search__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="site-search-listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
          placeholder="Search people, projects, research, news…"
          autoComplete="off"
          spellCheck="false"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          tabIndex={open ? 0 : -1}
        />
        {query && (
          <button
            type="button"
            className="search__clear"
            aria-label="Clear search"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            Clear
          </button>
        )}
        <button
          type="button"
          className="search__close"
          aria-label="Close search"
          tabIndex={open ? 0 : -1}
          onClick={() => close(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className={`search__panel ${showPanel ? 'open' : ''}`}>
        <div className="search__inner">
          {query ? (
            results.length > 0 ? (
              <>
                <p className="search__label" aria-live="polite">
                  {results.length} {results.length === 1 ? 'result' : 'results'}
                </p>
                <ul className="search__list" role="listbox" id="site-search-listbox">
                  {results.map((item, i) => (
                    <li
                      key={item.id}
                      id={`search-option-${i}`}
                      role="option"
                      aria-selected={activeIndex === i}
                      className={`search__item ${activeIndex === i ? 'active' : ''}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goTo(item)}
                      onMouseEnter={() => setActiveIndex(i)}
                    >
                      <span className="search__item-tag">{item.category}</span>
                      <span className="search__item-body">
                        <span className="search__item-title">{highlight(item.title, query)}</span>
                        {item.desc && <span className="search__item-desc">{item.desc}</span>}
                      </span>
                      <span className="search__item-go" aria-hidden="true">&rarr;</span>
                    </li>
                  ))}
                </ul>
                <p className="search__hint" aria-hidden="true">
                  <kbd>&uarr;</kbd> <kbd>&darr;</kbd> to move &nbsp;·&nbsp; <kbd>Enter</kbd> to open &nbsp;·&nbsp; <kbd>Esc</kbd> to close
                </p>
              </>
            ) : (
              <p className="search__empty" aria-live="polite">
                No results for &ldquo;{query}&rdquo;. Try a name, a project, or a topic such as heritage or VR.
              </p>
            )
          ) : (
            <>
              <p className="search__label">Go to</p>
              <ul className="search__quick" id="site-search-listbox">
                {NAV_LINKS.map((link) => (
                  <li key={link.path}>
                    <button
                      type="button"
                      className="search__quick-link"
                      tabIndex={open ? 0 : -1}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goTo({ path: link.path })}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
