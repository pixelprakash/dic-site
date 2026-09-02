import { useEffect, useState } from 'react'
import Model3DViewer from './Model3DViewer'
import '../styles/Model3DModal.css'

const EXIT_DURATION = 320 // ms — must match the CSS closing-animation duration below

// Kept mounted for a beat after `isOpen` goes false so the closing
// animation can actually play — unmounting immediately would just make
// the modal vanish with no exit motion at all.
export default function Model3DModal({ isOpen, onClose, src, texture, label }) {
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)

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
    }, EXIT_DURATION)
    return () => clearTimeout(t)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mounted) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [mounted, onClose])

  if (!mounted) return null

  return (
    <div className={`model-modal ${closing ? 'is-closing' : 'is-open'}`} role="dialog" aria-modal="true" aria-label={label || 'Interactive 3D model'}>
      <div className="model-modal__backdrop" onClick={onClose} />
      <div className="model-modal__panel">
        <button type="button" className="model-modal__close" onClick={onClose} aria-label="Close 3D model view">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          <span>Close</span>
        </button>
        <Model3DViewer src={src} texture={texture} label={label} fill />
      </div>
    </div>
  )
}
