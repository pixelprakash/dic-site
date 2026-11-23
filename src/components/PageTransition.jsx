import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDesign } from '../lib/designVariant';
import { curtainEnabled, curtainLabel } from '../lib/pageTransition';
import '../styles/PageTransition.css';

// Page-switch curtain (Design 1). A black panel wipes up over the screen with
// the name of the section being opened and a red rule drawing across it; the
// page underneath is swapped while it is fully covered, then the panel wipes
// away upward to reveal the new page already at the top. The route renders
// from `shown`, which trails the real location by the closing wipe.
//   children: (location) => node   — render the routes for this location
const IN = 440; // ms: curtain closes
const HOLD = 140; // ms: held shut while the new page mounts
const OUT = 560; // ms: curtain opens

export default function PageTransition({ children }) {
  const location = useLocation();
  const design = useDesign();
  const [shown, setShown] = useState(location);
  const [phase, setPhase] = useState('idle');
  const [label, setLabel] = useState('');
  const latest = useRef(location);
  const target = useRef(location.pathname);
  const shownPath = useRef(location.pathname);
  const timers = useRef([]);
  latest.current = location;

  useEffect(() => {
    // Same page (a #hash or ?search change): nothing to transition.
    if (location.pathname === target.current) {
      if (shownPath.current === location.pathname) setShown(location);
      return;
    }
    target.current = location.pathname;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const swap = () => {
      setShown(latest.current);
      shownPath.current = latest.current.pathname;
    };

    if (!curtainEnabled(design)) {
      swap();
      setPhase('idle');
      return;
    }

    setLabel(curtainLabel(location.pathname));
    setPhase('in');
    timers.current = [
      setTimeout(() => {
        swap();
        // A #hash target scrolls itself; otherwise open at the top. 'instant'
        // because the site sets html{scroll-behavior:smooth}.
        if (!latest.current.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        setPhase('hold');
      }, IN),
      setTimeout(() => setPhase('out'), IN + HOLD),
      setTimeout(() => setPhase('idle'), IN + HOLD + OUT),
    ];
  }, [location, design]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <>
      {children(shown)}
      <div className={`ptr ptr--${phase}`} aria-hidden="true">
        <span className="ptr__line" />
        <span className="ptr__word">DIC</span>
        <span className="ptr__label">{label}</span>
      </div>
    </>
  );
}
