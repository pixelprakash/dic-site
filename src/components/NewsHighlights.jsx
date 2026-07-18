import { useRef, useState } from 'react';
import { NEWS } from '../data/siteData';
import { useReveal } from '../hooks/useReveal';
import '../styles/NewsHighlights.css';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();

export default function NewsHighlights() {
  const [ref, visible] = useReveal();
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef(null);
  const maxIndex = NEWS.length - 1;

  const goTo = (target) => {
    const clamped = Math.max(0, Math.min(maxIndex, target));
    const track = trackRef.current;
    const item = track?.children[clamped];
    if (item && track) {
      // item/track both carry the current transform, so the difference
      // between their rects is already the item's untransformed offset
      // within the track — do not add the previous offset back in.
      const itemLeftInFlow = item.getBoundingClientRect().left - track.getBoundingClientRect().left;
      setOffset(itemLeftInFlow);
    }
    setIndex(clamped);
  };

  return (
    <section className="news" id="news" aria-label="Latest news and highlights">
      <div className={`news__inner reveal ${visible ? 'visible' : ''}`} ref={ref}>
        <h2 className="news__title">Latest News and Highlights</h2>

        <div className="news__viewport">
          <div className="news__track" ref={trackRef} style={{ transform: `translateX(-${offset}px)` }}>
            {NEWS.map((item) => (
              <article className="news-item" key={item.id}>
                <time className="news-item__date" dateTime={item.date}>
                  {formatDate(item.date)}
                </time>
                <div className="news-item__row">
                  <div className="news-item__image">
                    <img src={item.image} alt="" loading="lazy" />
                  </div>
                  <h3 className="news-item__title">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="news__nav">
          <button
            type="button"
            className="news__nav-btn"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous news item"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="news__nav-count">{index + 1}/{NEWS.length}</span>
          <button
            type="button"
            className="news__nav-btn"
            onClick={() => goTo(index + 1)}
            disabled={index === maxIndex}
            aria-label="Next news item"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
