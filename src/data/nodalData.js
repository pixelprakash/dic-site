/* ─── Data for the DIC Nodal (national network) page ───
   role: "nodal" | "hub" | "spoke" | "national" */
export const NODAL_SEALS = [
  { value: '20', label: 'Design Innovation Centres' },
  { value: '70+', label: 'Spoke institutions' },
  { value: '2014', label: 'Established under NIDI' },
  { value: 'IIT-H', label: 'Hub & Nodal Centre' },
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

export const CENTRES = [
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
