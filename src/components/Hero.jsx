import '../styles/Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg">
        <img
          src="/images/image103.jpeg"
          alt="DIC IIT Hyderabad building interior"
          loading="eager"
        />
        <div className="hero__overlay" />
      </div>

      <div className="hero__content">
        <p className="hero__label">IIT Hyderabad — Department of Design</p>
        <h1 className="hero__title">
          Design Innovation Centre
        </h1>
        <p className="hero__subtitle">
          Interdisciplinary design research across cultural heritage,
          autonomous mobility, immersive education, and sustainable innovation.
        </p>
        <a href="#projects" className="hero__cta">
          Explore our work
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="hero__scroll">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
