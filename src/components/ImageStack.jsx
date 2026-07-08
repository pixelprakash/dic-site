import '../styles/ImageStack.css';

export default function ImageStack({ images, className = '' }) {
  return (
    <div className={`image-stack ${className}`}>
      {images.map((img, i) => (
        <div
          key={img.id ?? i}
          className="image-stack__item"
          style={{ '--rotation': `${img.rotation}deg`, zIndex: i + 1 }}
        >
          <img src={img.src} alt={img.alt ?? ''} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
