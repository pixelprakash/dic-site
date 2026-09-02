/* ─── Projects — transcribed verbatim from the Fifth All India DIC Meet
   2025 (IIT Delhi) exhibition posters. Text is kept as close to the
   poster wording/structure as possible (paragraphs stay paragraphs,
   bulleted objectives stay bullets) rather than paraphrased or condensed.
   Project photos are not yet uploaded (the posters themselves aren't
   files we can crop from) — `image: ''` falls back to a plain panel
   until real photos land in public/images/projects/. See the comment on
   each project for the expected filename. ─── */

export const PROJECTS = [
  {
    slug: 'temple-heritage-digital-preservation',
    title: 'Virtual Recreation & Digital Preservation of Cultural Heritage Temple Sites of Southern States of India',
    subtitle: 'Digital Preservation through 3D Printing and Virtual Reality for the Temple Architecture of Telangana',
    tagline: 'Reviving the built heritage of the Kakatiya dynasty through photogrammetry, AR/VR and 3D documentation.',
    domain: 'Cultural Heritage',
    status: 'Ongoing',
    pi: { name: 'Prof. Deepak John Mathew', slug: 'deepak-john-mathew' },
    image: '/images/projects/temple-heritage.webp',
    // This export has the texture atlas embedded directly in the FBX
    // (23.9MB vs. the untextured 3.6MB export) — FBXLoader extracts and
    // wires up embedded media on its own, which is why this one doesn't
    // need a separate `modelTexture` manually mapped onto the material
    // the way the untextured export did.
    model: '/models/kateshwara-temple-textured.fbx',
    modelLabel: 'Kateshwara Temple — 3D digital twin',
    description: [
      'Telangana is home to several magnificent built monuments that reflect the region’s rich cultural heritage. The essential features of the Kakatiya dynasty reflect the built heritage of the Warangal region. Warangal is the cultural capital of the Telangana state; in terms of historical importance and its unique architectural style, it has become a state heritage site.',
      'The project seeks to address these challenges by exploring the use of technology towards the digital preservation of the tangible aspects of the built heritage of southern India. The project also seeks to revive ancient culture and heritage by developing a comprehensive digital heritage repository through systematic documentation and using advanced technologies such as 3D documentation and AR and VR creations of the built heritage of Telangana, India.',
    ],
    objectives: [
      'Systematic documentation of the built heritage of Telangana through photogrammetry and other technologies.',
      'Use of Technology towards digital preservation of the built cultural heritage.',
      'To identify and make an inventory of all the architectural elements found through documentation.',
      'Identify methods to safeguard and promote the Tangible cultural heritage and revival of ancient culture.',
      'To involve the local communities in preserving the heritage and the surroundings of the premises.',
      'Interpretation of the sculptures, reliefs and architectural elements and motifs.',
      'Representation through methods of design innovation and technological advancement.',
    ],
    tags: ['3D Printing', 'VR', 'AR', 'Photogrammetry', 'Kakatiya Dynasty', 'Digital Heritage'],
  },
  {
    slug: 'telangana-cultural-heritage',
    title: 'Tangible and Intangible Cultural Heritage of Telangana: Visual Documentation and Design Intervention',
    subtitle: 'Preserving the Past, Sustaining the Future with Mixed Reality (VR/AR), AI, and Design Interventions',
    subtitle2: 'Virtual Walkthroughs of Legacy: Gond Tribe’s Cultural Heritage',
    tagline: 'Preserving the past, sustaining the future with mixed reality (VR/AR), AI, and design interventions.',
    domain: 'Cultural Heritage',
    status: 'Ongoing',
    pi: { name: 'Prof. Deepak John Mathew', slug: 'deepak-john-mathew' },
    image: '/images/projects/telangana-heritage.webp',
    description: [
      'Our project focuses on digitally documenting and preserving the tangible and intangible heritage of Telangana spanning landmarks like the Ramappa Temple and Warangal Fort, along with the diverse crafts, rituals, and traditions of its communities, including the Gond tribe of Adilabad.',
      'By employing cutting-edge technologies such as Virtual Reality (VR), Augmented Reality (AR), Artificial Intelligence (AI), and advanced material studies, this initiative aims to create a comprehensive digital repository that merges design, technology, and cultural memory.',
    ],
    objectives: [
      'Heritage Documentation: Digitally capture and reconstruct Telangana’s architectural, artistic, and cultural legacy.',
      'Design & Material Innovation: Apply modern design thinking and research to revitalize traditional crafts while maintaining authenticity.',
      'AI-Driven Insights: Use AI for data processing, analysis, and preservation strategy optimization.',
      'Immersive XR Experiences: Develop 1:1 virtual walkthroughs and interactive museum spaces to engage global audiences.',
    ],
    outcomes: [
      'The project will result in a dynamic digital archive and Virtual Museum Walkthroughs showcasing Telangana’s tangible and intangible heritage through VR and AR. It also empowers indigenous communities by transforming heritage documentation into livelihood opportunities. By bridging tradition with innovation, the initiative establishes a replicable model for sustainable cultural preservation ensuring that the art, architecture, and stories of Telangana continue to inspire generations to come.',
    ],
    tags: ['VR', 'AR', 'AI', 'Digital Heritage', 'Gond Tribe', 'Ramappa Temple', 'Warangal Fort'],
  },
  {
    slug: 'ai-ar-vr-learning-models',
    title: 'Integrating AI, AR, and VR in Learning Models and Their Impact',
    tagline: 'Studying whether VR, AR and AI can make school classrooms more interactive, experiential and technology-enabled.',
    domain: 'VR/AR Education',
    status: 'Ongoing',
    pi: { name: 'Prof. Deepak John Mathew', slug: 'deepak-john-mathew' },
    image: '/images/projects/ai-ar-vr-learning-models.webp',
    description: [
      'The Design Innovation Centre (DIC) project titled “Integrating AI, AR, and VR in Learning Models and Their Impact” aims to study the feasibility and effectiveness of immersive technologies in transforming school education in Telangana, India. The project focuses on evaluating how Virtual Reality (VR), Augmented Reality (AR), and Artificial Intelligence (AI) can create interactive, experiential, and technology-enabled classrooms in government schools.',
      'The study assesses the readiness of schools and teachers for adopting immersive technology, explores methods to integrate these tools into existing curricula, and analyzes their effect on student engagement, comprehension, and retention. Conducted through surveys, interviews, and classroom observations, the project is designed for scalability and may later be expanded to other states across India. The goal is to develop and implement a robust and adaptable framework for AR/VR-based education that enhances conceptual clarity, strengthens academic fundamentals, and improves students’ curiosity-driven learning.',
      'The project emphasizes multidisciplinary collaboration, combining design, pedagogy, and technology to create future-ready education systems. It aligns with the vision of the Ministry of Education and NEP 2020 to integrate advanced technologies into mainstream learning. Ultimately, the initiative seeks to develop scalable, accessible, and effective immersive education models that democratize quality learning, inspire innovation, and redefine how students perceive and interact with knowledge in the classroom.',
      'The project’s core focus areas include developing curriculum-based chapter plans, creating a VR/AR learning environment, and formulating flexible guidelines for teachers and students to ensure smooth integration into existing teaching systems. The workflow involves the integration of hardware, software, and project files, troubleshooting technical challenges, finalizing and launching a beta version, conducting primary testing, and refining the product based on user experience during initial school trials.',
      'The design team developed the concept and visual architecture for an immersive STEM education interface, initially exploring 3D home-screen buttons and icons for interactive navigation. However, the focus was later streamlined toward specific learning topics to ensure clarity and deeper pedagogical impact.',
      'One of the most significant milestones of the project is the creation of a working model prototype representing the first eighteen elements of the Periodic Table in a virtual chemistry lab. This interactive simulation allows students to visualize atomic structures, molecular bonds, and chemical interactions safely and immersively within VR. The prototype demonstrates how virtual learning can bridge the gap between theory and practice.',
    ],
    tags: ['VR', 'AR', 'AI', 'STEM Education', 'Virtual Chemistry Lab', 'Government Schools'],
  },
  {
    slug: 'urban-air-mobility-safety-vr-study',
    title: 'Urban Mobility - Investigating the Visual Safety Preferences and Acceptance of Urban Air Mobility (UAM) for Indian Passengers: A Digital Design and VR Validation Study',
    tagline: 'Understanding how Indian passengers perceive the safety, comfort, and design aesthetics of autonomous air taxis.',
    domain: 'Air Mobility',
    status: 'Ongoing',
    pi: { name: 'Prof. Deepak John Mathew', slug: 'deepak-john-mathew' },
    // Expected: public/images/projects/uam-safety-vr-study.jpg
    // (crop from the eVTOL render grid on the Innovation poster)
    image: '',
    description: [
      'This Design Innovation Centre (DIC) project explores the future of Urban Air Mobility (UAM) in India by analyzing user perceptions, safety preferences, and design acceptance of autonomous passenger drones, also referred to as “Air Taxis” or eVTOLs (Electric Vertical Take-off and Landing vehicles).',
      'Project focuses on developing a comprehensive interior design and user experience framework for next-generation aerial transport. Through digital modeling and Virtual Reality (VR) validation, the study aims to understand how Indian passengers perceive the safety, comfort, and design aesthetics of these autonomous systems. The project further includes the exterior design and configuration of eVTOLs, ensuring that both functional and emotional aspects of passenger experience are addressed within India’s evolving urban mobility landscape.',
    ],
    tags: ['UAM', 'eVTOL', 'VR', 'Urban Air Mobility', 'Digital Design'],
  },
  {
    slug: 'urban-aquaponics-no-soil-farming',
    title: 'No Soil Farming through Aquaponics',
    tagline: 'Growing food without soil — a closed-loop fish-and-plant system for space-starved Indian cities.',
    domain: 'Product Design',
    status: 'Ongoing',
    // No PI/faculty name was given for this one — built by first-year
    // BTech/BDes students — so the Team section stays empty rather than
    // guessing who's supervising it.
    image: '/images/projects/aquaproject/aquaponics-1.webp',
    description: [
      'With agricultural land increasingly scarce in India’s growing cities, the Design Innovation Centre’s Urban Aquaponics project is reimagining how and where food can be grown. The system creates a closed recycling loop: edible fish are raised in ponds, their nutrient-rich waste feeds vertically arranged crops, and the water is continuously refreshed to sustain both fish and plants without any external fertiliser.',
      'What began as a first-stage prototype, built through collaboration among first-year BTech and BDes students at the Centre, has since evolved into a broader research effort that tests the system at three distinct scales: compact units designed for apartment living, mid-scale rooftop installations, and community park-scale systems currently in development. Each version addresses a different layer of urban India’s food security challenge, from individual households to entire neighbourhoods.',
      'The high-nitrogen, continuously circulating water from the fish ecosystem enables plants to grow noticeably faster than in conventional soil-based systems, while eliminating the need for chemical inputs. It’s a project that started as a student-led experiment and has grown into a genuine model for how cities without spare land can still grow their own food, cleanly, efficiently, and sustainably.',
    ],
    tags: ['Aquaponics', 'Urban Farming', 'Sustainability', 'Food Security', 'Student-Led'],
    // Ordered as a rough story: the team and system overview, the build
    // process, the sensor/monitoring electronics, then a closing detail
    // shot of the pond itself.
    gallery: [
      '/images/projects/aquaproject/aquaponics-1.webp',
      '/images/projects/aquaproject/aquaponics-2.webp',
      '/images/projects/aquaproject/aquaponics-5.webp',
      '/images/projects/aquaproject/aquaponics-4.webp',
      '/images/projects/aquaproject/aquaponics-3.webp',
      '/images/projects/aquaproject/aquaponics-6.webp',
    ],
  },
];

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug);
}
