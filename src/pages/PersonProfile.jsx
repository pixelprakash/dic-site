import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMemberBySlug, getMemberCategory } from '../data/peopleData';
import '../styles/PersonProfile.css';

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

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9s1.2-6.4 3.6-9Z" />
    </svg>
  );
}

export default function PersonProfile() {
  const { slug } = useParams();
  const member = getMemberBySlug(slug);
  const [imgError, setImgError] = useState(false);

  if (!member) {
    return (
      <div className="profile-missing">
        <ol className="profile__breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/people">People</Link></li>
          <li aria-current="page">Profile not found</li>
        </ol>
        <p className="section-label">Members of DIC</p>
        <h1>Profile not found</h1>
        <p>This member doesn&rsquo;t have a page yet, or the link is out of date.</p>
        <Link className="pill-cta" to="/people">
          Back to Members of DIC
        </Link>
      </div>
    );
  }

  const { name, role, joinedYear, fullBio, bio, tags = [], interests = [], photo, email, website, linkedin, scholar } = member;
  const showPhoto = Boolean(photo) && !imgError;
  const bioParagraphs = fullBio ? [].concat(fullBio) : [bio];
  const chips = interests.length > 0 ? interests : tags;
  const category = getMemberCategory(slug);

  return (
    <div className="profile">
      <ol className="profile__breadcrumb" aria-label="Breadcrumb">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/people">People</Link></li>
        {category && (
          <li><Link to={`/people#${category.id}`}>{category.label}</Link></li>
        )}
        <li aria-current="page">{name}</li>
      </ol>

      <div className="profile__grid">
        <div className="profile__body">
          <p className="profile__role">{role}</p>
          <h1 className="profile__name">{name}</h1>
          {bioParagraphs.map((p, i) => (
            <p className="profile__bio" key={i}>{p}</p>
          ))}

          {chips.length > 0 && (
            <div className="profile__tags">
              {chips.map((t) => (
                <span className="profile__tag" key={t}>{t}</span>
              ))}
            </div>
          )}

          {(linkedin || scholar || website || email) && (
            <div className="profile__socials">
              {linkedin && (
                <a className="profile__social" href={linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon />
                  LinkedIn
                </a>
              )}
              {scholar && (
                <a className="profile__social" href={scholar} target="_blank" rel="noopener noreferrer">
                  <ScholarIcon />
                  Google Scholar
                </a>
              )}
              {website && (
                <a className="profile__social" href={website} target="_blank" rel="noopener noreferrer">
                  <WebsiteIcon />
                  Website
                </a>
              )}
              {email && (
                <a className="profile__social" href={`mailto:${email}`}>
                  <MailIcon />
                  {email}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="profile__photo">
          {showPhoto ? (
            <img src={photo} alt={name} onError={() => setImgError(true)} />
          ) : (
            <div className="profile__fallback">
              <span>{initials(name)}</span>
            </div>
          )}
          {joinedYear && <span className="profile__joined">Joined {joinedYear}</span>}
        </div>
      </div>
    </div>
  );
}
