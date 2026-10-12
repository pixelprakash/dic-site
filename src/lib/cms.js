import { useEffect, useState } from 'react';
import { MEMBER_CATEGORIES, MEMBERS } from '../data/peopleData';
import { PROJECTS } from '../data/projectsData';
import { RESEARCH_PROJECTS } from '../data/researchProjectsData';
import { BLOG_POSTS } from '../data/blogsData';
import { CONFERENCES } from '../data/conferencesData';
import { CENTRES, EVENTS as NODAL_EVENTS } from '../data/nodalData';
import { COLLABORATORS, TESTIMONIALS } from '../data/siteData';

// Content comes from Sanity (the studio in /studio, deployed separately).
// Reading is public — the project id below is not a secret, and no token is
// shipped with the site.
//
// Every read is fetched once per page load and shared (every component that
// asks for the same key gets the same cache entry). The built-in copy in
// src/data/* is each section's fallback: it renders immediately, and is
// swapped for the live content when it arrives (or stays if the CMS is
// unreachable or has nothing published yet). News & Updates has no built-in
// copy: nothing published, nothing shown.
//
// A plain fetch against Sanity's public query endpoint (the CDN one) rather
// than the @sanity/client package: same result, a fraction of the bundle.
const API = 'https://u4p2oauj.apicdn.sanity.io/v2025-01-01/data/query/production';

async function query(groq) {
  const res = await fetch(`${API}?query=${encodeURIComponent(groq)}`);
  if (!res.ok) throw new Error(`Sanity ${res.status}`);
  return (await res.json()).result;
}

const cache = new Map(); // key -> { data, promise }

