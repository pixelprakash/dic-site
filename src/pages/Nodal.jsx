import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { MARQUEE_IMAGES } from '../data/siteData';
import '../styles/Nodal.css';
import {
  NODAL_SEALS,
  MINISTRY_LINE,
  PILLARS,
  HUB_SPOKE,
  PROGRAMME_PARTNERS,
  CENTRES,
  ROLE_LABEL,
  NODAL_ROLE_FILTERS,
  EVENTS,
  WHO_CAN_JOIN,
} from '../data/nodalData';

const EVENT_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

const HS_ICONS = {
  hub: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  spoke: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2.4" />
      <circle cx="5" cy="19" r="2.4" />
      <circle cx="19" cy="19" r="2.4" />
      <path d="M12 7.4V13M9.9 17.4 12 13l2.1 4.4" />
    </svg>
  ),
  nodal: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="7" r="2.6" />
      <circle cx="18" cy="7" r="2.6" />
      <circle cx="12" cy="18" r="2.6" />
      <path d="M8.2 8.4 10 15.6M15.8 8.4 14 15.6M8.6 7h6.8" />
    </svg>
  ),
};

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function eventDateParts(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
  };
}

function initials(name) {
  const words = name.replace(/[().]/g, '').split(' ').filter(Boolean);
  const significant = words.filter((w) => !/^(of|and|the|for|&)$/i.test(w));
  const picked = significant.length >= 2 ? [significant[0], significant[significant.length - 1]] : significant;
  return picked.map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

// Parked, not deleted: the full national-network page below (NodalFull) is
// intact and unused while the site shows an "under construction" notice
// instead. To restore it, change the default export at the bottom of this
// file back to NodalFull.
function NodalFull() {
  const [missionRef, missionVis] = useReveal();
  const [networkRef, networkVis] = useReveal();
  const [dirRef, dirVis] = useReveal();
  const [evtRef, evtVis] = useReveal();
  const [leadRef, leadVis] = useReveal();
  const [joinRef, joinVis] = useReveal();

  const [centreQuery, setCentreQuery] = useState('');
  const [centreFilter, setCentreFilter] = useState('all');
  const [eventQuery, setEventQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');

  const filteredCentres = useMemo(() => {
    const q = centreQuery.trim().toLowerCase();
    return CENTRES.filter((c) => {
      const roleOk =
        centreFilter === 'all'
          ? true
          : centreFilter === 'hub'
          ? c.role === 'hub' || c.role === 'nodal'
          : c.role === centreFilter;
      const text = `${c.name} ${c.note} ${c.loc} ${ROLE_LABEL[c.role]}`.toLowerCase();
      return roleOk && (q === '' || text.includes(q));
    });
  }, [centreQuery, centreFilter]);

  const filteredEvents = useMemo(() => {
    const q = eventQuery.trim().toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return EVENTS.map((e) => ({
      ...e,
      upcoming: new Date(`${e.end || e.date}T00:00:00`) >= today,
    }))
      .filter((e) => {
        const fOk = eventFilter === 'all' ? true : eventFilter === 'upcoming' ? e.upcoming : !e.upcoming;
        const text = `${e.title} ${e.host} ${e.city}`.toLowerCase();
        return fOk && (q === '' || text.includes(q));
      })
      .sort((a, b) =>
        a.upcoming === b.upcoming
          ? (new Date(a.date) - new Date(b.date)) * (a.upcoming ? 1 : -1)
          : a.upcoming
          ? -1
          : 1,
      );
  }, [eventQuery, eventFilter]);

  return (
    <>
      <div className="page-header nodal-header">
        <div className="nodal-header__bg" style={{ backgroundImage: 'url(/images/image103.jpeg)' }} aria-hidden="true" />
        <div className="page-header__accent" />
        <p className="section-label" style={{ color: 'var(--color-terracotta-light)' }}>
          Ministry of Education · National Initiative for Design Innovation
        </p>
        <h1>The national node for design-led innovation in India.</h1>
        <p>
          The Design Innovation Centre at IIT Hyderabad is a Hub &amp; Nodal centre convening a
          country-wide network of Design Innovation Centres — bringing designers, engineers,
          industry and government together to solve real problems. Network programmes and
          capacity building are delivered in partnership with the{' '}
          <a href="https://hcd.institute" rel="noopener noreferrer" style={{ color: 'var(--color-terracotta-light)' }}>
            HCD Institute
          </a>
          .
        </p>
        <div className="nodal-seals">
          {NODAL_SEALS.map((s) => (
            <div className="nodal-seal" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="nodal-ministry">
        <div className="nodal-ministry__inner">
          <strong>Under the aegis of</strong>
          {MINISTRY_LINE.map((line) => (
            <span key={line} className="nodal-ministry__item">
              <span className="nodal-dot" aria-hidden="true" />
              {line}
            </span>
          ))}
        </div>
      </div>

      {/* Image marquee — life across the network */}
      <section className="marquee nodal-marquee" aria-label="The DIC network in pictures">
        <p className="section-label nodal-marquee__label">Across the campuses</p>
        <div className="marquee__track">
          {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" />
          ))}
        </div>
      </section>

      {/* Mission, vision & Viksit Bharat pillars */}
      <section className={`about nodal-mission reveal ${missionVis ? 'visible' : ''}`} ref={missionRef}>
        <div className="about__grid">
          <div>
            <p className="section-label">Mission &amp; Vision</p>
            <h2 className="section-title">Design as a force multiplier for a Viksit Bharat.</h2>
            <p>
              Design-centred innovation helps the country move up the value chain and makes
              Indian enterprise globally competitive. The DIC network exists to build that
              capability at scale — embedding design research, creative problem-solving and
              entrepreneurship inside institutions that would not otherwise have access to it.
            </p>
            <p>
              Our work is aligned to the national vision of <strong>Viksit Bharat 2047</strong>: a
              developed, self-reliant India by the centenary of independence, powered by
              innovation, skilling and inclusive growth. We advance this by turning design
              capability into public value — and by democratising human-centred design far
              beyond traditional design schools, in step with the{' '}
              <a href="https://hcd.institute" rel="noopener noreferrer">
                human-centred design programmes
              </a>{' '}
              of the HCD Institute.
            </p>
          </div>
          <div>
            <div className="nodal-vv">
              <h3>Mission</h3>
              <p>
                Promote and enhance interdisciplinary, design-focused innovation and creative
                problem-solving across the full value chain — from process to product — through
                education, research and projects that serve society.
              </p>
            </div>
            <div className="nodal-vv">
              <h3>Vision</h3>
              <p>
                A national design-innovation ecosystem where academia, industry, government and
                communities collaborate to raise living standards and build a self-reliant,
                globally competitive India.
              </p>
            </div>
            <div className="nodal-pillars">
              <p className="nodal-pillars__label">Aligned to the four pillars of Viksit Bharat</p>
              {PILLARS.map((p) => (
                <div className="nodal-pillar-row" key={p.name}>
                  <b>{p.name}</b>
                  <span>{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hub & spoke model */}
      <section className={`nodal-network reveal ${networkVis ? 'visible' : ''}`} ref={networkRef}>
        <p className="section-label">The National Network</p>
        <h2 className="section-title">One network. A hub-and-spoke model.</h2>
        <p>
          The National Initiative for Design Innovation established twenty Design Innovation
          Centres, one Open Design School and a National Design Innovation Network — connecting
          IITs, NITs, IIITs, IISc and central &amp; state universities into a single
          design-innovation grid.
        </p>
        <div className="nodal-hs-grid reveal-stagger visible">
          {HUB_SPOKE.map((card) => (
            <div className="nodal-hs-card" key={card.no} style={{ background: card.accent }}>
              <div className="nodal-hs-card__top">
                <span className="nodal-hs-card__icon">{HS_ICONS[card.icon]}</span>
                <span className="nodal-hs-card__no">{card.no}</span>
              </div>
              <span className="nodal-hs-card__tag">{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="nodal-partners">
          <p className="nodal-partners__label">Convened under</p>
          <div className="nodal-partners__grid">
            {PROGRAMME_PARTNERS.map((p) => (
              <span className="nodal-partner-tile" key={p}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Register of centres */}
      <section
        className={`nodal-directory reveal ${dirVis ? 'visible' : ''}`}
        ref={dirRef}
        id="centres"
      >
        <p className="section-label">Register of Centres</p>
        <h2 className="section-title">Design Innovation Centres across India.</h2>
        <p>
          A living directory of centres in the network. Search by institution or city, or filter
          by role. New centres are added as the register is verified.
        </p>

        <div className="nodal-toolbar">
          <label className="nodal-search">
            <span className="sr-only">Search centres</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search institution, city or state…"
              autoComplete="off"
              value={centreQuery}
              onChange={(e) => setCentreQuery(e.target.value)}
            />
          </label>
          <div className="nodal-chips" role="group" aria-label="Filter centres by role">
            {NODAL_ROLE_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className="nodal-chip"
                aria-pressed={centreFilter === f.key}
                onClick={() => setCentreFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <p className="nodal-count">
          <span>{filteredCentres.length}</span> centres listed
        </p>

        <div className="nodal-register">
          <div className="nodal-register__head" aria-hidden="true">
            <div>Institution</div>
            <div>Location</div>
            <div>Role</div>
          </div>
          {filteredCentres.length > 0 ? (
            filteredCentres.map((c) => (
              <div className={`nodal-register__row nodal-register__row--${c.role}`} key={c.code}>
                <div className="nodal-register__id">
                  <span className={`nodal-avatar nodal-avatar--${c.role}`} aria-hidden="true">
                    {initials(c.name)}
                  </span>
                  <div className="nodal-register__name">
                    {c.name}
                    <small>
                      <span className="nodal-register__code">{c.code}</span> · {c.note}
                    </small>
                  </div>
                </div>
                <div className="nodal-register__loc">{c.loc}</div>
                <div className="nodal-register__role">
                  <span className={`nodal-role nodal-role--${c.role}`}>{ROLE_LABEL[c.role]}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="nodal-empty">No centres match your search.</div>
          )}
        </div>
      </section>

      {/* Events across the network */}
      <section
        className={`nodal-events reveal ${evtVis ? 'visible' : ''}`}
        ref={evtRef}
        id="events"
      >
        <p className="section-label">Across the Network</p>
        <h2 className="section-title">Events, summits &amp; workshops.</h2>
        <p>
          What&rsquo;s happening at Design Innovation Centres nationwide. Search the board or
          switch between upcoming and past programmes.
        </p>

        <div className="nodal-toolbar">
          <label className="nodal-search">
            <span className="sr-only">Search events</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search event, host or city…"
              autoComplete="off"
              value={eventQuery}
              onChange={(e) => setEventQuery(e.target.value)}
            />
          </label>
          <div className="nodal-chips" role="group" aria-label="Filter events">
            {EVENT_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className="nodal-chip"
                aria-pressed={eventFilter === f.key}
                onClick={() => setEventFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <p className="nodal-count">
          <span>{filteredEvents.length}</span> events
        </p>

        <div className="nodal-events__grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((e) => {
              const range = e.end && e.end !== e.date ? `${formatDate(e.date)} – ${formatDate(e.end)}` : formatDate(e.date);
              const parts = eventDateParts(e.date);
              return (
                <article className={`nodal-evt ${e.upcoming ? 'nodal-evt--up' : ''}`} key={e.title}>
                  <div className="nodal-evt__datebox" aria-hidden="true">
                    <b>{parts.day}</b>
                    <span>{parts.month}</span>
                  </div>
                  <div className="nodal-evt__body">
                    <div className="nodal-evt__top">
                      <span className="nodal-evt__date">{range}</span>
                      <span className={`nodal-tag ${e.upcoming ? 'nodal-tag--up' : 'nodal-tag--past'}`}>
                        {e.upcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                    <h3>{e.title}</h3>
                    <div className="nodal-evt__meta">
                      <b>{e.host}</b> · {e.city}
                    </div>
                    <p>{e.desc}</p>
                    {e.link && (
                      <a className="nodal-evt__link" href={e.link} rel="noopener noreferrer">
                        {e.linkText || 'Learn more'}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </a>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="nodal-empty">No events match your search.</div>
          )}
        </div>
      </section>

      {/* Leadership */}
      <section className={`nodal-lead reveal ${leadVis ? 'visible' : ''}`} ref={leadRef}>
        <div className="nodal-lead__grid">
          <div className="nodal-lead__portrait" aria-hidden="true">DJM</div>
          <div>
            <p className="section-label" style={{ color: 'var(--color-terracotta-light)' }}>
              Leadership
            </p>
            <h2 className="section-title">Dr. Deepak John Mathew</h2>
            <p className="nodal-lead__role">
              Principal Design Investigator, DIC · Professor &amp; Head, Department of Design,
              IIT Hyderabad
            </p>
            <p>
              Dr. Mathew leads the Design Innovation Centre as its Principal Investigator and
              heads the Department of Design at IIT Hyderabad. His work spans digital heritage
              preservation, immersive technologies (AR/VR), autonomous and urban air mobility,
              photography and design education — bridging design and technology to address
              real-world challenges. Formerly Head of Photography Design at NID, he was
              instrumental in building design education at IIT Hyderabad.
            </p>
            <a className="pill-cta" href="https://deepakjohnmathew.net" rel="noopener noreferrer">
              Visit Dr. Mathew&rsquo;s site
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Join the network */}
      <section className={`nodal-join reveal ${joinVis ? 'visible' : ''}`} ref={joinRef}>
        <p className="section-label" style={{ textAlign: 'center' }}>
          Join the network
        </p>
        <h2>Bring your institution into the DIC network.</h2>
        <p>
          We invite government departments, universities, PSUs, research bodies and industry
          partners to join the network — as spokes, programme partners or collaborators on
          national-priority challenges. Network onboarding and programmes are coordinated through
          the{' '}
          <a href="https://hcd.institute" rel="noopener noreferrer">
            HCD Institute
          </a>
          .
        </p>
        <div className="nodal-join__actions">
          <a
            className="pill-cta"
            href="mailto:dic@hcd.institute?subject=Joining%20the%20DIC%20network"
          >
            Express interest — dic@hcd.institute
          </a>
          <a className="nodal-join__ghost" href="https://hcd.institute" rel="noopener noreferrer">
            Explore partner programmes
          </a>
        </div>
        <div className="nodal-join__who">
          {WHO_CAN_JOIN.map((who) => (
            <span className="nodal-who" key={who}>{who}</span>
          ))}
        </div>
      </section>
    </>
  );
}

export default function Nodal() {
  return (
    <div className="page-header" style={{ textAlign: 'center' }}>
      <div className="page-header__accent" />
      <p className="section-label" style={{ color: 'var(--color-terracotta-light)', justifyContent: 'center' }}>
        DIC Nodal
      </p>
      <h1 style={{ margin: '0 auto', maxWidth: '18ch' }}>Under construction.</h1>
      <p style={{ margin: '16px auto 0' }}>
        We&rsquo;re rebuilding the national network page. Check back soon — meanwhile, explore{' '}
        <Link to="/" style={{ color: 'var(--color-terracotta-light)', textDecoration: 'underline' }}>
          DIC · IITH
        </Link>
        .
      </p>
    </div>
  );
}
