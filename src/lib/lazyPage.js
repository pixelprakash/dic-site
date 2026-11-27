import { createElement, lazy } from 'react';

/* A code-split page that can be loaded ahead of time. Once loaded it renders
   straight away, with no loading screen in between. That matters twice: the
   build renders every page to HTML (scripts/prerender.mjs), and the browser
   swaps that HTML for the running app without a blank frame. */
export function lazyPage(load) {
  let Loaded = null;
  let pending = null;
  const preload = () => {
    pending ??= load().then(
      (module) => {
        Loaded = module.default;
        return module;
      },
      (error) => {
        pending = null; // a failed download may be tried again
        throw error;
      },
    );
    return pending;
  };
  const Lazy = lazy(preload);
  // Decided once per mount, so a page already on screen is never remounted
  // when its chunk finishes loading.
  let Chosen = null;
  function Page(props) {
    Chosen ??= Loaded || Lazy;
    return createElement(Chosen, props);
  }
  Page.preload = preload;
  return Page;
}
