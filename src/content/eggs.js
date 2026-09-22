// Easter eggs: things to find, poke and take home in each room. In the 3D museum each one hangs on a wall
// or stands on a plinth; without 3D they sit in a row at the top of the room.
// Facts follow the same rule as the rooms: a `tell` is a question Manoj still has to answer.
//
// egg fields
//   title, line  the card that opens when you find it
//   art          an illustration key from src/rooms, or
//   sign         a word painted on the wall object when there is no illustration
//   sfx          a comic sound word that pops when you poke it
//   tell         a missing detail, shown as a "Tell me" note
//   action       { kind: 'download', what: 'postcard' | 'boarding' | 'ticket' | 'resume' | 'vcard' | 'wallpaper' }
//                { kind: 'copy', text } · { kind: 'link', href } · { kind: 'clocks' } · { kind: 'countdown' }
//                { kind: 'jar' } · { kind: 'ab' } · { kind: 'feed' } · { kind: 'reveal', text } · { kind: 'visitors' }

const postcard = (id, place) => ({
  id, sign: 'POSTCARDS', title: `A postcard from ${place}`, line: 'Take this one home.',
  action: { kind: 'download', what: 'postcard', label: 'Download the postcard' },
});

export const EGGS = {
  lobby: [
    { id: 'ticket-copy', sign: 'YOUR TICKET', title: 'Take your ticket home', line: 'A copy of your ticket, punches and all.', action: { kind: 'download', what: 'ticket', label: 'Download your ticket' } },
    { id: 'visitor-count', sign: 'VISITORS', title: 'The visitor counter', line: 'Every browser that walks in gets the next number.', action: { kind: 'visitors' } },
  ],
  'room-02': [
    { id: 'tea-stall', art: 'chennai-street', title: 'The tea stall', line: 'An auto rattles past, and the tea on the corner starts to steam.', sfx: 'Pom pom!', tell: 'My usual order at the stall' },
    { id: 'lab-bench', art: 'circuit', title: 'The lab bench', line: 'Electronics and communication, and circuits that finally light up.', sfx: 'Bzzt!' },
    postcard('postcard-02', 'Chennai'),
  ],
  'room-03': [
    { id: 'story-wall', art: 'story-wall', title: 'The wall of user stories', line: '150+ user stories, with four personas pinned across the top.', sfx: 'Fwip!' },
    { id: 'first-badge', art: 'desk-badge', title: 'Day one', line: 'A badge slides across the first desk.', tell: 'Was 2020 remote or in the office?' },
    postcard('postcard-03', 'Teknuance'),
  ],
  'room-04': [
    { id: 'coin-jar', art: 'jar', title: 'The coin jar', line: 'Every project dropped a coin in. Add one.', action: { kind: 'jar' } },
    { id: 'napkin', art: 'napkin', title: 'The napkin', line: 'Three friends, one table, and a name on a napkin.', tell: 'How we picked the name' },
    postcard('postcard-04', 'the studio'),
  ],
  'room-05': [
    { id: 'boarding-del', sign: 'BOARDING PASS', title: 'Boarding pass, MAA to DEL', line: 'Chennai to Delhi, 1,760 km.', action: { kind: 'download', what: 'boarding', from: 'MAA', to: 'DEL', fromCity: 'Chennai', toCity: 'Delhi', distance: '1,760 km', when: 'NOV 2022', label: 'Download the boarding pass' } },
    { id: 'a-or-b', art: 'ab-test', title: 'A or B?', line: '25+ A/B experiments at Favcy. Pick one.', action: { kind: 'ab' }, tell: 'An A/B test that surprised me' },
    postcard('postcard-05', 'Delhi'),
  ],
  'room-06': [
    { id: 'three-clocks', art: 'clocks', title: 'Three time zones', line: 'US clients, so the wall follows New York and San Francisco from Chennai.', action: { kind: 'clocks' } },
    { id: 'neon-sign', art: 'studio-sign', title: 'The sign', line: 'A product studio of my own, lit for the first time.', sfx: 'Bzzt!', tell: 'Why I started it' },
    postcard('postcard-06', 'Hurrae'),
  ],
  'room-07': [
    { id: 'departures', art: 'departures', title: 'The departures board', line: 'Chennai to Buffalo. The board flips.', sfx: 'Clack clack!' },
    { id: 'boarding-buf', sign: 'BOARDING PASS', title: 'Boarding pass, MAA to BUF', line: '13,400 km, window seat.', action: { kind: 'download', what: 'boarding', from: 'MAA', to: 'BUF', fromCity: 'Chennai', toCity: 'Buffalo', distance: '13,400 km', when: 'AUG 2024', label: 'Download the boarding pass' } },
    { id: 'the-scale', art: 'packing', title: '23 kg?', line: 'Two suitcases, one scale, and the painful choice of what stays behind.', tell: "What didn't make the cut" },
  ],
  'room-08': [
    { id: 'first-snow', art: 'snow-window', title: 'First snow', line: 'The first real snowfall, watched from a window in a new city.', sfx: 'Whoosh!' },
    { id: 'snapinfra-cli', art: 'terminal', title: 'pip install snapinfra', line: 'Open source, and past 5,000 downloads on PyPI.', action: { kind: 'copy', text: 'pip install snapinfra', label: 'Copy the command' } },
    postcard('postcard-08', 'Buffalo'),
  ],
  'room-09': [
    { id: 'rhohack-clock', art: 'countdown', title: '24 hours', line: 'Rho Desk and its launch film, built in 24 hours at RhoHack.', action: { kind: 'countdown' } },
    { id: 'prototype-tower', art: 'prototype-tower', title: '15+ prototypes', line: 'Working prototypes on the production stack, stacked like floors.', sfx: 'Stack!' },
    postcard('postcard-09', 'New York'),
  ],
  'room-10': [
    { id: 'snapinfra-site', art: 'ex-snapinfra', title: 'SnapInfra', line: 'Plain English in, architecture and infrastructure code out.', action: { kind: 'link', href: 'https://snapinfra.ai', label: 'Visit snapinfra.ai' } },
    { id: 'scootpie-site', art: 'ex-scootpie', title: 'ScootPie', line: 'An AI shopping assistant with virtual try-on.', action: { kind: 'link', href: 'https://scootpie.com', label: 'Visit scootpie.com' } },
    { id: 'under-cloth', sign: 'ON LOAN', title: 'A frame under cloth', line: 'The pharma prototypes from VivPro.', action: { kind: 'reveal', text: 'Sorry, NDA.' } },
  ],
  'room-11': [
    { id: 'feed-nano', sign: 'NANO', title: "Nano's tank", line: 'My betta fish, and surprisingly good at keeping me calm.', action: { kind: 'feed' } },
    { id: 'coffee-bar', sign: 'COFFEE', title: 'The coffee bar', line: 'My best code happens between cups 2 and 4.', sfx: 'Blub blub!', tell: 'My favorite beans' },
    { id: 'the-camera', sign: 'D3300', title: 'The camera', line: 'An old Nikon D3300 and a 35mm f/1.8 prime.', tell: 'My best 8 to 12 photos' },
  ],
  'room-12': [
    { id: 'resume', sign: 'RESUME', title: 'The resume', line: 'One page, every stop.', action: { kind: 'download', what: 'resume', label: 'Download the resume' }, tell: 'Drop the latest resume at public/resume.pdf' },
    { id: 'contact-card', sign: 'CONTACT', title: 'Contact card', line: 'Straight into your phone.', action: { kind: 'download', what: 'vcard', label: 'Save the card' } },
    { id: 'wallpaper', sign: 'WALLPAPER', title: 'Doodle wallpaper', line: 'Your guide, on your lock screen.', action: { kind: 'download', what: 'wallpaper', label: 'Make the wallpaper' } },
  ],
};
