import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import '../styles/StoryFlow.css';

gsap.registerPlugin(ScrollTrigger);

export function StorySection({ className = '', style = {}, children, 'aria-label': ariaLabel }) {
  return (
    <section data-flow-section aria-label={ariaLabel} className={`story-section ${className}`}>
      <div data-flow-inner className="story-section__inner" style={style}>
        {children}
      </div>
    </section>
  );
}

export default function StoryFlow({ children, className = '', 'aria-label': ariaLabel = 'Story scroll' }) {
  const containerRef = useRef(null);
  const [skipEffect, setSkipEffect] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || window.matchMedia('(max-width: 767px)').matches
    );
  });

  useEffect(() => {
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileMq = window.matchMedia('(max-width: 767px)');
    const update = () => setSkipEffect(reduceMq.matches || mobileMq.matches);
    update();
    reduceMq.addEventListener('change', update);
    mobileMq.addEventListener('change', update);
    return () => {
      reduceMq.removeEventListener('change', update);
      mobileMq.removeEventListener('change', update);
    };
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const inners = sections
        .map((section) => section.querySelector('[data-flow-inner]'))
        .filter(Boolean);

      // Always reset first — guards against a leftover rotation/z-index
      // getting stuck when skipEffect flips (e.g. resize across the
      // mobile breakpoint) after the effect already ran once.
      gsap.set(inners, { clearProps: 'transform' });
      gsap.set(sections, { clearProps: 'zIndex' });

      if (skipEffect) return;

      const triggers = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector('[data-flow-inner]');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [React.Children.count(children), skipEffect] },
  );

  return (
    <div ref={containerRef} aria-label={ariaLabel} className={`story-flow ${className}`}>
      {children}
    </div>
  );
}
