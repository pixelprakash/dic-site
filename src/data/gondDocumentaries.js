// The APK bundled these five as local .mp4 files (Assets/Videos/…), played
// through a Unity VideoPlayer onto an in-scene UI panel — not the YouTube
// embeds they were half-remembered as (confirmed: no YouTube URLs or plugin
// anywhere in the APK). Titles are the source filenames as-authored, typos
// kept rather than silently "corrected".
//
// `screenPosition` places each clip as an actual video screen inside the
// walkable room. The original VideoPlayer components were UI Canvas
// elements (RectTransform, rendering to a RenderTexture), not objects
// placed in the 3D scene — so there is no "original" in-world position to
// recover here. These placements are a curatorial choice made for this
// rebuild, not a reconstruction of the source app's kiosk locations.
//
// The hall is a serpentine gallery (outer walls at x ≈ ±5.5, exhibits in
// staggered rows between), so the screens hang on the outer walls where
// they're clear of the exhibits: three on the east wall, two on the west,
// roughly beside the artefacts they're closest to in theme (see `near`).
// Positions were set against the model rebuilt from the Blender/FBX source —
// earlier ones (x = -8.5) now fall behind the partition walls.
export const DOCUMENTARIES = [
  {
    title: 'Nagoba Jatra Festival — Gond Documentary Trailer',
    file: '/videos/gond/nagoba_jatra.mp4',
    screenPosition: [-5.6, 1.9, 10.5],
    near: 'the shrine totems (Pedastals / RajulPen) — Nagoba Jatra is the Mesram clan’s snake-deity festival',
  },
  {
    title: 'Dandari Gussadi',
    file: '/videos/gond/dandari_gussadi.mp4',
    screenPosition: [5.4, 1.9, 6.0],
    near: 'the dance figures — Dandari Gussadi is a Gond dance performed at harvest festivals',
  },
  {
    title: 'Dhokra Casting (Trailer)',
    file: '/videos/gond/dhokra_casting_trailer.mp4',
    screenPosition: [5.5, 1.9, -6.0],
    near: 'the horse figure — cast bronze/brass horses are one of Dhokra craft’s most iconic forms',
  },
  {
    title: 'Thotis and Their Age-Old Traditions',
    file: '/videos/gond/thotis_traditions.mp4',
    screenPosition: [-5.6, 1.9, -11.0],
    near: 'the community/lineage figures — Thotis are a Gond priestly clan',
  },
  {
    title: 'Dhokra Casting — Digital Preservation of Indian Arts and Crafts',
    file: '/videos/gond/dhokra_casting_digital_preservation.mp4',
    screenPosition: [5.2, 1.9, -12.5],
    near: 'the dancer/craft figure cluster',
  },
]
