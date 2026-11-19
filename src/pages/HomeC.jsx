import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import GondMuseumModal from '../components/GondMuseumModal';
import { useProjects, useFeed, useCollaborators, useTestimonials } from '../lib/cms';
import { fmtDate, newsPath, isOpen } from '../lib/news';
import { useReveal } from '../hooks/useReveal';
import { responsive } from '../lib/img';
import '../styles/HomeC.css';

// Home page for Design 3 (after quakerschool.org): one photographic hero, a
// quiet statement, then pastel sheets that each say one thing — what the Centre
// is, what it does, what's new, the work, the museum, a voice, the partners,
// and a way to get in touch. One <h1>; every section is labelled by its own
// heading; every card is a single link with a descriptive name.

const WHAT_WE_DO = [
  { to: '/research', title: 'Research', text: 'Studies and publications on heritage, mobility and education.' },
  { to: '/projects', title: 'Projects', text: 'Products and programmes delivered with partners across India.' },
  { to: '/education', title: 'Education', text: 'Courses and workshops in design thinking and making.' },
  { to: '/practices', title: 'Practices', text: 'Design thinking taken from the campus into schools and colleges.' },
];

const CARD_TONES = ['butter', 'sage', 'coral'];

function Section({ className = '', labelledBy, id, children }) {
  const [ref, shown] = useReveal();
  return (
    <section id={id} className={`${className} reveal ${shown ? 'visible' : ''}`} ref={ref} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}

const HERO_FILM = '/videos/hero-c.mp4';
const HERO_POSTER = '/images/hero-c-poster.webp';

// The hero film plays silently on a loop. It starts paused for anyone who
// prefers reduced motion or has asked their browser to save data, stops by
// itself while off screen, and always has a visible pause/play control
// (WCAG 2.2.2). "Watch with full controls" opens the same film in a dialog.
function Hero() {
  const videoRef = useRef(null);
  const dialogRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [calm] = useState(() => {
    if (typeof window === 'undefined') return false;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData;
    return Boolean(reduce || saveData);
  });

  // Play when visible, pause when scrolled away or the tab is hidden.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    if (calm) {
      v.pause();
      return undefined;
    }
    let visible = true;
    const sync = () => {
      if (visible && !userPaused && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.15 })
      : null;
    io?.observe(v);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [calm, userPaused]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  const openFilm = () => {
    videoRef.current?.pause();
    dialogRef.current?.showModal();
  };
  const closeFilm = () => dialogRef.current?.close();
  const onFilmClosed = () => {
    dialogRef.current?.querySelector('video')?.pause();
    if (!calm && !userPaused) videoRef.current?.play().catch(() => {});
  };

  return (
    <section className="hc-hero" aria-labelledby="hc-title">
      <div className="hc-hero__head">
        <h1 id="hc-title">
          <span className="hc-hero__l1">Design Innovation</span>{' '}
          <span className="hc-hero__l2">Centre</span>
        </h1>
        <div className="hc-hero__side">
          <p className="hc-hero__lede">
            Interdisciplinary design research across cultural heritage, autonomous mobility,
            immersive education and sustainable innovation.
          </p>
          <div className="hc-hero__actions">
            <Link className="btn" to="/research">Explore our research</Link>
            <Link className="btn btn--ghost" to="/about">About the Centre</Link>
          </div>
        </div>
      </div>

      <div className="hc-film" role="group" aria-roledescription="film" aria-label="Film of the Centre's work" aria-describedby="hc-film-desc">
        <video
          ref={videoRef}
          className="hc-film__video"
          src={HERO_FILM}
          poster={HERO_POSTER}
          width="960"
          height="540"
          muted
          loop
          playsInline
          preload={calm ? 'none' : 'auto'}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-hidden="true"
          tabIndex={-1}
        />
        <p className="sr-only" id="hc-film-desc">
          A silent film with no spoken words: slow movements across photographs of the
          Centre&rsquo;s lab, its Gond heritage research and its community workshops.
        </p>
        <div className="hc-film__bar">
          <button type="button" className="hc-film__btn" onClick={toggle}>
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
            )}
            <span>{playing ? 'Pause film' : 'Play film'}</span>
          </button>
          <button type="button" className="hc-film__btn" onClick={openFilm}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            <span>Open full screen</span>
          </button>
        </div>
      </div>

      <dialog ref={dialogRef} className="hc-dialog" aria-label="Film of the Centre's work" onClose={onFilmClosed} onClick={(e) => { if (e.target === dialogRef.current) closeFilm(); }}>
        <button type="button" className="hc-dialog__close" onClick={closeFilm}>Close</button>
        <video src={HERO_FILM} poster={HERO_POSTER} controls loop playsInline preload="none" />
      </dialog>
    </section>
  );
}

