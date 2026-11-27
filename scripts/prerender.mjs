// Runs after `vite build` (see "build" in package.json). For every known page it
// writes dist/<path>/index.html containing the page's real content, title,
// description and structured data, so search engines, link previews and AI
// agents that don't run JavaScript can read the whole site, and visitors see
// the page before the app has started.
//
// It also writes:
//   dist/spa.html       the empty app shell, for addresses with no built page
//                       (content that exists only in the CMS, or a bad link)
//   dist/llms.txt       a short guide to the site for AI agents
//   dist/llms-full.txt  the text of every page in one file
//
//   dist/sitemap.xml    the same list of pages, for search engines
//
// Pages are built from the content published in the CMS when the build runs,
// with the copy in src/data for anything the CMS doesn't have (or if it can't
// be reached). Edits made later show in the browser at once, and reach these
// built files at the next deploy.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ORGANIZATION_LD, ROUTE_META, SITE, UNLISTED } from '../src/data/seoData.js';
import { breadcrumbs } from '../src/lib/seo.js';
import { MEMBERS } from '../src/data/peopleData.js';
import { PROJECTS } from '../src/data/projectsData.js';
import { RESEARCH_PROJECTS } from '../src/data/researchProjectsData.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(readFileSync(join(dist, '.vite/manifest.json'), 'utf8'));
const { render, fetchAll } = await import(pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href);

const { content, failed } = await fetchAll();
if (failed.length) console.warn(`prerender: CMS not reached for ${failed.join(', ')}; using the built-in copy`);

const absolute = (src) => (!src ? undefined : /^https?:/.test(src) ? src : `${SITE.url}${src}`);
const clip = (text = '', n = 200) => {
  const t = String(text).replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n).replace(/\s+\S*$/, '')}…`;
};
const centre = { '@type': 'ResearchOrganization', name: ORGANIZATION_LD.name, url: SITE.url };

/* ── The pages ── */
const PAGE_FILES = {
  '/': 'HomeRedesign', '/about': 'About', '/research': 'Research', '/projects': 'Projects',
  '/people': 'People', '/education': 'Education', '/practices': 'Practices', '/nodal': 'Nodal',
  '/contact': 'Contact', '/news': 'News', '/events': 'Events', '/workshops': 'Workshops',
  '/conferences': 'Conferences', '/conferences/fourth-all-india-dic-meet': 'FourthDicMeet', '/blogs': 'Blogs',
  '/blogs/reimagining-formative-assessment-art-education': 'BlogDetail',
  '/blogs/wiki-thesis-research-assessment-ai': 'WikiThesisBlog',
  '/blogs/how-intelligent-are-we-about-natural-intelligence': 'NaturalIntelligenceBlog',
};

const pages = Object.entries(ROUTE_META).map(([path, m]) => ({
  path, ...m, file: PAGE_FILES[path], section: path.startsWith('/blogs/') ? 'Articles' : 'Main pages', ld: [],
}));

const meet = pages.find((p) => p.path === '/conferences/fourth-all-india-dic-meet');
meet.ld.push({
  '@context': 'https://schema.org', '@type': 'Event', name: 'Fourth All India Design Innovation Centre Meet',
  startDate: '2024-05-02', endDate: '2024-05-03', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: { '@type': 'Place', name: 'IIT Hyderabad', address: ORGANIZATION_LD.address },
  organizer: centre, description: meet.description,
});

for (const p of pages.filter((x) => x.section === 'Articles')) {
  p.ld.push({
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title.replace(/ — DIC · IITH$/, ''),
    description: p.description, url: absolute(p.path), publisher: centre,
  });
}

for (const project of content.projects || PROJECTS) {
  const description = clip(project.tagline || project.subtitle || project.description?.[0]);
  pages.push({
    path: `/projects/${project.slug}`, title: `${project.title} — DIC · IITH`, description, image: project.image,
    file: 'ProjectDetail', section: 'Projects',
    ld: [{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description, url: absolute(`/projects/${project.slug}`), image: absolute(project.image), keywords: project.tags?.join(', '), producer: centre }],
  });
}

for (const study of (content.research || RESEARCH_PROJECTS).filter((r) => !r.hidden)) {
  const description = clip(study.tagline);
  pages.push({
    path: `/research/${study.slug}`, title: `${study.title} — DIC · IITH`, description, image: study.image,
    file: 'ResearchDetail', section: 'Research',
    ld: [{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: study.title, description, url: absolute(`/research/${study.slug}`), image: absolute(study.image), keywords: study.tags?.join(', '), producer: centre }],
  });
}

for (const m of Object.values(content.members || MEMBERS).flat().filter((x) => !x.placeholder)) {
  // led by the name where the bio doesn't give it, so no two people share one
  const bio = m.bio || `${m.role} at the Design Innovation Centre, IIT Hyderabad.`;
  const description = clip(bio.includes(m.name.split(' ')[0]) ? bio : `${m.name}: ${bio}`);
  pages.push({
    path: `/people/${m.id}`, title: `${m.name} — DIC · IITH`, description, image: m.photo,
    file: 'PersonProfile', section: 'People',
    ld: [{ '@context': 'https://schema.org', '@type': 'Person', name: m.name, jobTitle: m.role, description, url: absolute(`/people/${m.id}`), image: absolute(m.photo), affiliation: centre, sameAs: [m.linkedin, m.scholar, m.website].filter(Boolean) }],
  });
}

// Articles and news that exist only in the CMS.
for (const post of content.posts || []) {
  if (post.externalUrl || pages.some((p) => p.path === post.path)) continue;
  const description = clip(post.excerpt || post.title);
  pages.push({
    path: post.path, title: `${post.title} — DIC · IITH`, description, file: 'BlogPost', section: 'Articles',
    ld: [{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description, url: absolute(post.path), datePublished: post.iso, publisher: centre }],
  });
}

for (const post of content.feed || []) {
  const heading = post.title || post.text.split('\n')[0];
  const path = `/news/${post.slug}`;
  const description = clip(post.text || heading);
  const image = post.images[0]?.src;
  pages.push({
    path, title: `${clip(heading, 90)} — DIC · IITH`, description, image, file: 'NewsPost', section: 'News',
    ld: [{ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: clip(heading, 110), description, url: absolute(path), datePublished: post.date, image, publisher: centre }],
  });
}

/* ── Writing the HTML ── */
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const script = (data, extra = '') => `<script${extra} type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

