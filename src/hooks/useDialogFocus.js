import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, video[controls], iframe, [tabindex]:not([tabindex="-1"])';

/* Keyboard handling for a pop-up that isn't a native <dialog>: focus moves
   into it when it opens, Tab stays inside it, and focus goes back to whatever
   opened it when it closes (WCAG 2.4.3). Escape stays with each pop-up. */
export function useDialogFocus(active) {
  const ref = useRef(null);

  useEffect(() => {
    const box = ref.current;
    if (!active || !box) return undefined;
    const opener = document.activeElement;
    const inside = () => [...box.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length);
    inside()[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const items = inside();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const outside = !box.contains(document.activeElement);
      if (e.shiftKey ? outside || document.activeElement === first : outside || document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [active]);

  return ref;
}
