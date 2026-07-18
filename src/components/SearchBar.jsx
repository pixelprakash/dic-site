import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SEARCH_INDEX, NAV_LINKS } from '../data/siteData';
import '../styles/SearchBar.css';

const QUICK_LINKS = NAV_LINKS.map((link) => ({
  id: `quick-${link.path}`,
  title: link.label,
  desc: 'Jump to section',
  path: link.path,
  category: 'Quick link',
}));

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

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return QUICK_LINKS;
    return SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.desc?.toLowerCase().includes(q),
    ).slice(0, 7);
  }, [query]);

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

  const goTo = (item) => {
    if (!item) return;
    setOpen(false);
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
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
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

  return (
    <div className={`search ${open ? 'search--open' : ''}`} ref={wrapperRef}>
      <button
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

      <div className="search__field" role="search">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="site-search-listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
          placeholder="Search this site"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {query && (
          <button
            type="button"
            className="search__clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className={`search__panel ${open ? 'open' : ''}`}>
        {results.length > 0 ? (
          <ul className="search__list" role="listbox" id="site-search-listbox">
            {!query && <li className="search__group-label">Quick links</li>}
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
                <span className="search__item-title">{highlight(item.title, query)}</span>
                {item.desc && <span className="search__item-desc">{item.desc}</span>}
                <span className="search__item-tag">{item.category}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="search__empty">No results for &ldquo;{query}&rdquo;</p>
        )}
      </div>
    </div>
  );
}
