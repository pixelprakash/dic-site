import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDesign } from '../lib/designVariant';
import { PAGE_TRANSITIONS, curtainEnabled, curtainLabel, curtainSheet } from '../lib/pageTransition';
import Figure, { figureKey } from './PageTransitionFigures';
import '../styles/PageTransition.css';

// Page-switch "drawing sheet" (Design 1). The page is covered by a plain paper
// sheet; a hairline frame draws around it clockwise and a drawing-style title
// block in the lower corner names the section being opened, and a drawing of
// what that page is about (see PageTransitionFigures.jsx) is drafted line by
// line, with a red line or marker as the progress mark. The page underneath is swapped
// while the sheet is fully opaque, then the sheet fades away on the new page,
// already at the top. The route renders from `shown`, which trails the real
// location by the cover-up.
//   children: (location) => node   — render the routes for this location
const IN = 460; // ms: sheet covers the page and the drawing begins
const HOLD = 260; // ms: held while the drawing finishes and the new page mounts
const OUT = 380; // ms: sheet fades away

export default function PageTransition({ children }) {
  const location = useLocation();
  const design = useDesign();
  const [shown, setShown] = useState(location);
  const [phase, setPhase] = useState('idle');
  const [label, setLabel] = useState('');
  const [sheet, setSheet] = useState('01');
  const [fig, setFig] = useState('');
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
    setSheet(curtainSheet(location.pathname));
    setFig(figureKey(location.pathname));
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
      {PAGE_TRANSITIONS && (
      <div className={`ptr ptr--${phase}${phase === 'idle' ? '' : ' ptr--live'}`} aria-hidden="true">
        <span className="ptr__edge ptr__edge--top" />
        <span className="ptr__edge ptr__edge--right" />
        <span className="ptr__edge ptr__edge--bottom" />
        <span className="ptr__edge ptr__edge--left" />
        <span className="ptr__ruler ptr__ruler--x" />
        <span className="ptr__ruler ptr__ruler--y" />
        <svg className="ptr__fig" viewBox="0 0 880 352" focusable="false">
          <Figure name={fig} />
        </svg>
        <div className="ptr__block">
          <span className="ptr__name">{label}</span>
          <span className="ptr__org">
            Design Innovation Centre
            <br />
            IIT Hyderabad
            <br />
            <span className="ptr__sheet">Sheet {sheet}</span>
          </span>
          <span className="ptr__rule" />
        </div>
      </div>
      )}
    </>
  );
}
