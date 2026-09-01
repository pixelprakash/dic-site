import { useEffect, useRef, useState } from 'react';
import '../styles/CustomCursor.css';

// Interactive elements the cursor should visibly react to — kept as a
// single selector so adding a new clickable pattern later is one line.
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [role="link"], .navbar__item, .pill-cta';

// How much of the remaining distance the ring closes each frame — lower
// is laggier. Frame-rate independent enough for a cursor (no fixed-step
// physics needed) and avoids relying on a CSS transition to animate a
// per-frame JS-driven transform, which fights the browser's own timing.
const RING_EASE = 0.18;

/* A small precise dot plus a softer trailing ring, both DIC-red. The dot
   tracks the pointer exactly, every frame; the ring eases toward it via a
   simple rAF lerp, giving the classic "trailing" cursor feel without
   CSS-transitioning a value that's already being rewritten every frame.
   Off entirely on touch devices and under reduced-motion, where a custom
   cursor is either meaningless or actively unwanted. */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(fineHover.matches && !reducedMotion.matches);
    update();
    fineHover.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);
    return () => {
      fineHover.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const move = (e) => {
      setVisible(true);
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    const onOver = (e) => {
      if (e.target.closest?.(INTERACTIVE_SELECTOR)) setHovering(true);
    };
    const onOut = (e) => {
      if (e.target.closest?.(INTERACTIVE_SELECTOR)) setHovering(false);
    };
    const onLeaveWindow = () => setVisible(false);

    const tick = () => {
      ring.current.x += (target.current.x - ring.current.x) * RING_EASE;
      ring.current.y += (target.current.y - ring.current.y) * RING_EASE;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeaveWindow);
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeaveWindow);
    };
  }, [enabled]);

  useEffect(() => {
    document.documentElement.classList.toggle('has-custom-cursor', enabled);
    return () => document.documentElement.classList.remove('has-custom-cursor');
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className={`custom-cursor__pos ${visible ? '' : 'is-hidden'}`} aria-hidden="true">
        <div className={`custom-cursor__dot ${hovering ? 'is-hovering' : ''}`} />
      </div>
      <div ref={ringRef} className={`custom-cursor__pos ${visible ? '' : 'is-hidden'}`} aria-hidden="true">
        <div className={`custom-cursor__ring ${hovering ? 'is-hovering' : ''}`} />
      </div>
    </>
  );
}
