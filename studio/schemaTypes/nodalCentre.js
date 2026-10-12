import {defineField, defineType} from 'sanity'

// A centre in the national DIC network, listed on the Nodal page.
export default defineType({
  name: 'nodalCentre',
  title: 'Nodal network centre',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Institution', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'code', title: 'Code', type: 'string', description: 'e.g. DIC-HYD'}),
    defineField({name: 'note', title: 'Note', type: 'string'}),
    defineField({name: 'loc', title: 'Location', type: 'string'}),
    defineField({
      name: 'role',
      title: 'Role in the network',
      type: 'string',
      options: {
        list: [
          {value: 'nodal', title: 'Hub & Nodal'},
          {value: 'hub', title: 'Hub'},
          {value: 'spoke', title: 'Spoke'},
          {value: 'national', title: 'National body'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'order', title: 'Position', type: 'number', description: '1 shows first.', validation: (r) => r.min(1).integer()}),
  ],
  orderings: [{title: 'Position', name: 'position', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'code'}},
})
