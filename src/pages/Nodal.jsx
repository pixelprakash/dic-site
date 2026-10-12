import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { MARQUEE_IMAGES, ABOUT_STACK_IMAGES } from '../data/siteData';
import { useNodalEvents, useNodalCentres } from '../lib/cms';
import '../styles/Nodal.css';
import {
  NODAL_SEALS,
  MINISTRY_LINE,
  PILLARS,
  HUB_SPOKE,
  PROGRAMME_PARTNERS,
  ROLE_LABEL,
  NODAL_ROLE_FILTERS,
  WHO_CAN_JOIN,
  NODAL_HERO,
  NODAL_ABOUT,
  HUB_VS_SPOKE,
  NODAL_PI,
  NODAL_TIMELINE,
  NODAL_APPLY,
  NODAL_SOURCES,
  SPOKE_TOTAL,
} from '../data/nodalData';

// Three headline figures for the hero; the fuller set (NODAL_SEALS) sits
// in the About section below.
const HERO_METRICS = [
  { value: '20', label: 'DIC hubs' },
  { value: '64', label: 'Spoke institutions' },
  { value: '2014', label: 'NIDI launched' },
];

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

// New page structure, built section by section per direct spec rather than
// reusing NodalFull's layout (a different design entirely — mission/vision,
// hub-spoke, directory, leadership — kept parked below, untouched, in case
// any of it gets folded back in later).
//
// Hero: left column is a lead paragraph over three metric blocks; right
// column is a 2×2 image grid (reusing ABOUT_STACK_IMAGES — the same four
// real project photos already used for this exact grid on the parked
// Home.jsx About section, rather than stock/placeholder images).
function NodalHero() {
  return (
    <section className="nodal2-hero">
      <div className="nodal2-hero__bg" aria-hidden="true" />
      <div className="nodal2-hero__inner">
        <div className="nodal2-hero__left">
          <p className="section-label" style={{ color: 'var(--color-terracotta-light)' }}>
            {NODAL_HERO.eyebrow}
          </p>
          <h1>{NODAL_HERO.title}</h1>
          <p className="nodal2-hero__para">{NODAL_HERO.lede}</p>
          <div className="nodal2-hero__ctas">
            <a className="nodal2-btn nodal2-btn--primary" href="#apply">Apply to become a node</a>
            <a className="nodal2-btn" href="#network">See the network</a>
          </div>
          <div className="nodal2-metrics">
            {HERO_METRICS.map((m) => (
              <div className="nodal2-metric" key={m.label}>
                <b>{m.value}</b>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="nodal2-hero__right">
          {ABOUT_STACK_IMAGES.map((img) => (
            <div className="nodal2-hero__image" key={img.src}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Upcoming events — full-width rows stacked one after another (not the
// grid-of-cards NodalFull used for the same EVENTS data).
function UpcomingEventsSection() {
  const { events: EVENTS } = useNodalEvents();
  return (
    <section className="nodal2-events">
      <p className="section-label">Upcoming</p>
      <h2 className="section-title">Events across the network</h2>
      <div className="nodal2-events__list">
        {EVENTS.map((e) => {
          const parts = eventDateParts(e.date);
          const range =
            e.end && e.end !== e.date ? `${formatDate(e.date)} – ${formatDate(e.end)}` : formatDate(e.date);
          return (
            <article className="nodal2-events__row" key={e.title}>
              <div className="nodal2-events__date" aria-hidden="true">
                <b>{parts.day}</b>
                <span>{parts.month}</span>
              </div>
              <div className="nodal2-events__body">
                <h3>{e.title}</h3>
                <p className="nodal2-events__meta">
                  {range} · {e.host} · {e.city}
                </p>
                <p className="nodal2-events__desc">{e.desc}</p>
              </div>
              {e.link ? (
                <a className="nodal2-events__link" href={e.link} rel="noopener noreferrer">
                  {e.linkText || 'Details'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <span className="nodal2-events__link nodal2-events__link--muted">Details soon</span>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

// Research / Outreach / Education — no layout spec yet beyond "a section
// named X goes here", so these are honest placeholders (heading + note)
// rather than guessed-at content, ready to fill in next.
function NodalPlaceholderSection({ id, eyebrow, title, note }) {
  return (
    <section className="nodal2-placeholder" id={id}>
      <p className="section-label">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <p className="nodal2-placeholder__note">{note}</p>
    </section>
  );
}

// ── What is DIC ──────────────────────────────────────────────────────────
function NodalAbout() {
  return (
    <section className="nodal2-section" id="about">
      <div className="nodal2-split">
        <div className="nodal2-split__head">
          <p className="section-label">What is DIC</p>
          <h2 className="section-title">A national initiative for design innovation</h2>
        </div>
        <div className="nodal2-split__body">
          {NODAL_ABOUT.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <div className="nodal2-objectives">
            {NODAL_ABOUT.objectives.map((o) => (
              <div key={o.title}>
                <b>{o.title}</b>
                {o.text}
              </div>
            ))}
          </div>
          <ul className="nodal2-pills" aria-label="NIDI components">
            {NODAL_ABOUT.components.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="nodal2-stats">
        {NODAL_SEALS.map((x) => (
          <div className="nodal2-stat" key={x.label}>
            <b>{x.value}</b>
            <span>{x.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Hub and spokes ───────────────────────────────────────────────────────
function HubSpokeDiagram() {
  return (
    <svg className="nodal2-diagram" viewBox="0 0 760 210" role="img" aria-label="Hub and spoke: IIT Hyderabad hub connected to spokes and nodes, linked to industry, government and startups">
      <g className="nodal2-diagram__lines">
        <path d="M380 105 L150 50" /><path d="M380 105 L150 160" /><path d="M380 105 L610 50" /><path d="M380 105 L610 160" />
        <path d="M380 105 L380 20" strokeDasharray="4 4" /><path d="M380 105 L380 190" strokeDasharray="4 4" />
      </g>
      <circle className="nodal2-diagram__hub" cx="380" cy="105" r="44" />
      <text className="nodal2-diagram__mono" x="380" y="101" textAnchor="middle">DIC HUB</text>
      <text className="nodal2-diagram__label nodal2-diagram__label--muted" x="380" y="118" textAnchor="middle">IIT Hyderabad</text>
      <g className="nodal2-diagram__label">
        <circle className="nodal2-diagram__node" cx="150" cy="50" r="7" /><text x="138" y="54" textAnchor="end">IIIT Hyderabad · spoke</text>
        <circle className="nodal2-diagram__node" cx="150" cy="160" r="7" /><text x="138" y="164" textAnchor="end">Colleges &amp; universities</text>
        <circle className="nodal2-diagram__node" cx="610" cy="50" r="7" /><text x="622" y="54">Schools · HCD Labs</text>
        <circle className="nodal2-diagram__node" cx="610" cy="160" r="7" /><text x="622" y="164">Design institutes</text>
      </g>
      <g className="nodal2-diagram__mono nodal2-diagram__label--muted" textAnchor="middle">
        <text x="380" y="14">INDUSTRY · GOVERNMENT</text>
        <text x="380" y="206">INCUBATION · STARTUPS</text>
      </g>
    </svg>
  );
}

function NodalHubSpoke() {
  return (
    <section className="nodal2-section" id="hub">
      <div className="nodal2-split">
        <div className="nodal2-split__head">
          <p className="section-label">What is a hub</p>
          <h2 className="section-title">One mentor institution, many partners</h2>
          <p className="nodal2-muted">
            DICs run on a hub-and-spoke model. The hub leads and mentors. Spokes bring their own
            regional problems, people and strengths.
          </p>
        </div>
        <div className="nodal2-split__body">
          <div className="nodal2-hubrow">
            {HUB_VS_SPOKE.map((c) => (
              <div className="nodal2-card" key={c.kind}>
                <span className={`nodal2-tag nodal2-tag--${c.kind}`}>{c.tag}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
          <div className="nodal2-diagram-wrap">
            <HubSpokeDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Principal Investigator + milestones ──────────────────────────────────
function NodalLeadership() {
  return (
    <section className="nodal2-section" id="pi">
      <p className="section-label">Principal Investigator</p>
      <div className="nodal2-pi">
        <Link className="nodal2-pi__photo" to={`/people/${NODAL_PI.slug}`} aria-label={`${NODAL_PI.name}'s profile`}>
          <img src={NODAL_PI.photo} alt={NODAL_PI.name} loading="lazy" />
        </Link>
        <div>
          <h3 className="nodal2-pi__name">
            <Link to={`/people/${NODAL_PI.slug}`}>{NODAL_PI.name}</Link>
          </h3>
          <p className="nodal2-pi__role">{NODAL_PI.role}</p>
          <ul className="nodal2-cv">
            {NODAL_PI.facts.map((f) => (
              <li key={f.label}>
                <span>{f.label}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
          <blockquote className="nodal2-quote">{NODAL_PI.quote}</blockquote>
        </div>
      </div>
      <ol className="nodal2-timeline" aria-label="Milestones">
        {NODAL_TIMELINE.map((t) => (
          <li key={t.when + t.text}>
            <b>{t.when}</b>
            {t.text}
          </li>
        ))}
      </ol>
    </section>
  );
}

// ── The network directory ────────────────────────────────────────────────
function NodalNetwork() {
  const { centres } = useNodalCentres();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return centres.filter((c) => {
      const roleOk =
        filter === 'all' ? true : filter === 'hub' ? c.role === 'hub' || c.role === 'nodal' : c.role === filter;
      return roleOk && (!q || `${c.name} ${c.loc} ${c.note}`.toLowerCase().includes(q));
    });
  }, [centres, filter, query]);

  const hubCount = centres.filter((c) => c.role === 'hub' || c.role === 'nodal').length;
  const spokeCount = centres.filter((c) => c.role === 'spoke').length;

  return (
    <section className="nodal2-section" id="network">
      <div className="nodal2-dir-top">
        <div>
          <p className="section-label">The network</p>
          <h2 className="section-title">80+ DIC nodes across India</h2>
        </div>
        <div className="nodal2-dir-controls">
          <div className="nodal2-filters" role="group" aria-label="Filter nodes">
            {[{ key: 'all', label: 'All' }, { key: 'hub', label: 'Hubs' }, { key: 'spoke', label: 'Spokes' }].map((f) => (
              <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <input
            className="nodal2-search"
            type="search"
            placeholder="Search institution or state"
            aria-label="Search nodes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {shown.length > 0 ? (
        <ol className="nodal2-ledger">
          {shown.map((c, i) => (
            <li className={`nodal2-row${c.role === 'nodal' ? ' nodal2-row--self' : ''}`} key={c.code}>
              <span className="nodal2-row__n">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <b>{c.name}</b>
                <small>
                  <i className={c.role === 'spoke' ? 'is-spoke' : 'is-hub'}>{c.role === 'spoke' ? 'spoke' : 'hub'}</i>
                  {c.loc}
                  {c.note && c.role !== 'nodal' ? ` · ${c.note}` : ''}
                </small>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="nodal2-muted">No institutions match that search.</p>
      )}
      <p className="nodal2-dir-note" role="status">
        Showing {shown.length} of {centres.length} listed nodes. All {hubCount} hubs are listed; {spokeCount} of{' '}
        {SPOKE_TOTAL} spokes are listed so far, and the directory is being completed with each hub.
      </p>
    </section>
  );
}

// ── Apply to become a node ───────────────────────────────────────────────
// Email, not a form: there is no inbox wired to a form on this site, and a
// form that says "submitted" with nowhere to go would be worse than a
// plain, working mailto.
function NodalApply() {
  const subject = encodeURIComponent('DIC node application');
  const body = encodeURIComponent(
    `Institution name and type:\nCity and state:\nContact person and role:\nEmail and phone:\nWhat our node would work on:\n`,
  );
  return (
    <section className="nodal2-apply" id="apply">
      <div className="nodal2-apply__inner">
        <div className="nodal2-split">
          <div className="nodal2-split__head">
            <p className="section-label" style={{ color: 'var(--color-terracotta-light)' }}>Apply to become a node</p>
            <h2 className="section-title">{NODAL_APPLY.title}</h2>
            <p className="nodal2-apply__intro">{NODAL_APPLY.intro}</p>
          </div>
          <div className="nodal2-split__body">
            <div className="nodal2-benefits">
              {NODAL_APPLY.benefits.map((b) => (
                <div key={b.title}>
                  <b>{b.title}</b>
                  {b.text}
                </div>
              ))}
            </div>
            <ol className="nodal2-steps">
              {NODAL_APPLY.steps.map((st) => (
                <li key={st.title}>
                  <b>{st.title}</b>
                  {st.text}
                </li>
              ))}
            </ol>
            <div className="nodal2-apply__cta">
              <div>
                <p className="nodal2-apply__include-title">In your email, include</p>
                <ul>
                  {NODAL_APPLY.include.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <a className="nodal2-btn nodal2-btn--primary" href={`mailto:${NODAL_APPLY.email}?subject=${subject}&body=${body}`}>
                Email {NODAL_APPLY.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NodalSources() {
  return (
    <section className="nodal2-sources" aria-label="Sources">
      <p>Sources</p>
      <ol>
        {NODAL_SOURCES.map((x) => (
          <li key={x.href}>
            <a href={x.href} target="_blank" rel="noopener noreferrer">{x.label}</a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function NodalNew() {
  return (
    <>
      <NodalHero />
      <NodalAbout />
      <NodalHubSpoke />
      <UpcomingEventsSection />
      <NodalLeadership />
      <NodalNetwork />
      <NodalApply />
      <NodalPlaceholderSection
        id="research"
        eyebrow="Research"
        title="Research across the network"
        note="Structure pending — say what should go in this section and I'll build it next."
      />
      <NodalPlaceholderSection
        id="outreach"
        eyebrow="Outreach"
        title="Outreach & impact"
        note="Structure pending — say what should go in this section and I'll build it next."
      />
      <NodalPlaceholderSection
        id="education"
        eyebrow="Education"
        title="Education & capacity building"
        note="Structure pending — say what should go in this section and I'll build it next."
      />
      <NodalSources />
    </>
  );
}

// Parked, not deleted: the full national-network page below (NodalFull) is
// a different design entirely — kept intact and unused while the page is
// rebuilt section by section above.
function NodalFull() {
  const [missionRef, missionVis] = useReveal();
  const [networkRef, networkVis] = useReveal();
  const [dirRef, dirVis] = useReveal();
  const [evtRef, evtVis] = useReveal();
  const [leadRef, leadVis] = useReveal();
  const [joinRef, joinVis] = useReveal();

  const { events: EVENTS } = useNodalEvents();
  const { centres: CENTRES } = useNodalCentres();
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
  }, [CENTRES, centreQuery, centreFilter]);

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
  }, [EVENTS, eventQuery, eventFilter]);

  return (
    <>
      <div className="page-header nodal-header">
        <div className="nodal-header__bg" style={{ backgroundImage: 'url(/images/image103.webp)' }} aria-hidden="true" />
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
  return <NodalNew />;
}

// Parked, not deleted: the plain "under construction" notice this page
// showed before NodalNew existed.
// function NodalUnderConstruction() {
//   return (
//     <div className="page-header" style={{ textAlign: 'center' }}>
//       <div className="page-header__accent" />
//       <h1 style={{ margin: '0 auto', maxWidth: '18ch' }}>Under construction</h1>
//       <p style={{ margin: '16px auto 0' }}>
//         This page is being rebuilt. In the meantime, see{' '}
//         <Link to="/" style={{ color: 'var(--color-terracotta-light)', textDecoration: 'underline' }}>
//           DIC · IITH
//         </Link>
//         .
//       </p>
//     </div>
//   );
// }
