// The walk in, hands-free. Once the city has drawn itself, the camera walks you up 26th Avenue to the ticket booth.
// Once you choose a tour it carries on: out through Manoj's door, up the steps holding his hand, and in through the
// doors, on to the first stop for the full experience or the gift shop for the resume (lib/entrance.js). It moves the
// page itself, so every scene plays exactly as it does when you scroll.
// The control is a switch. On, the walk has the page: scrolling yourself is ignored, and the control says how to take
// over. Off, the page is yours until you switch it back on, and the walk picks up from wherever you are.

import gsap from 'gsap';
import { getLenis } from './scroll.js';
import { state } from './state.js';

const SCROLL_KEYS = [' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'End', 'Home'];
// Seconds the page takes to catch the walk up. It smooths the changes of pace between waypoints, and eases the start
// and the stop.
const LAG = 0.24;

const COPY = {
  booth: { go: 'Walking you to the booth', stopped: 'Walk me to the booth' },
  in: { go: 'Walking you in', stopped: 'Walk me in' },
};
const NUDGE = 'Pause to scroll yourself';

export function createAutopilot(world) {
  const root = document.documentElement;
  const top = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.getBoundingClientRect().top + window.scrollY : null;
  };
  const booth = () => top('#booth');
  // Where the walk in ends: the doors open, and the steps scene takes you through them (lib/entrance.js).
  const inside = () => world.rail.span('steps')?.[1] ?? booth();

  // The walk as waypoints on the page: where to be, and how many seconds it takes to get there from the one before.
  // The pace slows wherever Manoj has something to say (world/guide.js, scenes/steps.js), so there's time to read it.
  function route(leg) {
    if (leg === 'booth') return [[0, 0], [booth(), 7]];
    const walk = world.rail.span('walk');
    const steps = world.rail.span('steps');
    if (!walk || !steps) return [[booth(), 0], [inside(), 6]];
    const w = (p) => walk[0] + (walk[1] - walk[0]) * p;
    const s = (p) => steps[0] + (steps[1] - steps[0]) * p;
    return [
      [0, 0],
      [booth(), 7], // up the avenue first, if you're not at the booth yet
      [walk[0], 0], // the end of the avenue: the camera is parked at the window all the way here (see drive)
      [w(0.03), 0.12], // Manoj turns from the window straight away
      [w(0.2), 1.0], // to his door and out, with the camera turning to follow him on the way
      [w(0.26), 0.35],
      [w(0.84), 2.6], // "Right this way."
      [s(0), 1.4], // "I'm Manoj, your guide tonight."
      [s(1), 7], // up the steps and through the doors: the scene's lines are spaced for about this long
    ];
  }

  // The control: the steps' old hold button, now for the whole walk. A ring for how far along you are, pause or play,
  // and a line saying what it's doing.
  const ui = document.createElement('div');
  ui.className = 'autowalk is-off';
  ui.innerHTML = `
    <button class="autowalk__btn" type="button" data-walk-toggle>
      <svg class="autowalk__ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" class="autowalk__ring-bg"/><circle cx="50" cy="50" r="44" class="autowalk__ring-fg" pathLength="100"/></svg>
      <svg class="autowalk__icon" viewBox="0 0 24 24" aria-hidden="true"><path class="autowalk__pause" d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/><path class="autowalk__play" d="M8 5.2v13.6L19 12z"/></svg>
    </button>
    <p class="autowalk__hint"><span class="hand" data-walk-line></span></p>`;
  document.body.appendChild(ui);
  root.classList.add('has-autowalk');
  const toggle = ui.querySelector('[data-walk-toggle]');
  const ring = ui.querySelector('.autowalk__ring-fg');
  const line = ui.querySelector('[data-walk-line]');

  let enabled = false;
  let auto = true; // the switch: on until you turn it off
  let mode = 'idle'; // idle, driving, or waiting (the moment between choosing a tour and the walk in)
  let leg = 'booth';
  let tween = null;
  let beat = null;
  let goal = { y: 0 };
  let at = 0;
  let lastSet = null;
  let nudgeUntil = 0; // until when the control says how to take over
  let nudgeTimer = 0;
  let holding = false; // whether scrolling yourself is being ignored

  const legFor = () => (state.ticketPrinted ? 'in' : 'booth');
  const endOf = (which) => (which === 'booth' ? booth() : inside());
  const startOf = (which) => (which === 'booth' ? 0 : booth());

  const setScroll = (y) => {
    lastSet = y;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };

  // The page follows the walk a quarter second behind, which smooths every change of pace.
  function follow(time, deltaMs) {
    if (mode !== 'driving') return;
    // Anyone else moving the page (the scrollbar, the browser settling its toolbars) doesn't stop the walk: it carries on
    // from wherever the page is now. Held short by the end of the page, it has arrived.
    const y = window.scrollY;
    if (lastSet !== null && Math.abs(y - lastSet) > 6) {
      if (lastSet > y && y >= root.scrollHeight - window.innerHeight - 2) arrive();
      else drive(leg);
      return;
    }
    const dt = Math.min(0.05, deltaMs / 1000 || 1 / 60);
    at += (goal.y - at) * (1 - Math.exp(-dt / LAG));
    if (!tween && Math.abs(goal.y - at) < 0.5) {
      at = goal.y;
      setScroll(at);
      arrive();
      return;
    }
    setScroll(at);
  }
  gsap.ticker.add(follow);

  function drive(which = legFor()) {
    halt();
    leg = which;
    getLenis()?.resize();
    let from = window.scrollY;
    // Start from where you are: the waypoints behind you are skipped, and the one you're partway to is shortened.
    const points = route(leg);
    // Standing at the booth, the rest of the avenue is a stretch where nothing on screen moves: the camera is parked at
    // the window and the stage is pinned. The walk in skips it, so Manoj sets off the moment you choose.
    const parked = leg === 'in' ? world.rail.span('walk')?.[0] : null;
    if (parked && from < parked && from >= booth() - 24) { setScroll(parked); from = parked; }
    const plan = [];
    for (let i = 1; i < points.length; i += 1) {
      const [a] = points[i - 1];
      const [b, seconds] = points[i];
      if (b <= from + 1) continue;
      const part = b > a ? (b - Math.max(a, from)) / (b - a) : 1;
      plan.push([b, seconds * Math.min(1, part)]);
    }
    if (!plan.length) { mode = 'idle'; render(); return; }
    mode = 'driving';
    at = from;
    lastSet = from;
    goal = { y: from };
    tween = gsap.timeline({ onComplete: () => { tween = null; } });
    plan.forEach(([y, seconds]) => tween.to(goal, { y, duration: Math.max(0.2, seconds), ease: 'none' }));
    render();
  }

  function halt() {
    beat?.kill();
    beat = null;
    tween?.kill();
    tween = null;
    if (mode !== 'idle') { mode = 'idle'; render(); }
  }

  function takeOver() {
    if (mode === 'idle') return;
    halt();
  }

  // At the booth the walk waits for a choice, every visit: only choosing a tour carries it on in.
  function arrive() {
    tween?.kill();
    tween = null;
    mode = 'idle';
    render();
  }

  // After choosing a tour: just long enough for the card to light and Manoj to answer, then the walk in. Any longer
  // and the page looks stuck, and people click again.
  function walkIn({ delay = 0.15 } = {}) {
    if (!enabled) return;
    // Already on the way in (a second click on the card, say): carry on as you are.
    if (leg === 'in' && mode !== 'idle') return;
    halt();
    leg = 'in';
    // Switched off: the walk in is offered, not taken.
    if (!auto) { render(); return; }
    mode = 'waiting';
    render();
    // On the animation clock, like the rest of the walk, so it pauses with the page rather than firing behind it.
    beat = gsap.delayedCall(delay, () => { beat = null; drive('in'); });
  }

  // What the control says, and whether it shows at all. It hides while the tour panel is up at the booth, and once
  // you're through the doors.
  function render() {
    const which = mode === 'idle' ? legFor() : leg;
    const end = endOf(which);
    const y = window.scrollY;
    const going = mode !== 'idle';
    const nudging = going && performance.now() < nudgeUntil;
    const show = enabled && end !== null && (going || y < end - 24);
    ui.classList.toggle('is-off', !show);
    ui.classList.toggle('is-going', going);
    ui.classList.toggle('is-nudged', nudging);
    holdPage(mode === 'driving');
    const copy = COPY[which];
    line.textContent = nudging ? NUDGE : going ? copy.go : copy.stopped;
    toggle.setAttribute('aria-label', going ? 'Pause the walk' : copy.stopped);
    const start = startOf(which) ?? 0;
    const span = Math.max(1, (end ?? 1) - start);
    ring.style.strokeDashoffset = String(100 - Math.min(1, Math.max(0, (y - start) / span)) * 100);
  }
  let queued = false;
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; render(); });
  }, { passive: true });

  // While the walk has the page, scrolling yourself is ignored and the control says how to take over. Pinching to zoom
  // still works, and keys meant for a button or a field are theirs. It only listens while walking, so scrolling
  // yourself the rest of the time stays as smooth as ever.
  const ignore = (e) => {
    if (e.touches?.length > 1) return;
    if (e.type === 'keydown' && (!SCROLL_KEYS.includes(e.key) || e.target.closest?.('input, textarea, select, button, a, [contenteditable]'))) return;
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    nudgeUntil = performance.now() + 2200;
    clearTimeout(nudgeTimer);
    nudgeTimer = setTimeout(render, 2250);
    render();
  };
  const HOLD = [['wheel', { passive: false, capture: true }], ['touchmove', { passive: false, capture: true }], ['keydown', { capture: true }]];
  function holdPage(on) {
    if (on === holding) return;
    holding = on;
    HOLD.forEach(([type, options]) => (on ? addEventListener(type, ignore, options) : removeEventListener(type, ignore, options)));
  }
  // Changing your mind at the booth (the tour, the name) holds the walk in until you ask for it.
  document.addEventListener('pointerdown', (e) => {
    if (mode === 'waiting' && e.target.closest?.('[data-panel]')) takeOver();
  }, true);

  toggle.addEventListener('click', () => {
    auto = mode === 'idle';
    if (auto) drive(legFor());
    else halt();
  });

  return {
    // Begin: up the avenue to the booth. Landed further along (a link back to the steps), the walk is offered, not
    // taken.
    start() {
      enabled = true;
      if (window.scrollY < booth() - 24) drive('booth');
      else render();
    },
    walkIn,
    // Switched off from outside (a jump to somewhere along the walk): the page is yours.
    stop() {
      auto = false;
      halt();
    },
  };
}
