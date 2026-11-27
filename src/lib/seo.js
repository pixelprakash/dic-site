import { ROUTE_META, SITE, UNLISTED } from '../data/seoData.js';

// Keeps the document's <head> in step with the page on screen: title,
// description, canonical address, Open Graph / Twitter tags, robots, and a
// BreadcrumbList. (Crawlers that don't run JavaScript get the same tags from
// the edge middleware; this covers everything that does, and in-app navigation.)

function tag(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

const meta = (attr, name) =>
  tag(`meta[${attr}="${name}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(attr, name);
    return m;
  });

const absolute = (path) => (/^https?:\/\//.test(path) ? path : `${SITE.url}${path}`);

const LABELS = {
  about: 'About', research: 'Research', projects: 'Projects', people: 'People', education: 'Education',
  practices: 'Practices', nodal: 'DIC Nodal', contact: 'Contact', news: 'News', events: 'Events',
  workshops: 'Workshops', conferences: 'Conferences', blogs: 'Blogs',
};

export function breadcrumbs(path, title) {
  const parts = path.split('/').filter(Boolean);
  const items = [{ name: 'Home', url: SITE.url + '/' }];
  let acc = '';
  parts.forEach((p, i) => {
    acc += `/${p}`;
    items.push({
      name: i === parts.length - 1 && i > 0 ? title.replace(/ — .*$/, '') : LABELS[p] || p,
      url: SITE.url + acc,
    });
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

export function setPageMeta({ title, description, path, image, noindex = false } = {}) {
  const p = path ?? window.location.pathname;
  const known = ROUTE_META[p];
  const t = title || known?.title || SITE.name;
  const d = description || known?.description || ROUTE_META['/'].description;
  const url = SITE.url + (p === '/' ? '/' : p.replace(/\/$/, ''));
  const img = absolute(image || SITE.image);

  document.title = t;
  meta('name', 'description').setAttribute('content', d);
  const robots = noindex ? 'noindex, nofollow' : UNLISTED.includes(p) ? 'noindex, follow' : 'index, follow';
  meta('name', 'robots').setAttribute('content', robots);
  tag('link[rel="canonical"]', () => {
    const l = document.createElement('link');
    l.rel = 'canonical';
    return l;
  }).setAttribute('href', url);

  meta('property', 'og:type').setAttribute('content', 'website');
  meta('property', 'og:url').setAttribute('content', url);
  meta('property', 'og:title').setAttribute('content', t);
  meta('property', 'og:description').setAttribute('content', d);
  meta('property', 'og:image').setAttribute('content', img);
  meta('name', 'twitter:card').setAttribute('content', 'summary_large_image');
  meta('name', 'twitter:title').setAttribute('content', t);
  meta('name', 'twitter:description').setAttribute('content', d);
  meta('name', 'twitter:image').setAttribute('content', img);

  const ld = tag('script#ld-breadcrumb', () => {
    const s = document.createElement('script');
    s.id = 'ld-breadcrumb';
    s.type = 'application/ld+json';
    return s;
  });
  ld.textContent = noindex || p === '/' ? '' : JSON.stringify(breadcrumbs(p, t));
}
