import {defineField, defineType} from 'sanity'

// A logo on the home page's Collaborators strip.
export default defineType({
  name: 'collaborator',
  title: 'Collaborator',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Transparent or white background. Without a logo, the name is shown as text.',
    }),
    defineField({name: 'order', title: 'Position', type: 'number', description: '1 shows first.', validation: (r) => r.min(1).integer()}),
  ],
  orderings: [{title: 'Position', name: 'position', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', media: 'logo'}},
})
