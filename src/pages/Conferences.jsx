import { Link } from 'react-router-dom';
import { CONFERENCES } from '../data/conferencesData';
import '../styles/Conferences.css';

export default function Conferences() {
  return (
    <>
      <div className="page-header">
        <div className="page-header__accent" />
        <h1>DIC Hosted Conferences</h1>
        <p>National and international conferences organised by the Design Innovation Centre.</p>
      </div>

      <section className="conferences-list">
        {CONFERENCES.map((c) =>
          c.internal ? (
            <Link className="conference-card" to={c.path} key={c.id}>
              <h3>{c.title}</h3>
              <p>{c.tagline}</p>
              <span className="conference-card__cta">
                View conference
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ) : (
            <a className="conference-card" href={c.path} target="_blank" rel="noopener noreferrer" key={c.id}>
              <h3>{c.title}</h3>
              <p>{c.tagline}</p>
              <span className="conference-card__cta">
                Visit website
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </a>
          )
        )}
      </section>
    </>
  );
}
