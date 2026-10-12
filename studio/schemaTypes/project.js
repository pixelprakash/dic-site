import {defineArrayMember, defineField, defineType} from 'sanity'

const strings = (name, title, description) =>
  defineField({name, title, type: 'array', of: [defineArrayMember({type: 'string'})], description})

const personRef = (name, title) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({name: 'name', title: 'Name', type: 'string'}),
      defineField({
        name: 'slug',
        title: 'Profile address (optional)',
        type: 'string',
        description: 'The person\'s web address ending on the People page, e.g. deepak-john-mathew. Makes the name link to their profile.',
      }),
    ],
  })

// A DIC project: a card on Projects and its own page at /projects/<web address>.
export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      description: 'Page address: /projects/<this>. Do not change after publishing.',
      options: {source: 'title', maxLength: 70},
      validation: (r) => r.required(),
    }),
    defineField({name: 'order', title: 'Position', type: 'number', description: '1 shows first.', validation: (r) => r.min(1).integer()}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'subtitle2', title: 'Second subtitle', type: 'string'}),
    defineField({name: 'tagline', title: 'Tagline (one line on the card)', type: 'text', rows: 2}),
    defineField({name: 'domain', title: 'Domain', type: 'string', description: 'e.g. Cultural Heritage, Air Mobility'}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: ['Ongoing', 'Completed'], layout: 'radio'},
    }),
    personRef('pi', 'Principal investigator'),
    defineField({name: 'image', title: 'Cover photo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'model',
      title: '3D model file (path)',
      type: 'string',
      description: 'Developer-managed: a path under the website\'s /models folder. Leave empty unless the project has an interactive 3D model.',
    }),
    defineField({name: 'modelLabel', title: '3D model caption', type: 'string'}),
    strings('description', 'Description (one item per paragraph)'),
    strings('objectives', 'Objectives'),
    strings('outcomes', 'Outcomes (one item per paragraph)'),
    strings('tags', 'Tags'),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
    }),
  ],
  orderings: [{title: 'Position', name: 'position', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'domain', media: 'image'}},
})
