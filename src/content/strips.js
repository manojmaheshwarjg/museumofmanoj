// The walk into each room: a short comic strip Manoj tells on the way, about how he got to that chapter.
// Facts come from the resume and the approved storyboard, the same as the rooms.
// A `tell` panel is a gap: its line is the question Manoj still has to answer, and it renders as a "Tell me" note.
//
// panel fields
//   caption  the comic caption box
//   line     what Manoj says (or, on a tell panel, the missing detail)
//   art      an illustration key from src/rooms (null draws a lettered panel)
//   tell     true when the panel is still a placeholder

export const STRIPS = {
  'room-02': [
    { caption: 'Chennai', art: 'chennai-street', line: 'Every museum starts somewhere. Mine starts here.' },
    { caption: 'Growing up', art: null, line: 'The neighborhood, and the year', tell: true },
  ],
  'room-03': [
    { caption: 'May 2019', art: 'circuit', line: 'Degree in hand, from Anna University.' },
    { caption: 'The job hunt', art: null, line: 'How I found Teknuance', tell: true },
    { caption: 'The interview', art: null, line: 'One moment from the interview', tell: true },
    { caption: 'Ding!', art: 'offer-letter', line: 'Software analyst at Teknuance, starting January 2020.' },
  ],
  'room-04': [
    { caption: 'January 2021', art: 'kanban', line: 'A year of shipping at Teknuance.' },
    { caption: 'The pitch', art: null, line: 'Why I left, and who pitched the studio', tell: true },
    { caption: 'One table', art: 'napkin', line: 'Three friends, one table, a name on a napkin.' },
    { caption: 'April 2021', art: 'invoice', line: 'The studio opens for business.' },
  ],
  'room-05': [
    { caption: 'October 2022', art: 'jar', line: '30+ clients and $15k later, the studio closes.' },
    { caption: 'Why', art: null, line: 'Why the chapter closed', tell: true },
    { caption: 'The interview', art: null, line: 'How the Favcy interview happened', tell: true },
    { caption: 'The offer', art: 'suitcase', line: 'Associate product manager, in Delhi. 1,760 km away.' },
  ],
  'room-06': [
    { caption: 'October 2023', art: 'pm-desk', line: 'A year of product work in Delhi.' },
    { caption: 'The itch', art: null, line: 'Why I started my own studio', tell: true },
    { caption: 'The first client', art: null, line: 'How the first US client found us', tell: true },
    { caption: 'December 2023', art: 'studio-sign', line: 'The Hurrae sign lights up.' },
  ],
  'room-07': [
    { caption: 'July 2024', art: 'notebook-ai', line: 'Ten apps shipped, and one question in the notebook: what next?' },
    { caption: 'The answer', art: 'decision', line: 'The moment I chose AI', tell: true },
    { caption: 'Up next', art: 'window-seat', line: 'The longest stop on the tour. Take your time.' },
  ],
  'room-08': [
    { caption: 'August 2024', art: 'landing', line: 'Wheels down in Buffalo.' },
    { caption: 'Week one', art: null, line: 'Where I stayed, and what surprised me', tell: true },
    { caption: 'The cold', art: 'snow-window', line: 'The puffer jacket goes on.' },
  ],
  'room-09': [
    { caption: 'January 2026', art: 'graduation', line: 'M.S. in Artificial Intelligence, done.' },
    { caption: 'The hunt', art: null, line: 'How I found VivPro, on F-1 OPT', tell: true },
    { caption: 'March 2026', art: 'prototype-tower', line: 'Product management intern at VivPro.' },
    { caption: 'The move', art: 'skyline-suitcase', line: 'How I got to New York', tell: true },
  ],
  'room-10': [
    { caption: 'After hours', art: 'terminal', line: 'Between classes and jobs, the side builds kept going.' },
    { caption: '2025', art: 'contracts', line: 'SnapInfra, RebateOS and ScootPie.' },
    { caption: 'September 2026', art: 'countdown', line: 'Rho Desk, built in 24 hours at RhoHack.' },
  ],
  'room-11': [
    { caption: 'Off the clock', art: 'window-seat', line: 'Enough about work.' },
    { caption: 'The good stuff', art: null, line: 'The camera, the fish, the coffee.' },
  ],
  'room-12': [
    { caption: 'So far', art: null, line: "That's the story so far." },
    { caption: 'From here', art: 'skyline-suitcase', line: 'Open to full-time product roles. F-1 OPT, New York.' },
  ],
};
