/* ─── Data for the DIC Nodal (national network) page ───
   role: "nodal" | "hub" | "spoke" | "national" */
export const NODAL_SEALS = [
  { value: '20', label: 'DIC hubs at IITs, IISc, SPA and universities' },
  { value: '64', label: 'Spoke institutions linked to the hubs' },
  { value: '80+', label: 'Institutions in the DIC network' },
  { value: '₹240 Cr', label: 'NIDI scheme outlay, launched 2014' },
];

export const MINISTRY_LINE = [
  'Ministry of Education, Government of India',
  'Department of Higher Education',
  'National Initiative for Design Innovation (NIDI)',
  'A constituent centre of IIT Hyderabad',
];

export const PILLARS = [
  { name: 'Yuva', desc: 'Youth — skilling, entrepreneurship and design capability for the next generation' },
  { name: 'Garib', desc: 'The poor — inclusive, affordable design for societal challenges' },
  { name: 'Mahilayen', desc: 'Women — equitable participation in innovation and enterprise' },
  { name: 'Annadata', desc: 'Farmers — design for agriculture, livelihoods and rural India' },
];

export const HUB_SPOKE = [
  {
    no: '01',
    label: 'Hub',
    title: 'Lead centres',
    desc: 'Twenty DIC hubs — including ten IITs, nine universities and SPA New Delhi — mentor their regions, run programmes and steward funding under the scheme.',
    accent: 'var(--color-dic-red)',
    icon: 'hub',
  },
  {
    no: '02',
    label: 'Spoke',
    title: 'Partner institutions',
    desc: "Seventy-plus spoke institutions extend the network's reach into new disciplines, campuses and regional priorities across the country.",
    accent: 'var(--color-dic-orange)',
    icon: 'spoke',
  },
  {
    no: '03',
    label: 'Nodal',
    title: 'Convening & exchange',
    desc: 'As a Hub & Nodal centre, IIT Hyderabad convenes shared programmes, events and knowledge exchange — linking the network to industry, government and global partners.',
    accent: 'var(--color-dic-blue)',
    icon: 'nodal',
  },
];

export const PROGRAMME_PARTNERS = [
  'Ministry of Education',
  'Dept. of Higher Education',
  'National Initiative for Design Innovation',
  'HCD Institute',
  'Department of Design, IIT-H',
];

// Parked, not deleted: the earlier, shorter list (10 entries), replaced by the
// Ministry-of-Education-based list below.
export const CENTRES_PREVIOUS = [
  { code: 'DIC-HYD', name: 'IIT Hyderabad', note: 'This centre — Hub & Nodal', loc: 'Kandi, Telangana', role: 'nodal' },
  { code: 'ODS-BOM', name: 'IIT Bombay', note: 'Open Design School (ODS)', loc: 'Mumbai, Maharashtra', role: 'national' },
  { code: 'NDIN-BLR', name: 'IISc Bangalore', note: 'National Design Innovation Network', loc: 'Bengaluru, Karnataka', role: 'national' },
  { code: 'DIC-RKE', name: 'IIT Roorkee', note: 'Navaashay DIC', loc: 'Roorkee, Uttarakhand', role: 'hub' },
  { code: 'DIC-DEL', name: 'SPA New Delhi', note: 'School of Planning & Architecture', loc: 'New Delhi', role: 'hub' },
  { code: 'DIC-CLT', name: 'NIT Calicut', note: 'DIC (with IISc Bangalore)', loc: 'Kozhikode, Kerala', role: 'hub' },
  { code: 'DIC-GTU', name: 'Gujarat Technological Univ.', note: 'DIC', loc: 'Ahmedabad, Gujarat', role: 'hub' },
  { code: 'SPK-KSH', name: 'IIM Kashipur', note: 'Spoke of IIT Roorkee', loc: 'Kashipur, Uttarakhand', role: 'spoke' },
  { code: 'SPK-NUK', name: 'NIT Uttarakhand', note: 'Spoke of IIT Roorkee', loc: 'Srinagar, Uttarakhand', role: 'spoke' },
  { code: 'SPK-GBP', name: 'G.B. Pant Univ. of Agri. & Tech.', note: 'Spoke of IIT Roorkee', loc: 'Pantnagar, Uttarakhand', role: 'spoke' },
];

/* ─── The DIC network directory ───
   20 hubs (Ministry of Education list) and the spokes confirmed in public
   sources so far. Rows: [institution, state, role, note]. `nodal` is IIT
   Hyderabad itself — a hub that also convenes the network. */
