// Museum of Manoj: boots the tour, the heads-up display and each scene.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { state, on, formatVisitor, ROOM_COUNT } from './lib/state.js';
import { registerVisit } from './lib/visitor.js';
import { startBoil, loadPhotos, reducedMotion } from './lib/doodle.js';
import { setLenis, getLenis, scrollToTarget } from './lib/scroll.js';
import { STOPS } from './content/tour.js';
import { stopAt, stopIndex, pathFor, holdForTicket, takeHeldPath } from './lib/routes.js';
import { createAutopilot } from './lib/autopilot.js';
import { goInside } from './lib/entrance.js';

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

// A ScrollTrigger refresh measures by parking the page at the top and putting it back afterwards, and it doesn't
// always put it back where it was. Choosing a tour opens the museum and refreshes, and the page could land a screen
// away or at the top of the avenue, with the walk in then setting off from there. Whatever a refresh does, the page
// stays where it was.
let heldAt = null;
ScrollTrigger.addEventListener('refreshInit', () => { heldAt = window.scrollY; });
ScrollTrigger.addEventListener('refresh', () => {
  const y = heldAt;
  heldAt = null;
  const smooth = getLenis();
  smooth?.resize();
  if (y === null || Math.abs(window.scrollY - y) < 1) return;
  if (smooth) smooth.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
});

// Visitor number everywhere it appears.
const paintVisitor = () => {
  document.querySelectorAll('[data-visitor]').forEach((n) => { n.textContent = formatVisitor(state.visitor); });
};
paintVisitor();
// Ask the counter for this browser's number right away; scenes wait briefly for it.
const counted = registerVisit();

// Which page this is. The home page is the walk in; an experience page is one stop of the tour.
const docEl = document.documentElement;
const stop = stopAt(location.pathname);
// Booth first: a link straight to a page still needs a ticket, so it starts at the booth, and carries on to the
// page it asked for once one prints.
if (stop && !state.ticketPrinted) {
  holdForTicket(location.pathname);
  history.replaceState(null, '', '/#booth');
} else if (!stop && location.pathname !== '/') {
  history.replaceState(null, '', `/${location.hash}`);
}
const onPage = Boolean(stop && state.ticketPrinted);
if (onPage) docEl.dataset.page = 'experience';
else delete docEl.dataset.page;

// No ticket, no museum: until a tour is chosen the page ends at the booth, and trying to go further asks for one.
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
directory.querySelector('[data-directory]').innerHTML = STOPS.map((s) => {
  const walk = !stopAt(pathFor(s.id));
  return `
  <li><a href="${pathFor(s.id)}"${walk ? ` data-go="#${s.id}"` : ''}><span>${s.no}</span><span>${s.title}</span><span class="mono">${s.time}</span></a></li>`;
}).join('');
const setDirectory = (open) => {
  directory.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
};
menuBtn.addEventListener('click', () => setDirectory(true));
directory.addEventListener('click', (e) => {
  if (e.target === directory || e.target.closest('[data-close]')) setDirectory(false);
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') setDirectory(false); });

// Any [data-go] link glides to its target on this page. Without a ticket, every stop past the booth leads back to
// the booth. A target that isn't on this page (the steps, seen from an experience page) is left to the link itself.
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-go]');
  if (!link) return;
  const target = document.querySelector(link.dataset.go);
  if (!target || !target.getClientRects().length) return;
  e.preventDefault();
  setDirectory(false);
  if (gated() && !target.closest('#plaza')) {
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
  const modeLabel = state.mode === 'resume' ? 'resume' : 'full tour';
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
    // Where the choice at the booth leads. Arrived by a link to one page: on to that page. Otherwise, after a beat, the
    // walk in, through the doors to the first stop or, for the resume, the gift shop. Without the walk (no 3D), the
    // resume goes straight there and the full experience is a scroll away.
    const held = takeHeldPath();
    if (held) setTimeout(() => location.assign(held), 1500);
    else if (autopilot) autopilot.walkIn();
    else if (state.mode === 'resume') setTimeout(goInside, 1500);
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

// Scenes, in walking order. Each module draws its own scene and scroll choreography. An experience page loads only
// its stop, so it never downloads the 3D city.
const scenes = onPage
  ? [['#rooms', () => import('./rooms/index.js')]]
  : [
    ['#plaza', () => import('./scenes/arrival/index.js')],
    ['#steps', () => import('./scenes/steps.js')],
  ];

// On an experience page the HUD says where you are in the tour, and the tab says which stop it is.
const showWhere = (at) => {
  document.title = `${at.title} · Museum of Manoj`;
  const where = document.querySelector('[data-where]');
  if (where) { where.textContent = `${at.no} of ${ROOM_COUNT}`; where.hidden = false; }
};
if (onPage) showWhere(stop);

// Between stops, the next one is drawn in place and slides in over this one, so nothing waits on a page load.
// The way home (the street, the steps) is a full page load, because that is where the 3D city lives.
let stops = null;
let shown = onPage ? stop : null;
function travel(path, { push = true } = {}) {
  const to = stopAt(path);
  if (!to || !stops) { location.assign(path); return; }
  if (to.id === shown?.id) return;
  docEl.dataset.nav = stopIndex(to) < stopIndex(shown) ? 'back' : 'forward';
  const swap = () => {
    if (push) history.pushState(null, '', path);
    stops.init(to);
    shown = to;
    showWhere(to);
    const lenis = getLenis();
    if (lenis) { lenis.resize(); lenis.scrollTo(0, { immediate: true, force: true }); } else scrollTo(0, 0);
    ScrollTrigger.refresh();
    loadPhotos();
    paintVisitor();
  };
  const done = () => { delete docEl.dataset.nav; };
  if (!document.startViewTransition || reducedMotion()) { swap(); done(); return; }
  const transition = document.startViewTransition(swap);
  transition.ready.catch(() => {});
  transition.finished.then(done, done);
}
if (onPage) {
  history.scrollRestoration = 'manual';
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !stopAt(url.pathname)) return;
    e.preventDefault();
    setDirectory(false);
    travel(url.pathname);
  });
  addEventListener('popstate', () => travel(location.pathname, { push: false }));
}

