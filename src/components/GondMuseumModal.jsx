import { useEffect, useState } from 'react'
import GondMuseumViewer from './GondMuseumViewer'
import { DOCUMENTARIES } from '../data/gondDocumentaries'
import '../styles/GondMuseumModal.css'

const EXIT_DURATION = 320 // ms — must match the CSS closing-animation duration below

// The original app's own UI click/close sounds (extracted from the same
// FMOD bank as the exhibit SFX) — reused here for the same actions
// (select a documentary / dismiss a panel) rather than left on the shelf.
// Plain HTML5 Audio, not Web Audio: this is 2D UI feedback with no need
// for the 3D listener/positional graph GondMuseumViewer owns.
const playUiSound = (file) => {
  new Audio(file).play().catch(() => {}) // ignored: browser blocked autoplay or the tab is backgrounded
}

// A walkable room reads as cramped inside Model3DModal's capped 1500×920
// panel — this is a true full-viewport takeover instead, on the same
// mount-then-animate-out pattern as that modal (kept mounted briefly after
// isOpen goes false so the closing transition can actually play).
export default function GondMuseumModal({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)
  const [showList, setShowList] = useState(false)
  const [playing, setPlaying] = useState(null) // a DOCUMENTARIES entry, or null

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      setClosing(false)
      return undefined
    }
    if (!mounted) return undefined
    setClosing(true)
    const t = setTimeout(() => {
      setMounted(false)
      setClosing(false)
      setShowList(false)
      setPlaying(null)
    }, EXIT_DURATION)
    return () => clearTimeout(t)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mounted) return undefined
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      // Escape backs out one layer at a time — closing a video or the list
      // first, only exiting the whole experience once neither is open.
      if (playing) setPlaying(null)
      else if (showList) setShowList(false)
      else onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [mounted, onClose, playing, showList])

  if (!mounted) return null

  return (
    <div className={`gond-modal ${closing ? 'is-closing' : 'is-open'}`} role="dialog" aria-modal="true" aria-label="Gond Virtual Museum">
      <button type="button" className="gond-modal__close" onClick={() => { playUiSound('/audio/gond/close_03.mp3'); onClose() }} aria-label="Exit the Gond Virtual Museum">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
        <span>Exit</span>
      </button>

      <button
        type="button"
        className="gond-modal__docs-button"
        onClick={() => { playUiSound('/audio/gond/selection_02.mp3'); setShowList(true) }}
        aria-label={`Watch documentaries (${DOCUMENTARIES.length} available)`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M10 9.5v5l4-2.5-4-2.5Z" fill="currentColor" stroke="none" />
        </svg>
        Documentaries
      </button>

      <GondMuseumViewer
        src="/models/gond-museum.glb"
        fill
        duckAudio={Boolean(playing)}
        documentaries={DOCUMENTARIES}
        onOpenVideo={(doc) => { playUiSound('/audio/gond/selection_02.mp3'); setPlaying(doc) }}
      />

      {showList && !playing && (
        <div className="gond-modal__docs-panel" role="dialog" aria-label="Documentaries">
          <div className="gond-modal__docs-header">
            <div>
              <h3>Documentaries from the field</h3>
              <p className="gond-modal__docs-subtitle">Each also plays on a screen inside the room — click one as you walk past</p>
            </div>
            <button type="button" className="gond-modal__docs-panel-close" onClick={() => setShowList(false)} aria-label="Close documentaries list">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <ul className="gond-modal__docs-list">
            {DOCUMENTARIES.map((doc) => (
              <li key={doc.file}>
                <button type="button" onClick={() => { playUiSound('/audio/gond/selection_02.mp3'); setPlaying(doc); setShowList(false) }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M10 9v6l5-3-5-3Z" fill="currentColor" stroke="none" />
                  </svg>
                  {doc.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {playing && (
        <div className="gond-modal__video-overlay">
          <button type="button" className="gond-modal__video-close" onClick={() => { playUiSound('/audio/gond/close_03.mp3'); setPlaying(null) }} aria-label="Close video">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- source footage has no caption track to attach */}
          <video
            key={playing.file}
            src={playing.file}
            controls
            autoPlay
            playsInline
            className="gond-modal__video"
          />
          <p className="gond-modal__video-title">{playing.title}</p>
        </div>
      )}
    </div>
  )
}
