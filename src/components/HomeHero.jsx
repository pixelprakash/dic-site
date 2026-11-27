import { useEffect, useRef } from 'react';
import { responsive } from '../lib/img';
import '../styles/HomeHero.css';

// Home hero in the manner of lfs.org.uk: a full-viewport picture that stays
// fixed while the rest of the page slides up over it, with a very large
// condensed headline at the bottom-left. The navbar is transparent on top of it
// (see Navbar.jsx).
//
// It shows a photograph of the lab. To use real footage later, add the file to
// /public/videos and set HERO_VIDEO to its path: keep it muted, ≤ ~10 MB, and
// cropped to read well at both 16:9 and portrait (it is object-fit: cover).
// (The old /videos/home-hero.mp4 was a placeholder colour wash.)
const HERO_VIDEO = null;
const HERO_PHOTO = '/images/image7.webp';

export default function HomeHero() {
  const videoRef = useRef(null);

  // Respect reduced motion: show the still photo instead of a moving background.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      videoRef.current?.pause();
    }
  }, []);

  return (
    <section className="hh" aria-labelledby="hh-title">
      <div className="hh__media">
        {HERO_VIDEO ? (
          <video
            ref={videoRef}
            className="hh__video"
            src={HERO_VIDEO}
            poster={HERO_PHOTO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        ) : (
          <img
            className="hh__video"
            {...responsive(HERO_PHOTO)}
            sizes="(max-aspect-ratio: 4/3) 134vh, 100vw"
            alt="Researchers at work in the Design Innovation Centre lab at IIT Hyderabad"
            fetchpriority="high"
            decoding="async"
          />
        )}
      </div>

      <h1 className="hh__title" id="hh-title">Design Innovation Centre</h1>
    </section>
  );
}
