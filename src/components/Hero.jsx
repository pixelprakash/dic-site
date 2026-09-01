import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { NEWS } from '../data/siteData'
// Scrolling domain ticker — parked for now. Not deleted: uncomment this
// import and the <DomainMarquee /> usage below to bring it back.
// import DomainMarquee from './DomainMarquee'
import '../styles/Hero.css'

const VIDEO_ID = 'JVgO6pTn4jA'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase()

let ytApiPromise = null
function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      const previousCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.()
        resolve(window.YT)
      }
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)
    })
  }
  return ytApiPromise
}

export default function Hero() {
  const playerTargetRef = useRef(null)
  const videoWrapRef = useRef(null)
  const playerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    let cancelled = false

    loadYouTubeApi().then((YT) => {
      if (cancelled) return
      playerRef.current = new YT.Player(playerTargetRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: VIDEO_ID,
          start: 10,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          rel: 0,
          disablekb: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            e.target.mute()
            e.target.playVideo()
          },
        },
      })
    })

    return () => {
      cancelled = true
      playerRef.current?.destroy?.()
    }
  }, [])

  const togglePlay = () => {
    const player = playerRef.current
    if (!player) return
    if (isPlaying) {
      player.pauseVideo()
      setIsPlaying(false)
    } else {
      player.playVideo()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    const player = playerRef.current
    if (!player) return
    if (isMuted) {
      player.unMute()
      setIsMuted(false)
    } else {
      player.mute()
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoWrapRef.current?.requestFullscreen?.()
    }
  }

  return (
    <>
      {/* Two-column band: DIC's own intro (navy) beside a compact feed of
          announcements & notifications (orange) — following the wireframe
          layout rather than the previous copy+video split. The orange
          treatment matches the "Research Domains" band further down this
          same page (var(--color-dic-orange) + white text), so the two
          brand-colour full-bleed sections read as one consistent choice
          rather than a one-off. */}
      <section className="hero">
        <div className="hero__row">
          <div className="hero__info">
            <h1 className="hero__title">Design Innovation Centre</h1>
            <p className="hero__affiliation">
              <a href="https://design.iith.ac.in" target="_blank" rel="noopener noreferrer">
                Design Department
              </a>
              ,{' '}
              <a href="https://www.iith.ac.in" target="_blank" rel="noopener noreferrer">
                IIT Hyderabad
              </a>
            </p>
            <p className="hero__subtitle">
              Driving innovation through design and technology — across cultural heritage,
              autonomous mobility, immersive education, and sustainable product design.
            </p>
            <div className="hero__cta-row">
              <a href="#research-domains" className="pill-cta">
                Explore our work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="/contact" className="hero__cta-secondary">
                Get in touch
              </a>
            </div>
          </div>

          <aside className="hero__announcements" aria-label="Announcements and notifications">
            <h2 className="hero__announcements-title">Announcements &amp; Notifications</h2>
            <ul className="hero__announcements-list">
              {NEWS.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <time className="hero__announcements-date" dateTime={item.date}>
                    {formatDate(item.date)}
                  </time>
                  <p>{item.title}</p>
                  <Link to={`/news/${item.id}`} className="hero__announcements-more">
                    Know more
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Full-width band below the info/announcements row, per the
          wireframe — was previously a video embedded beside the intro
          copy instead of its own section. */}
      <section className="hero-clips" aria-label="Video clips">
        <div className="hero-clips__frame" ref={videoWrapRef}>
          <div ref={playerTargetRef} />
          <div className="hero__video-scrim" aria-hidden="true" />
          <button
            type="button"
            className="hero__video-shield"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          />

          <div className="hero__controls">
            <button
              type="button"
              className="hero__control-btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              title={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="hero__control-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              title={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="hero__control-btn"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
              title="Toggle fullscreen"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* <DomainMarquee /> — parked for now, see import note above */}
    </>
  )
}
