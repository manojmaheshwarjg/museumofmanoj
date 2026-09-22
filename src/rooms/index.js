// The galleries. Renders every room from src/content/rooms.js, draws its illustrations,
// starts its 4D effects, and punches your ticket as you leave each room.
//
// Plug-ins, collected automatically:
//   art-*.js   export const ART   = { key: (kit) => draw }   illustrations, 600 × 420
//   fx-*.js    export const FX    = { key: (el, ctx) => run }  4D effects and ambient layers
//   wing-*.js  export const WINGS = { layout: { html(room), init(el, room, ctx) } }  custom rooms

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountManoj } from '../character/manoj.js';
import { photo, reducedMotion } from '../lib/doodle.js';
import { punch, on } from '../lib/state.js';
import { ROOMS } from '../content/rooms.js';
import { STRIPS } from '../content/strips.js';
import { eggButtonsHTML } from '../world/eggs.js';
import { kit, sketchPending } from './kit.js';

import { ART, FX, WINGS } from './registry.js';

const attr = (s) => String(s).replace(/"/g, '&quot;');

function beatHTML(beat, i) {
  return `
    <li class="beat${beat.slow ? ' beat--slow' : ''}" data-beat="${i}" ${beat.full ? 'data-full' : ''}>${beat.slow ? '<div class="beat__hold">' : ''}
      <div class="beat__stage">
        <svg class="beat__art" viewBox="0 0 600 420" data-seed="${i + 3}" role="img" aria-label="${attr(beat.title)}"></svg>
        <div class="beat__fx" aria-hidden="true"></div>
      </div>
      <div class="beat__copy">
        <p class="mono beat__label">${beat.label}</p>
        <h3 class="t-h2 beat__title">${beat.title}</h3>
        <p class="beat__text">${beat.text}</p>
        ${beat.stat ? `<p class="beat__stat"><span class="dotf beat__num" data-stat="${attr(beat.stat.value)}">${beat.stat.value}</span><span class="mono">${beat.stat.label}</span></p>` : ''}
        ${beat.photo ? `<div class="beat__photo">${photo(beat.photo)}</div>` : ''}
        ${beat.tell?.length ? `<ul class="beat__tell">${beat.tell.map((t) => `<li class="tellme">Tell me: ${t}</li>`).join('')}</ul>` : ''}
      </div>
    ${beat.slow ? '</div>' : ''}</li>`;
}

// How the room happened, told in panels before the room itself (src/content/strips.js).
function stripHTML(room) {
  const panels = STRIPS[room.id] || [];
  if (!panels.length) return '';
  return `
    <ol class="room__strip wrap" aria-label="The story behind ${attr(room.title)}">
      ${panels.map((p, i) => `
        <li class="strip__panel${p.tell ? ' strip__panel--tell' : ''}">
          <p class="mono strip__cap">${p.caption}</p>
          <svg class="strip__art" viewBox="0 0 600 420" data-strip="${i}" role="img" aria-label="${attr(p.caption)}"></svg>
          <p class="strip__line${p.tell ? ' tellme' : ''}">${p.tell ? `Tell me: ${p.line}` : p.line}</p>
        </li>`).join('')}
    </ol>`;
}

function roomHTML(room, next) {
  const wing = WINGS[room.layout];
  const body = wing ? wing.html(room) : `<ol class="room__beats">${(room.beats || []).map(beatHTML).join('')}</ol>`;
  return `
    <section class="room room--${room.tone}${room.layout ? ` room--${room.layout}` : ''}" id="${room.id}" data-room="${room.n}" aria-labelledby="${room.id}-title">
      ${room.ambient ? '<div class="room__ambient" aria-hidden="true"><canvas></canvas></div>' : ''}
      ${stripHTML(room)}
      <div class="room__inner wrap">
        <aside class="room__plaque">
          <div class="room__card">
            <p class="mono room__kicker"><span>No. ${room.no}</span><span>${room.time}</span></p>
            <h2 class="t-h1 room__title" id="${room.id}-title">${room.title}</h2>
            <p class="mono room__meta">${room.place} · ${room.dates}</p>
            ${room.fourD ? `<p class="room__4d"><span class="mono">4D</span>${room.fourD}</p>` : ''}
            ${room.proof?.length ? `<ul class="room__proof">${room.proof.map((p) => `<li>${p}</li>`).join('')}</ul>` : ''}
          </div>
          ${eggButtonsHTML(room.id)}
          <div class="room__guide">
            <div class="room__guide-art"></div>
            <p class="bubble room__bubble">${room.guide.line}</p>
          </div>
        </aside>
        <div class="room__body">${body}</div>
      </div>
      ${next ? `
      <a class="room__ramp" href="#${next.id}" data-go="#${next.id}">
        <span class="room__ramp-line" aria-hidden="true"></span>
        <span class="mono">Up the ramp</span>
        <span class="room__ramp-to">No. ${next.no} · ${next.title}</span>
      </a>` : ''}
    </section>`;
}

// Counts a stat up from zero, keeping its prefix, suffix and thousands separator.
function countStat(node, quiet) {
  if (!node || quiet) return;
  const match = /^(\D*?)([\d,.]+)(.*)$/.exec(node.dataset.stat);
  if (!match) return;
  const [, pre, digits, post] = match;
  const target = parseFloat(digits.replace(/,/g, ''));
  const decimals = (digits.split('.')[1] || '').length;
  const counter = { v: 0 };
  gsap.to(counter, {
    v: target, duration: 1.4, ease: 'power2.out',
    onUpdate: () => {
      const v = decimals ? counter.v.toFixed(decimals) : Math.round(counter.v).toLocaleString('en-US');
      node.textContent = `${pre}${digits.includes(',') || decimals ? v : String(v).replace(/,/g, '')}${post}`;
    },
  });
}

export function init() {
  const host = document.getElementById('rooms');
  host.innerHTML = ROOMS.map((room, i) => roomHTML(room, ROOMS[i + 1])).join('');
  const quiet = reducedMotion();

  // Hand-drawn lines only boil while they are on screen.
  const boil = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-boiling', entry.isIntersecting));
  }, { rootMargin: '10% 0px' });

  ROOMS.forEach((room) => {
    const el = document.getElementById(room.id);
    const guide = mountManoj(el.querySelector('.room__guide-art'), {
      pose: room.guide.pose, outfit: room.outfit, label: `Doodle Manoj, your guide to ${room.title}`,
    });
    const ctx = { room, quiet, kit, guide, ScrollTrigger };

    const panels = STRIPS[room.id] || [];
    el.querySelectorAll('.strip__art').forEach((svg) => {
      const panel = panels[Number(svg.dataset.strip)];
      if (!panel) return;
      if (panel.art && ART[panel.art]) ART[panel.art](kit(svg, room.tone)); else sketchPending(svg, panel.art, room.tone);
      boil.observe(svg);
    });

    el.querySelectorAll('.beat').forEach((beatEl) => {
      const beat = room.beats[Number(beatEl.dataset.beat)];
      const svg = beatEl.querySelector('.beat__art');
      if (ART[beat.art]) ART[beat.art](kit(svg, room.tone)); else sketchPending(svg, beat.art, room.tone);
      boil.observe(svg);
      if (beat.effect && FX[beat.effect]) FX[beat.effect](beatEl, { ...ctx, beat, svg, fx: beatEl.querySelector('.beat__fx') });

      const parts = beatEl.querySelectorAll('.beat__stage, .beat__copy > *');
      if (!quiet) gsap.set(parts, { y: 36, autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: beatEl, start: 'top 80%', once: true,
        onEnter: () => {
          if (!quiet) gsap.to(parts, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out' });
          countStat(beatEl.querySelector('[data-stat]'), quiet);
        },
      });
    });

    if (WINGS[room.layout]?.init) WINGS[room.layout].init(el, room, ctx);
    if (room.ambient && FX[room.ambient]) FX[room.ambient](el.querySelector('.room__ambient'), ctx);

    const bubble = el.querySelector('.room__bubble');
    ScrollTrigger.create({
      trigger: el, start: 'top 60%', once: true,
      onEnter: () => { if (!quiet) gsap.fromTo(bubble, { scale: 0.8, rotate: -4 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(3)' }); },
    });
    // The last room ends the page, so its punch lands as you reach the very bottom.
    const last = room === ROOMS[ROOMS.length - 1];
    ScrollTrigger.create({ trigger: el, start: last ? 'bottom-=80 bottom' : 'bottom 65%', once: true, onEnter: () => punch(room.n) });
  });

  // The express tour hides the long beats, so every trigger needs new measurements.
  on((type) => { if (type === 'ticket') ScrollTrigger.refresh(); });
}
