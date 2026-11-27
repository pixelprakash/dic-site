// Renders one address to HTML at build time (see scripts/prerender.mjs).
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppShell, preloadRoute } from './App';
import { requested } from './lib/cms';

export { fetchAll } from './lib/cms';

export async function render(path) {
  await preloadRoute(path);
  requested.clear();
  const html = renderToString(
    <StaticRouter location={path}>
      <AppShell />
    </StaticRouter>
  );
  return { html, uses: [...requested] };
}
