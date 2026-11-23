import { useEffect, useRef } from 'react';
import '../styles/CustomCursor.css';

// Cursor for the redesign, after dschool.stanford.edu: a small dot rides the
// pointer and every movement draws a thin line behind it that fades away, like
// a pen being dragged across a drawing sheet. The dot grows into a ring over
// anything clickable and presses in on click. The real pointer stays visible
// (nothing is hidden), so it never costs anyone usability; the whole thing is
// skipped on touch screens and for visitors who prefer reduced motion.
const INTERACTIVE =
  'a[href], button, input, textarea, select, summary, label[for], [role="button"], [role="link"], [tabindex]:not([tabindex="-1"]), video';
const LIFE = 700; // ms a trail segment stays visible
const MAX_POINTS = 90;

export default function CustomCursor() {
  const dotRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return undefined;

    const dot = dotRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const red =
      getComputedStyle(document.documentElement).getPropertyValue('--color-dic-red').trim() || '#e03a2f';
    let w = 0;
    let h = 0;
    let points = [];
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = red;
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, w, h);
      points = points.filter((p) => now - p.t < LIFE);
      for (let i = 1; i < points.length; i += 1) {
        const a = points[i - 1];
        const b = points[i];
        if (b.gap) continue; // a jump (pointer left and came back): don't join
        const age = (now - b.t) / LIFE;
        ctx.globalAlpha = (1 - age) * 0.9;
        ctx.lineWidth = 0.8 + (1 - age) * 2.2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      raf = points.length > 1 ? requestAnimationFrame(draw) : 0;
      if (!raf) ctx.clearRect(0, 0, w, h);
    };

    let gap = true;
    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      dot.classList.add('is-on');
      dot.classList.toggle('is-link', Boolean(e.target.closest?.(INTERACTIVE)));
      points.push({ x: e.clientX, y: e.clientY, t: performance.now(), gap });
      gap = false;
      if (points.length > MAX_POINTS) points.shift();
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onLeave = () => {
      dot.classList.remove('is-on');
      gap = true;
    };
    const onDown = () => dot.classList.add('is-down');
    const onUp = () => dot.classList.remove('is-down');

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div className="dic-cursor" aria-hidden="true">
      <canvas ref={canvasRef} className="dic-cursor__trail" />
      <div ref={dotRef} className="dic-cursor__dot">
        <span />
      </div>
    </div>
  );
}
