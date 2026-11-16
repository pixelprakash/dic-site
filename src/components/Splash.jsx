import { useEffect, useRef, useState } from 'react';
import '../styles/Splash.css';

// First-visit intro for the Design 1 Home page: the Centre's own lab
// equipment drawn stroke by stroke on a black blueprint — an XR headset, an
// air taxi, a heritage monument being scanned, a camera, design-education
// tools — each one named beside it. When the page is really ready (web fonts
// loaded, the hero video has a frame to show) the panel lifts away under a red
// leading edge onto the hero, whose headline and card then rise into place.
//
// Never shorter than the drawing itself (the sequence is CSS-timed), never
// longer than MAX_MS (a slow connection can't trap anyone behind it), and
// clicking it, pressing Esc or the Skip button ends it at once. Shown once per
// browser session, and not at all with reduced motion. While it is up,
// <html data-splash="on"> hides the hero's own headline and card so they can
// take over as it lifts.
//
// ?splash in the address forces it to play again (to review it).

const KEY = 'dic-splash-seen';
const FONT_WAIT_MS = 900;
const MAX_MS = 6500;
const LEAVE_MS = 1300;

// Each drawing is a set of paths in a 240 × 240 box; every path carries
// pathLength="1" so one CSS animation can "draw" any of them. `d` is the
// stagger (fractions of a second) between strokes; `r` paths are the red accent.
const ITEMS = [
  {
    label: 'XR devices',
    paths: [
      { d: 'M40 100Q40 78 62 78H178Q200 78 200 100V146Q200 164 182 164H150Q138 164 132 150Q126 138 120 138Q114 138 108 150Q102 164 90 164H58Q40 164 40 146Z', t: 0 },
      { d: 'M70 78Q120 50 170 78', t: 0.08 },
      { d: 'M40 98L22 90M40 150L22 158M200 98L218 90M200 150L218 158', t: 0.12 },
      { d: 'M62 118a20 20 0 1 0 40 0a20 20 0 1 0 -40 0M138 118a20 20 0 1 0 40 0a20 20 0 1 0 -40 0', t: 0.16 },
      { d: 'M74 118a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M150 118a8 8 0 1 0 16 0a8 8 0 1 0 -16 0', t: 0.24, r: true },
    ],
  },
  {
    label: 'Air taxis',
    paths: [
      { d: 'M92 134Q92 104 120 104Q148 104 148 134V160Q148 172 136 172H104Q92 172 92 160Z', t: 0 },
      { d: 'M100 132Q104 114 120 114Q136 114 140 132Z', t: 0.08 },
      { d: 'M26 98Q120 86 214 98', t: 0.1 },
      { d: 'M100 106L96 91M140 106L144 91', t: 0.14 },
      { d: 'M100 172V184M140 172V184M84 186H156', t: 0.16 },
      { d: 'M18 82a22 5 0 1 0 44 0a22 5 0 1 0 -44 0M70 76a22 5 0 1 0 44 0a22 5 0 1 0 -44 0M126 76a22 5 0 1 0 44 0a22 5 0 1 0 -44 0M178 82a22 5 0 1 0 44 0a22 5 0 1 0 -44 0', t: 0.2, r: true },
      { d: 'M40 82V95M92 76V90M148 76V90M200 82V95', t: 0.24, r: true },
    ],
  },
  {
    label: 'Heritage preservation',
    paths: [
      { d: 'M18 190H222', t: 0 },
      { d: 'M40 190V176H200V190M56 176V162H184V176', t: 0.04 },
      { d: 'M72 162V114H168V162M88 162V114M104 162V114M136 162V114M152 162V114', t: 0.08 },
      { d: 'M62 114L76 100H164L178 114M84 100L96 86H144L156 100M106 86L114 72H126L134 86M120 72V56', t: 0.14 },
      { d: 'M28 134H212', t: 0.2, r: true },
      { d: 'M34 116h.01M206 150h.01M26 158h.01M214 118h.01M44 98h.01M196 94h.01M30 178h.01M210 176h.01M52 128h.01M188 130h.01', t: 0.26, r: true, dot: true },
    ],
  },
  {
    label: 'Cameras',
    paths: [
      { d: 'M36 98Q36 88 46 88H80L90 74H150L160 88H194Q204 88 204 98V176Q204 186 194 186H46Q36 186 36 176Z', t: 0 },
      { d: 'M80 134a40 40 0 1 0 80 0a40 40 0 1 0 -80 0', t: 0.06 },
      { d: 'M94 134a26 26 0 1 0 52 0a26 26 0 1 0 -52 0', t: 0.12 },
      { d: 'M52 98H72V110H52ZM174 80H190', t: 0.16 },
      { d: 'M108 134a12 12 0 1 0 24 0a12 12 0 1 0 -24 0', t: 0.2, r: true },
      { d: 'M186 102a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', t: 0.24, r: true },
    ],
  },
  {
    label: 'Design education tools',
    paths: [
      { d: 'M50 190V66L176 190Z', t: 0 },
      { d: 'M72 170V112L128 170Z', t: 0.08 },
      { d: 'M50 88H60M50 108H66M50 128H60M50 148H66M50 168H60', t: 0.12 },
      { d: 'M146 62L192 108L183 117L137 71Z', t: 0.16 },
      { d: 'M192 108L200 128L183 117', t: 0.22, r: true },
      { d: 'M150 182Q178 150 216 166', t: 0.26, r: true },
    ],
  },
];

