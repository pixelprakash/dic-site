import { defineConfig } from 'vite';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import react from '@vitejs/plugin-react';
import { ORGANIZATION_LD } from './src/data/seoData.js';

// Puts the organisation's structured data (schema.org JSON-LD) into index.html
// at build time, from the one source in src/data/seoData.js.
const structuredData = () => ({
  name: 'dic-structured-data',
  transformIndexHtml(html) {
    const site = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: ORGANIZATION_LD.name,
      url: ORGANIZATION_LD.url,
      inLanguage: 'en-IN',
    };
    const tags = [ORGANIZATION_LD, site]
      .map((d) => `<script type="application/ld+json">${JSON.stringify(d)}</script>`)
      .join('\n    ');
    return html.replace('<!--JSON-LD-->', tags);
  },
});

// `npm run preview` serves the built pages the way the live host does: a page's
// own HTML where one was built, the empty app shell everywhere else.
const previewLikeProduction = () => ({
  name: 'dic-preview-routes',
  configurePreviewServer(server) {
    const dist = join(server.config.root, server.config.build.outDir);
    server.middlewares.use((req, _res, next) => {
      const [path, query] = req.url.split('?');
      if (!/\.\w+$/.test(path)) {
        const own = join(path, 'index.html');
        req.url = (existsSync(join(dist, own)) ? own : '/spa.html') + (query ? `?${query}` : '');
      }
      next();
    });
  },
});

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), structuredData(), previewLikeProduction()],
  build: {
    manifest: !isSsrBuild,
    rollupOptions: {
      output: isSsrBuild
        ? {}
        : {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
            },
          },
    },
  },
}));
