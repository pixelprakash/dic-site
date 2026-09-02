import { useEffect, useRef, useState } from 'react'
import '../styles/Model3DViewer.css'

// Three.js (plus its FBX loader and orbit controls) is only pulled in once
// this actually mounts — the caller (Model3DModal) only mounts it once
// someone has explicitly asked to see the model, so a 3D library plus a
// multi-MB FBX file never loads on a page that merely has one available.
// The dynamic imports below become their own chunk, separate from the
// main bundle.
export default function Model3DViewer({ src, texture, label, fill = false }) {
  const stageRef = useRef(null)
  const cleanupRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [progress, setProgress] = useState(0) // 0-100, from the FBX download itself

  useEffect(() => {
    let cancelled = false
    const container = stageRef.current
    if (!container) return undefined

    ;(async () => {
      try {
        const [THREE, { OrbitControls }, { FBXLoader }] = await Promise.all([
          import('three'),
          import('three/addons/controls/OrbitControls.js'),
          import('three/addons/loaders/FBXLoader.js'),
        ])
        if (cancelled) return

        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#1a1714') // --color-ink, matching the stage's CSS background

        const camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          5000
        )

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        container.appendChild(renderer.domElement)

        scene.add(new THREE.AmbientLight(0xffffff, 0.7))
        scene.add(new THREE.HemisphereLight(0xfff3e0, 0x4a3826, 0.9))
        const key = new THREE.DirectionalLight(0xffffff, 1.2)
        key.position.set(1, 1.6, 1)
        scene.add(key)
        const fill2 = new THREE.DirectionalLight(0xffffff, 0.5)
        fill2.position.set(-1, 0.6, -1)
        scene.add(fill2)

        // Rendering is on-demand (triggered by real pointer/wheel events via
        // OrbitControls' "change" event, plus one explicit call right after
        // load) rather than an always-running requestAnimationFrame loop.
        // rAF can be throttled or fully suspended by the browser when it
        // doesn't consider the tab "visible" — when that happens, a loop
        // that only renders inside rAF never paints a single frame, leaving
        // a blank canvas even though loading succeeded and no error is
        // thrown. Damping is off so no continuous loop is needed at all:
        // every actual camera change (drag, scroll) fires its own render.
        const renderFrame = () => renderer.render(scene, camera)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = false
        controls.minDistance = 0.5
        controls.maxDistance = 500
        controls.addEventListener('change', renderFrame)

        // Load the model and its texture atlas in parallel — the FBX has a
        // real UV channel but no embedded or referenced image (a bare
        // photogrammetry export), so the actual diffuse texture is a
        // separate file applied to the material by hand once both are in.
        // This file is tens of MB (an embedded texture atlas), so a real
        // download percentage matters here — a static "Loading…" with no
        // sense of progress reads as stalled on a slow connection.
        const loadFBX = () =>
          new Promise((resolve, reject) => {
            new FBXLoader().load(
              src,
              resolve,
              (evt) => {
                if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100))
              },
              reject
            )
          })

        const loadTexture = () =>
          texture ? new THREE.TextureLoader().loadAsync(texture) : Promise.resolve(null)

        const [object, tex] = await Promise.all([loadFBX(), loadTexture()])
        if (cancelled) return

        if (tex) {
          tex.colorSpace = THREE.SRGBColorSpace
          tex.flipY = false // FBX/Maya-style UVs — three.js's default flipY (for OBJ/glTF conventions) mirrors this atlas vertically otherwise.
        }

        object.traverse((n) => {
          if (!n.isMesh) return
          const materials = Array.isArray(n.material) ? n.material : [n.material]
          materials.forEach((m) => {
            if (tex) {
              m.map = tex
              m.color.set(0xffffff) // let the texture carry color instead of tinting it with the default grey base color
              m.vertexColors = false // the geometry's vertex-color channel is a blank placeholder (uniform near-white), not real data — the texture is the real source now
            }
            m.needsUpdate = true
          })
        })

        // Recenter AFTER scaling, not before: object.position is a
        // translation in the parent's (scene) space, applied on top of the
        // object's own scale — it isn't scaled down along with the
        // geometry. This model's raw bounding box is on the order of
        // thousands of units (a photogrammetry export, not meter-scaled and
        // centered), so translating by the unscaled center first and
        // scaling afterwards left the now-tiny model translated thousands
        // of units away from the origin — comfortably outside the camera's
        // far plane, rendering as a blank frame with no error anywhere.
        // Scaling the center offset by the same factor keeps the
        // translation in the same space as the scaled object.
        const box = new THREE.Box3().setFromObject(object)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())

        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const targetSize = 4
        const scale = targetSize / maxDim
        object.scale.setScalar(scale)
        object.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
        scene.add(object)

        camera.position.set(targetSize * 1.1, targetSize * 0.85, targetSize * 1.4)
        camera.near = targetSize / 100
        camera.far = targetSize * 100
        camera.updateProjectionMatrix()
        controls.target.set(0, 0, 0)
        controls.update()
        renderFrame()

        setStatus('ready')

        // Embedded FBX textures (and the manually-applied atlas case) can
        // still be decoding asynchronously at this point — hasMap is true
        // the instant FBXLoader resolves, but the actual image data can
        // arrive a beat later. With on-demand rendering, nothing repaints
        // once that happens unless the visitor happens to drag/scroll, so
        // the model could sit fully textured in memory but visibly flat
        // grey until interacted with. A short, self-terminating loop
        // (not a permanent one) re-renders for the next second to catch
        // that arrival, then stops.
        const settleUntil = performance.now() + 1200
        let settleId
        const settle = () => {
          renderFrame()
          if (performance.now() < settleUntil) settleId = requestAnimationFrame(settle)
        }
        settleId = requestAnimationFrame(settle)
        // requestAnimationFrame can be throttled or fully suspended in some
        // environments (backgrounded/hidden-per-the-Page-Visibility-API
        // tabs) — setTimeout isn't gated the same way, so these act as a
        // belt-and-suspenders catch for the same async-texture-arrival case.
        const settleTimeouts = [150, 400, 900, 1300].map((ms) => setTimeout(renderFrame, ms))

        const handleResize = () => {
          if (!container) return
          camera.aspect = container.clientWidth / container.clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(container.clientWidth, container.clientHeight)
          renderFrame()
        }
        window.addEventListener('resize', handleResize)

        cleanupRef.current = () => {
          cancelAnimationFrame(settleId)
          settleTimeouts.forEach(clearTimeout)
          window.removeEventListener('resize', handleResize)
          controls.removeEventListener('change', renderFrame)
          controls.dispose()
          scene.traverse((obj) => {
            obj.geometry?.dispose?.()
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
            mats.forEach((m) => m?.dispose?.())
          })
          tex?.dispose?.()
          renderer.dispose()
          renderer.domElement.parentNode?.removeChild(renderer.domElement)
        }
      } catch (err) {
        console.error('Model3DViewer: load failed', err)
        if (!cancelled) setStatus('error')
      }
    })()

    return () => {
      cancelled = true
      cleanupRef.current?.()
    }
  }, [src, texture])

  return (
    <div className={`model-viewer ${fill ? 'model-viewer--fill' : ''}`}>
      <div className="model-viewer__stage" ref={stageRef}>
        {status !== 'ready' && (
          <div className="model-viewer__overlay">
            {status === 'loading' && (
              <div className="model-viewer__progress">
                <span className="model-viewer__status">
                  Loading 3D model{progress > 0 ? `… ${progress}%` : '…'}
                </span>
                <div className="model-viewer__progress-track">
                  <div className="model-viewer__progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            {status === 'error' && <span className="model-viewer__status">Couldn&rsquo;t load the 3D model. Please try again later.</span>}
          </div>
        )}
      </div>
      {status === 'ready' && (
        <p className="model-viewer__hint">Drag to rotate · Scroll to zoom{label ? ` · ${label}` : ''}</p>
      )}
    </div>
  )
}
