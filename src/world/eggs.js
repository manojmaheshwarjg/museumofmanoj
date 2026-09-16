// Easter eggs: things to find in each room, as a row of buttons in the room itself.
// Finding one opens a card: a drawing, a line, sometimes a missing detail, and something to do or take home.

import gsap from 'gsap';
import { EGGS } from '../content/eggs.js';
import { ROOMS } from '../content/rooms.js';
import { state, formatVisitor } from '../lib/state.js';
import { keepsake } from '../lib/keepsakes.js';
import { drawArt } from '../rooms/raster.js';
import { readFed, saveFed } from '../rooms/wing-human.js';

const FOUND_KEY = 'manoj-museum:eggs';
const found = new Set((() => { try { return JSON.parse(localStorage.getItem(FOUND_KEY)) || []; } catch { return []; } })());
const remember = (id) => {
  found.add(id);
  try { localStorage.setItem(FOUND_KEY, JSON.stringify([...found])); } catch { /* private mode: remembered for this visit */ }
};
let coins = 0;
let ticking = 0;
let card = null;

function button(label, onClick, ink = true) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `btn${ink ? ' btn--ink' : ''}`;
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

// The interactive part of an egg card.
function play(egg, roomId, into, actions) {
  const a = egg.action;
  if (!a) return;
  const note = (text) => { const p = document.createElement('p'); p.className = 'hand egg-card__note'; p.textContent = text; into.replaceChildren(p); return p; };
  if (a.kind === 'download') {
    const room = ROOMS.find((r) => r.id === roomId);
    actions.append(button(a.label, async (e) => {
      const b = e.currentTarget;
      b.disabled = true;
      b.textContent = 'Making it…';
      const ok = await keepsake(a, room).catch(() => false);
      b.disabled = false;
      b.textContent = ok ? 'Saved. Get another' : 'Not ready yet';
    }));
  } else if (a.kind === 'copy') {
    actions.append(button(a.label, async (e) => {
      try { await navigator.clipboard.writeText(a.text); e.currentTarget.textContent = 'Copied'; } catch { e.currentTarget.textContent = a.text; }
    }));
  } else if (a.kind === 'link') {
    actions.append(Object.assign(document.createElement('a'), { className: 'btn btn--ink', href: a.href, target: '_blank', rel: 'noopener', textContent: a.label }));
  } else if (a.kind === 'clocks') {
    const zones = [['New York', 'America/New_York'], ['San Francisco', 'America/Los_Angeles'], ['Chennai', 'Asia/Kolkata']];
    const list = document.createElement('ul');
    list.className = 'egg-card__clocks';
    const paint = () => {
      list.innerHTML = zones.map(([city, timeZone]) => `<li><span class="mono">${city}</span><b class="dotf">${new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit', second: '2-digit' }).format(new Date())}</b></li>`).join('');
    };
    paint();
    ticking = setInterval(paint, 1000);
    into.replaceChildren(list);
  } else if (a.kind === 'countdown') {
    let left = 24 * 3600;
    const face = note('');
    face.className = 'dotf egg-card__countdown';
    const paint = () => { face.textContent = [left / 3600, (left % 3600) / 60, left % 60].map((n) => String(Math.floor(n)).padStart(2, '0')).join(':'); };
    paint();
    ticking = setInterval(() => { left = Math.max(0, left - 1); paint(); }, 1000);
  } else if (a.kind === 'jar') {
    const count = note(coins ? `$${coins.toLocaleString('en-US')} in the jar` : 'The jar is empty. For now.');
    actions.append(button('Drop a coin', () => {
      coins = Math.min(15000, coins + 500);
      count.textContent = coins >= 15000 ? "$15,000. That's the whole jar." : `$${coins.toLocaleString('en-US')} in the jar`;
      pop('Clink!');
    }));
  } else if (a.kind === 'ab') {
    const reply = note('Which one ships?');
    ['A', 'B'].forEach((choice) => actions.append(button(choice, () => { reply.textContent = `You picked ${choice}. At Favcy, the experiment decided.`; pop(choice === 'A' ? 'A!' : 'B!'); }, choice === 'A')));
  } else if (a.kind === 'feed') {
    const count = note(`Nano has had ${readFed()} snacks so far.`);
    actions.append(button('Feed Nano', () => {
      const n = readFed() + 1;
      saveFed(n);
      count.textContent = `Nano has had ${n} snacks so far.`;
      pop('Blub!');
    }));
  } else if (a.kind === 'reveal') {
    const under = note('');
    actions.append(button('Lift the cloth', (e) => { under.textContent = a.text; e.currentTarget.remove(); pop('Whoops'); }));
  } else if (a.kind === 'visitors') {
    note(Number.isInteger(state.visitor)
      ? `You're visitor ${formatVisitor(state.visitor)}.${Number.isInteger(state.totalVisitors) ? ` ${state.totalVisitors.toLocaleString('en-US')} ${state.totalVisitors === 1 ? 'visitor' : 'visitors'} so far.` : ''}`
      : 'Your number is still on its way.');
  }
}