// The last good answer for each query is kept in localStorage, so a returning
// visitor sees their content immediately and it is refreshed in the
// background (stale-while-revalidate). Bump STORE's version if the shape the
// mappers produce ever changes.
const STORE = 'dic-cms:v1:';
const readStored = (key) => {
  try {
    const raw = localStorage.getItem(STORE + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const writeStored = (key, data) => {
  try {
    if (data) localStorage.setItem(STORE + key, JSON.stringify(data));
    else localStorage.removeItem(STORE + key);
  } catch {
    /* private mode or storage full: just skip caching */
  }
};

function load(key, groq, map) {
  let entry = cache.get(key);
  if (!entry) {
    entry = {};
    const stored = readStored(key);
    if (stored) entry.data = stored; // usable at once
    entry.promise = query(groq)
      .then((rows) => {
        // Nothing published yet counts as "no live content".
        const fresh = Array.isArray(rows) && rows.length ? map(rows) : null;
        entry.data = fresh;
        writeStored(key, fresh);
        return fresh;
      })
      .catch(() => {
        // Offline or blocked: keep whatever we already had.
        if (!('data' in entry)) entry.data = null;
        return entry.data;
      });
    cache.set(key, entry);
  }
  return entry;
}

/* Live content if there is any, else `fallback`. `loading` is true until the
   first answer arrives (a page that must not show "not found" for a
   CMS-only item yet can wait on it) — which is immediately, for anyone who
   has been here before. */
export function useCms(key, groq, map, fallback) {
  const known = load(key, groq, map);
  const [state, setState] = useState(() => ({
    data: 'data' in known ? known.data : undefined, // undefined = not answered yet
  }));

  useEffect(() => {
    let alive = true;
    known.promise.then((data) => {
      if (alive) setState((s) => (s.data === data ? s : { data }));
    });
    return () => {
      alive = false;
    };
    // key identifies the query; groq/map are module constants at call sites.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const answered = state.data !== undefined;
  return { data: state.data || fallback, loading: !answered, live: Boolean(state.data) };
}

/* ── Shaping what Sanity returns into what the pages already expect ── */

// Sanity's image CDN resizes and re-encodes on the fly via URL parameters.
export const sized = (url, w) => (url ? `${url}?w=${w}&auto=format&q=82` : url);

// Drops null/empty fields so a mapped object looks like the hand-written
// ones in src/data (absent, not null).
const compact = (o) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && v !== ''));
const paragraphs = (text) => {
  const parts = (text || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return parts.length > 1 ? parts : parts[0] || '';
};

/* ── People ── */
export const MEMBERS_QUERY = `*[_type == "member" && defined(slug.current)]{
  "id": slug.current, name, category, "order": coalesce(order, 9999), role, track,
  joinedYear, defenceYear, relievedYear, "photo": photo.asset->url,
  bio, fullBio, tags, interests, researchAreas,
  experience[]{role, org, duration, desc},
  education[]{degree, institution, year},
  achievements,
  publications[]{title, venue, year, link},
  email, website, linkedin, scholar
}`;

export const mapMembers = (rows) => {
  const grouped = Object.fromEntries(MEMBER_CATEGORIES.map((c) => [c.id, []]));
  [...rows]
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .forEach((r) => {
      if (!grouped[r.category]) return;
      grouped[r.category].push({
        ...compact({
          id: r.id,
          name: r.name,
          role: r.role,
          track: r.track,
          joinedYear: r.joinedYear,
          defenceYear: r.defenceYear,
          relievedYear: r.relievedYear,
          photo: sized(r.photo, 800),
          bio: r.bio,
          email: r.email,
          website: r.website,
          linkedin: r.linkedin,
          scholar: r.scholar,
        }),
        fullBio: paragraphs(r.fullBio),
        tags: r.tags || [],
        interests: r.interests || [],
        researchAreas: r.researchAreas || [],
        achievements: r.achievements || [],
        experience: (r.experience || []).map(compact),
        education: (r.education || []).map(compact),
        publications: (r.publications || []).map(compact),
      });
    });
  return grouped;
};

export function useMembers() {
  const { data, loading, live } = useCms('members', MEMBERS_QUERY, mapMembers, MEMBERS);
  return { members: data, all: Object.values(data).flat(), loading, live };
}

/* ── Projects ── */
const PROJECT_FIELDS = `"slug": slug.current, title, subtitle, subtitle2, tagline, domain, status,
  "order": coalesce(order, 9999), pi, "image": image.asset->url, model, modelLabel,
  description, objectives, outcomes, tags, "gallery": gallery[].asset->url`;

export const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)]{${PROJECT_FIELDS}}`;

export const mapProjects = (rows) =>
  [...rows]
    .sort((a, b) => a.order - b.order)
    .map((r) => ({
      ...compact({
        slug: r.slug,
        title: r.title,
        subtitle: r.subtitle,
        subtitle2: r.subtitle2,
        tagline: r.tagline,
        domain: r.domain,
        status: r.status,
        pi: r.pi?.name ? compact(r.pi) : undefined,
        model: r.model,
        modelLabel: r.modelLabel,
      }),
      image: sized(r.image, 1600) || '',
      description: r.description || [],
      objectives: r.objectives || [],
      outcomes: r.outcomes || [],
      tags: r.tags || [],
      gallery: (r.gallery || []).filter(Boolean).map((u) => sized(u, 1600)),
    }));

export const useProjects = () => {
  const { data, loading, live } = useCms('projects', PROJECTS_QUERY, mapProjects, PROJECTS);
  return { projects: data, loading, live };
};

/* ── Research projects ── */
export const RESEARCH_QUERY = `*[_type == "researchProject" && defined(slug.current)]{
  "slug": slug.current, title, domain, tagline, venue, hidden, "order": coalesce(order, 9999),
  "image": image.asset->url, pi, researchers[]{name, slug, role},
  sections[]{title, paragraphs, list}, "gallery": gallery[].asset->url,
  partners, publications[]{title, venue, doi}, patents[]{id, name}, tags
}`;

export const mapResearch = (rows) =>
  [...rows]
    .sort((a, b) => a.order - b.order)
    .map((r) => ({
      ...compact({
        slug: r.slug,
        title: r.title,
        domain: r.domain,
        tagline: r.tagline,
        venue: r.venue,
        pi: r.pi?.name ? compact(r.pi) : undefined,
      }),
      hidden: Boolean(r.hidden),
      image: sized(r.image, 1600) || '',
      researchers: (r.researchers || []).map(compact),
      sections: (r.sections || []).map((s) => ({
        ...compact({ title: s.title }),
        ...(s.paragraphs?.length ? { paragraphs: s.paragraphs } : {}),
        ...(s.list?.length ? { list: s.list } : {}),
      })),
      gallery: (r.gallery || []).filter(Boolean).map((u) => sized(u, 1600)),
      partners: r.partners || [],
      publications: (r.publications || []).map(compact),
      patents: (r.patents || []).map(compact),
      tags: r.tags || [],
    }));

export const useResearchProjects = () => {
  const { data, loading, live } = useCms('research', RESEARCH_QUERY, mapResearch, RESEARCH_PROJECTS);
  return { researchProjects: data, loading, live };
};

/* ── Blogs & articles ──
   The three original posts have hand-built pages in the code (src/pages/*Blog*.jsx)
   and are not in Sanity, so they are merged in after the CMS posts. */
export const POSTS_QUERY = `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
  "slug": slug.current, title, author, byline, publishedAt, excerpt, externalUrl,
  "body": body[]{ ..., _type == "image" => { "asset": { "url": asset->url } } }
}`;

const longDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const mapPosts = (rows) =>
  rows.map((r) => ({
    id: r.slug,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt || '',
    author: r.author || '',
    byline: r.byline || '',
    date: longDate(r.publishedAt),
    iso: r.publishedAt,
    path: `/blogs/${r.slug}`,
    externalUrl: r.externalUrl || '',
    body: r.body || [],
    cms: true,
  }));

export function useBlogPosts() {
  const { data, loading, live } = useCms('posts', POSTS_QUERY, mapPosts, []);
  const ids = new Set(data.map((p) => p.id));
  const posts = [...data, ...BLOG_POSTS.filter((p) => !ids.has(p.id))].sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
  );
  return { posts, cmsPosts: data, loading, live };
}

/* ── Conferences ── */
export const CONFERENCES_QUERY = `*[_type == "conference" && defined(slug.current)] | order(startDate desc){
  "id": slug.current, title, tagline, externalUrl
}`;

export const mapConferences = (rows) =>
  rows.map((r) => ({
    id: r.id,
    title: r.title,
    tagline: r.tagline || '',
    internal: !r.externalUrl,
    path: r.externalUrl || `/conferences/${r.id}`,
  }));

export const useConferences = () => {
  const { data, loading, live } = useCms('conferences', CONFERENCES_QUERY, mapConferences, CONFERENCES);
  return { conferences: data, loading, live };
};

/* ── DIC Nodal ── */
export const NODAL_EVENTS_QUERY = `*[_type == "nodalEvent"] | order(date desc){
  date, end, title, host, city, desc, link, linkText
}`;
export const mapNodalEvents = (rows) =>
  rows.map((r) => ({
    date: r.date,
    end: r.end || r.date,
    title: r.title,
    host: r.host || '',
    city: r.city || '',
    desc: r.desc || '',
    link: r.link || '',
    linkText: r.linkText || '',
  }));
export const useNodalEvents = () => {
  const { data, live } = useCms('nodal-events', NODAL_EVENTS_QUERY, mapNodalEvents, NODAL_EVENTS);
  return { events: data, live };
};

export const NODAL_CENTRES_QUERY = `*[_type == "nodalCentre"] | order(coalesce(order, 9999) asc){
  code, name, note, loc, role
}`;
export const mapNodalCentres = (rows) =>
  rows.map((r) => ({
    code: r.code || r.name,
    name: r.name,
    note: r.note || '',
    loc: r.loc || '',
    role: r.role,
  }));
export const useNodalCentres = () => {
  const { data, live } = useCms('nodal-centres', NODAL_CENTRES_QUERY, mapNodalCentres, CENTRES);
  return { centres: data, live };
};

/* ── Home page: testimonials and collaborators ── */
export const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(coalesce(order, 9999) asc){
  _id, quote, name, role, "avatar": avatar.asset->url
}`;
export const mapTestimonials = (rows) =>
  rows.map((r) => ({
    id: r._id,
    quote: paragraphs(r.quote),
    name: r.name,
    role: r.role || '',
    avatar: sized(r.avatar, 600) || '',
  }));
export const useTestimonials = () =>
  useCms('testimonials', TESTIMONIALS_QUERY, mapTestimonials, TESTIMONIALS).data;

export const COLLABORATORS_QUERY = `*[_type == "collaborator"] | order(coalesce(order, 9999) asc){
  _id, name, "logo": logo.asset->url
}`;
export const mapCollaborators = (rows) =>
  rows.map((r) => ({ id: r._id, name: r.name, logo: sized(r.logo, 400) || null }));
export const useCollaborators = () =>
  useCms('collaborators', COLLABORATORS_QUERY, mapCollaborators, COLLABORATORS).data;

/* ── News, updates and announcements (LinkedIn-style posts) ── */
export const FEED_QUERY = `*[_type == "feedPost"] | order(coalesce(pinned, false) desc, publishedAt desc){
  _id, title, "slug": slug.current, text, publishedAt, linkedinUrl, topic, pinned,
  closesOn, ctaLabel, ctaUrl,
  "images": images[]{ "url": asset->url, alt }
}`;

export const mapFeed = (rows) =>
  rows.map((r) => ({
    id: r._id,
    // Posts made before slugs existed fall back to their id, so every update
    // still has an address of its own.
    slug: r.slug || r._id,
    title: r.title || '',
    closesOn: r.closesOn || '',
    cta: r.ctaUrl ? { label: r.ctaLabel || 'Learn more', url: r.ctaUrl } : null,
    text: r.text || '',
    date: r.publishedAt,
    url: r.linkedinUrl || '',
    topic: r.topic || '',
    pinned: Boolean(r.pinned),
    images: (r.images || [])
      .filter((i) => i.url)
      .map((i) => ({
        src: sized(i.url, 1600),
        thumb: sized(i.url, 800),
        alt: i.alt || '',
      })),
  }));

export const useFeed = () => useCms('feed', FEED_QUERY, mapFeed, []);
