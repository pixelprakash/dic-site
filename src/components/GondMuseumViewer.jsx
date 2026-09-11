import { useEffect, useRef, useState } from 'react'
import '../styles/GondMuseumViewer.css'

const EYE_HEIGHT = 1.6
const WALK_SPEED = 2.4 // m/s
const RUN_SPEED = 4.6 // m/s, Shift held
const LOOK_SENSITIVITY = 0.0035 // radians per pixel of drag
const PITCH_LIMIT = Math.PI / 2 - 0.05

// Each name matches a node in the glTF export (confirmed still present post
// gltf-transform optimize — the mesh-merge pass combines draw calls but
// keeps named empties). Sound files are the APK's own bundled SFX,
// extracted from its FMOD bank — see the extraction notes in this repo's
// session history — and named for their subject in the original project
// (Hindi/Marathi animal names, matched to the exhibit they were clearly
// authored for: ghoda=horse, hathi=elephant, hiran=deer, machali=fish,
// morpakshi=peacock, waghoba=tiger). "Kachoba" and "Tavij" don't have an
// unambiguous mesh name to key off of — KasoPen/Medicall are this build's
// best phonetic/thematic match (tortoise totem; medicine-man's amulet) but
// that pairing is a guess, not something recovered from the original
// scene's own trigger logic (not present in this APK's extracted data).
// `title`/`description` are placards written for this rebuild — the
// original app had no extracted curatorial text to recover, so these are
// deliberately general (the animal's role in Gond belief, the Dhokra
// casting technique) rather than invented specifics about any one piece.
const EXHIBITS = [
  {
    node: 'Horse_LOD0',
    file: '/audio/gond/ghoda.mp3',
    title: 'Horse (Ghoda)',
    description: 'A cast bronze horse in the Dhokra tradition — the lost-wax metal-casting craft practiced by Gond and other tribal communities of central India.',
  },
  {
    node: 'Elephant_LOD0',
    file: '/audio/gond/hathi.mp3',
    title: 'Elephant (Hathi)',
    description: 'The elephant is a recurring figure in Gond folk art, often associated with strength and prosperity.',
  },
  {
    node: 'Deer_LOD0',
    file: '/audio/gond/hiran.mp3',
    title: 'Deer (Hiran)',
    description: 'Forest animals like the deer are central to Gond visual storytelling, reflecting a close relationship with the surrounding woodland.',
  },
  {
    node: 'Fish_LOD0',
    file: '/audio/gond/machali.mp3',
    title: 'Fish (Machali)',
    description: 'A motif tied to rivers and water bodies significant to Gond settlements, common across the region’s folk and tribal art.',
  },
  {
    node: 'Bird_LOD0',
    file: '/audio/gond/morpakshi.mp3',
    title: 'Peacock (Mor)',
    description: 'The peacock appears widely across Gond art as a decorative and symbolic motif.',
  },
  {
    node: 'Tiger_01',
    file: '/audio/gond/waghoba.mp3',
    title: 'Tiger (Waghoba)',
    description: 'Waghoba, the tiger deity, is worshipped across Gond and neighbouring tribal communities as a guardian spirit of the forest.',
  },
  {
    node: 'KasoPen_LOD0',
    file: '/audio/gond/kachoba.mp3',
    title: 'Kaso Pen',
    description: 'A totemic figure from Gond ancestral/clan-deity (Pen) tradition — the exact identity of this particular piece wasn’t recoverable from the source material.',
  },
  {
    node: 'Medicall_LOD0',
    file: '/audio/gond/tavij.mp3',
    title: 'Healing Figure',
    description: 'Associated with traditional Gond medicinal and protective practice — this piece’s specific narrative wasn’t recoverable from the source material.',
  },
  {
    node: 'Diya_LOD0',
    file: '/audio/gond/dhupli_lamp.mp3',
    title: 'Diya (Lamp)',
    description: 'An oil lamp, used across Indian traditions in ritual and everyday lighting alike.',
  },
  {
    node: '09_Dog',
    title: 'Dog',
    description: 'A cast figure recovered from the project’s Blender source file — absent from the original Unity/Oculus build, added here for the first time.',
  },
]
const TRIGGER_RADIUS = 2.4 // metres — walking this close plays the clip
const RETRIGGER_RADIUS = 4 // must back off this far before it can fire again
const INFO_RADIUS = 3.5 // metres — shows that exhibit's info card
const AMBIENCE_VOLUME = 0.22
const EXHIBIT_VOLUME = 0.85
const VIDEO_PREVIEW_RADIUS = 6 // metres — screens only decode/play (muted) once you're this close
const VIDEO_INTERACT_RADIUS = 9 // metres — clicking a screen from further than this does nothing
const CLICK_MAX_MOVEMENT = 6 // px — a pointer down→up further than this counts as a look-drag, not a click
const CLICK_MAX_DURATION = 400 // ms