function pop(word) {
  if (!card || !word) return;
  const sfx = card.querySelector('.egg-card__sfx');
  sfx.textContent = word;
  gsap.fromTo(sfx, { scale: 0.2, rotate: -18, autoAlpha: 1 }, { scale: 1, rotate: -8, duration: 0.45, ease: 'back.out(3)' });
  gsap.to(sfx, { autoAlpha: 0, duration: 0.3, delay: 1.1 });
}

function ensureCard() {
  if (card) return card;
  card = document.createElement('div');
  card.className = 'egg-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-labelledby', 'egg-card-title');
  card.hidden = true;
  card.innerHTML = `
    <button class="mono egg-card__close" type="button">Close</button>
    <p class="mono egg-card__kicker">Easter egg</p>
    <h3 class="egg-card__title" id="egg-card-title"></h3>
    <svg class="egg-card__art" aria-hidden="true"></svg>
    <p class="dotf egg-card__sign" aria-hidden="true"></p>
    <p class="egg-card__line"></p>
    <div class="egg-card__play"></div>
    <p class="tellme egg-card__tell"></p>
    <div class="egg-card__actions"></div>
    <span class="egg-card__sfx" aria-hidden="true"></span>`;
  document.body.appendChild(card);
  card.querySelector('.egg-card__close').addEventListener('click', closeEgg);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEgg(); });
  document.addEventListener('pointerdown', (e) => { if (!card.hidden && !card.contains(e.target) && !e.target.closest('.egg-dot, [data-egg]')) closeEgg(); });
  return card;
}

export function closeEgg() {
  if (!card || card.hidden) return;
  clearInterval(ticking);
  card.hidden = true;
}

export function openEgg(egg, roomId) {
  const c = ensureCard();
  clearInterval(ticking);
  remember(egg.id);
  document.querySelectorAll(`[data-egg="${egg.id}"]`).forEach((b) => b.classList.add('is-found'));
  c.querySelector('.egg-card__title').textContent = egg.title;
  const art = c.querySelector('.egg-card__art');
  art.replaceChildren();
  art.style.display = egg.art ? '' : 'none';
  if (egg.art) drawArt(art, egg.art, 'paper');
  const sign = c.querySelector('.egg-card__sign');
  sign.textContent = egg.sign || '';
  sign.style.display = egg.art ? 'none' : '';
  c.querySelector('.egg-card__line').textContent = egg.line;
  const tell = c.querySelector('.egg-card__tell');
  tell.textContent = egg.tell ? `Tell me: ${egg.tell}` : '';
  tell.style.display = egg.tell ? '' : 'none';
  const into = c.querySelector('.egg-card__play');
  const actions = c.querySelector('.egg-card__actions');
  into.replaceChildren();
  actions.replaceChildren();
  play(egg, roomId, into, actions);
  c.hidden = false;
  gsap.fromTo(c, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out' });
  if (egg.sfx) pop(egg.sfx);
  c.querySelector('.egg-card__close').focus({ preventScroll: true });
}

// Rows of egg buttons for the rooms (used when there is no 3D world, and as a keyboard-friendly list).
export function eggButtonsHTML(roomId) {
  const eggs = EGGS[roomId] || [];
  if (!eggs.length) return '';
  return `<div class="room__eggs" aria-label="Easter eggs in this room"><span class="mono">Things to find</span>${eggs.map((egg) => `<button class="room__egg${found.has(egg.id) ? ' is-found' : ''}" type="button" data-egg="${egg.id}" data-egg-room="${roomId}">${egg.title}</button>`).join('')}</div>`;
}

export function initEggs() {
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-egg]');
    if (!b) return;
    const egg = (EGGS[b.dataset.eggRoom] || []).find((x) => x.id === b.dataset.egg);
    if (egg) openEgg(egg, b.dataset.eggRoom);
  });
}
