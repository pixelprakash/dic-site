import { defineConfig } from 'vite';
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

export default defineConfig({
  plugins: [react(), structuredData()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
