import {defineField, defineType} from 'sanity'

// A card on the Conferences page.
export default defineType({
  name: 'conference',
  title: 'Conference',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      options: {source: 'title', maxLength: 70},
      validation: (r) => r.required(),
    }),
    defineField({name: 'tagline', title: 'Short description', type: 'text', rows: 2}),
    defineField({name: 'startDate', title: 'Date', type: 'date', description: 'Used to order the list (newest first).'}),
    defineField({
      name: 'externalUrl',
      title: 'External website',
      type: 'url',
      description: 'If the conference has its own website, the card links there. Leave empty for a conference with a page on this site (/conferences/<web address>), which a developer needs to build.',
    }),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'startDate', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'tagline'}},
})
