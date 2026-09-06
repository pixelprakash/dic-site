import { useEffect, useState } from 'react';
import '../styles/GalleryLightbox.css';

const EXIT_DURATION = 280; // ms — must match the CSS closing-animation duration below

// Fullscreen image viewer + slideshow for a project/research gallery.
// `index` is the open image's position in `images`, or null when closed —
// kept mounted for a beat after it goes null so the closing animation can
// actually play, the same pattern Model3DModal uses.
export default function GalleryLightbox({ images = [], index, onClose, onNavigate }) {
  const isOpen = index !== null && index !== undefined;
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setClosing(false);
      return undefined;
    }
    if (!mounted) return undefined;
    setClosing(true);
    const t = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, EXIT_DURATION);
    return () => clearTimeout(t);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const count = images.length;
  const goPrev = () => count > 0 && onNavigate((index - 1 + count) % count);
  const goNext = () => count > 0 && onNavigate((index + 1) % count);

  useEffect(() => {
    if (!mounted) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, index, count]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  const src = images[index];

  return (
    <div className={`gallery-lightbox ${closing ? 'is-closing' : 'is-open'}`} role="dialog" aria-modal="true" aria-label="Image viewer">
      <div className="gallery-lightbox__backdrop" onClick={onClose} />

      <button type="button" className="gallery-lightbox__close" onClick={onClose} aria-label="Close image viewer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
        <span>Close</span>
      </button>

      {count > 1 && (
        <button type="button" className="gallery-lightbox__nav gallery-lightbox__nav--prev" onClick={goPrev} aria-label="Previous image">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <figure className="gallery-lightbox__frame">
        <img key={src} src={src} alt="" />
      </figure>

      {count > 1 && (
        <button type="button" className="gallery-lightbox__nav gallery-lightbox__nav--next" onClick={goNext} aria-label="Next image">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {count > 1 && (
        <div className="gallery-lightbox__counter">{index + 1} / {count}</div>
      )}
    </div>
  );
}
