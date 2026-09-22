// Museum of Manoj: boots the tour, the heads-up display and each scene.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { state, on, formatVisitor, ROOM_COUNT } from './lib/state.js';
import { registerVisit } from './lib/visitor.js';
import { startBoil, loadPhotos, reducedMotion } from './lib/doodle.js';
import { setLenis, scrollToTarget } from './lib/scroll.js';
import { STOPS } from './content/tour.js';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// Weighted smooth scrolling for mouse and trackpad. Phones keep their native momentum.
if (matchMedia('(pointer: fine)').matches && !reducedMotion()) {
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  setLenis(lenis);
}

// Visitor number everywhere it appears.
const paintVisitor = () => {
  document.querySelectorAll('[data-visitor]').forEach((n) => { n.textContent = formatVisitor(state.visitor); });
};
paintVisitor();
// Ask the counter for this browser's number right away; scenes wait briefly for it.
const counted = registerVisit();

// No ticket, no museum: until a ticket is printed the page ends at the booth, and trying to go further asks for one.
const docEl = document.documentElement;
const plazaEl = document.getElementById('plaza');
const gated = () => docEl.classList.contains('is-gated');
const fitGate = () => { if (plazaEl) docEl.style.setProperty('--gate', `${plazaEl.offsetTop + plazaEl.offsetHeight}px`); };
if (!state.ticketPrinted) docEl.classList.add('is-gated');
fitGate();
if (plazaEl && 'ResizeObserver' in window) new ResizeObserver(fitGate).observe(plazaEl);
let nudgedAt = -Infinity;
const nudge = () => {
  if (performance.now() - nudgedAt < 1600) return;
  nudgedAt = performance.now();
  window.dispatchEvent(new CustomEvent('museum:gate'));
};
const atGate = () => gated() && window.scrollY + window.innerHeight >= docEl.scrollHeight - 6;
addEventListener('wheel', (e) => { if (e.deltaY > 0 && atGate()) nudge(); }, { passive: true });
let touchY = null;
addEventListener('touchstart', (e) => { touchY = e.touches[0] ? e.touches[0].clientY : null; }, { passive: true });
addEventListener('touchmove', (e) => {
  if (touchY !== null && e.touches[0] && touchY - e.touches[0].clientY > 24 && atGate()) nudge();
}, { passive: true });
addEventListener('keydown', (e) => {
  if (!['ArrowDown', 'PageDown', 'End', ' '].includes(e.key) || e.target.closest?.('input, textarea, select, button, a, [contenteditable]')) return;
  if (atGate()) nudge();
});

// Reading progress along the top edge.
const rail = document.querySelector('.progress-rail');
ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => rail?.style.setProperty('--p', self.progress.toFixed(4)),
});

// Floor directory.
const menuBtn = document.querySelector('.hud__menu');
const directory = document.getElementById('directory');
directory.querySelector('[data-directory]').innerHTML = STOPS.map((s) => `
  <li><a href="#${s.id}" data-go="#${s.id}"><span>${s.no}</span><span>${s.title}</span><span class="mono">${s.time}</span></a></li>`).join('');
const setDirectory = (open) => {
  directory.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
};
menuBtn.addEventListener('click', () => setDirectory(true));
directory.addEventListener('click', (e) => {
  if (e.target === directory || e.target.closest('[data-close]')) setDirectory(false);
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') setDirectory(false); });

// Any [data-go] link glides to its target. Without a ticket, every stop past the booth leads back to the booth.
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-go]');
  if (!link) return;
  e.preventDefault();
  setDirectory(false);
  if (gated() && !document.querySelector(link.dataset.go)?.closest('#plaza')) {
    scrollToTarget('#booth');
    nudgedAt = -Infinity;
    nudge();
    return;
  }
  scrollToTarget(link.dataset.go);
});

// The docked ticket: your progress bar for the whole tour.
const dock = document.querySelector('[data-dock-ticket]');
const renderDock = (fresh = 0) => {
  if (!state.ticketPrinted) return;
  const modeLabel = { full: 'full tour', express: 'express', resume: 'resume' }[state.mode] || 'full tour';
  dock.innerHTML = `
    <div class="dock-ticket__top"><span>admit one</span><span>${modeLabel}</span></div>
    <div class="dock-ticket__no">${formatVisitor(state.visitor)}</div>
    <div class="dock-ticket__holes">${Array.from({ length: ROOM_COUNT }, (_, i) => `<i class="${state.punched.has(i + 1) ? 'is-punched' : ''}${i + 1 === fresh ? ' is-new' : ''}"></i>`).join('')}</div>`;
  dock.classList.add('is-in');
};
renderDock();

// A little stamp beside the ticket each time a room is punched.
const toast = document.createElement('div');
toast.className = 'punch-toast';
toast.setAttribute('role', 'status');
document.body.appendChild(toast);
let toastTimer = 0;
on((type, _state, room) => {
  if (type === 'visitor') { paintVisitor(); renderDock(); }
  if (type === 'ticket') {
    renderDock();
    // The ticket opens the museum.
    if (gated()) { docEl.classList.remove('is-gated'); ScrollTrigger.refresh(); }
  }
  if (type !== 'punch') return;
  renderDock(room);
  toast.innerHTML = `<span class="dotf">PUNCHED</span><span class="mono">no. ${String(room).padStart(2, '0')} · ${state.punched.size} of ${ROOM_COUNT}</span>`;
  toast.classList.remove('is-in');
  void toast.offsetWidth;
  toast.classList.add('is-in');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-in'), 1800);
});
if (state.mode) document.body.dataset.mode = state.mode;

// Scenes, in walking order. Each module draws its own scene and scroll choreography.
const scenes = [
  ['#plaza', () => import('./scenes/arrival/index.js')],
  ['#steps', () => import('./scenes/steps.js')],
  ['#lobby', () => import('./scenes/lobby.js')],
  ['#rooms', () => import('./rooms/index.js')],
];

async function boot() {
  if (document.fonts?.ready) { try { await document.fonts.ready; } catch { /* fonts are optional */ } }
  await Promise.race([counted, new Promise((resolve) => { setTimeout(resolve, 1500); })]);
  for (const [selector, load] of scenes) {
    if (!document.querySelector(selector)) continue;
    try {
      const mod = await load();
      await mod.init?.();
    } catch (err) {
      console.warn(`[museum] ${selector} failed to load`, err);
    }
  }
  // Easter eggs: the row of things to find in each room.
  try { (await import('./world/eggs.js')).initEggs(); } catch (err) { console.warn('[museum] eggs failed to load', err); }
  paintVisitor();
  loadPhotos();
  startBoil();
  ScrollTrigger.refresh();
  document.documentElement.classList.add('is-ready');
}

boot();
