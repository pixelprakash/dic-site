import { getMemberBySlug } from './src/data/peopleData.js';
import { ROUTE_META, SITE } from './src/data/seoData.js';

// Runs at the edge, before Vercel's SPA rewrite serves index.html for
// every path. Social-media crawlers (WhatsApp, Instagram, Facebook,
// Slack, ...) fetch a URL's HTML directly and read its <meta> tags —
// they never execute the React app's JS, so anything set client-side
// (document.title, etc.) is invisible to them. This intercepts just
// /people/:slug, swaps the site-wide OG tags for that person's own
// name/bio/photo, and serves that — real visitors still get the exact
// same index.html and the SPA takes over normally once it hydrates.
//
// The same is done for every other known page (see src/data/seoData.js), so
// search engines and link previews that don't run JavaScript get each page's
// own title, description and canonical address instead of the home page's.
// Static files (assets, images, sitemap, robots) are left alone.
export const config = {
  matcher: ['/((?!assets/|images/|fonts/|videos/|models/|audio/|sitemap\\.xml|robots\\.txt|favicon).*)'],
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// The person's own record in Sanity (the CMS the site reads from), so a
// profile added or edited in the Studio gets the right link preview too.
// Falls back to the built-in data if the CMS can't be reached.
const SANITY_API = 'https://u4p2oauj.apicdn.sanity.io/v2025-01-01/data/query/production';
async function cmsMember(slug) {
  try {
    const groq = '*[_type=="member" && slug.current==$slug][0]{name, role, bio, "photo": photo.asset->url}';
    const url = `${SANITY_API}?query=${encodeURIComponent(groq)}&$slug=${encodeURIComponent(JSON.stringify(slug))}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const { result } = await res.json();
    return result ? { ...result, photo: result.photo ? `${result.photo}?w=1200&h=630&fit=crop&auto=format` : '' } : null;
  } catch {
    return null;
  }
}

function withHead(html, { title, description, url, image }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(url);
  const i = escapeHtml(image);
  return html
    .replace(/<title>.*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${u}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${u}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${i}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${i}$2`);
}

const htmlResponse = (html) =>
  new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  const match = path.match(/^\/people\/([^/]+)$/);
  if (match) {
    const slug = decodeURIComponent(match[1]);
    const member = (await cmsMember(slug)) || getMemberBySlug(slug);
    if (!member) return;

    const indexRes = await fetch(new URL('/index.html', request.url));
    const image = member.photo
      ? new URL(member.photo, url.origin).toString()
      : `${SITE.url}${SITE.image}`;
    return htmlResponse(
      withHead(await indexRes.text(), {
        title: `${member.name} — DIC · IITH`,
        description: member.bio || `${member.role} at the Design Innovation Centre, IIT Hyderabad.`,
        url: `${SITE.url}${path}`,
        image,
      }),
    );
  }

  const meta = ROUTE_META[path];
  if (!meta) return;
  const indexRes = await fetch(new URL('/index.html', request.url));
  return htmlResponse(
    withHead(await indexRes.text(), {
      title: meta.title,
      description: meta.description,
      url: `${SITE.url}${path === '/' ? '/' : path}`,
      image: `${SITE.url}${SITE.image}`,
    }),
  );
}
