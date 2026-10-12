import {defineField, defineType} from 'sanity'

// An event on the DIC Nodal page. Upcoming / ongoing / past is worked out from the dates.
export default defineType({
  name: 'nodalEvent',
  title: 'Nodal event',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'date', title: 'Starts', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'end', title: 'Ends', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'host', title: 'Host', type: 'string'}),
    defineField({name: 'city', title: 'City', type: 'string'}),
    defineField({name: 'desc', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'link', title: 'Link (optional)', type: 'url'}),
    defineField({name: 'linkText', title: 'Link text', type: 'string', description: 'e.g. Details & registration'}),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'date'}},
})
