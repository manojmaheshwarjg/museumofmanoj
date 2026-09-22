// Where each stop of the tour lives. The home page is the walk in, from Fifth Avenue to the welcome, and every other
// stop is its own page at /experience/<slug>, so it can be linked to, shared, and read on its own.
// Kept free of the DOM, because the build reads it too, to write each page's link preview.

import { ROOMS } from '../content/rooms.js';

const SLUGS = {
  'room-02': 'chennai',
  'room-03': 'teknuance',
  'room-04': 'three-friends',
  'room-05': 'delhi',
  'room-06': 'own-studio',
  'room-07': 'the-leap',
  'room-08': 'buffalo',
  'room-09': 'new-york',
  'room-10': 'projects',
  'room-11': 'human-wing',
  'room-12': 'whats-next',
};

// Where a stop lives. Stops that are part of the walk (the plaza, the lobby) keep their place on the home page.
export const pathFor = (id) => (SLUGS[id] ? `/experience/${SLUGS[id]}` : `/#${id}`);

// The stop a page belongs to, or null for the home page and for addresses that match no stop.
export function stopAt(pathname) {
  const match = /^\/experience\/([a-z0-9-]+)\/?$/.exec(pathname || '');
  if (!match) return null;
  const id = Object.keys(SLUGS).find((key) => SLUGS[key] === match[1]);
  return ROOMS.find((room) => room.id === id) || null;
}

// Where a stop falls in the tour, to tell going on from going back.
export const stopIndex = (stop) => ROOMS.findIndex((room) => room.id === stop?.id);

// What a shared link to each page says about it, taken from the stop itself so a preview never invents anything.
export const STOP_PAGES = ROOMS.filter((room) => SLUGS[room.id]).map((room) => ({
  slug: SLUGS[room.id],
  title: room.title,
  description: `${room.proof?.[0] || room.place}. ${room.place}, ${room.dates}.`,
}));

// A link straight to a page still needs a ticket. The page it asked for waits here while the ticket prints.
const HELD = 'manoj-museum:after-ticket';
export const holdForTicket = (path) => { try { sessionStorage.setItem(HELD, path); } catch { /* storage blocked */ } };
export function heldStop() {
  try { return stopAt(sessionStorage.getItem(HELD)); } catch { return null; }
}
export function takeHeldPath() {
  try {
    const path = sessionStorage.getItem(HELD);
    sessionStorage.removeItem(HELD);
    return stopAt(path) ? path : null;
  } catch { return null; }
}