// The page's own stylesheets (its code is split from the rest), so the HTML is
// styled as soon as it paints rather than when the app starts.
function assetsFor(file) {
  // A chunk that other chunks import is listed under a generated key, so it is
  // matched by name too. The home design ships inside the Home chunk.
  const name = file === 'HomeRedesign' ? 'Home' : file;
  const entry = Object.keys(manifest).find(
    (k) => k === `src/pages/${name}.jsx` || (manifest[k].isDynamicEntry && manifest[k].name === name),
  );
  if (!entry) throw new Error(`prerender: no built chunk found for page ${name}`);
  const css = new Set();
  const js = new Set();
  const walk = (key) => {
    const item = manifest[key];
    if (!item || item.isEntry || js.has(item.file)) return;
    js.add(item.file);
    item.css?.forEach((c) => css.add(c));
    item.imports?.forEach(walk);
  };
  walk(entry);
  return [
    ...[...css].filter((c) => !template.includes(c)).map((c) => `<link rel="stylesheet" crossorigin href="/${c}">`),
    ...[...js].filter((j) => !template.includes(j)).map((j) => `<link rel="modulepreload" crossorigin href="/${j}">`),
  ];
}

function document_(page, body, uses) {
  const url = `${SITE.url}${page.path === '/' ? '/' : page.path}`;
  const image = absolute(page.image) || absolute(SITE.image);
  const set = (html, pattern, value) => html.replace(pattern, (_, a, b) => `${a}${attr(value)}${b}`);
  let html = template.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${attr(page.title)}</title>`);
  html = set(html, /(<meta name="description" content=")[^"]*(")/, page.description);
  html = set(html, /(<link rel="canonical" href=")[^"]*(")/, url);
  for (const [key, value] of Object.entries({ 'og:url': url, 'og:title': page.title, 'og:description': page.description, 'og:image': image })) {
    html = set(html, new RegExp(`(<meta property="${key}" content=")[^"]*(")`), value);
  }
  for (const [key, value] of Object.entries({ 'twitter:title': page.title, 'twitter:description': page.description, 'twitter:image': image })) {
    html = set(html, new RegExp(`(<meta name="${key}" content=")[^"]*(")`), value);
  }
  // the size and alt text describe the default share image only
  if (page.image) html = html.replace(/\s*<meta property="og:image:(width|height|alt)"[^>]*>/g, '');
  if (UNLISTED.includes(page.path)) html = set(html, /(<meta name="robots" content=")[^"]*(")/, 'noindex, follow');
  // the CMS content this page shows, so the app starts from the same
  const data = Object.fromEntries(uses.filter((key) => content[key]).map((key) => [key, content[key]]));
  const head = [
    ...assetsFor(page.file),
    ...page.ld.map((d) => script(d)),
    ...(page.path === '/' ? [] : [script(breadcrumbs(page.path, page.title), ' id="ld-breadcrumb"')]),
  ];
  return html
    .replace('</head>', () => `  ${head.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', () => {
      const seed = Object.keys(data).length
        ? `\n    <script>window.__DIC_CMS__=${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
        : '';
      return `<div id="root">${body}</div>${seed}`;
    });
}

writeFileSync(join(dist, 'spa.html'), template);

const bodies = new Map();
for (const page of pages) {
  const { html: body, uses } = await render(page.path);
  if (!body.includes('<h1')) throw new Error(`prerender: ${page.path} came out without its content`);
  bodies.set(page.path, body);
  const out = join(dist, page.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, document_(page, body, uses));
}

/* ── The guide and full text for AI agents ── */
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) => s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (all, e) => {
  if (e[0] !== '#') return ENTITIES[e.toLowerCase()] ?? all;
  return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
});

