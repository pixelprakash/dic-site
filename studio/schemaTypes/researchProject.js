import {defineArrayMember, defineField, defineType} from 'sanity'

const strings = (name, title, description) =>
  defineField({name, title, type: 'array', of: [defineArrayMember({type: 'string'})], description})

// A research project / poster: a card on Research and its own page at /research/<web address>.
export default defineType({
  name: 'researchProject',
  title: 'Research project',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      description: 'Page address: /research/<this>. Do not change after publishing.',
      options: {source: 'title', maxLength: 70},
      validation: (r) => r.required(),
    }),
    defineField({name: 'order', title: 'Position', type: 'number', description: '1 shows first.', validation: (r) => r.min(1).integer()}),
    defineField({
      name: 'hidden',
      title: 'Hide from the Research page and search',
      type: 'boolean',
      description: 'Keeps the project here but takes it off the listing. (Its direct link still opens.)',
      initialValue: false,
    }),
    defineField({name: 'domain', title: 'Domain', type: 'string', description: 'e.g. Design Education, Craft & Material Culture'}),
    defineField({name: 'tagline', title: 'Tagline', type: 'text', rows: 2}),
    defineField({name: 'venue', title: 'Where it was presented', type: 'string'}),
    defineField({name: 'image', title: 'Cover photo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'pi',
      title: 'Principal investigator',
      type: 'object',
      fields: [
        defineField({name: 'name', title: 'Name', type: 'string'}),
        defineField({name: 'slug', title: 'Profile address (optional)', type: 'string'}),
      ],
    }),
    defineField({
      name: 'researchers',
      title: 'Researchers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'researcher',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'slug', title: 'Profile address (optional)', type: 'string'}),
            defineField({name: 'role', title: 'Role', type: 'string'}),
          ],
          preview: {select: {title: 'name', subtitle: 'role'}},
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      description: 'Each section has a heading, optional paragraphs and an optional bullet list.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          fields: [
            defineField({name: 'title', title: 'Heading', type: 'string'}),
            strings('paragraphs', 'Paragraphs (one item per paragraph)'),
            strings('list', 'Bullet list'),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
    }),
    strings('partners', 'Partners'),
    defineField({
      name: 'publications',
      title: 'Publications',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'publication',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'venue', title: 'Venue', type: 'string'}),
            defineField({name: 'doi', title: 'DOI / link', type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'venue'}},
        }),
      ],
    }),
    defineField({
      name: 'patents',
      title: 'Patents',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'patent',
          fields: [
            defineField({name: 'id', title: 'Patent number', type: 'string'}),
            defineField({name: 'name', title: 'Name', type: 'string'}),
          ],
          preview: {select: {title: 'name', subtitle: 'id'}},
        }),
      ],
    }),
    strings('tags', 'Tags'),
  ],
  orderings: [{title: 'Position', name: 'position', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'domain', media: 'image'}},
})
