// 01 · Meet your guide. Doodle Manoj waits at the bottom of the museum steps and holds out his hand.
// Press and hold (or just scroll) to climb together. At the top, the doors open onto the lobby.

import gsap from 'gsap';
import { sketcher, el, PAPER, reducedMotion } from '../lib/doodle.js';
import { mountManoj } from '../character/manoj.js';
import { state, formatVisitor } from '../lib/state.js';
import { scrollToProgress, scrollToTarget } from '../lib/scroll.js';
import { ensureWorld } from '../world/stage.js';
import { ensureGuide, GUIDE_INTRO } from '../world/guide.js';
import { visitorArm } from '../character/arm.js';

const NIGHT = '#070706';
const HOLD_SECONDS = 7;

const BEATS = [
  { at: 0, pose: 'wave', line: "Hi, I'm Manoj. I'll be your guide tonight." },
  { at: 0.1, pose: 'offer', line: "Hold my hand. I'll walk you in." },
  { at: 0.3, pose: 'offer', line: 'Mind the third step. Everyone trips on it.' },
  { at: 0.52, pose: 'offer', line: "Twelve stops. I promise they're short." },
  { at: 0.72, pose: 'offer', line: 'Almost there. Ready?' },
  { at: 0.84, pose: 'point', line: 'After you.' },
];

// Steps in the 1000 × 1000 drawing: where each tread starts and its half width.
const TOPS = [760, 790, 824, 864, 910, 962, 1030];
const HALF = [120, 170, 230, 300, 380, 470, 580];

