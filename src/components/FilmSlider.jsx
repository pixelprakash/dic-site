import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_FILMS } from '../data/featuredFilms';
import '../styles/FilmSlider.css';

// Home page film slider (after papernewyork.com): the current film large in the
// middle, its neighbours turned away on either side. No text is laid over the
// picture — many of the films carry their own captions — so the title and
// actions sit in a caption bar below it. It advances by itself and
// the current film plays silently as a preview.
//
//  • No YouTube player loads until the slider is on screen. Then there are at
//    most two: the current film, and the next one already running unseen so
//    it can appear at once (privacy-enhanced youtube-nocookie). The thumbnail stays on top
//    until the video is really playing.
//  • Auto-advance is the progress bar's own animation, so pausing the bar
//    pauses the slider. It stops off screen, in a background tab, while the
//    full film is open, while a keyboard user is inside it, and when the
//    pause button is pressed (WCAG 2.2.2).
//  • Reduced motion or data saver: starts paused, thumbnails only.
const SECONDS = 8; // time on each film

const thumb = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const previewUrl = (f) =>
  `https://www.youtube-nocookie.com/embed/${f.id}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1&start=${f.start}`;

// Signed distance from the current slide, going the short way round.
const offsetFrom = (i, active, n) => {
  let d = (i - active + n) % n;
  if (d > n / 2) d -= n;
  return d;
};

const PLAYER_ORIGIN = 'https://www.youtube-nocookie.com';

// One silent player. With `play` false it is the next film getting ready: it
// is already running, unseen, so it can be uncovered the moment its slide comes
// to the middle. It is never paused and resumed — YouTube flashes a large
// pause/play icon over the picture when a script does that.
function Preview({ film, play }) {
  const frame = useRef(null);
  const [playing, setPlaying] = useState(false);

  const hello = useCallback(() => {
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: film.id }), PLAYER_ORIGIN);
  }, [film.id]);

  // Ask the player to report its state, so it is only uncovered once playing.
  useEffect(() => {
    let settle = 0;
    let heard = false;
    let tries = 0;
    const onMessage = (e) => {
      if (e.source !== frame.current?.contentWindow || typeof e.data !== 'string') return;
      let data;
      try { data = JSON.parse(e.data); } catch { return; }
      heard = true;
      const state = data.event === 'onStateChange' ? data.info : data.info?.playerState;
      if (state === 1 && !settle) settle = window.setTimeout(() => setPlaying(true), 150);
    };
    window.addEventListener('message', onMessage);
    const ask = window.setInterval(() => {
      tries += 1;
      if (heard || tries > 60) window.clearInterval(ask);
      else hello();
    }, 150);
    return () => {
      window.removeEventListener('message', onMessage);
      window.clearInterval(ask);
      window.clearTimeout(settle);
    };
  }, [hello]);

  return (
    <div className={`fs__preview${playing && play ? ' is-live' : ''}`} aria-hidden="true">
      <iframe ref={frame} src={previewUrl(film)} title={`Silent preview: ${film.title}`} tabIndex={-1} allow="autoplay; encrypted-media" onLoad={hello} />
    </div>
  );
}

export default function FilmSlider() {
  const films = FEATURED_FILMS;
  const n = films.length;
  const [calm] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData,
    );
  });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(calm);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [keyboardInside, setKeyboardInside] = useState(false);
  const [open, setOpen] = useState(null);
  const rootRef = useRef(null);
  const dialogRef = useRef(null);
  const dragX = useRef(null);

  const running = !paused && inView && !hidden && !open;
  const advancing = running && !keyboardInside;
  const go = useCallback((i) => setActive(((i % n) + n) % n), [n]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Open the connections to YouTube as the slider approaches, so the first
  // preview doesn't have to wait for them.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || calm || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      [PLAYER_ORIGIN, 'https://i.ytimg.com'].forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        document.head.appendChild(link);
      });
    }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [calm]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (open && d && !d.open) d.showModal();
  }, [open]);

  const onKeyDown = (e) => {
    if (open) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };
  const onFocus = (e) => setKeyboardInside(e.target.matches(':focus-visible'));
  const onBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setKeyboardInside(false);
  };
  const onPointerDown = (e) => { dragX.current = e.clientX; };
  const onPointerUp = (e) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = null;
    if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1));
  };

  const current = films[active];

  return (
    <section
      className="fs"
      ref={rootRef}
      aria-roledescription="carousel"
      aria-labelledby="fs-heading"
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className="fs__head">
        <h2 className="hx-display" id="fs-heading">Our work on film</h2>
        <p>Heritage, craft, air mobility, virtual museums and the national DIC network.</p>
      </div>

      <div className="fs__stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {films.map((f, i) => {
          const d = offsetFrom(i, active, n);
          const isActive = d === 0;
          const pos = Math.abs(d) > 2 ? (d > 0 ? 'out-r' : 'out-l') : String(d);
          return (
            <div
              key={f.id}
              className="fs__slide"
              data-pos={pos}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${f.title}`}
              aria-hidden={!isActive}
            >
              <div className="fs__media">
                <img src={f.poster || thumb(f.id)} alt="" width="1280" height="720" loading="lazy" decoding="async" draggable="false" />
                {(isActive || i === (active + 1) % n) && running && !calm && <Preview film={f} play={isActive} />}
              </div>

              {isActive ? (
                <div className="fs__over">
                  <p className="fs__area">{f.area}</p>
                  <h3 className="fs__title">{f.title}</h3>
                  <div className="fs__actions">
                    <button type="button" className="fs__btn fs__btn--red" onClick={() => setOpen(f)}>
                      Watch film<span className="sr-only">: {f.title}</span>
                    </button>
                    <Link className="fs__btn" to={f.to}>
                      {f.cta}<span className="sr-only">: {f.title}</span>
                    </Link>
                  </div>
                </div>
              ) : (
                Math.abs(d) <= 2 && (
                  <button type="button" className="fs__pick" onClick={() => go(i)} tabIndex={-1}>
                    <span className="sr-only">Show {f.title}</span>
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>

      <div className="fs__controls">
        <button type="button" className="fs__ctl" onClick={() => go(active - 1)} aria-label="Previous film">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20 12H4M11 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" className="fs__ctl" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play slider' : 'Pause slider'}>
          {paused ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
          )}
        </button>
        <button type="button" className="fs__ctl" onClick={() => go(active + 1)} aria-label="Next film">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7" /></svg>
        </button>

        <div className="fs__progress">
          <span className="fs__count" aria-live={advancing ? 'off' : 'polite'}>
            {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            <span className="sr-only">: {current.title}</span>
          </span>
          <span className="fs__track" aria-hidden="true">
            <span
              key={active}
              className="fs__fill"
              style={{ animationDuration: `${SECONDS}s`, animationPlayState: advancing ? 'running' : 'paused' }}
              onAnimationEnd={() => go(active + 1)}
            />
          </span>
        </div>
      </div>

      {open && (
        <dialog
          ref={dialogRef}
          className="fs__dialog"
          aria-label={open.title}
          onClose={() => setOpen(null)}
          onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current.close(); }}
        >
          <div className="fs__dialog-bar">
            <p>{open.title}</p>
            <button type="button" onClick={() => dialogRef.current.close()}>Close</button>
          </div>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${open.id}?autoplay=1&rel=0`}
            title={open.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </dialog>
      )}
    </section>
  );
}
