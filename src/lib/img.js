// Responsive image sources, so a phone downloads a phone-sized photo.
//
// Local photos that have smaller copies (see LOCAL_VARIANTS, generated as
// name-600.webp, name-1000.webp beside the original) and Sanity CDN images
// (resized on the fly with ?w=) both come back as { src, srcSet }.

// path -> the widths that exist as name-<w>.webp, besides the original (whose width is `full`).
const LOCAL_VARIANTS = {
  '/images/image7.webp': { widths: [600, 1000], full: 1600 },
  '/images/image68.webp': { widths: [600, 1000], full: 1600 },
  '/images/image85.webp': { widths: [600, 1000], full: 1600 },
  '/images/projects/temple-heritage.webp': { widths: [600], full: 990 },
  '/images/projects/telangana-heritage.webp': { widths: [600], full: 990 },
  '/images/projects/ai-ar-vr-learning-models.webp': { widths: [600], full: 858 },
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
