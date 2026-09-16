// Registers this browser with the visitor counter, then remembers its number.
// A random id lives in localStorage (with a cookie as a backup), so each browser counts once.

import { setVisitor } from './state.js';

const ID_KEY = 'manoj-museum:visitor-id';
const COOKIE = 'mm_vid';
const API = import.meta.env.VITE_VISITOR_API || 'api/visit';

function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function visitorId() {
  let id = null;
  try { id = localStorage.getItem(ID_KEY); } catch { /* storage blocked */ }
  if (!id) id = (document.cookie.match(/(?:^|; )mm_vid=([^;]+)/) || [])[1] || null;
  if (!id) id = uuid();
  try { localStorage.setItem(ID_KEY, id); } catch { /* storage blocked */ }
  document.cookie = `${COOKIE}=${id}; max-age=${60 * 60 * 24 * 730}; path=/; samesite=lax`;
  return id;
}

export async function registerVisit({ timeout = 5000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: visitorId() }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`counter answered ${res.status}`);
    const { number, total, returning } = await res.json();
    if (!Number.isInteger(number) || number < 1) throw new Error('counter sent no number');
    setVisitor({ number, total, returning });
    return true;
  } catch (err) {
    console.info('[museum] visitor counter unavailable:', err?.message || err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