const band = (cx, y, w, h) => {
  const r = h / 2;
  const x = cx - w / 2;
  return `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
};

function drawEntrance(svg) {
  const facade = el('g', { class: 'steps__facade' }, svg);
  const f = sketcher(svg, { stroke: PAPER, strokeWidth: 2.4, roughness: 1.1, seed: 31 }).into(facade);

  // ramps of the spiral above the entrance, seen on tall screens
  [[110, 900], [240, 840], [370, 780]].forEach(([y, w], i) => {
    f.path(band(500, y, w, 96), { fill: NIGHT, fillStyle: 'solid', seed: 70 + i });
    for (let x = 500 - w / 2 + 70; x < 500 + w / 2 - 70; x += 42) {
      el('rect', { x, y: y + 40, width: 18, height: 14, fill: PAPER, opacity: 0.5, class: 'plaza__win' }, facade);
    }
  });
  const sign = el('text', { x: 500, y: 514, 'text-anchor': 'middle', 'font-family': 'Doto, monospace', 'font-weight': 900, 'font-size': 34, 'letter-spacing': 3, fill: PAPER }, facade);
  el('tspan', {}, sign).textContent = 'MUSEUM ';
  el('tspan', { 'font-family': '"Instrument Serif", Georgia, serif', 'font-style': 'italic', 'font-weight': 400, 'font-size': 46, 'letter-spacing': 0 }, sign).textContent = 'of';
  el('tspan', {}, sign).textContent = ' MANOJ';

  // posters either side of the doors
  [[286, 'NOW SHOWING', 'CHENNAI', 'TO NEW YORK'], [624, 'TONIGHT ONLY', 'VISITOR', formatVisitor(state.visitor)]].forEach(([x, top, big, small], i) => {
    f.rect(x, 568, 90, 132, { fill: PAPER, fillStyle: 'solid', stroke: PAPER, seed: 90 + i });
    const text = (y, s, attrs) => { el('text', { x: x + 45, y, 'text-anchor': 'middle', fill: NIGHT, ...attrs }, facade).textContent = s; };
    text(590, top, { 'font-family': 'JetBrains Mono, monospace', 'font-size': 8.5, 'letter-spacing': 0.5 });
    text(636, big, { 'font-family': 'Bricolage Grotesque, sans-serif', 'font-weight': 800, 'font-size': 17 });
    text(662, small, i ? { 'font-family': 'Doto, monospace', 'font-weight': 900, 'font-size': 15, 'data-visitor': '' } : { 'font-family': 'JetBrains Mono, monospace', 'font-size': 9.5 });
  });

  // the light behind the doors, then the two doors on their hinges
  el('rect', { x: 404, y: 544, width: 192, height: 216, fill: PAPER, class: 'steps__light' }, facade);
  const doorL = el('g', { class: 'steps__door' }, facade);
  const doorR = el('g', { class: 'steps__door' }, facade);
  [[doorL, 404, 488], [doorR, 500, 512]].forEach(([g, x, knob], i) => {
    const d = sketcher(svg, { stroke: PAPER, strokeWidth: 2.4, roughness: 1, seed: 81 + i }).into(g);
    d.rect(x, 544, 96, 216, { fill: NIGHT, fillStyle: 'solid' });
    d.rect(x + 18, 566, 60, 70, { strokeWidth: 1.6 });
    el('circle', { cx: knob, cy: 664, r: 5, fill: PAPER }, g);
  });
  f.rect(396, 536, 208, 224, { strokeWidth: 3.2, seed: 88 });

  // the stairs
  const stairs = el('g', { class: 'steps__stairs' }, svg);
  const s = sketcher(svg, { stroke: PAPER, strokeWidth: 2.2, roughness: 1.1, seed: 41 }).into(stairs);
  for (let i = 0; i < TOPS.length - 1; i++) {
    const t = TOPS[i];
    const d = (TOPS[i + 1] - t) * 0.38;
    const h = HALF[i];
    const hb = h + (HALF[i + 1] - h) * 0.38;
    s.poly([[500 - h, t], [500 + h, t], [500 + hb, t + d], [500 - hb, t + d]], { fill: NIGHT, fillStyle: 'solid', seed: 100 + i });
    el('rect', { x: 500 - hb, y: t + d, width: hb * 2, height: TOPS[i + 1] - t - d, fill: 'url(#hatch-paper)', opacity: 0.2 }, stairs);
    s.rect(500 - hb, t + d, hb * 2, TOPS[i + 1] - t - d, { strokeWidth: 1.8, seed: 120 + i });
  }
  [-1, 1].forEach((side) => {
    s.line(500 + side * 150, 700, 500 + side * 560, 930, { strokeWidth: 3 });
    [[150, 700, 772], [330, 801, 872], [520, 908, 1000]].forEach(([dx, y1, y2]) => s.line(500 + side * dx, y1, 500 + side * dx, y2, { strokeWidth: 2 }));
  });

  return { facade, stairs, doorL, doorR };
}

export async function init() {
  const root = document.getElementById('steps');
  // In the 3D world the camera climbs real steps with the same Manoj who walked you over from the booth
  // (world/guide.js). The flat drawing, with a guide of its own, is only the fallback.
  const world = await ensureWorld();
  const actor = world ? await ensureGuide() : null;
  root.innerHTML = `
    <div class="stage steps${world ? '' : ' tex-dots'}">
      ${world ? '' : '<svg class="steps__art" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true"></svg>'}
      ${actor ? '' : `<div class="steps__guide"></div>
      <div class="steps__hand" aria-hidden="true">${visitorArm}</div>
      <div class="bubble steps__bubble" data-bubble aria-live="polite">${BEATS[0].line}</div>`}
      ${world ? '' : '<div class="steps__flood" aria-hidden="true"></div>'}
      <p class="mono steps__label">01 · Meet your guide</p>
      <div class="steps__ui">
        <button class="steps__hold" type="button" data-hold aria-label="Press and hold to walk up the steps with Manoj">
          <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" class="steps__ring-bg"/><circle cx="50" cy="50" r="44" class="steps__ring" pathLength="100"/></svg>
          <span class="mono">hold</span>
        </button>
        <div class="steps__hint">
          <span class="hand">Press and hold to walk up</span>
          <span class="mono">or just scroll · <a href="#lobby" data-go="#lobby">skip to the lobby</a></span>
        </div>
      </div>
    </div>`;

  const stage = root.querySelector('.stage');
  const svg = root.querySelector('.steps__art');
  const parts = svg ? drawEntrance(svg) : null;
  const guideBox = root.querySelector('.steps__guide');
  const guide = guideBox ? mountManoj(guideBox, { pose: 'wave', label: 'Doodle Manoj at the bottom of the museum steps, holding out his hand' }) : null;
  const hand = actor ? actor.hand : root.querySelector('.steps__hand');
  const bubble = root.querySelector('[data-bubble]');
  const flood = root.querySelector('.steps__flood');
  const label = root.querySelector('.steps__label');
  const ui = root.querySelector('.steps__ui');
  const holdBtn = root.querySelector('[data-hold]');
  const ring = root.querySelector('.steps__ring');

  if (reducedMotion()) {
    root.classList.add('is-static');
    guide.pose('offer');
    bubble.textContent = BEATS[1].line;
    holdBtn.addEventListener('click', () => scrollToTarget('#lobby'));
    return;
  }

  // The walking guide already said hello on his way over, so his first line on the steps picks up from there.
  const beats = actor ? BEATS.map((b, i) => (i ? b : { ...b, line: GUIDE_INTRO })) : BEATS;
  const show = (i) => {
    if (actor) { actor.pose('steps', beats[i].pose); actor.say('steps', beats[i].line); return; }
    guide.pose(beats[i].pose);
    bubble.textContent = beats[i].line;
    gsap.fromTo(bubble, { scale: 0.86, rotate: -3 }, { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(3)' });
  };
  // The walking guide moves his legs whenever he moves; the flat one walks while the page scrolls.
  const walk = (on) => { if (guide) guide.walking(on); };
  const wait = (on) => (actor ? actor.waiting(on) : guide.waiting(on));
  if (actor) show(0);

  let beat = 0;
  const setBeat = (p) => {
    let next = 0;
    beats.forEach((b, i) => { if (p >= b.at) next = i; });
    if (next === beat) return;
    beat = next;
    show(next);
  };

  let holding = false;
  let idle = 0;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.5,
      onUpdate: (self) => {
        setBeat(self.progress);
        ring.style.strokeDashoffset = String(100 - self.progress * 100);
        if (guide && self.progress > 0.1 && self.progress < 0.84) {
          walk(true);
          clearTimeout(idle);
          idle = setTimeout(() => { if (!holding) walk(false); }, 180);
        }
      },
    },
  });
  const doorCenter = () => {
    const r = svg.querySelector('.steps__light').getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    return `${(((r.left + r.width / 2 - s.left) / s.width) * 100).toFixed(1)}% ${(((r.top + r.height / 2 - s.top) / s.height) * 100).toFixed(1)}%`;
  };
  tl.fromTo(hand, { xPercent: 70, yPercent: 60 }, { xPercent: 0, yPercent: 0, duration: 0.08, ease: 'power2.out' }, 0.1);
  if (actor) {
    // The hold button and the label fade in as you reach the steps instead of riding up with the page,
    // and your hand lets go as Manoj steps aside to hold the door.
    tl.fromTo([label, ui], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, 0)
      .to(hand, { xPercent: 80, yPercent: 70, duration: 0.08, ease: 'power2.in' }, 0.64)
      // The chrome goes as he says "After you", not at the very end. Scrub stretches this timeline to the
      // whole climb, so the last tween always finishes at the doors: leave the fade there and the hold button
      // is still sitting on the paper while the welcome section arrives.
      .to([label, ui], { autoAlpha: 0, y: 20, duration: 0.08 }, 0.52);
  } else {
    tl.to(guideBox, { scale: 0.95, duration: 0.7 }, 0.14)
      .to(ui, { autoAlpha: 0, y: 20, duration: 0.05 }, 0.82)
      .to(hand, { xPercent: 80, yPercent: 70, duration: 0.08, ease: 'power2.in' }, 0.84)
      .to(guideBox, { xPercent: -45, duration: 0.1 }, 0.84)
      .to(bubble, { autoAlpha: 0, duration: 0.04 }, 0.92);
  }
  if (parts) {
    tl.to(parts.facade, { scale: 2.1, svgOrigin: '500 652', duration: 0.72 }, 0.14)
      .to(parts.stairs, { scale: 1.9, y: 230, svgOrigin: '500 1000', duration: 0.72 }, 0.14)
      .to(parts.doorL, { scaleX: 0.06, svgOrigin: '404 652', duration: 0.1, ease: 'power2.in' }, 0.84)
      .to(parts.doorR, { scaleX: 0.06, svgOrigin: '596 652', duration: 0.1, ease: 'power2.in' }, 0.84)
      .fromTo(flood, { clipPath: () => `circle(0% at ${doorCenter()})` }, { clipPath: () => `circle(150% at ${doorCenter()})`, duration: 0.08, ease: 'power2.in' }, 0.92);
  }
  const st = tl.scrollTrigger;

  // Press and hold: the page climbs for you. Let go to pause.
  let p = 0;
  let last = 0;
  let raf = 0;
  const climb = (t) => {
    if (!holding) return;
    const dt = Math.min(0.064, (t - last) / 1000);
    last = t;
    p = Math.min(1, p + dt / HOLD_SECONDS);
    scrollToProgress(root, p);
    if (p >= 1) { stop(); scrollToTarget('#lobby', { duration: 1.1 }); return; }
    raf = requestAnimationFrame(climb);
  };
  const start = (e) => {
    if (holding || (e && e.button > 0)) return;
    holding = true;
    p = st.progress;
    last = performance.now();
    holdBtn.classList.add('is-holding');
    walk(true);
    raf = requestAnimationFrame(climb);
  };
  const stop = () => {
    if (!holding) return;
    holding = false;
    cancelAnimationFrame(raf);
    holdBtn.classList.remove('is-holding');
    if (st.progress > 0.1 && st.progress < 0.84) {
      wait(true);
      setTimeout(() => wait(false), 1400);
    }
  };

  holdBtn.addEventListener('pointerdown', (e) => { holdBtn.setPointerCapture?.(e.pointerId); start(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture', 'blur'].forEach((type) => holdBtn.addEventListener(type, stop));
  holdBtn.addEventListener('contextmenu', (e) => e.preventDefault());
  holdBtn.addEventListener('keydown', (e) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    if (!e.repeat) start();
  });
  holdBtn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') stop(); });
  if (matchMedia('(pointer: fine)').matches) {
    stage.addEventListener('pointerdown', (e) => { if (!e.target.closest('a, button')) start(e); });
    addEventListener('pointerup', stop);
  }
}
