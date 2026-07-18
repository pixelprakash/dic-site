import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMAINS } from '../data/siteData';
import '../styles/ResearchDomainsNav.css';

export default function ResearchDomainsNav() {
  const [active, setActive] = useState(0);

  return (
    <div className="rd">
      <div className="rd__panel">
        <nav className="rd__sidebar" aria-label="Research domains quick navigation">
          <ul className="rd__list" role="tablist">
            {DOMAINS.map((d, i) => (
              <li key={d.title} role="presentation">
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  className={`rd__list-item ${active === i ? 'active' : ''}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="rd__list-dot" />
                  {d.title}
                </button>
              </li>
            ))}
          </ul>
          <Link to="/research" className="rd__view-all">
            View all research
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </nav>

        <div className="rd__grid">
          {DOMAINS.map((d, i) => (
            <Link
              to="/research"
              className={`rd__card ${active === i ? 'active' : ''}`}
              key={d.title}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <img src={d.image} alt={d.title} loading="lazy" />
              <div className="rd__card-overlay">
                <h4>{d.title}</h4>
                <span className="rd__card-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