const NODE_ROWS = [
  ['Indian Institute of Technology Hyderabad', 'Telangana', 'nodal', 'This centre: Hub & Nodal'],
  ['Indian Institute of Technology Delhi', 'Delhi', 'hub'],
  ['Indian Institute of Technology Bombay', 'Maharashtra', 'hub'],
  ['Indian Institute of Technology Kanpur', 'Uttar Pradesh', 'hub'],
  ['Indian Institute of Technology Kharagpur', 'West Bengal', 'hub'],
  ['Indian Institute of Technology Guwahati', 'Assam', 'hub'],
  ['Indian Institute of Technology Roorkee', 'Uttarakhand', 'hub'],
  ['Indian Institute of Technology Bhubaneswar', 'Odisha', 'hub'],
  ['IIT (BHU) & Banaras Hindu University', 'Uttar Pradesh', 'hub'],
  ['Indian Institute of Science Bangalore', 'Karnataka', 'hub'],
  ['School of Planning and Architecture, New Delhi', 'Delhi', 'hub'],
  ['University of Delhi', 'Delhi', 'hub'],
  ['Central University of Kashmir', 'Jammu & Kashmir', 'hub'],
  ['North Eastern Hill University, Shillong', 'Meghalaya', 'hub'],
  ['Panjab University, Chandigarh', 'Punjab / Chandigarh', 'hub'],
  ['Savitribai Phule Pune University', 'Maharashtra', 'hub'],
  ['Gujarat Technological University', 'Gujarat', 'hub'],
  ['JNTU Kakinada', 'Andhra Pradesh', 'hub'],
  ['Rani Durgavati Vishwavidyalaya, Jabalpur', 'Madhya Pradesh', 'hub'],
  ['University of Rajasthan', 'Rajasthan', 'hub'],
  ['IIIT Hyderabad', 'Telangana', 'spoke', 'Spoke of IIT Hyderabad'],
  ['IIM Kashipur', 'Uttarakhand', 'spoke', 'Spoke of IIT Roorkee'],
  ['NIT Uttarakhand', 'Uttarakhand', 'spoke', 'Spoke of IIT Roorkee'],
  ['College of Technology, GBPUAT Pantnagar', 'Uttarakhand', 'spoke', 'Spoke of IIT Roorkee'],
  ['Assam Agricultural University', 'Assam', 'spoke', 'Spoke of IIT Guwahati'],
  ['NIT Meghalaya', 'Meghalaya', 'spoke', 'Spoke of IIT Guwahati'],
  ['IIIT Manipur', 'Manipur', 'spoke', 'Spoke of IIT Guwahati'],
];

const slugify = (t) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const CENTRES = NODE_ROWS.map(([name, loc, role, note]) => ({
  code: slugify(name),
  name,
  loc,
  role,
  note: note || '',
}));

// Total spokes in the network — more than the directory lists so far.
export const SPOKE_TOTAL = 64;

/* ─── Narrative content for the Nodal page ─── */
export const NODAL_HERO = {
  eyebrow: 'Design Innovation Centre · Hub · Ministry of Education, Govt. of India',
  title: 'Design-led innovation, built as a national network.',
  lede: 'The Design Innovation Centre at IIT Hyderabad brings designers, engineers and partner institutions together to work on real problems with real stakeholders, and to turn the ideas into products, services and startups.',
};

export const NODAL_ABOUT = {
  paragraphs: [
    'Design Innovation Centres were set up under the National Initiative for Design Innovation (NIDI), a flagship scheme of the Ministry of Education (then MHRD) in the Twelfth Plan. The scheme created 20 DICs in publicly funded institutions, one Open Design School and a National Design Innovation Network, with e-Kalpa as a further component.',
    'Each DIC is a platform where students, faculty and citizens bring ideas that can be developed into products and processes. DICs also act as enabling and incubation centres for startups.',
  ],
  objectives: [
    { title: 'Interdisciplinary innovation', text: 'Design-focused problem solving through design-based education and projects, from process to product.' },
    { title: 'Collaboration', text: 'Knowledge sharing between industry, academia, government and research labs, toward entrepreneurship and products in market.' },
    { title: 'A replicable model', text: 'A flagship design and innovation programme other institutes and universities can adopt.' },
  ],
  components: ['20 Design Innovation Centres', 'Open Design School', 'National Design Innovation Network', 'e-Kalpa'],
};

export const HUB_VS_SPOKE = [
  {
    kind: 'hub',
    tag: 'Hub',
    title: 'The lead institution',
    text: 'Hosts the centre, sets direction, shares labs, faculty and funding, and mentors its spokes. At IIT Hyderabad the hub sits in the Department of Design.',
  },
  {
    kind: 'spoke',
    tag: 'Spoke / node',
    title: 'The partner institution',
    text: "Runs its own design and innovation projects, usually aimed at local problems, with access to the hub's expertise and network. IIIT Hyderabad is a spoke of the IITH hub.",
  },
];

