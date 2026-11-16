import { useEffect, useRef } from 'react';
import '../styles/HomeHero.css';

// Home hero in the manner of lfs.org.uk: a full-viewport looping video that
// stays fixed while the rest of the page slides up over it, a very large
// condensed headline at the bottom-left, and one featured card at the
// bottom-right. The navbar is transparent on top of it (see Navbar.jsx).
//
// /videos/home-hero.mp4 is a PLACEHOLDER (a slow colour wash). To use the real
// footage, replace that file (and /videos/home-hero-poster.jpg, the frame shown
// while it loads) — nothing else needs to change. Keep it muted, ≤ ~10 MB,
// and cropped to read well at both 16:9 and portrait (it is object-fit: cover).
const HERO_VIDEO = '/videos/home-hero.mp4';
const HERO_POSTER = '/videos/home-hero-poster.jpg';

export default function HomeHero() {
  const videoRef = useRef(null);

  // Respect reduced motion: show the poster frame instead of a moving background.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      videoRef.current?.pause();
    }
  }, []);

  return (
    <section className="hh" aria-labelledby="hh-title">
      <div className="hh__media" aria-hidden="true">
        <video
          ref={videoRef}
          className="hh__video"
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      <h1 className="hh__title" id="hh-title">Design Innovation Centre</h1>

      <a className="hh__notice" href="#home-gond">
        <span className="hh__notice-media">
          <img src="/images/projects/telangana-heritage.webp" alt="" width="600" height="400" decoding="async" />
        </span>
        <span className="hh__notice-text">
          <span className="hh__notice-heading">Step into the Gond Virtual Museum</span>
          <span className="hh__notice-arrow" aria-hidden="true">
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
              <path d="M5.93591 0.373047L11.5359 5.37681L5.93591 10.373" stroke="currentColor" strokeMiterlimit="10" />
              <path d="M11.5686 5.37305L0 5.37305" stroke="currentColor" strokeMiterlimit="10" />
            </svg>
          </span>
          <span className="hh__notice-cta">Explore</span>
        </span>
      </a>
    </section>
  );
}
