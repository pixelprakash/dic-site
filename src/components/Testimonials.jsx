import { useState } from 'react';
import { TESTIMONIALS } from '../data/siteData';
import { useReveal } from '../hooks/useReveal';
import '../styles/Testimonials.css';

export default function Testimonials() {
  const [ref, visible] = useReveal();
  const [index, setIndex] = useState(0);
  const maxIndex = TESTIMONIALS.length - 1;
  const t = TESTIMONIALS[index];

  const prev = () => setIndex((i) => (i === 0 ? maxIndex : i - 1));
  const next = () => setIndex((i) => (i === maxIndex ? 0 : i + 1));

  return (
    <section className="testimonials" id="testimonials" aria-label="Testimonials">
      <h2 className="testimonials__title">Testimonials</h2>

      <div className={`testimonials__card reveal ${visible ? 'visible' : ''}`} ref={ref}>
        <div className="testimonials__body">
          <div className="testimonials__text">
            <svg className="testimonials__quote-mark" width="44" height="34" viewBox="0 0 40 32" fill="none" aria-hidden="true">
              <path d="M0 32V19.2C0 8.6 6.4 1.6 17.6 0l2.4 5.6C13.6 7.2 9.6 11.2 9.6 17.6H17.6V32H0ZM22.4 32V19.2C22.4 8.6 28.8 1.6 40 0l2.4 5.6C36 7.2 32 11.2 32 17.6H40V32H22.4Z" fill="currentColor" />
            </svg>
            <blockquote key={t.id}>
              {/* A few of these run long enough in the giver's own words to
                  read as several paragraphs — quote can be a string or an
                  array of paragraphs, same pattern as fullBio elsewhere. */}
              {(Array.isArray(t.quote) ? t.quote : [t.quote]).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </blockquote>
          </div>
          <div className="testimonials__photo">
            {t.avatar ? (
              <img src={t.avatar} alt="" loading="lazy" />
            ) : (
              // No photo on file for this person — an initials tile
              // instead of a broken image, matching the fallback pattern
              // used for missing profile photos elsewhere on the site.
              <div className="testimonials__photo-fallback" aria-hidden="true">
                {t.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')}
              </div>
            )}
          </div>
        </div>

        <div className="testimonials__footer">
          <div className="testimonials__author">
            <p className="testimonials__name">{t.name}</p>
            <p className="testimonials__role">{t.role}</p>
          </div>
          {TESTIMONIALS.length > 1 && (
            <div className="testimonials__nav">
              <button type="button" className="testimonials__nav-btn" onClick={prev} aria-label="Previous testimonial">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button type="button" className="testimonials__nav-btn" onClick={next} aria-label="Next testimonial">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
