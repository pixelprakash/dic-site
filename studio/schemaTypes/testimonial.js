import {defineField, defineType} from 'sanity'

// A quote on the home page. Only real testimonials from real people, please.
export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 8, validation: (r) => r.required(), description: 'Leave a blank line between paragraphs.'}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'role', title: 'Role', type: 'string', description: 'e.g. M.Des Student, IIT Hyderabad (Class of 2027)'}),
    defineField({name: 'avatar', title: 'Photo', type: 'image', options: {hotspot: true}, description: 'Portrait, 3:4. Without a photo, the person\'s initials are shown.'}),
    defineField({name: 'order', title: 'Position', type: 'number', description: '1 shows first.', validation: (r) => r.min(1).integer()}),
  ],
  orderings: [{title: 'Position', name: 'position', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'role', media: 'avatar'}},
})