// The Gond Virtual Museum experience — a glTF export of the DIC's Gond folk-art
// museum diorama (originally a Unity/Oculus build), with a WebXR "Enter VR"
// button layered on top. Unlike Model3DViewer's on-demand rendering (which
// only repaints on pointer/wheel events to save battery on a static object
// viewer), WebXR requires the renderer to drive its own loop via
// renderer.setAnimationLoop — a session's frames are scheduled by the XR
// device, not by page events — so this component renders continuously for as
// long as it's mounted.
//
// Movement is a hand-rolled first-person walker rather than OrbitControls —
// OrbitControls orbits the camera *around* a fixed target point (so dragging
// just spins you in place, and there's no way to translate through the room
// at all, which is the actual complaint this replaces). Look is yaw/pitch
// from pointer drag; movement is WASD/arrow keys (desktop) or an on-screen
// joystick (touch, but it works with a mouse too), both feeding the same
// forward/right vectors derived from yaw alone — pitch is deliberately left
// out of the movement basis so looking up/down doesn't tilt your walking
// direction into the floor or ceiling, same as any FPS-style walk control.
export default function GondMuseumViewer({ src, fill = false, duckAudio = false, documentaries = [], onOpenVideo }) {
  const stageRef = useRef(null)
  const joystickBaseRef = useRef(null)
  const joystickKnobRef = useRef(null)
  const cleanupRef = useRef(null)
  const ambienceRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [progress, setProgress] = useState(0)
  const [activeExhibit, setActiveExhibit] = useState(null) // { title, description } | null

  // Ducks the ambient room loop while a documentary plays over it (see
  // GondMuseumModal) — kept as its own effect, keyed only on `duckAudio`,
  // so toggling it doesn't reach into (or re-run) the load/animation effect.
  const duckAudioRef = useRef(duckAudio)
  useEffect(() => {
    duckAudioRef.current = duckAudio
    ambienceRef.current?.setVolume(duckAudio ? 0 : AMBIENCE_VOLUME)
  }, [duckAudio])

  // onOpenVideo is a fresh arrow function from the parent on every render —
  // read through a ref inside the load effect instead of listing it as a
  // dependency, so a parent re-render (e.g. opening the documentaries menu)
  // doesn't tear down and reload the whole three.js scene.
  const onOpenVideoRef = useRef(onOpenVideo)
  useEffect(() => {
    onOpenVideoRef.current = onOpenVideo
  }, [onOpenVideo])

  useEffect(() => {
    let cancelled = false
    const container = stageRef.current
    if (!container) return undefined

    ;(async () => {
      try {
        const [THREE, { GLTFLoader }, { MeshoptDecoder }, { VRButton }] = await Promise.all([
          import('three'),
          import('three/addons/loaders/GLTFLoader.js'),
          import('three/addons/libs/meshopt_decoder.module.js'),
          import('three/addons/webxr/VRButton.js'),
        ])
        if (cancelled) return

        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#1a1714')

        const camera = new THREE.PerspectiveCamera(
          50,
          container.clientWidth / container.clientHeight,
          0.05,
          500
        )
        camera.rotation.order = 'YXZ'

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.xr.enabled = true
        container.appendChild(renderer.domElement)
        renderer.domElement.classList.add('gond-viewer__canvas')

        const vrButton = VRButton.createButton(renderer)
        vrButton.classList.add('gond-viewer__vr-button')
        container.appendChild(vrButton)

        // Colors here are pulled from the original lighting rig recovered
        // from the design's Blender source file (Gond_Musium_with_Light2.blend):
        // 61 real spotlights, all pure white (1,1,1), plus 26 point lights
        // in a warm amber accent tone (~0xffa36d) for lamp/diya glow. That
        // file's full rig isn't reproduced as real lights here — the room's
        // textures are Unity-baked lightmaps (lighting already painted into
        // the diffuse maps), so 87 additional dynamic lights on top would
        // double-light everything for a real performance cost. What's used
        // instead is just the *palette* it revealed: the key light was
        // previously a guessed warm off-white — swapped to actual neutral
        // white to match the real spotlights, with the amber now carried by
        // the fill light instead of also being neutral.
        scene.add(new THREE.AmbientLight(0xffffff, 0.5))
        const key = new THREE.DirectionalLight(0xffffff, 1.1)
        key.position.set(2, 4, 2)
        scene.add(key)
        const fillLight = new THREE.DirectionalLight(0xffa36d, 0.45)
        fillLight.position.set(-2, 2, -2)
        scene.add(fillLight)

        const loader = new GLTFLoader()
        loader.setMeshoptDecoder(MeshoptDecoder)

        const gltf = await new Promise((resolve, reject) => {
          loader.load(
            src,
            resolve,
            (evt) => {
              if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100))
            },
            reject
          )
        })
        if (cancelled) return

        const model = gltf.scene

        // The export's own coordinate space (Unity meters, floor near y=0)
        // is kept as-is rather than recentered/rescaled like the FBX viewer —
        // this scene is a walkable room, not a single inspectable object, so
        // its real-world scale is exactly what a "stand inside it" VR view
        // needs.
        scene.add(model)
        // A freshly-added object's matrixWorld isn't computed until the
        // renderer's next render pass — calling getWorldPosition() on any of
        // its children before that returns each one's stale default
        // (effectively ~(0,0,0), not its real place in the room). Every
        // exhibit below was resolving to nearly the same wrong point, right
        // next to the spawn position — meaning all of them read as "in
        // range" simultaneously the moment the experience opened, and every
        // clip fired at once (staggered only by how long each one took to
        // download/decode, which is exactly the "one after another in the
        // background" symptom this fixes).
        model.updateMatrixWorld(true)

        // ── Audio: ambient room loop + proximity-triggered exhibit sounds ──
        // The click that opened this experience is the user gesture the
        // Web Audio API needs to unlock playback, so starting it here (not
        // waiting for another click) works without hitting an autoplay
        // block.
        const listener = new THREE.AudioListener()
        camera.add(listener)
        const audioLoader = new THREE.AudioLoader()

        const ambience = new THREE.Audio(listener)
        ambienceRef.current = ambience
        audioLoader.load('/audio/gond/ambience.mp3', (buffer) => {
          if (cancelled) return
          ambience.setBuffer(buffer)
          ambience.setLoop(true)
          ambience.setVolume(duckAudio ? 0 : AMBIENCE_VOLUME)
          ambience.play()
        })

        const exhibitTriggers = EXHIBITS.map(({ node, file, title, description }) => {
          const target = model.getObjectByName(node)
          if (!target) return null
          const worldPos = new THREE.Vector3()
          target.getWorldPosition(worldPos)

          let audio = null
          if (file) {
            audio = new THREE.PositionalAudio(listener)
            audio.setRefDistance(1.5)
            audio.setRolloffFactor(2)
            audio.setVolume(EXHIBIT_VOLUME)
            audioLoader.load(file, (buffer) => audio.setBuffer(buffer))
            const anchor = new THREE.Object3D()
            anchor.position.copy(worldPos)
            anchor.add(audio)
            scene.add(anchor)
          }
          return { position: worldPos, audio, armed: true, title, description }
        }).filter(Boolean)

        // ── In-world documentary video screens ──
        // Each screen is a plane textured with a live <video> element via
        // THREE.VideoTexture. The video elements are never attached to the
        // DOM (three.js only needs them as a frame source) and start with
        // preload="none" — nothing downloads until a visitor actually walks
        // close enough for the proximity check below to call .play(). See
        // gondDocumentaries.js for why these positions are a curatorial
        // choice rather than a recovered original layout.
        const videoScreens = documentaries
          .filter((doc) => doc.screenPosition)
          .map((doc) => {
            const videoEl = document.createElement('video')
            videoEl.src = doc.file
            videoEl.loop = true
            videoEl.muted = true // in-world preview is silent; opening it via onOpenVideo plays the real thing with sound
            videoEl.playsInline = true
            videoEl.preload = 'none'

            const texture = new THREE.VideoTexture(videoEl)
            texture.colorSpace = THREE.SRGBColorSpace

            const screenMesh = new THREE.Mesh(
              new THREE.PlaneGeometry(1.6, 0.9),
              new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
            )
            const bezel = new THREE.Mesh(
              new THREE.PlaneGeometry(1.8, 1.06),
              new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.7, side: THREE.DoubleSide })
            )
            bezel.position.z = -0.02
            screenMesh.add(bezel)

            const [x, y, z] = doc.screenPosition
            screenMesh.position.set(x, y, z)
            // Face the room's central north–south corridor (the x=0 line)
            // at the same height/z — material is DoubleSide specifically so
            // this doesn't need to fight lookAt's forward-axis convention.
            screenMesh.lookAt(0, y, z)

            scene.add(screenMesh)
            return { mesh: screenMesh, video: videoEl, doc }
          })
        const raycaster = new THREE.Raycaster()
        const screenMeshes = videoScreens.map((s) => s.mesh)

        // Soft wander limit, not real collision (no per-frame raycasting
        // against ~900k triangles here) — just keeps a stray drag+hold from
        // walking someone straight out of the room and into the far dark.
        // Padded a couple of metres past the model's own extent so it never
        // clips visible geometry.
        const bounds = new THREE.Box3().setFromObject(model)
        bounds.expandByScalar(2)

        // The source Unity scene's own "XR Origin" rig (the VR play-area
        // spawn point) sits at the world origin facing +Z — using that
        // instead of a bounding-box guess opens the same way the original
        // headset experience did.
        camera.position.set(0, EYE_HEIGHT, 0)
        let yaw = Math.PI // faces +Z
        let pitch = 0
        camera.rotation.set(pitch, yaw, 0)

        // ── Look: pointer-drag anywhere on the canvas (yaw/pitch) ──
        // A pointer down→up with barely any movement is treated as a click
        // on whatever's under it (a video screen, via raycast) rather than
        // a look-drag — same gesture, disambiguated by how far it travelled.
        let looking = false
        let lastX = 0
        let lastY = 0
        let downX = 0
        let downY = 0
        let downTime = 0
        const onPointerDown = (e) => {
          // Belt-and-suspenders for autoplay policy: the "Launch" click is
          // several `await`s removed from where the AudioContext is created,
          // which some browsers (Safari especially) no longer count as the
          // same user gesture — leaving audio silently suspended. The first
          // real interaction with the scene itself is a safe second chance.
          if (listener.context.state === 'suspended') listener.context.resume()
          looking = true
          lastX = e.clientX
          lastY = e.clientY
          downX = e.clientX
          downY = e.clientY
          downTime = performance.now()
          renderer.domElement.setPointerCapture?.(e.pointerId)
        }
        const onPointerMove = (e) => {
          if (!looking) return
          const dx = e.clientX - lastX
          const dy = e.clientY - lastY
          lastX = e.clientX
          lastY = e.clientY
          yaw -= dx * LOOK_SENSITIVITY
          pitch -= dy * LOOK_SENSITIVITY
          pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch))
        }
        const onPointerUp = (e) => {
          looking = false
          renderer.domElement.releasePointerCapture?.(e.pointerId)

          const moved = Math.hypot(e.clientX - downX, e.clientY - downY)
          const elapsed = performance.now() - downTime
          if (moved > CLICK_MAX_MOVEMENT || elapsed > CLICK_MAX_DURATION || !screenMeshes.length) return

          const rect = renderer.domElement.getBoundingClientRect()
          const ndc = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
          )
          raycaster.setFromCamera(ndc, camera)
          const hit = raycaster.intersectObjects(screenMeshes, true)[0]
          if (!hit) return
          const screen = videoScreens.find((s) => s.mesh === hit.object || s.mesh === hit.object.parent)
          if (screen && camera.position.distanceTo(screen.mesh.position) <= VIDEO_INTERACT_RADIUS) {
            onOpenVideoRef.current?.(screen.doc)
          }
        }
        renderer.domElement.addEventListener('pointerdown', onPointerDown)
        renderer.domElement.addEventListener('pointermove', onPointerMove)
        renderer.domElement.addEventListener('pointerup', onPointerUp)
        renderer.domElement.addEventListener('pointercancel', onPointerUp)

        // ── Move: WASD / arrow keys ──
        const keys = new Set()
        const MOVE_CODES = new Set([
          'KeyW', 'KeyA', 'KeyS', 'KeyD',
          'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
          'ShiftLeft', 'ShiftRight',
        ])
        const onKeyDown = (e) => {
          if (MOVE_CODES.has(e.code)) {
            keys.add(e.code)
            e.preventDefault()
          }
        }
        const onKeyUp = (e) => {
          keys.delete(e.code)
        }
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)

        // ── Move: on-screen joystick (bottom-left; works with mouse too) ──
        const joyBase = joystickBaseRef.current
        const joyKnob = joystickKnobRef.current
        const joystick = { x: 0, y: 0 } // x: strafe (-1..1), y: forward (-1..1)
        let joyPointerId = null
        const JOY_RADIUS = 56 // must track .gond-viewer__joystick's size in the CSS
        const setKnob = (dx, dy) => {
          if (joyKnob) joyKnob.style.transform = `translate(${dx}px, ${dy}px)`
        }
        const onJoyDown = (e) => {
          if (listener.context.state === 'suspended') listener.context.resume()
          joyPointerId = e.pointerId
          joyBase?.setPointerCapture?.(e.pointerId)
          updateJoy(e)
          e.preventDefault()
          e.stopPropagation()
        }
        const updateJoy = (e) => {
          if (!joyBase) return
          const rect = joyBase.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          let dx = e.clientX - cx
          let dy = e.clientY - cy
          const dist = Math.hypot(dx, dy)
          if (dist > JOY_RADIUS) {
            dx = (dx / dist) * JOY_RADIUS
            dy = (dy / dist) * JOY_RADIUS
          }
          setKnob(dx, dy)
          joystick.x = dx / JOY_RADIUS
          joystick.y = -dy / JOY_RADIUS // up on the stick = forward
        }
        const onJoyMove = (e) => {
          if (joyPointerId === null || e.pointerId !== joyPointerId) return
          updateJoy(e)
          e.preventDefault()
          e.stopPropagation()
        }
        const onJoyUp = (e) => {
          if (joyPointerId === null || e.pointerId !== joyPointerId) return
          joyPointerId = null
          joystick.x = 0
          joystick.y = 0
          setKnob(0, 0)
        }
        joyBase?.addEventListener('pointerdown', onJoyDown)
        joyBase?.addEventListener('pointermove', onJoyMove)
        joyBase?.addEventListener('pointerup', onJoyUp)
        joyBase?.addEventListener('pointercancel', onJoyUp)

        const clock = new THREE.Clock()
        let lastInfoKey = null // which exhibit's info card is currently shown, if any

        renderer.setAnimationLoop(() => {
          const dt = Math.min(clock.getDelta(), 0.1) // clamp so a tab-switch stall doesn't teleport the walker

          // Keyboard input, combined with the joystick — both feed the same
          // -1..1 forward/right axes so they can be used interchangeably or
          // together.
          let forwardInput = joystick.y
          let rightInput = joystick.x
          if (keys.has('KeyW') || keys.has('ArrowUp')) forwardInput += 1
          if (keys.has('KeyS') || keys.has('ArrowDown')) forwardInput -= 1
          if (keys.has('KeyD') || keys.has('ArrowRight')) rightInput += 1
          if (keys.has('KeyA') || keys.has('ArrowLeft')) rightInput -= 1
          forwardInput = Math.max(-1, Math.min(1, forwardInput))
          rightInput = Math.max(-1, Math.min(1, rightInput))

          if (!renderer.xr.isPresenting && (forwardInput !== 0 || rightInput !== 0)) {
            const running = keys.has('ShiftLeft') || keys.has('ShiftRight')
            const speed = running ? RUN_SPEED : WALK_SPEED
            // Movement basis from yaw only (not pitch) — see file header.
            const forwardX = -Math.sin(yaw)
            const forwardZ = -Math.cos(yaw)
            const rightX = Math.cos(yaw)
            const rightZ = -Math.sin(yaw)
            const step = speed * dt
            let nx = camera.position.x + (forwardX * forwardInput + rightX * rightInput) * step
            let nz = camera.position.z + (forwardZ * forwardInput + rightZ * rightInput) * step
            nx = Math.max(bounds.min.x, Math.min(bounds.max.x, nx))
            nz = Math.max(bounds.min.z, Math.min(bounds.max.z, nz))
            camera.position.x = nx
            camera.position.z = nz
          }

          if (!renderer.xr.isPresenting) {
            camera.rotation.set(pitch, yaw, 0)
          }

          // Proximity-triggered exhibit sounds: fires once per approach
          // (armed → play → disarmed), only re-arming once the visitor has
          // walked back out past a wider radius — otherwise standing right
          // next to an exhibit would restart its clip on every frame.
          // Also tracks the single nearest exhibit (within INFO_RADIUS) for
          // the info-card overlay below.
          let nearest = null
          let nearestDist = INFO_RADIUS
          for (const trigger of exhibitTriggers) {
            const dist = camera.position.distanceTo(trigger.position)
            if (trigger.audio) {
              if (trigger.armed && dist < TRIGGER_RADIUS) {
                trigger.armed = false
                if (trigger.audio.buffer && !trigger.audio.isPlaying) trigger.audio.play()
              } else if (!trigger.armed && dist > RETRIGGER_RADIUS) {
                trigger.armed = true
              }
            }
            if (dist < nearestDist) {
              nearestDist = dist
              nearest = trigger
            }
          }
          const nearestKey = nearest ? nearest.title : null
          if (nearestKey !== lastInfoKey) {
            lastInfoKey = nearestKey
            setActiveExhibit(nearest ? { title: nearest.title, description: nearest.description } : null)
          }

          // Video screens: only decode/play (muted) once a visitor is close
          // enough to plausibly be looking at one — five clips all decoding
          // at once from across the room would be pure waste. All pause
          // while the fullscreen documentary overlay is open (`duckAudio`
          // doubles as that signal here) so nothing decodes twice at once.
          for (const screen of videoScreens) {
            const dist = camera.position.distanceTo(screen.mesh.position)
            const shouldPlay = !duckAudioRef.current && dist < VIDEO_PREVIEW_RADIUS
            if (shouldPlay && screen.video.paused) {
              screen.video.play().catch(() => {})
            } else if (!shouldPlay && !screen.video.paused) {
              screen.video.pause()
            }
          }

          renderer.render(scene, camera)
        })

        setStatus('ready')

        const handleResize = () => {
          if (!container) return
          camera.aspect = container.clientWidth / container.clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(container.clientWidth, container.clientHeight)
        }
        window.addEventListener('resize', handleResize)

        cleanupRef.current = () => {
          renderer.setAnimationLoop(null)
          setActiveExhibit(null)
          if (ambience.isPlaying) ambience.stop()
          ambienceRef.current = null
          exhibitTriggers.forEach(({ audio }) => {
            if (audio?.isPlaying) audio.stop()
          })
          videoScreens.forEach(({ video }) => {
            video.pause()
            video.removeAttribute('src')
            video.load() // releases the decoder — clearing src alone leaves it held on some browsers
          })
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('keydown', onKeyDown)
          window.removeEventListener('keyup', onKeyUp)
          renderer.domElement.removeEventListener('pointerdown', onPointerDown)
          renderer.domElement.removeEventListener('pointermove', onPointerMove)
          renderer.domElement.removeEventListener('pointerup', onPointerUp)
          renderer.domElement.removeEventListener('pointercancel', onPointerUp)
          joyBase?.removeEventListener('pointerdown', onJoyDown)
          joyBase?.removeEventListener('pointermove', onJoyMove)
          joyBase?.removeEventListener('pointerup', onJoyUp)
          joyBase?.removeEventListener('pointercancel', onJoyUp)
          scene.traverse((obj) => {
            obj.geometry?.dispose?.()
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
            mats.forEach((m) => {
              m?.map?.dispose?.()
              m?.dispose?.()
            })
          })
          renderer.dispose()
          vrButton.parentNode?.removeChild(vrButton)
          renderer.domElement.parentNode?.removeChild(renderer.domElement)
        }
      } catch (err) {
        console.error('GondMuseumViewer: load failed', err)
        if (!cancelled) setStatus('error')
      }
    })()

    return () => {
      cancelled = true
      cleanupRef.current?.()
    }
  }, [src])

  return (
    <div className={`gond-viewer ${fill ? 'gond-viewer--fill' : ''}`}>
      <div className="gond-viewer__stage" ref={stageRef}>
        {status !== 'ready' && (
          <div className="gond-viewer__overlay">
            {status === 'loading' && (
              <div className="gond-viewer__progress">
                <span className="gond-viewer__status">Loading the museum{progress > 0 ? `… ${progress}%` : '…'}</span>
                <div className="gond-viewer__progress-track">
                  <div className="gond-viewer__progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            {status === 'error' && (
              <span className="gond-viewer__status">Couldn&rsquo;t load the museum experience. Please try again later.</span>
            )}
          </div>
        )}
        {/* Always mounted (not gated on `status`) so its ref exists before the
            load effect wires up its pointer handlers — the loading overlay
            sits on top and visually hides it until the model is ready. */}
        <div className="gond-viewer__joystick" ref={joystickBaseRef} aria-hidden="true">
          <div className="gond-viewer__joystick-knob" ref={joystickKnobRef} />
        </div>
        {activeExhibit && (
          <div className="gond-viewer__info-card" role="status">
            <h4>{activeExhibit.title}</h4>
            <p>{activeExhibit.description}</p>
          </div>
        )}
      </div>
      {status === 'ready' && (
        <p className="gond-viewer__hint">Drag to look around · WASD, arrow keys, or the joystick to walk · click a video screen to watch · Enter VR on a headset for the full experience</p>
      )}
    </div>
  )
}
