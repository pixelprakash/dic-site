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
  particleCount = 220,
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = container.clientWidth
      height = container.clientHeight
      cx = width / 2
      cy = height / 2
      maxDist = Math.hypot(cx, cy) * 1.15 // a little past the corners, so streaks clear the edges before resetting
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
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
      width: rand(1.4, 3), // thick enough to read as a glowing streak, not a hairline
    })

    const particles = Array.from({ length: particleCount }, makeParticle)

    const drawFrame = (dt) => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      for (const p of particles) {
        if (dt !== null) {
          p.dist += p.dist * p.speed * (dt / 1000) + 0.4
          if (p.dist > maxDist) Object.assign(p, makeParticle())
        }

        const cos = Math.cos(p.angle)
        const sin = Math.sin(p.angle)
        // Trail length scales with distance-from-center too, so it reads
        // as acceleration blur rather than a fixed-length dash.
        const trail = Math.min(p.dist * 0.6, 140)
        const x1 = cx + cos * (p.dist - trail)
        const y1 = cy + sin * (p.dist - trail)
        const x2 = cx + cos * p.dist
        const y2 = cy + sin * p.dist

        ctx.beginPath()
        ctx.strokeStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.lineWidth = p.width
        ctx.globalAlpha = Math.min(1, p.dist / (maxDist * 0.2)) // fades in from the very center instead of popping in at full strength
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }

    if (prefersReducedMotion) {
      drawFrame(null) // one static frame, no rAF loop at all
      return () => window.removeEventListener('resize', resize)
    }

    let lastTime = performance.now()
    let frameId
    const tick = (now) => {
      const dt = Math.min(now - lastTime, 100)
      lastTime = now
      drawFrame(dt)
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [colors, particleCount])

  return <canvas className={`particle-animation ${className}`} ref={canvasRef} aria-hidden="true" />
}
