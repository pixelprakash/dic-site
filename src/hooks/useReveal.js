import { useEffect, useRef, useState } from 'react';

export function useReveal(threshold = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        // Fire a little before the element's top edge reaches the bottom
        // of the viewport, not only once 15% of the element's own height
        // (the old default) is already on screen. That 15%-of-self rule
        // was fine for a short hero block, but a tall wrapper — a whole
        // card list stacked into one observed section, for instance —
        // could need a long stretch of scrolling before 15% of its own
        // multi-thousand-pixel height was exposed, so the content sat
        // invisible (opacity: 0 from the .reveal class) well after it was
        // already on screen, reading as "nothing loaded until I scrolled".
        rootMargin: '0px 0px -5% 0px',
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
