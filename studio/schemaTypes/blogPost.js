import {defineArrayMember, defineField, defineType} from 'sanity'

// An article listed on Blogs & Articles. Posts written here get their own page at
// /blogs/<web address>. (The three original posts have hand-built pages in the
// website's code; they keep showing from there.)
export default defineType({
  name: 'blogPost',
  title: 'Blog post / article',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      description: 'Page address: /blogs/<this>. Do not change after publishing.',
      options: {source: 'title', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({name: 'author', title: 'Author(s)', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'byline',
      title: 'Byline (optional)',
      type: 'string',
      description: 'The full line under the title, e.g. "By Salil S, PhD Scholar, IIT Hyderabad — originally published in Careers360". Defaults to "By <author>".',
    }),
    defineField({name: 'publishedAt', title: 'Date', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'excerpt', title: 'Summary (shown on the Blogs page)', type: 'text', rows: 3, validation: (r) => r.required()}),
    defineField({
      name: 'externalUrl',
      title: 'Link to the original (optional)',
      type: 'url',
      description: 'For articles published elsewhere: shown as a "Read the full piece" link at the end.',
    }),
    defineField({
      name: 'body',
      title: 'Article',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Paragraph', value: 'normal'},
            {title: 'Heading', value: 'h2'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [{title: 'Bullets', value: 'bullet'}, {title: 'Numbered', value: 'number'}],
          marks: {
            decorators: [{title: 'Bold', value: 'strong'}, {title: 'Italic', value: 'em'}],
            annotations: [
              {name: 'link', type: 'object', title: 'Link', fields: [{name: 'href', type: 'url', title: 'URL'}]},
            ],
          },
        }),
        defineArrayMember({type: 'image', options: {hotspot: true}, fields: [{name: 'alt', type: 'string', title: 'Description'}]}),
      ],
    }),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'author'}},
})