// The loader (index.html) on the home page, and the hands-free walk in once the city is up.
const loader = window.__loader || null;
let autopilot = null;
// Every face the site uses, loaded before anything is seen so no text reflows afterwards.
const FACES = [
  '400 17px "Bricolage Grotesque"', '800 17px "Bricolage Grotesque"', '500 20px Caveat', '700 20px Caveat', '700 20px Doto',
  '900 20px Doto', '400 11px "JetBrains Mono"', '500 11px "JetBrains Mono"', 'italic 400 20px "Instrument Serif"',
];
const DRAWN = 'manoj-museum:drawn';
const seenDrawing = () => { try { return localStorage.getItem(DRAWN) === '1'; } catch { return false; } };

const untilDrawn = (world, share) => new Promise((resolve) => {
  const check = () => { if (world.introProgress >= share) { gsap.ticker.remove(check); resolve(); } };
  gsap.ticker.add(check);
});

// Lifting the loader: the city draws itself in, and the walk to the booth sets off while the last of it arrives.
async function open(world, landing) {
  const seen = seenDrawing();
  if (world) {
    world.hold(false);
    world.settle();
  }
  await loader?.finish();
  const drawing = Boolean(world?.drawing);
  if (drawing) world.intro({ quick: seen });
  loader?.hide();
  try { localStorage.setItem(DRAWN, '1'); } catch { /* storage blocked */ }
  if (!autopilot) return;
  if (drawing) await untilDrawn(world, 0.55);
  autopilot.start();
}

// Through the doors (lib/entrance.js): this page starts as the light through them, and the stop rises up into it from
// the bottom, the way the welcome used to scroll up when it was part of the street. Everything that measures the page
// measures it again once the stop is in place.
function riseThroughDoors() {
  if (docEl.dataset.arrive !== 'doors') return;
  clearTimeout(window.__doorsTimer);
  const host = document.getElementById('rooms');
  const settle = () => {
    gsap.set(host, { clearProps: 'transform' });
    delete docEl.dataset.arrive;
    ScrollTrigger.refresh();
  };
  if (reducedMotion()) { settle(); return; }
  gsap.fromTo(host, { y: innerHeight }, { y: 0, duration: 1.15, ease: 'power3.out', onComplete: settle });
}

async function boot() {
  // The walk in loads all at once: the fonts, the 3D city (its download, build and warm-up are the loader's progress),
  // and this visitor's number for the billboard. A slow font server doesn't hold the museum up for more than 4 seconds.
  const fonts = document.fonts
    ? Promise.race([Promise.allSettled(FACES.map((face) => document.fonts.load(face))), new Promise((resolve) => { setTimeout(resolve, 4000); })])
    : Promise.resolve();
  const city = onPage
    ? Promise.resolve(null)
    : import('./world/stage.js').then(({ ensureWorld }) => ensureWorld((done) => loader?.set(0.1 + done * 0.5))).catch(() => null);
  city.then((world) => world?.hold(true));
  await fonts;
  loader?.set(0.1);
  // The home page waits a moment for this visitor's number, because the billboard shows it. An experience page
  // doesn't show it, so it draws straight away.
  if (!onPage) await Promise.race([counted, new Promise((resolve) => { setTimeout(resolve, 1500); })]);
  for (const [selector, load] of scenes) {
    if (!document.querySelector(selector)) continue;
    try {
      const mod = await load();
      await mod.init?.(stop);
      if (selector === '#rooms') stops = mod;
    } catch (err) {
      console.warn(`[museum] ${selector} failed to load`, err);
    }
  }
  paintVisitor();
  loadPhotos();
  startBoil();
  ScrollTrigger.refresh();
  riseThroughDoors();
  // Arriving at a place in the walk (the steps from an experience page, the booth from a shared link): go straight
  // there, now that every scene has its height.
  const landing = !onPage && /^#[a-z][\w-]*$/i.test(location.hash) ? document.querySelector(location.hash) : null;
  if (landing) {
    const lenis = getLenis();
    // Lenis caches how tall the page is, and it was measured before the scenes filled it in. Without a fresh
    // measure it clamps the jump to that old, shorter height and lands you halfway up the steps.
    lenis?.resize();
    const top = landing.getBoundingClientRect().top + scrollY;
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
    else scrollTo(0, top);
  }
  if (!onPage) {
    const world = await city;
    if (world) await world.warm({ onProgress: (done) => loader?.set(0.6 + done * 0.36) });
    if (world && !reducedMotion()) autopilot = createAutopilot(world);
    // For checking the walk against a production build (?shots), where nothing can be imported by path.
    if (import.meta.env.DEV || new URLSearchParams(location.search).has('shots')) window.__museum = { gsap, ScrollTrigger, getLenis, autopilot, world };
    await open(world, landing);
  }
  document.documentElement.classList.add('is-ready');
}

boot();
