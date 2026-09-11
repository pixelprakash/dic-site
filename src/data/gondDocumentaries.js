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
// All five sit in a row along the room's west wall (x ≈ -8.5, just inside
// the ~-9.6 wall face), evenly spaced along its length — an earlier pass
// placed each screen right next to its "matching" exhibit instead, which
// put two screens close enough to visually overlap each other and clip
// into an existing wall-art panel from some viewing angles. Ordered
// north→south to loosely track the exhibits they're thematically closest
// to (see `near`), without literally standing next to them.
export const DOCUMENTARIES = [
  {
    title: 'Nagoba Jatra Festival — Gond Documentary Trailer',
    file: '/videos/gond/nagoba_jatra.mp4',
    screenPosition: [-8.5, 2.0, 12.0],
    near: 'the shrine totems (Pedastals / RajulPen) — Nagoba Jatra is the Mesram clan’s snake-deity festival',
  },
  {
    title: 'Dandari Gussadi',
    file: '/videos/gond/dandari_gussadi.mp4',
    screenPosition: [-8.5, 2.0, 6.0],
    near: 'the dance figures — Dandari Gussadi is a Gond dance performed at harvest festivals',
  },
  {
    title: 'Dhokra Casting (Trailer)',
    file: '/videos/gond/dhokra_casting_trailer.mp4',
    screenPosition: [-8.5, 2.0, 0.0],
    near: 'the horse figure — cast bronze/brass horses are one of Dhokra craft’s most iconic forms',
  },
  {
    title: 'Thotis and Their Age-Old Traditions',
    file: '/videos/gond/thotis_traditions.mp4',
    screenPosition: [-8.5, 2.0, -6.0],
    near: 'the community/lineage figures — Thotis are a Gond priestly clan',
  },
  {
    title: 'Dhokra Casting — Digital Preservation of Indian Arts and Crafts',
    file: '/videos/gond/dhokra_casting_digital_preservation.mp4',
    screenPosition: [-8.5, 2.0, -12.0],
    near: 'the dancer/craft figure cluster',
  },
]
