import { Link } from 'react-router-dom';
import { Deadline, Cta } from './NewsBits';
import { useFeed } from '../lib/cms';
import { fmtDate, newsPath, isOpen } from '../lib/news';
import '../styles/News.css';

// One lead story, then a short list. Everything else is on /news.
const LIST = 3;

/* News, updates and announcements — admissions windows, openings, awards,
   talks — on the home page under the hero. The pinned (else newest) update
   leads; the next few follow as compact rows. Anything whose "closes on"
   date has passed drops off here (it stays on /news, marked Closed).
   Entries are "News, update or announcement" documents in Sanity (see
   /studio). Nothing published, nothing shown. */
export default function NewsSection() {
  const { data: feed } = useFeed();
  const open = feed.filter(isOpen);
  if (!open.length) return null;

  const [lead, ...rest] = open;
  const rows = rest.slice(0, LIST);
  const cover = lead.images[0];

  return (
    <section className="ns" aria-labelledby="ns-heading">
      <div className="ns-head">
        <div>
          <h2 className="ns-heading" id="ns-heading">News &amp; Updates</h2>
          <p className="ns-sub">Announcements, admissions, openings, talks, and recent work.</p>
        </div>
        <Link className="ns-follow" to="/news">
          All news <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className={`ns-layout${rows.length ? '' : ' ns-layout--solo'}`}>
        <article className="ns-lead">
          {cover && (
            <Link
              className="ns-lead-media"
              to={newsPath(lead)}
              tabIndex={-1}
              aria-hidden="true"
              style={{ '--ns-fill': `url("${cover.thumb}")` }}
            >
              <img
                src={cover.src}
                srcSet={cover.srcSet}
                sizes={rows.length ? '(min-width: 1000px) 55vw, 100vw' : '(min-width: 1000px) 60vw, 100vw'}
                alt=""
                decoding="async"
              />
            </Link>
          )}
          <div className="ns-lead-body">
            <div className="ns-meta">
              {lead.pinned && <span className="ns-pin">Pinned</span>}
              {lead.topic && <span className="ns-topic">{lead.topic}</span>}
              <time className="ns-date" dateTime={lead.date}>{fmtDate(lead.date)}</time>
              <Deadline closesOn={lead.closesOn} />
            </div>
            <h3 className="ns-lead-title">
              <Link to={newsPath(lead)}>{lead.title || lead.text.split('\n')[0]}</Link>
            </h3>
            <p className="ns-lead-text">{lead.text}</p>
            <div className="ns-lead-actions">
              <Cta cta={lead.cta} />
              <Link className="ns-details" to={newsPath(lead)}>
                Details<span className="sr-only"> of {lead.title || 'this update'}</span>{' '}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </article>

        {rows.length > 0 && (
          <ul className="ns-rows">
            {rows.map((p) => (
              <li className="ns-row" key={p.id}>
                <Link className="ns-row-link" to={newsPath(p)}>
                  {p.images[0] && (
                    <span
                      className="ns-row-thumb"
                      aria-hidden="true"
                      style={{ '--ns-fill': `url("${p.images[0].thumb}")` }}
                    >
                      <img src={p.images[0].thumb} alt="" loading="lazy" decoding="async" />
                    </span>
                  )}
                  <span className="ns-row-body">
                    <span className="ns-meta">
                      {p.topic && <span className="ns-topic">{p.topic}</span>}
                      <time className="ns-date" dateTime={p.date}>{fmtDate(p.date)}</time>
                    </span>
                    <span className="ns-row-title">{p.title || p.text.split('\n')[0]}</span>
                    <span className="ns-row-text">{p.text.replace(/\s+/g, ' ')}</span>
                    <Deadline closesOn={p.closesOn} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
