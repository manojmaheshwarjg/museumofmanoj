// Tour state: this browser's visitor number, the chosen tour, the name on the ticket and punched rooms.
// Stored per browser so a returning visitor keeps their ticket and their number.

const KEY = 'manoj-museum:v1';
const listeners = new Set();

export const ROOM_COUNT = 12;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* private mode: keep it in memory */ }
}

const stored = load();

export const state = {
  // Only numbers handed out by the visitor counter are ever shown. Nothing is made up locally.
  visitor: stored.visitorCounted && Number.isInteger(stored.visitor) ? stored.visitor : null,
  totalVisitors: Number.isInteger(stored.totalVisitors) ? stored.totalVisitors : null,
  returning: false,
  name: stored.name || '',
  // Express was retired: anyone who chose it before is on the full tour.
  mode: stored.mode === 'express' ? 'full' : stored.mode || null,
  punched: new Set(stored.punched || []),
  ticketPrinted: Boolean(stored.ticketPrinted),
  startedAt: stored.startedAt || Date.now(),
};

function persist() {
  save({
    visitor: state.visitor,
    visitorCounted: state.visitor !== null,
    totalVisitors: state.totalVisitors,
    name: state.name,
    mode: state.mode,
    punched: [...state.punched],
    ticketPrinted: state.ticketPrinted,
    startedAt: state.startedAt,
  });
}
persist();

// #00,001 style. Until the counter answers, the number shows as dashes.
export const formatVisitor = (n) => (Number.isInteger(n) && n > 0 ? `#${n.toLocaleString('en-US', { minimumIntegerDigits: 5 })}` : '#--,---');

export function on(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(type, detail) {
  listeners.forEach((fn) => fn(type, state, detail));
}

export function setVisitor({ number, total, returning }) {
  state.visitor = number;
  if (Number.isInteger(total)) state.totalVisitors = total;
  state.returning = Boolean(returning);
  persist();
  emit('visitor');
}

export function printTicket({ name, mode }) {
  state.name = (name || '').trim().slice(0, 22);
  state.mode = mode;
  state.ticketPrinted = true;
  document.body.dataset.mode = mode;
  persist();
  emit('ticket');
}

export function punch(room) {
  if (state.punched.has(room)) return;
  state.punched.add(room);
  persist();
  emit('punch', room);
}

export function minutesSinceStart() {
  return Math.max(1, Math.round((Date.now() - state.startedAt) / 60000));
}
