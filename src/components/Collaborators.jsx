import { COLLABORATORS } from '../data/siteData';
import '../styles/Collaborators.css';

export default function Collaborators() {
  return (
    <div className="collaborators" id="collaborators">
      <p className="collaborators__label">Collaborators</p>
      <div className="collaborators__grid">
        {COLLABORATORS.map((c) => (
          <div className="collaborators__tile" key={c.id} title={c.name}>
            {c.logo ? (
              <img src={c.logo} alt={c.name} loading="lazy" />
            ) : (
              <span>{c.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
