// 01 · The lobby. Paper walls, a dot-matrix floor directory, the house rules,
// and the machine that gives your ticket its first punch.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sketcher, el, INK, PAPER, reducedMotion } from '../lib/doodle.js';
import { mountManoj } from '../character/manoj.js';
import { state, punch, ROOM_COUNT } from '../lib/state.js';
import { STOPS } from '../content/tour.js';
import { pathFor } from '../lib/routes.js';
import { eggButtonsHTML } from '../world/eggs.js';

const pad2 = (n) => String(n).padStart(2, '0');

function drawPuncher(svg) {
  const sk = sketcher(svg, { stroke: INK, strokeWidth: 2.4, roughness: 1.2, seed: 17 });
  sk.rect(70, 250, 20, 90, { fill: 'url(#hatch-ink)', fillStyle: 'solid' });
  sk.line(30, 342, 130, 342, { strokeWidth: 3 });
  sk.rect(20, 70, 120, 180, { fill: PAPER, fillStyle: 'solid' });
  sk.rect(36, 88, 88, 40, { fill: INK, fillStyle: 'solid' });
  const count = el('text', { x: 80, y: 116, 'text-anchor': 'middle', 'font-family': 'Doto, monospace', 'font-weight': 900, 'font-size': 20, fill: PAPER }, svg);
  sk.rect(44, 176, 72, 10, { fill: INK, fillStyle: 'solid' });
  el('text', { x: 80, y: 208, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9, 'letter-spacing': 0.6, fill: INK }, svg).textContent = 'INSERT TICKET';
  for (let i = 0; i < 4; i++) el('circle', { cx: 50 + i * 20, cy: 232, r: 3.2, fill: INK }, svg);
  const lever = el('g', {}, svg);
  const lv = sketcher(svg, { stroke: INK, strokeWidth: 4, roughness: 1, seed: 23 }).into(lever);
  lv.line(140, 150, 186, 110);
  lv.circle(190, 106, 22, { fill: INK, fillStyle: 'solid' });
  return { count, lever };
}

export function init() {
  const root = document.getElementById('lobby');
  const rooms = STOPS.filter((s) => s.id.startsWith('room-'));
  const note = {
    express: "Express tour: I'll skip the long bits.",
    resume: 'In a hurry? The resume is in the gift shop, at the last stop.',
  }[state.mode] || '';

  root.innerHTML = `
    <div class="lobby">
      <div class="lobby__inner wrap">
        <header class="lobby__head">
          <p class="mono lobby__kicker">01 · The lobby</p>
          <h2 class="t-h1">Welcome in.</h2>
          <p class="lead lobby__lead">Twelve stops, in the order they happened. Each one is a moment, a few photos, and the work that came out of it.</p>
        </header>

        <div class="lobby__guide-wrap">
          <div class="lobby__guide"></div>
          <div class="bubble lobby__bubble" data-bubble>Every stop is a moment I lived. Let's start where I did.</div>
        </div>

        <nav class="lobby__board" aria-label="Stops on the tour">
          <div class="lobby__board-head dotf"><span>FLOOR DIRECTORY</span><span>TIME</span></div>
          <ol>${rooms.map((r) => `
            <li><a href="${pathFor(r.id)}"><span>${r.no}</span><span>${r.title}</span><span class="lobby__time">${r.time}</span></a></li>`).join('')}
          </ol>
        </nav>

        <div class="lobby__cta">
          <p class="lobby__note" data-note ${note ? '' : 'hidden'}>${note}</p>
          <a class="btn btn--ink" href="${pathFor('room-02')}">Begin the tour</a>
          <a class="mono lobby__skip" href="${pathFor('room-12')}">or skip to the gift shop</a>
        </div>
        ${eggButtonsHTML('lobby')}

        <div class="lobby__extras">
          <div class="lobby__rules">
            <p class="mono">House rules</p>
            <ol>
              <li>Touching encouraged.</li>
              <li>Flash photography allowed.</li>
              <li>Tap any photo to see it in color.</li>
              <li>No rush. Your ticket keeps your punches.</li>
            </ol>
          </div>
          <div class="lobby__machine">
            <svg viewBox="0 0 220 350" role="img" aria-label="Ticket punch machine"></svg>
            <span class="lobby__stamp dotf" data-stamp>PUNCHED · 01</span>
          </div>
        </div>
      </div>
    </div>`;

  const guide = mountManoj(root.querySelector('.lobby__guide'), { pose: 'point', label: 'Doodle Manoj pointing at the floor directory' });
  const machine = root.querySelector('.lobby__machine svg');
  const stamp = root.querySelector('[data-stamp]');
  const { count, lever } = drawPuncher(machine);
  const rows = root.querySelectorAll('.lobby__board li');
  const paintCount = () => { count.textContent = `${pad2(state.punched.size)}/${ROOM_COUNT}`; };
  paintCount();

  const quiet = reducedMotion();
  if (state.punched.has(1)) gsap.set(stamp, { autoAlpha: 1, rotate: -8 });
  if (!quiet) gsap.set(rows, { opacity: 0.35 });

  const doPunch = () => {
    // Nobody gets past the booth without a ticket, so there is always one to punch here.
    if (!state.ticketPrinted) return;
    const fresh = !state.punched.has(1);
    punch(1);
    paintCount();
    if (quiet || !fresh) { gsap.set(stamp, { autoAlpha: 1, rotate: -8 }); return; }
    gsap.timeline()
      .to(lever, { rotation: 38, svgOrigin: '140 150', duration: 0.18, ease: 'power3.in' })
      .to(machine, { y: 3, duration: 0.06, yoyo: true, repeat: 1 })
      .fromTo(stamp, { autoAlpha: 0, scale: 1.8, rotate: -20 }, { autoAlpha: 1, scale: 1, rotate: -8, duration: 0.32, ease: 'back.out(2)' }, '<')
      .to(lever, { rotation: 0, svgOrigin: '140 150', duration: 0.6, ease: 'elastic.out(1, 0.4)' }, '<');
  };

  ScrollTrigger.create({
    trigger: root,
    start: 'top 55%',
    once: true,
    onEnter: () => {
      doPunch();
      if (!quiet) gsap.to(rows, { opacity: 1, duration: 0.01, stagger: 0.07 });
      guide.pose('point');
    },
  });
}
