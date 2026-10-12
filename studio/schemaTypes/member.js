import {defineArrayMember, defineField, defineType} from 'sanity'

export const MEMBER_CATEGORIES = [
  {value: 'principal-investigator', title: 'Principal Investigator'},
  {value: 'design-manager', title: 'Design Head'},
  {value: 'phd-students', title: 'PhD Students'},
  {value: 'project-staff', title: 'Project Staff'},
  {value: 'interns', title: 'Interns'},
  {value: 'past-members', title: 'Past Members'},
]

const strings = (name, title, description) =>
  defineField({name, title, type: 'array', of: [defineArrayMember({type: 'string'})], description})

// One person on the People page, with their own profile at /people/<web address>.
export default defineType({
  name: 'member',
  title: 'Person',
  type: 'document',
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'profile', title: 'Profile'},
    {name: 'cv', title: 'Education, experience & publications'},
    {name: 'links', title: 'Links'},
  ],
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', group: 'basics', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      group: 'basics',
      description: 'Becomes the profile address: /people/<this>. Do not change it after publishing, or old links stop working.',
      options: {source: 'name', maxLength: 70},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Section on the People page',
      type: 'string',
      group: 'basics',
      options: {list: MEMBER_CATEGORIES, layout: 'radio'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Position within the section',
      type: 'number',
      group: 'basics',
      description: '1 shows first. People with the same number (or none) are sorted by name.',
      validation: (r) => r.min(1).integer(),
    }),
    defineField({
      name: 'track',
      title: 'PhD track',
      type: 'string',
      group: 'basics',
      description: 'Only for PhD students: splits the section into "Regular PhD" and "External PhD". Leave empty for everyone else.',
      options: {list: [{value: 'regular', title: 'Regular PhD'}, {value: 'external', title: 'External PhD'}], layout: 'radio'},
    }),
    defineField({name: 'role', title: 'Role / title', type: 'string', group: 'basics', validation: (r) => r.required()}),
    defineField({name: 'joinedYear', title: 'Joined (year)', type: 'string', group: 'basics'}),
    defineField({name: 'defenceYear', title: 'PhD defence (year)', type: 'string', group: 'basics', description: 'Past members only.'}),
    defineField({name: 'relievedYear', title: 'Left (year)', type: 'string', group: 'basics', description: 'Past members only.'}),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      group: 'basics',
      description: 'Portrait, 3:4 works best. A white or plain background keeps the grid tidy.',
      options: {hotspot: true},
    }),

    defineField({name: 'bio', title: 'Short bio (one line on the card)', type: 'text', rows: 3, group: 'profile'}),
    defineField({
      name: 'fullBio',
      title: 'Full bio',
      type: 'text',
      rows: 10,
      group: 'profile',
      description: 'Leave a blank line between paragraphs.',
    }),
    {...strings('tags', 'Tags', 'Short topic chips shown on the card.'), group: 'profile'},
    {...strings('researchAreas', 'Research areas', ''), group: 'profile'},
    {...strings('interests', 'Interests', ''), group: 'profile'},

    defineField({
      name: 'experience',
      title: 'Experience / positions',
      type: 'array',
      group: 'cv',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'position',
          fields: [
            defineField({name: 'role', title: 'Role', type: 'string'}),
            defineField({name: 'org', title: 'Organisation', type: 'string'}),
            defineField({name: 'duration', title: 'Duration', type: 'string', description: 'e.g. 2023 – present'}),
            defineField({name: 'desc', title: 'Description (optional)', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'role', subtitle: 'org'}},
        }),
      ],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      group: 'cv',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'degree',
          fields: [
            defineField({name: 'degree', title: 'Degree', type: 'string'}),
            defineField({name: 'institution', title: 'Institution', type: 'string'}),
            defineField({name: 'year', title: 'Year(s)', type: 'string'}),
          ],
          preview: {select: {title: 'degree', subtitle: 'institution'}},
        }),
      ],
    }),
    {...strings('achievements', 'Achievements', ''), group: 'cv'},
    defineField({
      name: 'publications',
      title: 'Publications / works',
      type: 'array',
      group: 'cv',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'publication',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'venue', title: 'Venue', type: 'string'}),
            defineField({name: 'year', title: 'Year', type: 'string'}),
            defineField({name: 'link', title: 'Link', type: 'url'}),
          ],
          preview: {select: {title: 'title', subtitle: 'venue'}},
        }),
      ],
    }),

    defineField({name: 'email', title: 'Email', type: 'string', group: 'links'}),
    defineField({name: 'website', title: 'Website', type: 'url', group: 'links'}),
    defineField({name: 'linkedin', title: 'LinkedIn', type: 'url', group: 'links'}),
    defineField({name: 'scholar', title: 'Google Scholar', type: 'url', group: 'links'}),
  ],
  orderings: [
    {title: 'Section, then position', name: 'sectionOrder', by: [{field: 'category', direction: 'asc'}, {field: 'order', direction: 'asc'}]},
    {title: 'Name', name: 'name', by: [{field: 'name', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})
