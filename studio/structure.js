// The studio's left-hand menu, grouped the way the website is.
const list = (S, title, type, id) =>
  S.listItem()
    .id(id || type)
    .title(title)
    .child(S.documentTypeList(type).title(title))

export const structure = (S) =>
  S.list()
    .title('Website content')
    .items([
      list(S, 'News & updates', 'feedPost'),
      S.divider(),
      list(S, 'People', 'member'),
      S.divider(),
      list(S, 'Projects', 'project'),
      list(S, 'Research projects', 'researchProject'),
      S.divider(),
      list(S, 'Blogs & articles', 'blogPost'),
      list(S, 'Conferences', 'conference'),
      S.divider(),
      S.listItem()
        .title('DIC Nodal page')
        .child(
          S.list()
            .title('DIC Nodal page')
            .items([list(S, 'Events', 'nodalEvent'), list(S, 'Network centres', 'nodalCentre')]),
        ),
      S.divider(),
      S.listItem()
        .title('Home page')
        .child(
          S.list()
            .title('Home page')
            .items([list(S, 'Testimonials', 'testimonial'), list(S, 'Collaborators (logo strip)', 'collaborator')]),
        ),
    ])
