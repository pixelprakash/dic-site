// Builds seed/content.ndjson from the website's current built-in content
// (src/data/*) so it can be imported into Sanity instead of retyped:
//
//   npm run seed
//   npx sanity dataset import seed/content.ndjson production --replace
//
// Document ids are fixed (member-<slug>, project-<slug> ...), so re-running the
// import with --replace updates the same documents instead of duplicating them.
// Photos are read from the website's public/ folder and uploaded by the importer.
import {existsSync, writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {MEMBERS} from '../../src/data/peopleData.js'
import {PROJECTS} from '../../src/data/projectsData.js'
import {RESEARCH_PROJECTS} from '../../src/data/researchProjectsData.js'
import {CENTRES, EVENTS} from '../../src/data/nodalData.js'
import {CONFERENCES} from '../../src/data/conferencesData.js'
import {COLLABORATORS, TESTIMONIALS} from '../../src/data/siteData.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(HERE, '..', '..', 'public')

const key = (() => {
  let n = 0
  return () => `k${(++n).toString(36).padStart(5, '0')}`
})()

const missing = []
const image = (path) => {
  if (!path) return undefined
  const file = join(PUBLIC, path)
  if (!existsSync(file)) {
    missing.push(path)
    return undefined
  }
  return {_type: 'image', _sanityAsset: `image@${pathToFileURL(file).href}`}
}
const gallery = (paths) => (paths || []).map((p) => ({_key: key(), ...image(p)})).filter((i) => i._sanityAsset)
const slug = (s) => ({_type: 'slug', current: s})
const keyed = (arr) => (arr && arr.length ? arr.map((o) => ({_key: key(), ...o})) : undefined)
const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && !v.length)))
const keepKeys = (o, keys) => clean(Object.fromEntries(keys.map((k) => [k, o[k]])))

const docs = []

/* People */
for (const [category, list] of Object.entries(MEMBERS)) {
  list.forEach((m, i) => {
    if (m.placeholder) return
    docs.push(clean({
      _id: `member-${m.id}`,
      _type: 'member',
      name: m.name,
      slug: slug(m.id),
      category,
      order: i + 1,
      track: m.track,
      role: m.role,
      joinedYear: m.joinedYear,
      defenceYear: m.defenceYear,
      relievedYear: m.relievedYear,
      photo: image(m.photo),
      bio: m.bio,
      fullBio: [].concat(m.fullBio || []).join('\n\n'),
      tags: m.tags,
      researchAreas: m.researchAreas,
      interests: m.interests,
      experience: keyed((m.experience || []).map((e) => keepKeys(e, ['role', 'org', 'duration', 'desc']))),
      education: keyed((m.education || []).map((e) => keepKeys(e, ['degree', 'institution', 'year']))),
      achievements: m.achievements,
      publications: keyed((m.publications || []).map((p) => keepKeys(p, ['title', 'venue', 'year', 'link']))),
      email: m.email,
      website: m.website,
      linkedin: m.linkedin,
      scholar: m.scholar,
    }))
  })
}

/* Projects */
PROJECTS.forEach((p, i) => {
  docs.push(clean({
    _id: `project-${p.slug}`,
    _type: 'project',
    title: p.title,
    slug: slug(p.slug),
    order: i + 1,
    subtitle: p.subtitle,
    subtitle2: p.subtitle2,
    tagline: p.tagline,
    domain: p.domain,
    status: p.status,
    pi: p.pi,
    image: image(p.image),
    model: p.model,
    modelLabel: p.modelLabel,
    description: p.description,
    objectives: p.objectives,
    outcomes: p.outcomes,
    tags: p.tags,
    gallery: gallery(p.gallery),
  }))
})

/* Research projects */
RESEARCH_PROJECTS.forEach((r, i) => {
  docs.push(clean({
    _id: `research-${r.slug}`,
    _type: 'researchProject',
    title: r.title,
    slug: slug(r.slug),
    order: i + 1,
    hidden: r.hidden ? true : undefined,
    domain: r.domain,
    tagline: r.tagline,
    venue: r.venue,
    image: image(r.image),
    pi: r.pi,
    researchers: keyed(r.researchers),
    sections: keyed((r.sections || []).map((s) => clean({title: s.title, paragraphs: s.paragraphs, list: s.list}))),
    gallery: gallery(r.gallery),
    partners: r.partners,
    publications: keyed(r.publications),
    patents: keyed(r.patents),
    tags: r.tags,
  }))
})

/* Conferences (dates are the ones stated on the site) */
const CONFERENCE_DATES = {'fourth-all-india-dic-meet': '2024-05-02', '6th-mobile-studies-congress': '2026-08-21'}
CONFERENCES.forEach((c) => {
  docs.push(clean({
    _id: `conference-${c.id}`,
    _type: 'conference',
    title: c.title,
    slug: slug(c.id),
    tagline: c.tagline,
    startDate: CONFERENCE_DATES[c.id],
    externalUrl: c.internal ? undefined : c.path,
  }))
})

/* Nodal */
EVENTS.forEach((e, i) => {
  docs.push(clean({_id: `nodalEvent-${i + 1}`, _type: 'nodalEvent', ...e}))
})
CENTRES.forEach((c, i) => {
  docs.push(clean({_id: `nodalCentre-${c.code.toLowerCase()}`, _type: 'nodalCentre', ...c, order: i + 1}))
})

/* Home page */
TESTIMONIALS.forEach((t, i) => {
  docs.push(clean({
    _id: `testimonial-${t.id}`,
    _type: 'testimonial',
    quote: [].concat(t.quote).join('\n\n'),
    name: t.name,
    role: t.role,
    avatar: image(t.avatar),
    order: i + 1,
  }))
})
COLLABORATORS.forEach((c, i) => {
  docs.push(clean({_id: `collaborator-${c.id}`, _type: 'collaborator', name: c.name, logo: image(c.logo), order: i + 1}))
})

// `--only member-<slug> [more ids]` writes just those documents to
// seed/partial.ndjson, so one new profile can be pushed without --replace-ing
// (and so overwriting any Studio edits to) everything else.
const onlyAt = process.argv.indexOf('--only')
const typeAt = process.argv.indexOf('--type')
if (typeAt !== -1) {
  // `--type nodalCentre` writes every document of that type (e.g. after the
  // site's list for it changes).
  const type = process.argv[typeAt + 1]
  const picked = docs.filter((d) => d._type === type)
  writeFileSync(join(HERE, '..', 'seed', 'partial.ndjson'), picked.map((d) => JSON.stringify(d)).join('\n') + '\n')
  console.log(`Wrote ${picked.length} ${type} documents to seed/partial.ndjson`)
  process.exit(0)
}
if (onlyAt !== -1) {
  const ids = process.argv.slice(onlyAt + 1)
  const picked = docs.filter((d) => ids.includes(d._id))
  writeFileSync(join(HERE, '..', 'seed', 'partial.ndjson'), picked.map((d) => JSON.stringify(d)).join('\n') + '\n')
  console.log(`Wrote ${picked.length} of ${ids.length} requested documents to seed/partial.ndjson`)
  if (missing.length) console.warn('Images referenced but not found in public/ (skipped):', missing)
  process.exit(0)
}

const out = join(HERE, '..', 'seed', 'content.ndjson')
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
const counts = docs.reduce((a, d) => ({...a, [d._type]: (a[d._type] || 0) + 1}), {})
console.log(`Wrote ${docs.length} documents to seed/content.ndjson`, counts)
if (missing.length) console.warn('Images referenced but not found in public/ (skipped):', missing)
