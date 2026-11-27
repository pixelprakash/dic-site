import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeHero from '../components/HomeHero';
import FilmSlider from '../components/FilmSlider';
// First-visit intro — parked for now (components/Splash.jsx + styles/Splash.css are
// kept). Un-comment this import and the <Splash /> below to bring it back.
// import Splash from '../components/Splash';
import GondMuseumModal from '../components/GondMuseumModal';
import { useFeed, useCollaborators, useTestimonials } from '../lib/cms';
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

/* Testimonials — a grey panel: giant heading, one large quote, the person beside it. */
function TestimonialsPanel() {
  const testimonials = useTestimonials();
  const [index, setIndex] = useState(0);
  const [revealRef, shown] = useReveal();
  if (!testimonials.length) return null;

  const last = testimonials.length - 1;
  const t = testimonials[Math.min(index, last)];
  const prev = () => setIndex((i) => (i === 0 ? last : i - 1));
  const next = () => setIndex((i) => (i === last ? 0 : i + 1));
  const initials = t.name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <section
      className={`hx-panel hx-panel--quote reveal ${shown ? 'visible' : ''}`}
      ref={revealRef}
      id="testimonials"
      aria-labelledby="hx-quote-heading"
    >
      <div className="hx-panel__head">
        <h2 className="hx-display hx-display--red" id="hx-quote-heading">Testimonials</h2>
        {testimonials.length > 1 && (
          <div className="hx-panel__nav">
            <button type="button" className="hx-arrow" onClick={prev} aria-label="Previous testimonial">
              <ChevronLeft />
            </button>
            <button type="button" className="hx-arrow" onClick={next} aria-label="Next testimonial">
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      <figure className="hx-quote" key={t.id}>
        <div className="hx-quote__main">
          <span className="hx-quote__mark" aria-hidden="true">&ldquo;</span>
          <blockquote className="hx-quote__text">
            {(Array.isArray(t.quote) ? t.quote : [t.quote]).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </blockquote>
          <figcaption className="hx-quote__by">
            <strong>{t.name}</strong>
            <span>{t.role}</span>
          </figcaption>
        </div>
        <div className="hx-quote__photo">
          {t.avatar ? (
            <img src={t.avatar} alt="" loading="lazy" decoding="async" />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
        </div>
      </figure>
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
        <FilmSlider />
        <WhoWeAre />
        <Spotlight />
        <NewsRow />
        <TestimonialsPanel />
        <Collaborators />
      </div>
    </>
  );
}
