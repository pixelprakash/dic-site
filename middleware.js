import { getMemberBySlug } from './src/data/peopleData.js';

// Runs at the edge, before Vercel's SPA rewrite serves index.html for
// every path. Social-media crawlers (WhatsApp, Instagram, Facebook,
// Slack, ...) fetch a URL's HTML directly and read its <meta> tags —
// they never execute the React app's JS, so anything set client-side
// (document.title, etc.) is invisible to them. This intercepts just
// /people/:slug, swaps the site-wide OG tags for that person's own
// name/bio/photo, and serves that — real visitors still get the exact
// same index.html and the SPA takes over normally once it hydrates.
export const config = {
  matcher: ['/people/:slug'],
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/people\/([^/]+)\/?$/);
  if (!match) return;

  const slug = decodeURIComponent(match[1]);
  const member = getMemberBySlug(slug);
  if (!member) return;

  const indexRes = await fetch(new URL('/index.html', request.url));
  let html = await indexRes.text();

  const title = `${member.name} — DIC · IITH`;
  const description = escapeHtml(
    member.bio || `${member.role} at the Design Innovation Centre, IIT Hyderabad.`,
  );
  const image = member.photo
    ? new URL(member.photo, url.origin).toString()
    : new URL('/images/diclogo.webp', url.origin).toString();
  const pageUrl = url.toString();
  const escapedTitle = escapeHtml(title);

  html = html
    .replace(/<title>.*?<\/title>/, `<title>${escapedTitle}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${escapeHtml(pageUrl)}$2`)
    .replace(/(<meta property="og:site_name" content=")[^"]*(")/, `$1${escapedTitle}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escapedTitle}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${escapeHtml(image)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escapedTitle}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${escapeHtml(image)}$2`);

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
