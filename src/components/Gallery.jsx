import { GALLERY_IMAGES } from '../data/siteData';
import { useReveal } from '../hooks/useReveal';
import '../styles/Gallery.css';

export default function Gallery() {
  const [ref, visible] = useReveal();

  return (
    <section className="gallery" id="gallery" aria-label="Image gallery">
      <h2 className="section-title">Gallery</h2>
      <div className={`gallery__grid reveal ${visible ? 'visible' : ''}`} ref={ref}>
        {GALLERY_IMAGES.map((img, i) => (
          <div className="gallery__item" key={img.src + i}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