function toText(html) {
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] || '';
  return decode(
    main
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(svg|script|style|button|form|dialog|nav)\b[\s\S]*?<\/\1>/g, ' ')
      .replace(/<([a-z]+)\b[^>]*aria-hidden="true"[^>]*>[^<]*<\/\1>/g, ' ')
      .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g, (_, n, t) => `\n\n${'#'.repeat(Math.min(6, +n + 2))} ${t.replace(/<[^>]+>/g, ' ')}\n\n`)
      .replace(/<li\b[^>]*>/g, '\n- ')
      .replace(/<\/(p|div|section|article|header|ul|ol|tr|table|blockquote|figure|figcaption)>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    // personal addresses stay on their profile pages; they are not gathered into one file
    .replace(/[\w.+-]+@(?!des\.iith\.ac\.in)[\w-]+(\.[\w-]+)+/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n-\s*(?=\n)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const listed = pages.filter((p) => !UNLISTED.includes(p.path));
const intro = [
  `# ${SITE.name}`,
  '',
  `> ${ORGANIZATION_LD.description}`,
  '',
  `- Part of: Department of Design, ${ORGANIZATION_LD.parentOrganization.name}`,
  `- Email: ${ORGANIZATION_LD.email}`,
  `- Phone: ${ORGANIZATION_LD.telephone}`,
  `- Address: ${ORGANIZATION_LD.address.streetAddress}, ${ORGANIZATION_LD.address.addressLocality}, ${ORGANIZATION_LD.address.addressRegion} ${ORGANIZATION_LD.address.postalCode}, India`,
  '- Enquiries (courses, collaboration, visits): by email. The website has no online application or booking system.',
  '',
];
const sections = ['Main pages', 'Projects', 'Research', 'News', 'Articles', 'People']
  .filter((name) => listed.some((p) => p.section === name))
  .map((name) => [
  `## ${name}`,
  '',
  ...listed.filter((p) => p.section === name).map((p) => `- [${p.title.replace(/ — DIC · IITH$/, '')}](${absolute(p.path)}): ${p.description}`),
  '',
].join('\n'));

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${listed
    .map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);

writeFileSync(join(dist, 'llms.txt'), [...intro, ...sections, '## Full text', '', `- [Every page in one file](${SITE.url}/llms-full.txt)`, `- [Sitemap](${SITE.url}/sitemap.xml)`, ''].join('\n'));
writeFileSync(join(dist, 'llms-full.txt'), [...intro, ...listed.map((p) => `\n## ${p.title.replace(/ — DIC · IITH$/, '')}\n\nSource: ${absolute(p.path)}\n\n${toText(bodies.get(p.path))}\n`)].join('\n'));

rmSync(join(root, 'dist-ssr'), { recursive: true, force: true });
rmSync(join(dist, '.vite'), { recursive: true, force: true });
console.log(`prerender: ${pages.length} pages (CMS: ${Object.keys(content).join(', ') || 'none'}), sitemap.xml, llms.txt, llms-full.txt`);
