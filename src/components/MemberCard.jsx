import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MemberCard.css';

function initials(name) {
  return name
    .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
    </svg>
  );
}

function ScholarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.242 13.769 0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.24 14.978 9.5 12 9.5c-2.977 0-5.548 1.74-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  );
}

export default function MemberCard({ member }) {
  const [imgError, setImgError] = useState(false);
  const { id, name, role, joinedYear, bio, tags = [], photo, linkedin, scholar, placeholder } = member;
  const showPhoto = Boolean(photo) && !imgError;

  return (
    <article className="member-card">
      <div className="member-card__photo">
        {showPhoto ? (
          <img src={photo} alt={name} loading="lazy" onError={() => setImgError(true)} />
        ) : (
          <div className={`member-card__fallback ${placeholder ? 'member-card__fallback--placeholder' : ''}`}>
            {placeholder ? <PersonIcon /> : <span>{initials(name)}</span>}
          </div>
        )}

        {joinedYear && <span className="member-card__joined">Joined {joinedYear}</span>}

        {(linkedin || scholar) && (
          <div className="member-card__socials">
            {linkedin && (
              <a
                className="member-card__social"
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on LinkedIn`}
              >
                <LinkedInIcon />
              </a>
            )}
            {scholar && (
              <a
                className="member-card__social"
                href={scholar}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on Google Scholar`}
              >
                <ScholarIcon />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="member-card__info">
        <h3 className="member-card__name">{name}</h3>
        <p className="member-card__role">{role}</p>
        {bio && <p className="member-card__bio">{bio}</p>}
        {tags.length > 0 && (
          <div className="member-card__tags">
            {tags.map((t) => (
              <span className="member-card__tag" key={t}>{t}</span>
            ))}
          </div>
        )}
        {!placeholder && (
          <Link className="member-card__link" to={`/people/${id}`}>
            view full profile
          </Link>
        )}
      </div>
    </article>
  );
}