function Statement() {
  return (
    <section className="hc-statement" id="hc-statement" aria-label="In brief">
      <p>
        Design research and teaching that bridge heritage, technology and social impact.
      </p>
    </section>
  );
}

function About() {
  return (
    <Section className="hc-sheet hc-sheet--butter" labelledBy="hc-about-h">
      <p className="hc-label">About the Centre</p>
      <h2 className="hc-title" id="hc-about-h">A design lab and a teaching space, in one place</h2>
      <div className="hc-split">
        <img
          className="hc-photo"
          {...responsive('/images/image68.webp')}
          sizes="(min-width: 900px) 46vw, 100vw"
          alt="Faculty, researchers and community members gathered for a group photograph at a DIC workshop."
          width="1600"
          height="1005"
          loading="lazy"
          decoding="async"
        />
        <div className="hc-prose">
          <p>
            The Design Innovation Centre is part of the Department of Design at IIT Hyderabad.
            Research projects and products sit on one side, courses and workshops on the other.
          </p>
          <p>
            Its lab, over 3,000 square feet of fabrication, mixed-reality, prototyping and
            preservation facilities, builds its projects in-house, from first prototype to
            full-scale exhibit.
          </p>
          <Link className="btn" to="/about">More about the Centre</Link>
        </div>
      </div>
    </Section>
  );
}

