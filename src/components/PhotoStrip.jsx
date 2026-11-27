import { useEffect, useRef, useState } from 'react';
import { responsive } from '../lib/img';

/* The moving strip of photos at the end of the Projects page. It is decoration
   at the bottom of a long page, so its photos load only as it comes near. It
   moves on its own, so it has a pause button (WCAG 2.2.2). */
export default function PhotoStrip({ images }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`marquee${paused ? ' marquee--paused' : ''}`} style={{ paddingBottom: 'var(--section-gap)' }} aria-label="Photos from the Centre">
      <div className="marquee__controls">
        <button type="button" className="marquee__toggle" aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
          {paused ? 'Play photo strip' : 'Pause photo strip'}
        </button>
      </div>
      <div className="marquee__track" aria-hidden="true">
        {near && [...images, ...images].map((src, i) => (
          <img key={i} {...responsive(src)} sizes="300px" alt="" decoding="async" />
        ))}
      </div>
    </section>
  );
}
