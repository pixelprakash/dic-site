import { useSyncExternalStore } from 'react';

// Three complete designs for the whole site, switchable for review:
//   'a' — the redesign (after lfs.org.uk): fixed video hero on Home, condensed
//         display type, black bars, grey panels, square corners
//         (see styles/redesign.css, pages/HomeRedesign.jsx)
//   'b' — the site as it was before the redesign
//   'c' — design 3 (after quakerschool.org): warm cream page, soft serif
//         display type, pastel rounded sheets, pill buttons — mobile first,
//         built for accessibility (see styles/redesign-c.css, pages/HomeC.jsx)
// The choice is stored on <html data-design="…"> so CSS can key off it, kept
// in localStorage, and can be forced with ?design=a|b|c. Once one is chosen,
// delete this file, DesignToggle, redesign.css and the losing Home page.
const KEY = 'dic-design';
const DEFAULT = 'a';
const listeners = new Set();

const valid = (v) => (v === 'a' || v === 'b' || v === 'c' ? v : null);

function read() {
  try {
    const fromUrl = valid(new URLSearchParams(window.location.search).get('design'));
    if (fromUrl) {
      window.localStorage.setItem(KEY, fromUrl);
      return fromUrl;
    }
    return valid(window.localStorage.getItem(KEY)) || DEFAULT;
  } catch {
    return DEFAULT;
  }
}

let current = typeof window === 'undefined' ? DEFAULT : read();
if (typeof document !== 'undefined') document.documentElement.dataset.design = current;

export function setDesign(next) {
  if (!valid(next) || next === current) return;
  current = next;
  document.documentElement.dataset.design = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    /* private mode: the choice just lasts for this visit */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useDesign = () => useSyncExternalStore(subscribe, () => current, () => DEFAULT);
