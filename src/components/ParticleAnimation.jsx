import { useEffect, useRef } from 'react'
import '../styles/ParticleAnimation.css'

// A hand-rolled equivalent of 21st.dev's "Particle Animation" component
// (https://21st.dev/@designali-in/components/particle-animation-1) — its
// own source is paywalled ("Component source is locked… Unlock to view the
// full implementation"), so rather than sign up/pay for an account to copy
// it, this reproduces the actual visual from the reference screenshot:
// a warp-speed burst of colored streaks radiating outward from the
// center, accelerating as they travel (so they start as short dashes near
// the middle and stretch into long trails toward the edges) — plain
// canvas + rAF, no dependency, matching how the rest of this site's own
// canvas/three.js effects (GondMuseumViewer, Model3DViewer) are already
// hand-written rather than pulled from a UI-kit.
//
// `colors` takes the same shape as the original's prop (an array of hex
// strings) — the caller decides the palette, so brand colors are passed in
// by whoever renders this rather than hardcoded here.
export default function ParticleAnimation({
  colors = ['#F0301B', '#EF7621', '#D4906B', '#2F3192'],
  particleCount = 160,
  className = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas?.parentElement
    if (!canvas || !container) return undefined

    const ctx = canvas.getContext('2d')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let cx = 0
    let cy = 0
    let maxDist = 0
    // Capped at 1.5: at 2x the canvas is 4x the pixels of 1x for thin streaks
    // that look the same, and this is what each frame has to repaint.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      width = container.clientWidth
      height = container.clientHeight
      cx = width / 2
      cy = height / 2
      maxDist = Math.hypot(cx, cy) * 1.15 // a little past the corners, so streaks clear the edges before resetting
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
    }
    resize()
    window.addEventListener('resize', resize)

    const rand = (min, max) => min + Math.random() * (max - min)
    const pickColor = () => colors[Math.floor(Math.random() * colors.length)]

    // Each particle is a ray from the center at a fixed angle. `dist` grows
    // exponentially (proportional to its own value each frame) rather than
    // linearly — the classic warp-speed/starfield trick: slow and dense
    // near the middle, rapidly accelerating outward, which is what
    // naturally produces short dashes at the center and long streaks near
    // the edges without having to fake the trail length separately.
    const makeParticle = () => ({
      angle: rand(0, Math.PI * 2),
      dist: rand(2, maxDist * 0.15), // staggered starting distance so the burst doesn't pulse in sync
      speed: rand(0.35, 0.9), // growth rate exponent
      color: pickColor(),
      width: rand(1.4, 3),
    })

    const particles = Array.from({ length: particleCount }, makeParticle)

    // Streaks are drawn in two passes — a wide, faint stroke (the glow) and a
    // thin, bright one (the core). The glow used to be ctx.shadowBlur, which is
    // a per-stroke Gaussian blur and by far the slowest thing the canvas can
    // do (hundreds per frame); two plain strokes look the same and cost a
    // fraction of it.
    const drawFrame = (dt) => {
      ctx.clearRect(0, 0, width, height)
      for (const pass of [0, 1]) {
        for (const p of particles) {
          if (pass === 0 && dt !== null) {
            p.dist += p.dist * p.speed * (dt / 1000) + 0.4
            if (p.dist > maxDist) Object.assign(p, makeParticle())
          }

          const cos = Math.cos(p.angle)
          const sin = Math.sin(p.angle)
          // Trail length scales with distance-from-center too, so it reads
          // as acceleration blur rather than a fixed-length dash.
          const trail = Math.min(p.dist * 0.6, 140)
          const fade = Math.min(1, p.dist / (maxDist * 0.2)) // fades in from the very center instead of popping in at full strength

          ctx.beginPath()
          ctx.strokeStyle = p.color
          ctx.lineWidth = pass === 0 ? p.width * 3 : p.width
          ctx.globalAlpha = pass === 0 ? fade * 0.16 : fade
          ctx.moveTo(cx + cos * (p.dist - trail), cy + sin * (p.dist - trail))
          ctx.lineTo(cx + cos * p.dist, cy + sin * p.dist)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }

    if (prefersReducedMotion) {
      drawFrame(null) // one static frame, no rAF loop at all
      return () => window.removeEventListener('resize', resize)
    }

    // Only animate while the hero is actually on screen and the tab is
    // visible — scrolled past it, nothing is repainting a full-viewport canvas
    // for no one.
    let frameId = 0
    let lastTime = 0
    let onScreen = true
    const tick = (now) => {
      const dt = Math.min(now - lastTime, 100)
      lastTime = now
      drawFrame(dt)
      frameId = requestAnimationFrame(tick)
    }
    const start = () => {
      if (frameId || !onScreen || document.hidden) return
      lastTime = performance.now()
      frameId = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frameId)
      frameId = 0
    }
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen) start()
      else stop()
    })
    observer.observe(container)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
    }
  }, [colors, particleCount])

  return <canvas className={`particle-animation ${className}`} ref={canvasRef} aria-hidden="true" />
}
