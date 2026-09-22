// Every gallery in the museum, in walking order.
// Facts come from Manoj's resume and the approved storyboard. Anything personal that isn't known yet
// is a `tell` note: it renders as a marked placeholder until Manoj fills it in. Never invent those.
//
// beat fields
//   art     illustration key (src/rooms/art-*.js)
//   effect  optional 4D effect key (src/rooms/effects.js)
//   stat    { value, label } big number on the beat
//   photo   { file, caption, ar } expected at public/photos/<file>
//   tell    list of details still needed from Manoj
//   full    true when the beat is skipped on the express tour

export const ROOMS = [
  {
    n: 2, id: 'room-02', no: '02', tone: 'paper', outfit: 'tee',
    title: 'Chennai, where it began', place: 'Chennai, India', dates: 'until 2019', time: '75 s',
    guide: { pose: 'wave', line: 'Chennai. This is where the story starts.' },
    fourD: 'Morning street, steam off the tea stall, a notebook that writes itself, circuits that light up.',
    beats: [
      {
        art: 'chennai-street', effect: 'steam', label: 'beat 1 · the street', title: 'Sunrise in Chennai',
        text: 'An auto rickshaw rattles past, and the tea stall on the corner starts to steam.',
        photo: { file: '02-chennai-street.jpg', caption: 'A Chennai street', ar: '4 / 3' },
        tell: ['Where in Chennai I grew up'],
      },
      {
        art: 'notebook', effect: 'write', label: 'beat 2 · the notebook', title: 'The first things I built', full: true,
        text: 'Before any code, there were stories and scripts, written line by line in a notebook at home.',
        photo: { file: '02-home.jpg', caption: 'Home', ar: '4 / 5' },
        tell: ['What I wrote: stories, scripts, a blog?', 'A family moment I would share'],
      },
      {
        art: 'circuit', effect: 'circuit', label: 'beat 3 · the lab', title: 'Anna University',
        text: 'Electronics and communication engineering, 2015 to 2019, and circuits that finally light up.',
        stat: { value: 'B.E.', label: 'electronics & communication' },
        photo: { file: '02-college.jpg', caption: 'College days', ar: '4 / 5' },
        tell: ['One college memory'],
      },
      {
        art: 'offer-letter', effect: 'confetti', label: 'beat 4 · the letter', title: 'An envelope arrives',
        text: 'Caps go up at graduation, and an offer comes in from Teknuance. The ramp leads to what came next.',
        photo: { file: '02-graduation.jpg', caption: 'Graduation', ar: '4 / 3' },
      },
    ],
    proof: ['B.E., Electronics and Communication', 'Anna University, Aug 2015 to May 2019'],
  },

  {
    n: 3, id: 'room-03', no: '03', tone: 'paper', outfit: 'tee',
    title: 'Teknuance, the first job', place: 'Chennai, India', dates: 'Jan 2020 to Jan 2021', time: '75 s',
    guide: { pose: 'point', line: 'My first desk. Go on, sit down.' },
    fourD: 'Keyboards clattering, a squeaky whiteboard marker, sticky notes that flutter when you scroll fast.',
    beats: [
      {
        art: 'desk-badge', label: 'beat 1 · day one', title: 'Software analyst',
        text: 'You sit down at the first desk, and a badge slides across it.',
        photo: { file: '03-office.jpg', caption: 'The office', ar: '4 / 3' },
        tell: ['Was 2020 remote or in the office?'],
      },
      {
        art: 'team', label: 'beat 2 · the team', title: 'Twelve people, one curious analyst', full: true,
        text: 'A cross-functional team of 12 engineers and designers, building AI and ML data science products.',
        stat: { value: '12', label: 'engineers & designers' },
        tell: ['A teammate story'],
      },
      {
        art: 'story-wall', effect: 'stickies', label: 'beat 3 · the wall', title: 'The wall of user stories',
        text: '150+ user stories and technical specs, with four personas pinned across the top.',
        stat: { value: '150+', label: 'user stories & specs' },
      },
      {
        art: 'kanban', effect: 'kanban', label: 'beat 4 · shipped', title: 'Eight products, shipped',
        text: 'Eight AI and ML data science products, with 85% of features delivered inside MVP timelines.',
        stat: { value: '85%', label: 'features on MVP timelines' },
        tell: ['The first thing I shipped'],
      },
      {
        art: 'meter', effect: 'meter', label: 'beat 5 · the interviews', title: 'Listen first', full: true,
        text: '50+ stakeholder interviews across 4 personas became 65 prioritized features for 6 communication tools, and development got 35% faster.',
        stat: { value: '+35%', label: 'development velocity' },
      },
    ],
    proof: ['Software Analyst, Teknuance, Chennai', 'Jan 2020 to Jan 2021', '8 AI and ML products with a team of 12', '150+ user stories, 85% on MVP timelines', '50+ interviews, 65 features, +35% velocity'],
  },

  {
    n: 4, id: 'room-04', no: '04', tone: 'night', outfit: 'tee',
    title: 'Three friends, one studio', place: 'Zedtribe · Chennai', dates: 'Apr 2021 to Oct 2022', time: '90 s',
    guide: { pose: 'idle', line: 'Three friends, one table, zero clients. For now.' },
    fourD: 'Three laptops open one after another, client pins drop onto a world map, a coin jar fills as projects land.',
    beats: [
      {
        art: 'napkin', effect: 'laptops', label: 'beat 1 · the night it started', title: 'A name on a napkin',
        text: 'Three friends around a table, and a studio name sketched on a napkin.',
        photo: { file: '04-founders.jpg', caption: 'The three of us', ar: '4 / 3' },
        tell: ['Was this Zedtribe or Hurrae?', 'Their names, with their OK', 'How we picked the name'],
      },
      {
        art: 'invoice', effect: 'invoice', label: 'beat 2 · the first client', title: 'Invoice #001', full: true,
        text: 'An email pings, and the studio prints its very first invoice.',
        photo: { file: '04-workspace.jpg', caption: 'The first workspace', ar: '4 / 3' },
      },
      {
        art: 'world-pins', effect: 'pins', label: 'beat 3 · clients everywhere', title: 'Clients around the world',
        text: '30+ client engagements across industries, pinned onto the map one by one.',
        stat: { value: '30+', label: 'client engagements' },
        tell: ['Client countries (pins are placeholders until then)'],
      },
      {
        art: 'design-to-code', effect: 'rocket', label: 'beat 4 · design to delivery', title: 'Sketch, design, code, launch', full: true,
        text: 'Full-stack development, product design and direct client management, all inside one small studio.',
        photo: { file: '04-launch.jpg', caption: 'A launch day', ar: '4 / 5' },
      },
      {
        art: 'jar', effect: 'jar', label: 'beat 5 · the jar', title: '$15k, coin by coin',
        text: '$15k in revenue, and everything you learn running a company with friends.',
        stat: { value: '$15K', label: 'revenue' },
        tell: ['Why the chapter closed'],
      },
    ],
    proof: ['Co-founder and engineer, Zedtribe, Chennai', 'Apr 2021 to Oct 2022', '30+ client engagements, $15k revenue', 'Full-stack, product design, client management'],
  },

  {
    n: 5, id: 'room-05', no: '05', tone: 'paper', outfit: 'tee',
    title: 'Flight to Delhi', place: 'Favcy · Delhi', dates: 'Nov 2022 to Oct 2023', time: '90 s',
    guide: { pose: 'point', line: 'Buckle up. Chennai to Delhi, 1,760 km.' },
    fourD: 'The camera pulls up over India, a plane traces the arc from Chennai to Delhi, and the Favcy doors open.',
    beats: [
      {
        art: 'suitcase', label: 'beat 1 · the move', title: 'A new job, a new city',
        text: 'One suitcase, zipped shut in Chennai.',
        photo: { file: '05-arriving-delhi.jpg', caption: 'Arriving in Delhi', ar: '4 / 3' },
        tell: ['What moving to Delhi felt like'],
      },
      {
        art: 'india-map', effect: 'flight-india', label: 'beat 2 · over India', title: 'MAA to DEL',
        text: 'The camera pulls up over India, and a plane draws the line from Chennai to Delhi.',
        stat: { value: '1,760 km', label: 'Chennai to Delhi' },
      },
      {
        art: 'pm-desk', effect: 'ab', label: 'beat 3 · Favcy', title: 'The first product manager desk',
        text: 'Associate product manager for products in a $2M+ revenue portfolio, from discovery through launch.',
        stat: { value: '$2M+', label: 'portfolio revenue' },
        photo: { file: '05-favcy-team.jpg', caption: 'The Favcy team', ar: '4 / 3' },
      },
      {
        art: 'llm-features', effect: 'typing', label: 'beat 4 · LLM features', title: 'Search, chat, recommendations', full: true,
        text: 'LLM-powered features for recommendation, search, chat and content generation, tuned with fine-tuning and prompt engineering.',
        tell: ['The feature I am proudest of'],
      },
      {
        art: 'ab-test', effect: 'ab', label: 'beat 5 · test everything', title: 'A or B?', full: true,
        text: '60+ user interviews and 25+ A/B experiments, analyzed in SQL and Python with teams of 10+ engineers and designers.',
        stat: { value: '25+', label: 'A/B experiments' },
        tell: ['An A/B test that surprised me'],
      },
    ],
    proof: ['Associate Product Manager, Favcy, Delhi', 'Nov 2022 to Oct 2023', 'Products in a $2M+ revenue portfolio', 'LLM features for search, chat, recs, content', '60+ interviews, 25+ A/B experiments'],
  },

  {
    n: 6, id: 'room-06', no: '06', tone: 'night', outfit: 'tee',
    title: 'A studio of my own', place: 'Hurrae · Chennai', dates: 'Dec 2023 to Jul 2024', time: '60 s',
    guide: { pose: 'point', line: 'Same city, new door. This one had my name on it.' },
    fourD: 'Wall clocks for New York, San Francisco and Chennai tick together, and app screens stack up one by one.',
    beats: [
      {
        art: 'studio-sign', effect: 'sign', label: 'beat 1 · the sign', title: 'Hurrae',
        text: 'A product studio of my own, with the sign lit for the first time.',
        photo: { file: '06-studio.jpg', caption: 'The studio', ar: '4 / 3' },
        tell: ['Why I started it'],
      },
      {
        art: 'clocks', effect: 'clocks', label: 'beat 2 · three time zones', title: 'New York, San Francisco, Chennai', full: true,
        text: 'US enterprise clients, so the clocks on the wall follow New York and San Francisco.',
      },
      {
        art: 'app-stack', effect: 'stack', label: 'beat 3 · ten apps', title: '10+ production web apps',
        text: 'For HR tech, insurtech, energy investment and portfolio management, each owned from scoping to client handoff.',
        stat: { value: '10+', label: 'production web apps' },
        tell: ['A favorite client story'],
      },
      {
        art: 'notebook-ai', effect: 'underline', label: 'beat 4 · the question', title: 'What next?',
        text: '$20k in delivery revenue, and one question in the notebook that leads straight into the next one.',
        stat: { value: '$20K', label: 'delivery revenue' },
        tell: ['The moment I chose AI'],
      },
    ],
    proof: ['Founder and engineer, Hurrae, Chennai', 'Dec 2023 to Jul 2024', '10+ production web apps for US enterprise clients', '$20k in delivery revenue'],
  },

  {
    n: 7, id: 'room-07', no: '07', tone: 'night', outfit: 'tee', layout: 'theater',
    title: 'The leap', place: 'Chennai to Buffalo', dates: '2024', time: '2.5 min',
    guide: { pose: 'idle', line: 'The longest stop on the tour. Take your time in here.' },
    fourD: 'The departures board flips, the seat rumbles on takeoff, and cold air greets you on landing.',
    beats: [
      {
        art: 'decision', effect: 'underline', label: 'beat 1 · the decision', title: 'One page in the notebook',
        text: 'After two studios and a product job: take a break, and go deep on AI.',
        tell: ['Why AI, and why then'],
      },
      {
        art: 'applications', effect: 'submit', label: 'beat 2 · applications', title: 'Submit', full: true,
        text: 'Browser tabs, essays and recommendation letters, and a submit button pressed at a very late hour.',
      },
      {
        art: 'admit', effect: 'confetti', label: 'beat 3 · the admit', title: 'Congrats!',
        text: 'The phone buzzes: admitted to the M.S. in Artificial Intelligence at the University at Buffalo.',
        photo: { file: '07-admit.jpg', caption: 'The admit screen', ar: '4 / 5' },
        tell: ['The day the admit came'],
      },
      {
        art: 'visa', effect: 'stamp', label: 'beat 4 · the visa', title: 'I-20, then F-1',
        text: 'The I-20 arrives, then the consulate queue, a short interview and the words everyone waits for. Documents here are drawn, never scanned.',
        tell: ['My visa interview story'],
      },
      {
        art: 'packing', effect: 'scale', label: 'beat 5 · packing', title: '23 kg?', full: true,
        text: 'Two suitcases, one scale, and the painful choice of what stays behind.',
        photo: { file: '07-packing.jpg', caption: 'Packing', ar: '4 / 3' },
      },
      {
        art: 'goodbye', effect: 'walk', label: 'beat 6 · goodbye at home', title: 'Mom and dad at the door', slow: true,
        text: 'The hardest scene in the museum gets the quietest telling.',
        photo: { file: '07-parents.jpg', caption: 'Home, before the airport', ar: '4 / 3' },
        tell: ['Only what I want to share here'],
      },
      {
        art: 'departures', effect: 'departures', label: 'beat 7 · the airport', title: 'Chennai airport',
        text: 'The departures board flips, a last hug before security, and a boarding pass.',
        photo: { file: '07-airport.jpg', caption: 'The airport goodbye', ar: '4 / 3' },
        tell: ['Who came to the airport'],
      },
      {
        art: 'window-seat', effect: 'flight-world', label: 'beat 8 · the flight', title: 'Window seat',
        text: 'Chennai shrinks, the ocean passes, a layover, then the long last leg.',
        stat: { value: '13,400 km', label: 'MAA to BUF' },
        tell: ['My route and layover'],
      },
      {
        art: 'landing', effect: 'frost', label: 'beat 9 · landing', title: 'Port of entry',
        text: 'A passport stamp, the first cold breath of American air, and the doors to Buffalo.',
        photo: { file: '07-first-us-photo.jpg', caption: 'First photo in the US', ar: '4 / 5' },
        tell: ['What I felt when I landed'],
      },
    ],
    proof: ['Admitted to the M.S. in Artificial Intelligence', 'University at Buffalo, SUNY', 'Arrived August 2024'],
  },

  {
    n: 8, id: 'room-08', no: '08', tone: 'paper', outfit: 'puffer', ambient: 'snow',
    title: 'Buffalo', place: 'University at Buffalo', dates: 'Aug 2024 to Jan 2026', time: '90 s',
    guide: { pose: 'wave', line: 'Buffalo. Good thing I brought the jacket.' },
    fourD: 'Snow falls across the page and piles up in the corners. The projects here are still being built.',
    beats: [
      {
        art: 'snow-window', effect: 'flakes', label: 'beat 1 · first snow', title: 'First snow',
        text: 'The first real snowfall, watched from a window in a new city.',
        photo: { file: '08-first-snow.jpg', caption: 'First snow', ar: '4 / 5' },
        tell: ['My first snow story'],
      },
      {
        art: 'lecture', label: 'beat 2 · the M.S.', title: 'M.S. in Artificial Intelligence', full: true,
        text: 'Lectures, labs and late nights at the University at Buffalo.',
        photo: { file: '08-campus.jpg', caption: 'Campus', ar: '4 / 3' },
        tell: ['A class or professor that mattered'],
      },
      {
        art: 'terminal', effect: 'terminal', label: 'beat 3 · SnapInfra is born', title: 'pip install snapinfra',
        text: 'An open-source CLI that writes infrastructure code from plain English. It has passed 5,000 downloads.',
        stat: { value: '5,000+', label: 'downloads on PyPI' },
        tell: ['How SnapInfra started'],
      },
      {
        art: 'contracts', label: 'beat 4 · RebateOS', title: 'Contracts into answers', full: true,
        text: 'Stacks of healthcare contracts turn into answers, with the sources cited.',
        stat: { value: '90%+', label: 'extraction accuracy' },
      },
      {
        art: 'mirror', effect: 'tryon', label: 'beat 5 · ScootPie', title: 'A mirror that tries outfits on', full: true,
        text: 'Virtual try-on built on Stable Diffusion XL, with product discovery and outfits on Gemini.',
      },
      {
        art: 'graduation', effect: 'confetti', label: 'beat 6 · graduation', title: 'January 2026',
        text: 'A cap in the air over a snowy campus: M.S. in AI, done.',
        photo: { file: '08-graduation.jpg', caption: 'Graduation', ar: '4 / 5' },
        tell: ['Friends who made Buffalo home'],
      },
    ],
    proof: ['M.S., Artificial Intelligence', 'University at Buffalo, SUNY', 'Aug 2024 to Jan 2026', 'SnapInfra, RebateOS and ScootPie, built in 2025'],
  },

  {
    n: 9, id: 'room-09', no: '09', tone: 'night', outfit: 'puffer',
    title: 'New York', place: 'VivPro · New Jersey', dates: 'Mar 2026 to now', time: '75 s',
    guide: { pose: 'point', line: 'New York. You walked past it on the way in.' },
    fourD: 'The skyline rises out of the ramp wall, prototypes stack up like floors, and a 24-hour clock takes over the page.',
    beats: [
      {
        art: 'skyline-suitcase', effect: 'windows', label: 'beat 1 · arriving', title: 'The New York chapter',
        text: 'A suitcase at the edge of the skyline.',
        photo: { file: '09-new-york.jpg', caption: 'New York', ar: '4 / 5' },
        tell: ['How I got to New York'],
      },
      {
        art: 'prototype-tower', effect: 'stack', label: 'beat 2 · VivPro', title: '15+ working prototypes',
        text: 'Product management intern at VivPro, building end-to-end prototypes on the production stack and design system, so they ship as the build spec.',
        stat: { value: '15+', label: 'end-to-end prototypes' },
      },
      {
        art: 'team-table', label: 'beat 3 · before the build', title: 'Prototype first, then build', full: true,
        text: 'A 10 to 12 engineer team aligns on a working prototype before development starts, and post-launch rework drops.',
      },
      {
        art: 'checklist', effect: 'checklist', label: 'beat 4 · pharma rules', title: 'Every screen answers to regulation', full: true,
        text: 'Embedded with leading global pharma clients, turning ambiguous, domain-heavy requirements into software under regulatory, compliance and data-handling constraints.',
        tell: ['A pharma prototype I can talk about'],
      },
      {
        art: 'countdown', effect: 'countdown', label: 'beat 5 · RhoHack, 24 hours', title: 'Before the clock hits zero',
        text: "Rho Desk, a voice AI desk on Rho's API, plus its launch film, built in 24 hours at RhoHack in September 2026.",
        photo: { file: '09-rhohack.jpg', caption: 'RhoHack, at night', ar: '4 / 3' },
        tell: ['The RhoHack night'],
      },
    ],
    proof: ['Product Management Intern, VivPro', 'Mar 2026 to now', '15+ end-to-end prototypes on the production stack', 'Prototype-first validation for a 10 to 12 engineer team', 'RhoHack, Sep 2026: Rho Desk in 24 hours'],
  },

  {
    n: 10, id: 'room-10', no: '10', tone: 'paper', outfit: 'puffer', layout: 'collection',
    title: 'The permanent collection', place: 'The finished works', dates: '2021 to now', time: '90 s',
    guide: { pose: 'point', line: 'The finished works. Touching encouraged.' },
    fourD: 'Spotlights warm up as you reach each piece, and one frame stays under cloth.',
    exhibits: [
      {
        art: 'ex-rhodesk', no: 'exhibit 1', title: 'Rho Desk', year: '2026', tag: 'BUILT IN 24 HOURS',
        text: "A voice AI desk on Rho's API, with its own launch film. Built at RhoHack.",
        photo: { file: '10-rho-desk.jpg', caption: 'Rho Desk, the demo', ar: '16 / 10' },
      },
      {
        art: 'ex-snapinfra', no: 'exhibit 2', title: 'SnapInfra', year: '2025', tag: '5,000+ DOWNLOADS',
        text: 'Turns plain English into architecture blueprints, C4 diagrams, backend code, database schemas and infrastructure code for AWS, GCP and Azure. Its open-source CLI lives on PyPI.',
        links: [{ label: 'snapinfra.ai', href: 'https://snapinfra.ai' }, { label: 'PyPI', href: 'https://pypi.org/project/snapinfra/' }],
        photo: { file: '10-snapinfra.jpg', caption: 'SnapInfra', ar: '16 / 10' },
      },
      {
        art: 'ex-rebateos', no: 'exhibit 3', title: 'RebateOS', year: '2025', tag: '90%+ ACCURACY',
        text: 'A RAG assistant for healthcare rebates: 1,000+ contracts and 200,000+ purchase orders, with conflicts flagged and every answer cited. Pinecone, LangChain and Mistral OCR.',
        photo: { file: '10-rebateos.jpg', caption: 'RebateOS', ar: '16 / 10' },
      },
      {
        art: 'ex-scootpie', no: 'exhibit 4', title: 'ScootPie', year: '2025', tag: 'TRY-ON · SDXL',
        text: 'An AI shopping assistant with virtual try-on (IDM-VTON on Stable Diffusion XL), product discovery and outfit ideas on Gemini.',
        links: [{ label: 'scootpie.com', href: 'https://scootpie.com' }],
        photo: { file: '10-scootpie.jpg', caption: 'ScootPie', ar: '16 / 10' },
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
    tell: ['Which client work is okay to show', 'GitHub links for each project', 'Screenshots or short demo videos'],
    proof: ['Rho Desk, RhoHack 2026', 'SnapInfra, 5,000+ CLI downloads', 'RebateOS, 90%+ extraction accuracy', 'ScootPie, virtual try-on on SDXL', 'Client work with Aerodei, Sixfold, Spellmint and more'],
  },

  {
    n: 11, id: 'room-11', no: '11', tone: 'night', outfit: 'tee', layout: 'wing',
    title: 'The human wing', place: 'Off the clock', dates: 'most evenings', time: '60 s',
    guide: { pose: 'wave', line: 'Off the clock. Say hi to Nano.' },
    fourD: 'A photo exhibition, an aquarium that bubbles when you tap it, and steam from the coffee bar.',
    items: [
      {
        kind: 'photos', label: 'no. 1 · photo exhibition', title: 'Lens life',
        text: 'I still shoot with my old Nikon D3300 and a 35mm f/1.8 prime. Sometimes I cheat with a Google Pixel 7.',
        photos: ['11-photo-1.jpg', '11-photo-2.jpg', '11-photo-3.jpg', '11-photo-4.jpg', '11-photo-5.jpg', '11-photo-6.jpg'],
        tell: ['My best 8 to 12 photos'],
      },
      {
        kind: 'nano', label: "no. 2 · Nano's aquarium", title: 'Fish dad',
        text: 'Nano, my betta fish, sits on my desk while I work. First pet, and surprisingly good at keeping me calm.',
        photo: { file: '11-nano.jpg', caption: 'Nano', ar: '1 / 1' },
      },
      {
        kind: 'coffee', label: 'no. 3 · the coffee bar', title: 'Cups 2 to 4',
        text: "I'm the one who orders single-origin beans online. My best code happens between cups 2 and 4.",
      },
      {
        kind: 'wip', label: 'no. 4 · unfinished works', title: '12 works in progress',
        text: '12 half-finished side projects and zero regrets. Learning by doing, one repo at a time.',
        tell: ['The side project list'],
      },
      {
        kind: 'pixel', label: 'no. 5 · the 2px corner', title: 'Two pixels off',
        text: 'One giant frame, 2 pixels out of line, and a magnifying glass. Pixel-perfect, on purpose.',
      },
      {
        kind: 'friends', label: 'no. 6 · the friend test', title: 'The non-tech friend test',
        text: 'Every feature gets tested on non-tech friends first. If they get confused, back to the drawing board.',
      },
    ],
    proof: ['Nikon D3300 and a 35mm f/1.8', 'Nano, the betta fish', 'Single-origin coffee', '12 side projects in progress'],
  },

  {
    n: 12, id: 'room-12', no: '12', tone: 'paper', outfit: 'tee', layout: 'skylight',
    title: "Skylight: what's next", place: 'The top of the spiral', dates: 'from here', time: '45 s',
    guide: { pose: 'wave', line: "Last stop. It's still under construction, on purpose." },
    fourD: 'The skylight opens onto a New York dawn, and your ticket gets its last punch.',
    plan: [
      { days: 'Days 1 to 30', phase: 'Absorb', goal: 'Learn the product, the users and the numbers.', steps: ['Talk to 20 customers', 'Sit in on sales and support calls', 'Map the funnel, signup to activation'], result: 'A ranked list of the problems that matter' },
      { days: 'Days 31 to 60', phase: 'Prove', goal: 'Pick the highest-leverage problem and prove the fix.', steps: ['Prototype the fix within a week', 'Test it with real users first', 'Set the success metric before building'], result: 'A shipped v1 with real usage numbers' },
      { days: 'Days 61 to 90', phase: 'Scale', goal: 'Turn what worked into a repeatable engine.', steps: ['Build the growth loop into the product', 'Leave patterns the team can reuse', "Write next quarter's roadmap from data"], result: 'A roadmap backed by data' },
    ],
    plaque: ['Open to full-time product roles', 'F-1 OPT · New York', 'Can start right away'],
    contact: { email: 'manojmaheshwarjg@gmail.com', phone: '+1 716-750-9384', site: 'https://manoj.ai' },
    tell: ['Remote or relocation answer', 'LinkedIn, GitHub, Dribbble, Instagram and X links', 'OK to show a public guestbook?'],
    proof: ['Open to full-time product roles', 'F-1 OPT, New York', 'manojmaheshwarjg@gmail.com'],
  },
];

export const roomByN = (n) => ROOMS.find((r) => r.n === n);