export const NODAL_PI = {
  slug: 'deepak-john-mathew',
  name: 'Prof. Deepak John Mathew',
  role: 'Professor, Department of Design · Principal Investigator, Design Innovation Centre, IIT Hyderabad',
  photo: '/images/people/deepak.webp',
  facts: [
    { label: 'At IITH', text: 'Leads the DIC hub and helped set up the Department of Design at IIT Hyderabad.' },
    { label: 'NID, 2002–2013', text: 'Head of Photography Design at the National Institute of Design, teaching drawing, colour and form, composition and photography.' },
    { label: 'Network role', text: 'Hosted the 4th All India DIC Meet (2024) and co-organised the 5th (2025).' },
  ],
  quote: 'All DICs working as one unit, through collective effort, can create a much larger impact than any single centre.',
};

export const NODAL_TIMELINE = [
  { when: '2014', text: 'NIDI launched by the Ministry. Up to ₹10 Cr per DIC.' },
  { when: 'Hub', text: 'IIT Hyderabad named one of the 20 DICs, with IIIT Hyderabad as a spoke.' },
  { when: 'May 2024', text: 'IITH hosts the 4th All India DIC Meet: 20 hubs and 64 spokes.' },
  { when: 'Nov 2025', text: '5th All India DIC Meet at IIT Delhi, co-organised by IITH.' },
];

export const NODAL_APPLY = {
  title: 'Bring your institution into the DIC network',
  intro: 'Open to colleges, universities, design and technical institutes, and schools ready to run design thinking and innovation programmes with the IIT Hyderabad hub.',
  benefits: [
    { title: 'Hub mentorship', text: 'Faculty guidance from the Department of Design, IIT Hyderabad.' },
    { title: 'Immersions at IITH', text: "Student cohorts and faculty training at the hub's labs." },
    { title: 'Certification', text: 'Programmes certified by the Design Innovation Centre, IIT Hyderabad.' },
    { title: 'Path to incubation', text: 'Selected projects move toward pre-incubation and startup support.' },
  ],
  steps: [
    { title: 'Express interest', text: 'Email the hub team with the details below.' },
    { title: 'Scoping call', text: 'Meet the hub team to agree focus areas.' },
    { title: 'MoU', text: 'Sign a node agreement with DIC, IITH.' },
    { title: 'Launch', text: 'Name a node coordinator and start your first cohort.' },
  ],
  include: ['Institution name and type', 'City and state', 'Contact person and role, email and phone', 'What your node would work on: regional problems, labs you already have, student numbers'],
  email: 'dic@des.iith.ac.in',
};

export const NODAL_SOURCES = [
  { label: 'IITH press release, 4th All India DIC Meet (2024)', href: 'https://pr.iith.ac.in/pressrelease/DIC.pdf' },
  { label: 'Ministry of Education, list of DICs', href: 'https://www.education.gov.in/sites/upload_files/mhrd/files/document-reports/funds_he.pdf' },
  { label: 'DIC IITH, PI profile', href: 'https://dic.iith.ac.in/?page_id=32' },
];

export const ROLE_LABEL = { nodal: 'Hub & Nodal', hub: 'Hub', spoke: 'Spoke', national: 'National body' };

export const NODAL_ROLE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'hub', label: 'Hubs' },
  { key: 'spoke', label: 'Spokes' },
  { key: 'national', label: 'National bodies' },
];

/* end: an ISO date (YYYY-MM-DD); status is derived from it at render time */
export const EVENTS = [
  {
    date: '2026-11-13',
    end: '2026-11-15',
    title: 'Global South Design Summit',
    host: 'IIT Hyderabad',
    city: 'Hyderabad',
    desc: 'Three-day summit on human-centred design for the Global South, co-hosted with the HCD Institute.',
    link: 'https://hcd.institute',
    linkText: 'Details & registration',
  },
  {
    date: '2024-11-08',
    end: '2024-11-10',
    title: 'Intl. Conference on Design & Manufacturing Technologies',
    host: 'IIT Roorkee',
    city: 'Roorkee',
    desc: 'Network conference on design and advanced manufacturing.',
    link: '',
    linkText: '',
  },
  {
    date: '2023-05-12',
    end: '2023-05-23',
    title: 'Medical Device Design Workshop',
    host: 'IIT Roorkee · Navaashay',
    city: 'Roorkee',
    desc: 'Hands-on workshop on design of medical devices.',
    link: '',
    linkText: '',
  },
];

export const WHO_CAN_JOIN = [
  'Government departments',
  'Universities & IITs / NITs',
  'PSUs & research bodies',
  'Industry partners',
  'NGOs',
];
