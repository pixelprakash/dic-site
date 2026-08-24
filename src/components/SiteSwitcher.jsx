import { Link, useLocation } from 'react-router-dom';
import '../styles/SiteSwitcher.css';

export default function SiteSwitcher() {
  const location = useLocation();
  const isNodal = location.pathname.startsWith('/nodal');

  return (
    <div className="site-switcher">
      <div className="site-switcher__inner">
        <span className="site-switcher__label">You&rsquo;re viewing</span>
        <div className="site-switcher__capsule" role="group" aria-label="Switch between DIC sites">
          <span
            className={`site-switcher__indicator ${isNodal ? 'is-left' : 'is-right'}`}
            aria-hidden="true"
          />
          <Link
            to="/nodal"
            className={`site-switcher__option ${isNodal ? 'is-active' : ''}`}
            aria-current={isNodal ? 'page' : undefined}
          >
            <span className="site-switcher__option-top">
              <span className="site-switcher__option-title">DIC Nodal</span>
              <span className="site-switcher__badge">Coming soon</span>
            </span>
            <span className="site-switcher__option-sub">National design network</span>
          </Link>
          <Link
            to="/"
            className={`site-switcher__option ${!isNodal ? 'is-active' : ''}`}
            aria-current={!isNodal ? 'page' : undefined}
          >
            <span className="site-switcher__option-top">
              <span className="site-switcher__option-title">DIC · IITH</span>
            </span>
            <span className="site-switcher__option-sub">Design Dept, IIT Hyderabad</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
