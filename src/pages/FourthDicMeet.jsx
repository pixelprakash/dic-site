import { Link } from 'react-router-dom';
import '../styles/ConferenceDetail.css';

// Photos from the event were shared directly in chat rather than as
// files on disk, so there's nothing here yet to point an <img> at —
// this array is ready to take real paths (e.g.
// '/images/conferences/fourth-dic-meet/1.webp') the moment those exist;
// the gallery section below simply doesn't render while it's empty,
// rather than showing broken images.
const GALLERY = [];

const SPEAKERS = [
  { name: 'Mr. K. Sanjay Murthy', role: 'Secretary, Ministry of Education, Government of India', note: 'Chief Guest' },
  { name: 'Dr. B S Murthy', role: 'Director, IIT Hyderabad' },
  { name: 'Mr. BVR Mohan Reddy', role: 'Chairperson, Board of Governors, IIT Hyderabad' },
  { name: 'Prof. Deepak John Mathew', role: 'Principal Investigator, DIC, IIT Hyderabad' },
];

export default function FourthDicMeet() {
  return (
    <div className="conference-detail">
      <div className="page-header">
        <div className="page-header__accent" />
        <ol className="conference-detail__breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/conferences">DIC Hosted Conferences</Link></li>
          <li aria-current="page">Fourth All India DIC Meet</li>
        </ol>
        <div className="conference-detail__meta-row">
          <span className="conference-detail__status">2–3 May 2024</span>
          <span className="conference-detail__status">IIT Hyderabad</span>
        </div>
        <h1>Fourth All India Design Innovation Centre Meet</h1>
      </div>

      <section className="conference-detail__section">
        <h2 className="section-title">Overview</h2>
        <p className="conference-detail__body">
          The Fourth All India Design Innovation Centre Meet was hosted by IIT Hyderabad from
          2–3 May 2024. The two-day event showcased work from Design Innovation Centres across
          the country.
        </p>
        <p className="conference-detail__body">
          The Chief Guest of the event was Mr. K. Sanjay Murthy, Secretary, Ministry of Education,
          Government of India. Dr. B S Murthy (Director, IIT Hyderabad), Mr. BVR Mohan Reddy
          (Chairperson, Board of Governors, IIT Hyderabad), and Prof. Deepak John Mathew
          (Principal Investigator, DIC, IIT Hyderabad) also spoke at the occasion.
        </p>
      </section>

      <section className="conference-detail__section">
        <h2 className="section-title">Speakers</h2>
        <div className="conference-detail__speakers">
          {SPEAKERS.map((s) => (
            <div className="conference-detail__speaker" key={s.name}>
              {s.note && <span className="conference-detail__speaker-note">{s.note}</span>}
              <span className="conference-detail__speaker-name">{s.name}</span>
              <span className="conference-detail__speaker-role">{s.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="conference-detail__section">
        <h2 className="section-title">Event Highlights</h2>
        <div className="video-embed">
          <iframe
            src="https://www.youtube.com/embed/FBoarrQ3CT0"
            title="Fourth All India DIC Meet — Event Highlights"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>

      {GALLERY.length > 0 && (
        <section className="conference-detail__section">
          <h2 className="section-title">Gallery</h2>
          <div className="conference-detail__gallery">
            {GALLERY.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