function WhatWeDo() {
  return (
    <Section className="hc-block" labelledBy="hc-do-h">
      <h2 className="hc-title hc-title--sm" id="hc-do-h">What we do</h2>
      <ul className="hc-columns">
        {WHAT_WE_DO.map((w) => (
          <li key={w.to}>
            <h3>
              <Link to={w.to}>{w.title}</Link>
            </h3>
            <p>{w.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function News() {
  const { data: feed } = useFeed();
  const items = feed.filter(isOpen).slice(0, 3);
  if (!items.length) return null;
  return (
    <Section className="hc-sheet hc-sheet--sage" labelledBy="hc-news-h">
      <div className="hc-head">
        <h2 className="hc-title" id="hc-news-h">News &amp; updates</h2>
        <Link className="hc-more" to="/news">All news</Link>
      </div>
      <ul className={`hc-news${items.length === 1 ? ' hc-news--solo' : ''}`}>
        {items.map((p) => {
          const img = p.images[0];
          const title = p.title || p.text.split('\n')[0];
          return (
            <li className="hc-news__card" key={p.id}>
              {img ? (
                <img src={img.thumb} srcSet={img.srcSet} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 46vw, 100vw" alt="" width="800" height="600" loading="lazy" decoding="async" />
              ) : (
                <span className="hc-news__blank" aria-hidden="true" />
              )}
              <div className="hc-news__body">
                <p className="hc-news__meta">
                  <time dateTime={p.date}>{fmtDate(p.date)}</time>
                  {p.topic && <span>{p.topic}</span>}
                </p>
                <h3><Link className="hc-stretch" to={newsPath(p)}>{title}</Link></h3>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Work() {
  const { projects } = useProjects();
  const items = projects.slice(0, 3);
  if (!items.length) return null;
  return (
    <Section className="hc-block hc-work" labelledBy="hc-work-h">
      <h2 className="hc-giant" id="hc-work-h">Our work</h2>
      <ul className="hc-cards">
        {items.map((p, i) => (
          <li className={`hc-card hc-card--${CARD_TONES[i % CARD_TONES.length]}`} key={p.slug}>
            <div className="hc-card__top">
              <h3 className="hc-card__title">
                <Link className="hc-stretch" to={`/projects/${p.slug}`}>{p.title}</Link>
              </h3>
              <span className="hc-pill" aria-hidden="true">Explore</span>
            </div>
            {p.tagline && <p className="hc-card__text">{p.tagline}</p>}
            {p.image && (
              <img className="hc-card__img" {...responsive(p.image)} sizes="(min-width: 900px) 30vw, 100vw" alt="" width="990" height="558" loading="lazy" decoding="async" />
            )}
          </li>
        ))}
      </ul>
      <p className="hc-center"><Link className="btn btn--ghost" to="/projects">See all projects</Link></p>
    </Section>
  );
}

function Museum() {
  const [open, setOpen] = useState(false);
  return (
    <Section className="hc-sheet hc-sheet--coral" labelledBy="hc-museum-h" id="home-gond">
      <p className="hc-label">Spotlight</p>
      <h2 className="hc-title" id="hc-museum-h">Step into the Gond Virtual Museum</h2>
      <div className="hc-split hc-split--reverse">
        <div className="hc-prose">
          <p>
            A room of Gond folk art, with tiger, horse, bird and dancer motifs, as a walkable 3D
            gallery, rebuilt from DIC&rsquo;s original Oculus experience for the browser. Look
            around on a computer, or use a headset for the full experience.
          </p>
          <button type="button" className="btn" onClick={() => setOpen(true)}>
            Launch the experience
          </button>
        </div>
        <img
          className="hc-photo"
          {...responsive('/images/projects/telangana-heritage.webp')}
          sizes="(min-width: 900px) 46vw, 100vw"
          alt="A visitor in a VR headset looking at Gond artwork on the walls of the virtual museum."
          width="990"
          height="558"
          loading="lazy"
          decoding="async"
        />
      </div>
      <GondMuseumModal isOpen={open} onClose={() => setOpen(false)} />
    </Section>
  );
}

function Voices() {
  const testimonials = useTestimonials();
  const [index, setIndex] = useState(0);
  if (!testimonials.length) return null;
  const last = testimonials.length - 1;
  const t = testimonials[Math.min(index, last)];
  const initials = t.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return (
    <Section className="hc-block hc-voice" labelledBy="hc-voice-h">
      <h2 className="hc-title hc-title--sm" id="hc-voice-h">In their words</h2>
      <figure className="hc-quote" aria-live="polite">
        <div className="hc-quote__photo">
          {t.avatar ? (
            <img {...responsive(t.avatar)} sizes="(min-width: 900px) 280px, 60vw" alt={`Portrait of ${t.name}`} width="400" height="533" loading="lazy" decoding="async" />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
        </div>
        <div>
          <blockquote>
            {(Array.isArray(t.quote) ? t.quote : [t.quote]).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </blockquote>
          <figcaption>
            <strong>{t.name}</strong>
            <span>{t.role}</span>
          </figcaption>
          {testimonials.length > 1 && (
            <div className="hc-quote__nav">
              <button type="button" className="btn btn--ghost" onClick={() => setIndex((i) => (i === 0 ? last : i - 1))}>
                Previous voice
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setIndex((i) => (i === last ? 0 : i + 1))}>
                Next voice
              </button>
            </div>
          )}
        </div>
      </figure>
    </Section>
  );
}

function Partners() {
  const collaborators = useCollaborators();
  if (!collaborators.length) return null;
  return (
    <Section className="hc-block hc-partners" labelledBy="hc-partners-h">
      <h2 className="hc-title hc-title--sm" id="hc-partners-h">Collaborators</h2>
      <ul className="hc-logos">
        {collaborators.map((c) => (
          <li key={c.id || c.name}>
            {c.logo ? (
              <img src={c.logo} alt={c.name} loading="lazy" decoding="async" />
            ) : (
              <span>{c.name}</span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Cta() {
  return (
    <section className="hc-cta" aria-labelledby="hc-cta-h">
      <img
        className="hc-cta__img"
        {...responsive('/images/image85.webp')}
        sizes="100vw"
        alt=""
        width="1600"
        height="1200"
        loading="lazy"
        decoding="async"
      />
      <div className="hc-cta__card">
        <h2 id="hc-cta-h">Work with the Centre</h2>
        <p>
          Tell us about your institution, project or idea. We&rsquo;ll write back and talk
          through how it could work.
        </p>
        <Link className="btn" to="/contact">Get in touch</Link>
      </div>
    </section>
  );
}

export default function HomeC() {
  return (
    <>
      <Hero />
      <Statement />
      <About />
      <WhatWeDo />
      <News />
      <Work />
      <Museum />
      <Voices />
      <Partners />
      <Cta />
    </>
  );
}
