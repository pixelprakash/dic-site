import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HomeHero from '../components/HomeHero';
// First-visit intro — parked for now (components/Splash.jsx + styles/Splash.css are
// kept). Un-comment this import and the <Splash /> below to bring it back.
// import Splash from '../components/Splash';
import GondMuseumModal from '../components/GondMuseumModal';
import { useProjects, useFeed, useCollaborators } from '../lib/cms';
import { fmtDate, newsPath, isOpen } from '../lib/news';
import { useReveal } from '../hooks/useReveal';
import '../styles/HomeRedesign.css';

// Home page, option A — modelled on lfs.org.uk: a fixed full-viewport video
// hero, then a dark sheet that slides over it, built from full-width bands:
// a grey panel with a giant display heading and a draggable card carousel,
// a large spotlight image, a three-up news row, a red statement block and a
// grey logo panel. Every band pads with --page-gutter (the site's one margin
// system); the display type is --font-display (see variables.css).

const ChevronLeft = () => (
  <svg width="24" height="46" viewBox="0 0 24 46" fill="none" aria-hidden="true">
    <path d="M23.067 45.08L0.707031 22.71L23.067 0.349976" stroke="currentColor" strokeMiterlimit="10" />
  </svg>
);
const ChevronRight = () => (
  <svg width="24" height="46" viewBox="0 0 24 46" fill="none" aria-hidden="true">
    <path d="M0.353516 0.353516L22.7135 22.7135L0.353516 45.0735" stroke="currentColor" strokeMiterlimit="10" />
  </svg>
);

/* Projects — grey panel, giant heading, card carousel (scroll-snap, drag or arrows). */
function ProjectsPanel() {
  const { projects } = useProjects();
  const track = useRef(null);
  const [revealRef, shown] = useReveal();

  const page = (dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('.hx-card');
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (!projects.length) return null;

  return (
    <section className={`hx-panel reveal ${shown ? 'visible' : ''}`} ref={revealRef} aria-labelledby="hx-projects-heading">
      <div className="hx-panel__head">
        <h2 className="hx-display hx-display--red" id="hx-projects-heading">Projects</h2>
        <p className="hx-panel__sub">
          Interdisciplinary design research across cultural heritage, autonomous mobility,
          immersive education and sustainable innovation.
        </p>
        <div className="hx-panel__nav">
          <button type="button" className="hx-arrow" onClick={() => page(-1)} aria-label="Previous projects">
            <ChevronLeft />
          </button>
          <button type="button" className="hx-arrow" onClick={() => page(1)} aria-label="Next projects">
            <ChevronRight />
          </button>
        </div>
      </div>

      <ul className="hx-track" ref={track}>
        {projects.map((p) => (
          <li className="hx-card" key={p.slug}>
            <Link className="hx-card__link" to={`/projects/${p.slug}`}>
              {p.image ? (
                <img className="hx-card__img" src={p.image} alt="" loading="lazy" decoding="async" />
              ) : (
                <span className="hx-card__img hx-card__img--blank" aria-hidden="true" />
              )}
              <span className="hx-card__body">
                {p.domain && <span className="hx-chip">{p.domain}</span>}
                <span className="hx-card__title">{p.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Spotlight — one large image, one headline, one action. */
function Spotlight() {
  const [open, setOpen] = useState(false);
  return (
    <section className="hx-spot" id="home-gond" aria-labelledby="hx-spot-heading">
      <img
        className="hx-spot__img"
        src="/images/projects/telangana-heritage.webp"
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className="hx-spot__copy">
        <span className="hx-chip">Spotlight</span>
        <h2 className="hx-display" id="hx-spot-heading">Gond Virtual Museum</h2>
        <p className="hx-spot__text">
          A room of Gond folk art — tiger, horse, bird and dancer motifs — as a walkable 3D
          gallery, rebuilt from DIC&rsquo;s original Oculus experience for the browser. Look around
          on desktop, or use a headset for the full experience.
        </p>
        <button type="button" className="hx-btn" onClick={() => setOpen(true)}>
          Launch the experience <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      <GondMuseumModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}

/* News — three cards, newest (or pinned) first. */
function NewsRow() {
  const { data: feed } = useFeed();
  const [revealRef, shown] = useReveal();
  const items = feed.filter(isOpen).slice(0, 3);
  if (!items.length) return null;

  return (
    <section className={`hx-news reveal ${shown ? 'visible' : ''}`} ref={revealRef} aria-labelledby="hx-news-heading">
      <div className="hx-news__head">
        <h2 className="hx-display" id="hx-news-heading">News</h2>
        <Link className="hx-link" to="/news">All news <span aria-hidden="true">&rarr;</span></Link>
      </div>
      <ul className={`hx-news__grid${items.length === 1 ? ' hx-news__grid--solo' : ''}`}>
        {items.map((p) => {
          const img = p.images[0];
          const title = p.title || p.text.split('\n')[0];
          return (
            <li key={p.id}>
              <Link className="hx-news__card" to={newsPath(p)}>
                {img ? (
                  <img className="hx-news__img" src={img.thumb} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className="hx-news__img hx-news__img--blank" aria-hidden="true" />
                )}
                <span className="hx-news__tags">
                  <time className="hx-chip" dateTime={p.date}>{fmtDate(p.date)}</time>
                  {p.topic && <span className="hx-chip">{p.topic}</span>}
                </span>
                <span className="hx-news__title">{title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* Statement block — red, giant type, two destinations. */
function WhoWeAre() {
  const [revealRef, shown] = useReveal();
  return (
    <section className={`hx-who reveal ${shown ? 'visible' : ''}`} ref={revealRef} aria-labelledby="hx-who-heading">
      <h2 className="hx-display" id="hx-who-heading">Who we are</h2>
      <div className="hx-who__side">
        <p>
          The Design Innovation Centre at IIT Hyderabad is a research community of faculty, PhD
          scholars, alumni and project staff working on design for cultural heritage, mobility,
          learning and sustainability.
        </p>
        <div className="hx-who__actions">
          <Link className="hx-btn hx-btn--light" to="/about">About the Centre <span aria-hidden="true">&rarr;</span></Link>
          <Link className="hx-btn hx-btn--ghost" to="/people">Meet the team <span aria-hidden="true">&rarr;</span></Link>
          <Link className="hx-btn hx-btn--ghost" to="/contact">Get in touch <span aria-hidden="true">&rarr;</span></Link>
        </div>
      </div>
    </section>
  );
}

/* Collaborators — grey panel of logos. */
function Collaborators() {
  const collaborators = useCollaborators();
  const [revealRef, shown] = useReveal();
  if (!collaborators.length) return null;
  return (
    <section className={`hx-panel hx-panel--logos reveal ${shown ? 'visible' : ''}`} ref={revealRef} aria-labelledby="hx-collab-heading">
      <div className="hx-panel__head">
        <h2 className="hx-display hx-display--red" id="hx-collab-heading">Collaborators</h2>
      </div>
      <ul className="hx-logos">
        {collaborators.map((c) => (
          <li className="hx-logos__tile" key={c.id || c.name} title={c.name}>
            {c.logo ? <img src={c.logo} alt={c.name} loading="lazy" /> : <span>{c.name}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function HomeRedesign() {
  return (
    <>
      <HomeHero />
      {/* <Splash /> — parked, see the import note above */}
      <div className="home-sheet hx">
        <ProjectsPanel />
        <Spotlight />
        <NewsRow />
        <WhoWeAre />
        <Collaborators />
      </div>
    </>
  );
}
