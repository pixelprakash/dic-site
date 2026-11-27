// Responsive image sources, so a phone downloads a phone-sized photo.
//
// Local photos that have smaller copies (see LOCAL_VARIANTS, generated as
// name-600.webp, name-1000.webp beside the original) and Sanity CDN images
// (resized on the fly with ?w=) both come back as { src, srcSet }.

// path -> the widths that exist as name-<w>.webp, besides the original (whose width is `full`).
const LOCAL_VARIANTS = {
  '/images/image103.webp': { widths: [600, 1000], full: 1200 },
  '/images/image39.webp': { widths: [600, 1000], full: 1600 },
  '/images/image40.webp': { widths: [600, 1000], full: 1600 },
  '/images/image52.webp': { widths: [600], full: 1067 },
  '/images/image55.webp': { widths: [600, 1000], full: 1600 },
  '/images/image56.webp': { widths: [600, 1000], full: 1600 },
  '/images/image67.webp': { widths: [600, 1000], full: 1600 },
  '/images/image68.webp': { widths: [600, 1000], full: 1600 },
  '/images/image7.webp': { widths: [600, 1000], full: 1600 },
  '/images/image84.webp': { widths: [600, 1000], full: 1200 },
  '/images/image85.webp': { widths: [600, 1000], full: 1200 },
  '/images/projects/ai-ar-vr-learning-models.webp': { widths: [600], full: 858 },
  '/images/projects/aquaproject/aquaponics-1.webp': { widths: [600, 1000], full: 1800 },
  '/images/projects/aquaproject/aquaponics-2.webp': { widths: [600, 1000], full: 1800 },
  '/images/projects/aquaproject/aquaponics-3.webp': { widths: [600, 1000], full: 1800 },
  '/images/projects/aquaproject/aquaponics-4.webp': { widths: [600], full: 1012 },
  '/images/projects/aquaproject/aquaponics-5.webp': { widths: [600], full: 1012 },
  '/images/projects/aquaproject/aquaponics-6.webp': { widths: [600], full: 1012 },
  '/images/projects/telangana-heritage.webp': { widths: [600], full: 990 },
  '/images/projects/temple-heritage.webp': { widths: [600], full: 990 },
  '/images/research/dhoolpet-idol-makers/dhoolpet-2.webp': { widths: [600, 1000], full: 1600 },
  '/images/research/dhoolpet-idol-makers/dhoolpet-4.webp': { widths: [600, 1000], full: 1200 },
  '/images/research/dhoolpet-idol-makers/dhoolpet-5.webp': { widths: [600], full: 1067 },
  '/images/research/tangible-intangible-heritage-gonds.webp': { widths: [600, 1000], full: 1383 },
  '/images/testimonials/chandu.webp': { widths: [400], full: 600 },
};

export function responsive(src, widths = [600, 1000, 1600]) {
  if (!src) return { src, srcSet: undefined };
  const local = LOCAL_VARIANTS[src];
  if (local) {
    const set = local.widths.map((w) => `${src.replace('.webp', `-${w}.webp`)} ${w}w`);
    set.push(`${src} ${local.full}w`);
    return { src, srcSet: set.join(', ') };
  }
  if (src.includes('cdn.sanity.io')) {
    const base = src.split('?')[0];
    return {
      src,
      srcSet: widths.map((w) => `${base}?w=${w}&auto=format&q=82 ${w}w`).join(', '),
    };
  }
  return { src, srcSet: undefined };
}
