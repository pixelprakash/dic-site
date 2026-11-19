// Writes public/sitemap.xml from the site's own data: every static page, plus
// every profile, project, research study, blog post and conference that exists
// in the built-in data. (Content that exists only in the CMS is not listed
// here; the pages themselves are still crawlable through the site's links.)
// Runs before every build (see "prebuild" in package.json).
import { writeFileSync } from 'node:fs';
import { SITE, ROUTE_META } from '../src/data/seoData.js';
import { MEMBERS } from '../src/data/peopleData.js';
import { PROJECTS } from '../src/data/projectsData.js';
import { RESEARCH_PROJECTS } from '../src/data/researchProjectsData.js';
import { BLOG_POSTS } from '../src/data/blogsData.js';

const today = new Date().toISOString().slice(0, 10);
const urls = new Map();
const add = (path, priority, freq = 'monthly') => urls.set(path, { priority, freq });

Object.keys(ROUTE_META).forEach((p) => add(p, p === '/' ? '1.0' : p.split('/').length > 2 ? '0.5' : '0.8', p === '/' ? 'weekly' : 'monthly'));
Object.values(MEMBERS).flat().filter((m) => !m.placeholder).forEach((m) => add(`/people/${m.id}`, '0.5'));
PROJECTS.forEach((p) => add(`/projects/${p.slug}`, '0.6'));
RESEARCH_PROJECTS.filter((r) => !r.hidden).forEach((r) => add(`/research/${r.slug}`, '0.6'));
(Array.isArray(BLOG_POSTS) ? BLOG_POSTS : []).forEach((b) => b.slug && add(`/blogs/${b.slug}`, '0.5'));
['reimagining-formative-assessment-art-education', 'wiki-thesis-research-assessment-ai', 'how-intelligent-are-we-about-natural-intelligence']
  .forEach((s) => add(`/blogs/${s}`, '0.5'));

const body = [...urls.entries()]
  .map(([path, u]) => `  <url><loc>${SITE.url}${path === '/' ? '/' : path}</loc><lastmod>${today}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`)
  .join('\n');

writeFileSync(
  new URL('../public/sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${urls.size} URLs`);
