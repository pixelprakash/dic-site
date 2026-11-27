import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_FILMS } from '../data/featuredFilms';
import '../styles/FilmSlider.css';

// Home page film slider (after papernewyork.com): the current film large in the
// middle, its neighbours turned away on either side. It advances by itself and
// the current film plays silently as a preview.
//
// UX rules this component keeps:
//  • Nothing is written over the picture — many films carry their own captions.
//    Title and actions sit below it.
//  • Clicking (or tapping) the film opens it with sound; a play mark appears on
//    hover, and stays on whenever the preview isn't running.
//  • It never moves while someone is about to act: it holds while the mouse is
//    on the film, its caption, the arrows or the index, and while a keyboard
//    user is inside it.
//  • The index under the film names all seven, so the range is visible at a
//    glance and any film is one click away.
//  • Pause freezes the picture and the timer (WCAG 2.2.2); off screen, in a
//    background tab or behind the full film it stops altogether.
//  • No YouTube player loads until the slider is on screen. Then there are at
//    most two: the current film, and the next one running unseen so it can
//    appear at once (privacy-enhanced youtube-nocookie).
//  • Reduced motion or data saver: starts paused, thumbnails only.
const SECONDS = 8; // time on each film
// A YouTube player draws a large icon over the middle of the picture for its
// first few seconds (seen at 4 s, gone by 4.8 s), so it is only uncovered once
// it has been playing this long. The next film has usually done that unseen.
const SETTLE_MS = 4600;

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
// to the middle. It is only paused when the visitor presses pause: YouTube
// flashes a large icon over the picture whenever a script pauses or resumes it.
function Preview({ film, play, frozen }) {
  const frame = useRef(null);
  const wasFrozen = useRef(false);
  const [playing, setPlaying] = useState(false);

  // The pause button (and only the visitor) freezes the picture.
  useEffect(() => {
    if (frozen === wasFrozen.current) return;
    wasFrozen.current = frozen;
    frame.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: frozen ? 'pauseVideo' : 'playVideo', args: [] }),
      PLAYER_ORIGIN,
    );
  }, [frozen]);

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
      if (state === 1 && !settle) settle = window.setTimeout(() => setPlaying(true), SETTLE_MS);
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
  const [hovering, setHovering] = useState(false);
  const [heldId, setHeldId] = useState(null); // film frozen by the pause button
  const [open, setOpen] = useState(null);
  const rootRef = useRef(null);
  const dialogRef = useRef(null);
  const dragX = useRef(null);
  const dragged = useRef(false);
  const indexRef = useRef(null);

  const onScreen = inView && !hidden && !open;
  const running = !paused && onScreen;
  const advancing = running && !keyboardInside && !hovering;
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

  // The full film is modal: hold the page still behind it.
  useEffect(() => {
    const d = dialogRef.current;
    if (!open || !d) return undefined;
    if (!d.open) d.showModal();
    const before = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = before; };
  }, [open]);

  // On narrow screens the index scrolls sideways: keep the current film in view
  // (moving only the index, never the page).
  useEffect(() => {
    const list = indexRef.current;
    const item = list?.children[active];
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior: calm ? 'auto' : 'smooth' });
  }, [active, calm]);

  const togglePause = () => {
    setHeldId(paused ? null : films[active].id);
    setPaused((p) => !p);
  };

  const onKeyDown = (e) => {
    if (open) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };
  const onFocus = (e) => setKeyboardInside(e.target.matches(':focus-visible'));
  const onBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setKeyboardInside(false);
  };
  const onPointerDown = (e) => { dragX.current = e.clientX; dragged.current = false; };
  const onPointerUp = (e) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = null;
    dragged.current = Math.abs(dx) > 10;
    if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1));
  };
  // A swipe must not also count as a click on whatever it ended on.
  const onClickCapture = (e) => {
    if (!dragged.current) return;
    dragged.current = false;
    e.preventDefault();
    e.stopPropagation();
  };
  // Hold still while the mouse is somewhere it might be about to click.
  const onPointerOver = (e) => {
    if (e.pointerType !== 'mouse') return;
    setHovering(Boolean(e.target.closest('.fs__slide[data-pos="0"], .fs__arrow, .fs__index')));
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
      onPointerOver={onPointerOver}
      onPointerLeave={() => setHovering(false)}
    >
      <div className="fs__head">
        <h2 className="hx-display" id="fs-heading">Our work on film</h2>
        <div className="fs__intro">
          <p>Heritage, craft, air mobility, virtual museums and the national DIC network.</p>
          <Link className="fs__all" to="/projects">
            All projects <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      <div className="fs__viewport">
        <div
          className="fs__stage"
          data-cursor="quiet"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onClickCapture={onClickCapture}
        >
          {films.map((f, i) => {
            const d = offsetFrom(i, active, n);
            const isActive = d === 0;
            const pos = Math.abs(d) > 1 ? (d > 0 ? 'out-r' : 'out-l') : String(d);
            const isNext = i === (active + 1) % n;
            const frozen = paused && heldId === f.id;
            // While paused, keep only the frozen picture; load nothing new.
            const hasPlayer = onScreen && !calm && (paused ? isActive && frozen : isActive || isNext);
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
                  {hasPlayer && <Preview film={f} play={isActive} frozen={frozen} />}
                  {isActive && (
                    // Mouse and touch shortcut for "Watch with sound" below,
                    // which is the control keyboard and screen readers use.
                    <button type="button" className="fs__play" onClick={() => setOpen(f)} tabIndex={-1} aria-hidden="true">
                      <span className="fs__play-mark">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </button>
                  )}
                </div>

                {isActive ? (
                  <div className="fs__over">
                    <div className="fs__text">
                      <h3 className="fs__title">{f.title}</h3>
                      <p className="fs__meta">{f.area}</p>
                    </div>
                    <div className="fs__actions">
                      <button type="button" className="fs__btn fs__btn--red" onClick={() => setOpen(f)}>
                        Watch with sound<span className="sr-only">: {f.title}</span>
                      </button>
                      <Link className="fs__btn" to={f.to}>
                        {f.cta}<span className="sr-only">: {f.title}</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  Math.abs(d) === 1 && (
                    <button type="button" className="fs__pick" onClick={() => go(i)} tabIndex={-1}>
                      <span className="sr-only">Show {f.title}</span>
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>

        <button type="button" className="fs__arrow fs__arrow--prev" onClick={() => go(active - 1)} aria-label="Previous film">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 12H4M11 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" className="fs__arrow fs__arrow--next" onClick={() => go(active + 1)} aria-label="Next film">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="fs__bar">
        <button type="button" className="fs__pause" onClick={togglePause} aria-label={paused ? 'Play slider' : 'Pause slider'}>
          {paused ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
          )}
        </button>
        <ol className="fs__index" ref={indexRef} aria-label="Choose a film">
          {films.map((f, i) => (
            <li key={f.id}>
              <button
                type="button"
                className="fs__tab"
                onClick={() => go(i)}
                aria-current={i === active ? 'true' : undefined}
              >
                <span className="fs__track" aria-hidden="true">
                  {i === active && (
                    <span
                      key={active}
                      className="fs__fill"
                      style={{ animationDuration: `${SECONDS}s`, animationPlayState: advancing ? 'running' : 'paused' }}
                      onAnimationEnd={() => go(active + 1)}
                    />
                  )}
                </span>
                <span className="fs__tab-name">{f.short}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Announced only when the visitor is in control, never on auto-advance. */}
      <p className="sr-only" aria-live={advancing ? 'off' : 'polite'}>
        Film {active + 1} of {n}: {current.title}
      </p>

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
            <Link className="fs__dialog-link" to={open.to} onClick={() => dialogRef.current.close()}>
              {open.cta} <span aria-hidden="true">&rarr;</span>
            </Link>
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
