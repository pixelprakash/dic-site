import { COLLABORATORS } from '../data/siteData';
import '../styles/Collaborators.css';

export default function Collaborators() {
  return (
    <div className="collaborators" id="collaborators">
      <p className="collaborators__label">Collaborators</p>
      <div className="collaborators__grid">
        {COLLABORATORS.map((c) => (
          <div className="collaborators__tile" key={c.id} title={`${c.name} — logo coming soon`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <path d="M8 12h8M12 8v8" />
            </svg>
            <span>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
