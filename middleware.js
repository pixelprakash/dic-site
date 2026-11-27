import { SITE } from './src/data/seoData.js';

// Every page the site knows about is built to its own HTML file, with its own
// title, description and content (scripts/prerender.mjs), and the host serves
// those files directly. That leaves one case for the edge: a person who exists
// only in the CMS, added since the last build. Link previews and crawlers
// don't run the app, so this puts that person's name, bio and photo into the
// empty app shell before sending it. Real visitors get the same shell and the
// app takes over as usual.
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
  if (!match) return;
  const slug = decodeURIComponent(match[1]);
  // Most people have a built page, which is served as it is. Asking for an
  // address with none gets the empty app shell, recognised by its empty root.
  const shell = await fetch(new URL(`/people/${encodeURIComponent(slug)}/index.html`, request.url));
  if (!shell.ok) return;
  const html = await shell.text();
  if (!html.includes('<div id="root"></div>')) return;
  const member = await cmsMember(slug);
  if (!member) return;
  const image = member.photo
    ? new URL(member.photo, url.origin).toString()
    : `${SITE.url}${SITE.image}`;
  return htmlResponse(
    withHead(html, {
      title: `${member.name} — DIC · IITH`,
      description: member.bio || `${member.role} at the Design Innovation Centre, IIT Hyderabad.`,
      url: `${SITE.url}${path}`,
      image,
    }),
  );
}
