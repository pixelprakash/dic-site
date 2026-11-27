// What search engines and link previews are told about each page. Plain data
// (no JSX, no browser APIs) so the same copy serves the page itself
// (lib/seo.js), the edge middleware for crawlers that don't run JavaScript
// (middleware.js) and the build step that writes each page and the sitemap
// (scripts/prerender.mjs).
//
// SITE.url is the address the site is published at; change it here if the
// domain changes and the canonical links, Open Graph URLs and sitemap follow.
export const SITE = {
  url: 'https://dic-site.vercel.app',
  name: 'DIC · IITH — Design Innovation Centre, IIT Hyderabad',
  shortName: 'DIC · IITH',
  image: '/images/og-dic.jpg',
  imageAlt: 'The Design Innovation Centre lab at IIT Hyderabad',
};

export const ROUTE_META = {
  '/': {
    title: 'DIC · IITH — Design Innovation Centre, IIT Hyderabad',
    description:
      'Design Innovation Centre at IIT Hyderabad: interdisciplinary design research across cultural heritage, autonomous mobility, immersive education and sustainable innovation. Also home to DIC Nodal, India’s national network of Design Innovation Centres.',
  },
  '/about': {
    title: 'About DIC — DIC · IITH',
    description:
      'About the Design Innovation Centre at IIT Hyderabad: a design lab and teaching space in the Department of Design, with over 3,000 square feet of fabrication, mixed-reality and preservation facilities, and the Nodal Centre of the National DIC Network.',
  },
  '/research': {
    title: 'Research — DIC · IITH',
    description:
      'Research projects, publications and patents from the Design Innovation Centre, IIT Hyderabad, on cultural heritage, autonomous air mobility, VR/AR education and design pedagogy.',
  },
  '/projects': {
    title: 'Projects — DIC · IITH',
    description:
      'Products and programmes delivered by the Design Innovation Centre, IIT Hyderabad, across cultural heritage, mobility, education and sustainable design.',
  },
  '/people': {
    title: 'People — DIC · IITH',
    description:
      'The faculty, researchers, designers and students of the Design Innovation Centre, IIT Hyderabad: the principal investigator, PhD scholars, project staff, interns and alumni.',
  },
  '/education': {
    title: 'Education — DIC · IITH',
    description:
      'Courses, workshops and impact at the Design Innovation Centre, IIT Hyderabad: 4,688 students enrolled in DIC courses and 214 workshops across design thinking and the creative arts.',
  },
  '/practices': {
    title: 'DIC Practices — DIC · IITH',
    description:
      'Five practices through which the DIC hub works with schools, colleges and governments: immersions at IIT Hyderabad, DICs in government schools, HCD Labs, design education centres and universal design.',
  },
  '/nodal': {
    title: 'DIC Nodal — India’s National Design Innovation Network',
    description:
      'DIC Nodal, India’s national network of Design Innovation Centres under the Ministry of Education: 20 DIC hubs, 64 spoke institutions, a directory of nodes, events across the network and how to join.',
  },
  '/contact': {
    title: 'Contact — DIC · IITH',
    description:
      'Contact the Design Innovation Centre at IIT Hyderabad: email, address in Kandi, Sangareddy, how to arrange a lab visit, and an enquiry form.',
  },
  '/news': {
    title: 'News & Updates — DIC · IITH',
    description:
      'Announcements, admissions, openings, talks and recent work from the Design Innovation Centre, IIT Hyderabad.',
  },
  '/events': {
    title: 'Events — DIC · IITH',
    description:
      'Talks, exhibitions and gatherings from across the Design Innovation Centre, IIT Hyderabad.',
  },
  '/workshops': {
    title: 'Workshops — DIC · IITH',
    description:
      'Hands-on workshops in design, fabrication and emerging technology from the Design Innovation Centre, IIT Hyderabad.',
  },
  '/conferences': {
    title: 'DIC Hosted Conferences — DIC · IITH',
    description:
      'National and international conferences organised by the Design Innovation Centre, IIT Hyderabad.',
  },
  '/conferences/fourth-all-india-dic-meet': {
    title: 'Fourth All India DIC Meet — DIC · IITH',
    description:
      'The Fourth All India DIC Meet, hosted by IIT Hyderabad on 2–3 May 2024, showcasing work from Design Innovation Centres across the country.',
  },
  '/blogs/reimagining-formative-assessment-art-education': {
    title: 'Reimagining Formative Assessment in Art Education — DIC · IITH',
    description:
      'Ganesh Kumar Malthurkar on a mobile-first approach to formative assessment in government school art education, presented at the 6th Mobile Studies Congress.',
  },
  '/blogs/wiki-thesis-research-assessment-ai': {
    title: "Time for the 'Wiki-Thesis' — DIC · IITH",
    description:
      'Salil S and Prof. Deepak John Mathew, writing in Careers360, on why AI writing tools call for new thesis formats, with three alternatives worth considering.',
  },
  '/blogs/how-intelligent-are-we-about-natural-intelligence': {
    title: 'How Intelligent Are We About Our Natural Intelligence? — DIC · IITH',
    description:
      'Salil Sahadevan and Prof. Deepak John Mathew, writing in The Hindu, on pea plants, slime moulds and the many modes of intelligence.',
  },
  '/blogs': {
    title: 'Blogs & Articles — DIC · IITH',
    description:
      'Insights, research notes and stories from the Design Innovation Centre community at IIT Hyderabad.',
  },
};

// Pages that have no content yet: still reachable, but kept out of search
// results, the sitemap and the AI guide. Remove an entry once it has content.
export const UNLISTED = ['/events', '/workshops'];

export const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  name: 'Design Innovation Centre, IIT Hyderabad',
  alternateName: 'DIC · IITH',
  url: SITE.url,
  logo: `${SITE.url}/images/diclogo.webp`,
  image: `${SITE.url}${SITE.image}`,
  description: ROUTE_META['/'].description,
  email: 'dic@des.iith.ac.in',
  telephone: '+91 40 2301 6000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Department of Design, IIT Hyderabad, Kandi',
    addressLocality: 'Sangareddy',
    addressRegion: 'Telangana',
    postalCode: '502284',
    addressCountry: 'IN',
  },
  parentOrganization: { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Hyderabad' },
};