const seen = () => {
  try {
    if (new URLSearchParams(window.location.search).has('splash')) return false;
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

const pad = (n) => String(n + 1).padStart(2, '0');

export default function Splash() {
  // loading (waiting for the web fonts so the type doesn't swap mid-drawing)
  // → play → leaving → gone
  const [stage, setStage] = useState(() =>
    seen() || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'gone' : 'loading',
  );
  const readyRef = useRef({ seq: false, fonts: false, video: false });
  const leaveRef = useRef(() => {});

  // While the intro is up: hide the hero's own text, lock scrolling, allow Esc.
  useEffect(() => {
    if (stage === 'gone') return undefined;
    const root = document.documentElement;
    const prevOverflow = document.body.style.overflow;
    if (stage === 'loading' || stage === 'play') {
      root.dataset.splash = 'on';
      document.body.style.overflow = 'hidden';
    }
    const onKey = (e) => { if (e.key === 'Escape') leaveRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      delete root.dataset.splash;
      document.body.style.overflow = prevOverflow;
    };
  }, [stage]);

  // loading → play
  useEffect(() => {
    if (stage !== 'loading') return undefined;
    let done = false;
    const go = () => { if (!done) { done = true; setStage('play'); } };
    const t = setTimeout(go, FONT_WAIT_MS);
    (document.fonts?.ready ?? Promise.resolve()).then(go);
    return () => clearTimeout(t);
  }, [stage]);

  // play → leaving, when the drawing has finished and the page is ready
  useEffect(() => {
    if (stage !== 'play') return undefined;
    const ready = readyRef.current;
    let finished = false;
    const finish = () => { if (!finished) { finished = true; setStage('leaving'); } };
    leaveRef.current = finish;
    const check = () => { if (ready.seq && ready.fonts && ready.video) finish(); };
    readyRef.current.check = check;

    const timers = [setTimeout(finish, MAX_MS)];
    (document.fonts?.ready ?? Promise.resolve()).then(() => { ready.fonts = true; check(); });

    // The hero is mounted already (it is this component's sibling).
    const video = document.querySelector('.hh__video');
    const cleanups = [];
    if (!video || video.readyState >= 2) {
      ready.video = true;
    } else {
      const on = () => { ready.video = true; check(); };
      video.addEventListener('loadeddata', on, { once: true });
      video.addEventListener('error', on, { once: true });
      cleanups.push(() => {
        video.removeEventListener('loadeddata', on);
        video.removeEventListener('error', on);
      });
    }
    check();
    // If the browser never reports the last animation ending, don't hang on it.
    timers.push(setTimeout(() => { ready.seq = true; check(); }, 4200));

    return () => {
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
    };
  }, [stage]);

  // leaving → gone
  useEffect(() => {
    if (stage !== 'leaving') return undefined;
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* private mode: it just shows again next time */
      }
      setStage('gone');
    }, LEAVE_MS);
    return () => clearTimeout(t);
  }, [stage]);

  if (stage === 'gone') return null;

  const skip = () => {
    if (stage === 'loading') setStage('leaving');
    else leaveRef.current();
  };
  const playing = stage !== 'loading';

  return (
    <div
      className={`splash splash--${stage}`}
      role="status"
      aria-label="Loading"
      onClick={skip}
    >
      <span className="splash__line" aria-hidden="true" />

      {playing && (
        <>
          <div className="splash__stage" aria-hidden="true">
            <span className="splash__corner splash__corner--tl" />
            <span className="splash__corner splash__corner--tr" />
            <span className="splash__corner splash__corner--bl" />
            <span className="splash__corner splash__corner--br" />
            {ITEMS.map((item, i) => (
              <svg
                key={item.label}
                className="splash__art"
                style={{ '--i': i }}
                viewBox="0 0 240 240"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.paths.map((p, k) => (
                  <path
                    key={k}
                    d={p.d}
                    pathLength="1"
                    className={`${p.r ? 'is-red ' : ''}${p.dot ? 'is-dot' : ''}`}
                    style={{ '--t': `${p.t}s` }}
                    onAnimationEnd={
                      i === ITEMS.length - 1 && k === item.paths.length - 1
                        ? () => {
                            readyRef.current.seq = true;
                            readyRef.current.check?.();
                          }
                        : undefined
                    }
                  />
                ))}
              </svg>
            ))}
          </div>

          <div className="splash__text" aria-hidden="true">
            <div className="splash__no">
              <div className="splash__reel splash__reel--no">
                {ITEMS.map((item, i) => <span key={item.label}>{pad(i)}</span>)}
              </div>
            </div>
            <div className="splash__label">
              <div className="splash__reel splash__reel--label">
                {ITEMS.map((item) => <span key={item.label}>{item.label}</span>)}
              </div>
            </div>
          </div>
        </>
      )}

      <button type="button" className="splash__skip" onClick={(e) => { e.stopPropagation(); skip(); }}>
        Skip
      </button>
      <span className="splash__edge" aria-hidden="true" />
    </div>
  );
}
