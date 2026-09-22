// Every gallery in the museum, in walking order.
// Facts come from Manoj's resume and the approved storyboard. Anything personal that isn't known yet is left
// out, never invented.
//
// beat fields
//   art     illustration key (src/rooms/art-*.js)
//   effect  optional 4D effect key (src/rooms/effects.js)
//   stat    { value, label } big number on the beat
//   photos  [{ file, alt, marks }] from public/photos, in a row under the beat. A beat with photos and no art or title
//           is a photo section of its own; one with words and no art is its words, then its photos. A room's cover is
//           one photo at the very top of its page, with a note in pen beside it if it has one ({ file, alt, note }).
//   photoLayout  'lead' to lay a beat's photos out as one grid: the first across the top, the rest in a row under it
//   copyFirst  true to put the beat's words above its drawing, instead of under it
//   full    true for the long beats (the express tour, since retired, used to skip them)

export const ROOMS = [
  {
    n: 2, id: 'room-02', no: '02', tone: 'night', outfit: 'tee',
    title: 'Chennai is where my story starts', place: 'Chennai, India', dates: 'until 2019',
    guide: { pose: 'wave', line: "Beaches, biryani and a bike. That's Chennai." },
    cover: { file: 'childhood.jpg', alt: 'Manoj as a child', note: "Yes, that's me!" },
    beats: [
      {
        art: 'marina', effect: 'tide', label: 'the good stuff', title: 'Beaches, biryani, bike',
        text: 'I loved all three. Marina Beach and the sound of the water, a good plate of biryani, and my Suzuki Gixxer SF 155.',
        photos: [{ file: 'chennaimarina.jpg', alt: 'Marina Beach, Chennai' }],
      },
      {
        label: 'the bot', title: 'The first thing we built', full: true,
        text: 'Our first bot: hardware, software, and a whole lot of wires.',
        // The bot across the top and two from college under it, as one grid.
        photoLayout: 'lead',
        photos: [
          { file: 'college5.jpg', alt: 'The first bot: its plywood body, its circuit board and its drive gears' },
          { file: 'college2.jpg', alt: 'College days' },
          { file: 'college4.jpg', alt: 'College days' },
        ],
      },
      {
        art: 'circuit', effect: 'circuit', label: 'the lab', title: 'Anna University',
        text: 'Four years of electronics and communication engineering, circuits that finally lit up, and the friends I graduated with.',
        stat: { value: 'B.E.', label: 'electronics & communication' },
        photos: [{ file: 'vecgrad.jpg', alt: 'Graduation day with friends' }],
      },
      {
        art: 'offer-letter', effect: 'confetti', label: 'the letter', title: 'An envelope arrives', copyFirst: true,
        text: 'Caps went up, and an offer came in from Teknuance: my first job.',
      },
    ],
    proof: ['B.E., Electronics and Communication', 'Anna University, Aug 2015 to May 2019'],
  },

  {
    n: 3, id: 'room-03', no: '03', tone: 'night', outfit: 'tee',
    title: 'Teknuance, the first job', place: 'Chennai, India', dates: 'Jan 2020 to Jan 2021',
    guide: { pose: 'point', line: 'My first desk. Go on, sit down.' },
    beats: [
      {
        art: 'desk-badge', label: 'day one', title: 'Software analyst',
        text: 'My first job out of college: software analyst at Teknuance, in Chennai.',
      },
      {
        art: 'team', label: 'the team', title: 'Twelve people, one curious analyst', full: true,
        text: 'A cross-functional team of 12 engineers and designers, building AI and ML data science products.',
        stat: { value: '12', label: 'engineers & designers' },
        photos: [{ file: 'teknuance1.jpg', alt: 'The Teknuance team' }],
      },
      {
        art: 'story-wall', effect: 'stickies', label: 'the wall', title: 'The wall of user stories',
        text: 'I wrote 150+ user stories and technical specs, built around four personas.',
        stat: { value: '150+', label: 'user stories & specs' },
      },
      {
        art: 'kanban', effect: 'kanban', label: 'shipped', title: 'Eight products, shipped',
        text: 'Eight AI and ML data science products, with 85% of features delivered inside MVP timelines.',
        stat: { value: '85%', label: 'features on MVP timelines' },
      },
      {
        art: 'meter', effect: 'meter', label: 'the interviews', title: 'Listen first', full: true,
        text: '50+ stakeholder interviews across 4 personas became 65 prioritized features for 6 communication tools, and development got 35% faster.',
        stat: { value: '+35%', label: 'development velocity' },
      },
    ],
    proof: ['Software Analyst, Teknuance, Chennai', 'Jan 2020 to Jan 2021', '8 AI and ML products with a team of 12', '150+ user stories, 85% on MVP timelines', '50+ interviews, 65 features, +35% velocity'],
  },

  {
    n: 4, id: 'room-04', no: '04', tone: 'night', outfit: 'tee',
    title: 'Three friends, one studio', place: 'Zedtribe · Chennai', dates: 'Apr 2021 to Oct 2022',
    guide: { pose: 'idle', line: 'Three friends, one studio, 30+ clients.' },
    beats: [
      {
        art: 'napkin', effect: 'laptops', label: 'the night it started', title: 'A name on a napkin',
        text: 'Three friends started a studio together: Zedtribe, in Chennai, in April 2021.',
        photos: [{
          file: '3founders.jpg',
          alt: 'A group photo with the three founders of Zedtribe circled',
          marks: { faces: [[480, 162, 88, 106], [676, 110, 86, 104], [1008, 110, 86, 104]], note: { text: 'the three of us', x: 352, y: 80 } },
        }],
      },
      {
        art: 'invoice', effect: 'invoice', label: 'the first client', title: 'Invoice #001', full: true,
        text: "Our first client, and the studio's very first invoice.",
      },
      {
        art: 'world-pins', effect: 'pins', label: 'clients everywhere', title: 'Clients around the world',
        text: '30+ client engagements across Europe, America and India, each one managed directly by us.',
        stat: { value: '30+', label: 'client engagements' },
      },
      {
        art: 'design-to-code', effect: 'rocket', label: 'design to delivery', title: 'Sketch, design, code, launch', full: true,
        text: 'Full-stack development, product design and direct client management, all inside one small studio.',
      },
      {
        art: 'jar', effect: 'jar', label: 'the jar', title: '$15k, coin by coin',
        text: '$15k in revenue, and everything you learn running a company with friends.',
        stat: { value: '$15K', label: 'revenue' },
      },
    ],
    proof: ['Co-founder and engineer, Zedtribe, Chennai', 'Apr 2021 to Oct 2022', '30+ client engagements, $15k revenue', 'Full-stack, product design, client management'],
  },

  {
    n: 5, id: 'room-05', no: '05', tone: 'night', outfit: 'tee',
    title: 'Flight to Delhi', place: 'Favcy · Delhi', dates: 'Nov 2022 to Oct 2023',
    guide: { pose: 'point', line: 'Buckle up. Chennai to Delhi, 1,760 km.' },
    beats: [
      {
        art: 'suitcase', label: 'the move', title: 'A new job, a new city',
        text: 'One suitcase from Chennai, and a whole new city to explore.',
        photos: [{ file: 'delhi1.jpg', alt: 'Manoj in Delhi' }, { file: 'delhi2.jpg', alt: 'Manoj in Delhi' }],
      },
      {
        art: 'india-map', effect: 'flight-india', label: 'over India', title: 'MAA to DEL',
        stat: { value: '1,760 km', label: 'Chennai to Delhi' },
      },
      {
        art: 'pm-desk', effect: 'ab', label: 'Favcy', title: 'The first product manager desk',
        text: 'Associate product manager at Favcy, with this team, on products in a $2M+ revenue portfolio, from discovery through launch.',
        stat: { value: '$2M+', label: 'portfolio revenue' },
        photos: [{ file: 'delhi3.jpg', alt: 'The Favcy team' }],
      },
      {
        art: 'llm-features', effect: 'typing', label: 'LLM features', title: 'Search, chat, recommendations', full: true,
        text: 'LLM-powered features for recommendation, search, chat and content generation, tuned with fine-tuning and prompt engineering.',
      },
      {
        art: 'ab-test', effect: 'ab', label: 'test everything', title: 'A or B?', full: true,
        text: '60+ user interviews and 25+ A/B experiments, analyzed in SQL and Python with teams of 10+ engineers and designers.',
        stat: { value: '25+', label: 'A/B experiments' },
      },
    ],
    proof: ['Associate Product Manager, Favcy, Delhi', 'Nov 2022 to Oct 2023', 'Products in a $2M+ revenue portfolio', 'LLM features for search, chat, recs, content', '60+ interviews, 25+ A/B experiments'],
  },

  {
    n: 6, id: 'room-06', no: '06', tone: 'night', outfit: 'tee',
    title: 'A studio of my own', place: 'Hurrae · Chennai', dates: 'Dec 2023 to Jul 2024',
    guide: { pose: 'point', line: 'Back in Chennai, and this door had my name on it.' },
    beats: [
      {
        art: 'studio-sign', effect: 'sign', label: 'the sign', title: 'Hurrae',
        text: 'My own product studio, Hurrae, in Chennai.',
      },
      {
        art: 'clocks', effect: 'clocks', label: 'three time zones', title: 'New York, San Francisco, Chennai', full: true,
        text: 'Enterprise clients in the US, served from a studio in Chennai.',
      },
      {
        art: 'app-stack', effect: 'stack', label: 'ten apps', title: '10+ production web apps',
        text: 'For HR tech, insurtech, energy investment and portfolio management, each owned from scoping to client handoff.',
        stat: { value: '10+', label: 'production web apps' },
      },
      {
        art: 'notebook-ai', effect: 'underline', label: 'the question', title: 'What next?',
        text: '$20k in delivery revenue, and then the big question: what next?',
        stat: { value: '$20K', label: 'delivery revenue' },
      },
    ],
    proof: ['Founder and engineer, Hurrae, Chennai', 'Dec 2023 to Jul 2024', '10+ production web apps for US enterprise clients', '$20k in delivery revenue'],
  },

  {
    n: 7, id: 'room-07', no: '07', tone: 'night', outfit: 'tee',
    title: 'The leap', place: 'Chennai to Buffalo', dates: '2024',
    guide: { pose: 'idle', line: "Chennai to Buffalo: 13,400 km. Let's go." },
    beats: [
      {
        art: 'decision', effect: 'underline', label: 'the decision', title: 'One page in the notebook',
        text: 'After two studios and a product job: take a break, and go deep on AI.',
      },
      {
        art: 'goodbye', effect: 'walk', label: 'goodbye at home', title: 'Mom and dad at the door',
        text: 'The hardest part of leaving: saying goodbye at home.',
      },
      {
        art: 'departures', effect: 'departures', label: 'the airport', title: 'Chennai airport',
        text: 'A last hug from mom and dad before security.',
        photos: [{ file: 'parents.jpg', alt: 'Mom and dad' }],
      },
      {
        art: 'window-seat', effect: 'flight-world', label: 'the flight', title: 'Window seat',
        text: 'Chennai to Buffalo, by way of JFK.',
        stat: { value: '13,400 km', label: 'MAA to BUF' },
      },
    ],
    proof: ['Admitted to the M.S. in Artificial Intelligence', 'University at Buffalo, SUNY', 'Arrived August 2024'],
  },

  {
    n: 8, id: 'room-08', no: '08', tone: 'night', outfit: 'puffer', ambient: 'snow',
    title: 'Buffalo', place: 'University at Buffalo', dates: 'Aug 2024 to Jan 2026',
    guide: { pose: 'wave', line: 'Buffalo. Good thing I brought the jacket.' },
    beats: [
      {
        art: 'snow-window', effect: 'flakes', label: 'first snow', title: 'First snow',
        text: 'The first real snowfall in a new city, and a snowman to go with it.',
        photos: ['buffalofirstsnow.jpg', 'buffalofirstsnow2.jpg', 'buffalofirstsnow3.jpg'].map((file) => ({ file, alt: 'First snow in Buffalo' })),
      },
      {
        art: 'lecture', label: 'the M.S.', title: 'M.S. in Artificial Intelligence', full: true,
        text: 'Lectures, labs and late nights at the University at Buffalo.',
        photos: [{ file: 'ub1.jpg', alt: 'The University at Buffalo campus' }],
      },
      {
        art: 'graduation', effect: 'confetti', label: 'graduation', title: 'January 2026',
        text: 'Graduation day at UB: M.S. in Artificial Intelligence, done.',
        photos: [{ file: 'ubgrad1.jpg', alt: 'Graduation at the University at Buffalo' }],
      },
    ],
    proof: ['M.S., Artificial Intelligence', 'University at Buffalo, SUNY', 'Aug 2024 to Jan 2026'],
  },

  {
    n: 9, id: 'room-09', no: '09', tone: 'night', outfit: 'puffer',
    title: 'New York', place: 'VivPro · New Jersey', dates: 'Mar 2026 to now',
    guide: { pose: 'point', line: 'New York. You walked past it on the way in.' },
    beats: [
      {
        art: 'skyline-suitcase', effect: 'windows', label: 'arriving', title: 'The New York chapter',
        text: 'After Buffalo, the move to New York.',
      },
      {
        art: 'prototype-tower', effect: 'stack', label: 'VivPro', title: '15+ working prototypes',
        text: 'Product management intern at VivPro, building end-to-end prototypes on the production stack and design system, so they ship as the build spec.',
        stat: { value: '15+', label: 'end-to-end prototypes' },
        photos: [{ file: 'vivpro1.jpg', alt: 'At VivPro' }],
      },
      {
        art: 'team-table', label: 'before the build', title: 'Prototype first, then build', full: true,
        text: 'A 10 to 12 engineer team aligns on a working prototype before development starts, and post-launch rework drops.',
      },
      {
        art: 'checklist', effect: 'checklist', label: 'pharma rules', title: 'Every screen answers to regulation', full: true,
        text: 'Embedded with leading global pharma clients, turning ambiguous, domain-heavy requirements into software under regulatory, compliance and data-handling constraints.',
      },
      {
        art: 'countdown', effect: 'countdown', label: 'RhoHack, 24 hours', title: 'We came in top 5',
        text: "Rho Desk, a voice AI desk on Rho's API, plus its launch film, built in 24 hours at RhoHack in September 2026. It won 1st place for Best Use of ElevenLabs API and 3rd place for Best Use of Tavily API.",
        photos: [{ file: 'hack1.jpg', alt: 'The Rho Desk team at RhoHack, where it came in the top 5' }],
      },
    ],
    proof: ['Product Management Intern, VivPro', 'Mar 2026 to now', '15+ end-to-end prototypes on the production stack', 'Prototype-first validation for a 10 to 12 engineer team', 'RhoHack, Sep 2026: top 5, 1st for ElevenLabs API'],
  },

  {
    n: 10, id: 'room-10', no: '10', tone: 'night', outfit: 'puffer', layout: 'collection',
    title: 'The permanent collection', place: 'The finished works', dates: '2021 to now',
    guide: { pose: 'point', line: 'The finished works. Touching encouraged.' },
    exhibits: [
      {
        art: 'ex-rhodesk', no: 'exhibit 1', title: 'Rho Desk', year: '2026', tag: 'BUILT IN 24 HOURS',
        text: "A voice AI desk on Rho's API, with its own launch film. Built at RhoHack, where it came in the top 5 and won 1st place for Best Use of ElevenLabs API.",
        links: [{ label: 'GitHub', href: 'https://github.com/manojmaheshwarjg/rhodesk' }, { label: 'Launch film', href: 'https://youtu.be/bGvRytckfJI' }],
      },
      {
        art: 'ex-snapinfra', no: 'exhibit 2', title: 'SnapInfra', year: '2025', tag: '5,000+ DOWNLOADS',
        text: 'Turns plain English into architecture blueprints, C4 diagrams, backend code, database schemas and infrastructure code for AWS, GCP and Azure. Its open-source CLI lives on PyPI.',
        links: [{ label: 'snapinfra.ai', href: 'https://snapinfra.ai' }, { label: 'PyPI', href: 'https://pypi.org/project/snapinfra/' }],
      },
      {
        art: 'ex-rebateos', no: 'exhibit 3', title: 'RebateOS', year: '2025', tag: '90%+ ACCURACY',
        text: 'A RAG assistant for healthcare rebates: 1,000+ contracts and 200,000+ purchase orders, with conflicts flagged and every answer cited. Pinecone, LangChain and Mistral OCR.',
        links: [{ label: 'GitHub', href: 'https://github.com/manojmaheshwarjg/RebateOS' }],
      },
      {
        art: 'ex-scootpie', no: 'exhibit 4', title: 'ScootPie', year: '2025', tag: 'TRY-ON · SDXL',
        text: 'An AI shopping assistant with virtual try-on (IDM-VTON on Stable Diffusion XL), product discovery and outfit ideas on Gemini.',
        links: [{ label: 'scootpie.com', href: 'https://scootpie.com' }],
      },
      {
        art: 'ex-nda', no: 'exhibit 5', title: 'On loan', year: '2026', tag: 'CONFIDENTIAL', cover: true,
        text: 'A frame under cloth: the pharma prototypes from VivPro.', reveal: 'Sorry, NDA.',
      },
    ],
    clients: {
      names: ['Aerodei', 'Closing Media', 'Sixfold', 'Spellmint', 'Jerrydata', 'Book180', 'Hoberman Rockets'],
      quotes: [
        { text: 'Teaming up with Manoj was a game-changer! His knack for design, swift development, and unmatched dedication made our web revamp a smashing hit!', who: 'Prabhakaran, founder, HireHere' },
        { text: 'Updating our website with Manoj was a breeze! Loved his expertise and collaborative spirit. Can’t wait for our next project together!', who: 'Sarah, founder, Book180' },
        { text: "Manoj's team is my go-to for web needs. Detailed proposals, clear communication, and top-notch results. They're a dream to work with!", who: 'Natalie, principal, Sulimani Law Firm' },
        { text: 'I had the pleasure of working with Manoj, and I cannot speak highly enough of his professionalism and dedication.', who: 'Walker, founder, Partywave' },
      ],
    },
    proof: ['Rho Desk, top 5 at RhoHack 2026', 'SnapInfra, 5,000+ CLI downloads', 'RebateOS, 90%+ extraction accuracy', 'ScootPie, virtual try-on on SDXL', 'Client work with Aerodei, Sixfold, Spellmint and more'],
  },

  {
    n: 11, id: 'room-11', no: '11', tone: 'night', outfit: 'tee', layout: 'wing',
    title: 'The human wing', place: 'Off the clock', dates: 'most evenings',
    guide: { pose: 'wave', line: 'Off the clock. Say hi to Nano.' },
    items: [
      {
        kind: 'photos', label: 'no. 1 · photo exhibition', title: 'Lens life',
        text: 'I still shoot with my old Nikon D3300 and a 35mm f/1.8 prime. Sometimes I cheat with a Google Pixel 7.',
        // Hung in rows, each row at one height: the wider landscapes paired with the narrower ones so every row comes
        // out about as tall, and the tall shot and the square one sharing a row with a landscape.
        photos: [['p1', 'p10'], ['p3', 'p12'], ['p9', 'p15', 'p2'], ['p4', 'p7'], ['p8', 'p14'], ['p6', 'p11'], ['p5', 'p13']]
          .map((row) => row.map((name) => ({ file: `${name}.jpg`, alt: 'A photograph by Manoj' }))),
      },
      {
        kind: 'nano', label: "no. 2 · Nano's aquarium", title: 'Fish dad',
        text: 'Nano, my betta fish, sits on my desk while I work. First pet, and surprisingly good at keeping me calm.',
        photo: { file: 'nano.jpg', alt: 'Nano the betta fish' },
      },
      {
        kind: 'coffee', label: 'no. 3 · the coffee bar', title: 'Cups 2 to 4',
        text: "I'm the one who orders single-origin beans online. My best code happens between cups 2 and 4.",
      },
      {
        kind: 'wip', label: 'no. 4 · unfinished works', title: '12 works in progress',
        text: '12 half-finished side projects and zero regrets. Learning by doing, one repo at a time.',
      },
      {
        kind: 'pixel', label: 'no. 5 · the 2px corner', title: 'Two pixels off',
        text: 'I notice when something is 2 pixels out of line. Pixel-perfect, on purpose.',
      },
      {
        kind: 'friends', label: 'no. 6 · the friend test', title: 'The non-tech friend test',
        text: 'Every feature gets tested on non-tech friends first. If they get confused, back to the drawing board.',
      },
    ],
    proof: ['Nikon D3300 and a 35mm f/1.8', 'Nano, the betta fish', 'Single-origin coffee', '12 side projects in progress'],
  },

  {
    n: 12, id: 'room-12', no: '12', tone: 'night', outfit: 'tee', layout: 'skylight',
    title: "Skylight: what's next", place: 'New York', dates: 'from here',
    guide: { pose: 'wave', line: "Last stop. It's still under construction, on purpose." },
    plaque: ['Open to full-time product roles', 'F-1 OPT · New York', 'Can start right away'],
    contact: { email: 'manojmaheshwarjg@gmail.com', phone: '+1 716-750-9384', site: 'https://manoj.ai', github: 'https://github.com/manojmaheshwarjg' },
    proof: ['Open to full-time product roles', 'F-1 OPT, New York'],
  },
];

export const roomByN = (n) => ROOMS.find((r) => r.n === n);
