// One stop of the tour, on its own page: the stop from src/content/rooms.js, its illustrations and 4D effects, and the
// way on to the stops either side. Reaching the bottom of the page punches your ticket.
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
import { pathFor } from '../lib/routes.js';
import { kit, sketchPending } from './kit.js';

import { ART, FX, WINGS } from './registry.js';

const attr = (s) => String(s).replace(/"/g, '&quot;');

// A beat's photos, in a row as wide as the beat: one big, two or three side by side at one height, four as a grid.
// Files that aren't in public/photos drop out (lib/doodle.js), and a row left empty isn't drawn at all.
function photosHTML(list) {
  const frames = (list || []).map((entry) => photo(entry)).filter(Boolean);
  return frames.length ? `<div class="photos photos--${Math.min(frames.length, 4)}">${frames.join('')}</div>` : '';
}

function beatHTML(beat, i) {
  // A photo section of its own: just the pictures.
  if (!beat.art && !beat.title) return `<li class="beat beat--photos" data-beat="${i}">${photosHTML(beat.photos)}</li>`;
  // A beat without a drawing is its words, then its photos.
  const stage = beat.art ? `
      <div class="beat__stage">
        <svg class="beat__art" viewBox="0 0 600 420" data-seed="${i + 3}" role="img" aria-label="${attr(beat.title)}"></svg>
        <div class="beat__fx" aria-hidden="true"></div>
      </div>` : '';
  const copy = `
      <div class="beat__copy">
        <p class="mono beat__label">${beat.label}</p>
        <h3 class="t-h2 beat__title">${beat.title}</h3>
        ${beat.text ? `<p class="beat__text">${beat.text}</p>` : ''}
        ${beat.stat ? `<p class="beat__stat"><span class="dotf beat__num" data-stat="${attr(beat.stat.value)}">${beat.stat.value}</span><span class="mono">${beat.stat.label}</span></p>` : ''}
      </div>`;
  return `
    <li class="beat" data-beat="${i}" ${beat.full ? 'data-full' : ''}>
      ${beat.copyFirst ? copy + stage : stage + copy}
      ${photosHTML(beat.photos)}
    </li>`;
}

function roomHTML(room, prev, next) {
  const wing = WINGS[room.layout];
  const body = wing ? wing.html(room) : `<ol class="room__beats">${(room.beats || []).map(beatHTML).join('')}</ol>`;
  const cover = room.cover ? photo(room.cover) : '';
  // A note in pen beside the cover, with an arrow to it.
  const coverNote = room.cover?.note
    ? `<p class="cover-note"><svg class="cover-note__arrow" viewBox="0 0 100 70" aria-hidden="true"><path d="M96 10 C70 4 34 16 10 56" pathLength="1"/><path d="M21 49 L10 56 L11 43" pathLength="1"/></svg><span class="hand">${room.cover.note}</span></p>`
    : '';
  return `
    <section class="room room--${room.tone}${room.layout ? ` room--${room.layout}` : ''}" id="${room.id}" data-room="${room.n}" aria-labelledby="${room.id}-title">
      ${room.ambient ? '<div class="room__ambient" aria-hidden="true"><canvas></canvas></div>' : ''}
      ${cover ? `<div class="room__cover wrap"><div class="room__print">${cover}${coverNote}</div></div>` : ''}
      <div class="room__inner wrap">
        <aside class="room__plaque">
          <div class="room__card">
            <p class="mono room__kicker"><span>No. ${room.no}</span><span>${room.time}</span></p>
            <h2 class="t-h1 room__title" id="${room.id}-title">${room.title}</h2>
            <p class="mono room__meta">${room.place} · ${room.dates}</p>
            ${room.proof?.length ? `<ul class="room__proof">${room.proof.map((p) => `<li>${p}</li>`).join('')}</ul>` : ''}
          </div>
          <div class="room__guide">
            <div class="room__guide-art"></div>
            <p class="bubble room__bubble">${room.guide.line}</p>
          </div>
        </aside>
        <div class="room__body">${body}</div>
      </div>
      <nav class="room__nav wrap" aria-label="More of the tour">
        <a class="room__nav-prev" href="${prev.href}"><span class="mono">← Previous</span><span class="room__nav-title">${prev.title}</span></a>
        <a class="room__nav-next" href="${next.href}">
          <span class="mono">${next.kicker}</span>
          <span class="room__nav-to">${next.title}</span>
          <span class="btn${room.tone === 'night' ? '' : ' btn--ink'} room__nav-cta">${next.cta}<span aria-hidden="true">→</span></span>
        </a>
      </nav>
    </section>`;
}

// Counts a stat up from zero, keeping its prefix, suffix and thousands separator. Only a value with a digit in it
// counts: "B.E." has dots but no number, and counting it showed NaN.
function countStat(node, quiet) {
  if (!node || quiet) return;
  const match = /^(\D*?)(\d[\d,.]*)(.*)$/.exec(node.dataset.stat);
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

// The stop on screen now, and everything it set running.
let current = null;

// Leaving a stop: undo its animations and scroll triggers, and stop anything it left going (snow, clocks).
function dispose() {
  if (!current) return;
  current.cleanups.forEach((fn) => { try { fn(); } catch { /* already gone */ } });
  current.boil.disconnect();
  current.animations.revert();
  current = null;
}

// The express tour hides the long beats, so every trigger needs new measurements.
on((type) => { if (type === 'ticket') ScrollTrigger.refresh(); });

export function init(stop) {
  dispose();
  const host = document.getElementById('rooms');
  if (!stop) { host.replaceChildren(); return; }
  const i = ROOMS.findIndex((room) => room.id === stop.id);
  const before = ROOMS[i - 1];
  const after = ROOMS[i + 1];
  // The way on. The first stop looks back to the entrance, where Manoj met you, and the last one leads out to the street.
  const prev = before ? { href: pathFor(before.id), title: before.title } : { href: pathFor('steps'), title: 'Meet your guide' };
  const next = after
    ? { href: pathFor(after.id), kicker: `Next · ${after.no}`, title: after.title, cta: 'View next' }
    : { href: '/', kicker: 'The end of the tour', title: '26th Avenue', cta: 'Back to the street' };
  host.innerHTML = roomHTML(stop, prev, next);
  const quiet = reducedMotion();
  const cleanups = [];

  // Hand-drawn lines only boil while they are on screen.
  const boil = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-boiling', entry.isIntersecting));
  }, { rootMargin: '10% 0px' });

  // Everything the stop animates is made inside one context, so leaving it can undo all of it in one go.
  const animations = gsap.context(() => [stop].forEach((room) => {
    const el = document.getElementById(room.id);
    const guide = mountManoj(el.querySelector('.room__guide-art'), {
      pose: room.guide.pose, outfit: room.outfit, label: `Doodle Manoj, your guide to ${room.title}`,
    });
    const ctx = { room, quiet, kit, guide, ScrollTrigger, onDispose: (fn) => cleanups.push(fn) };

    // The cover drops onto the page like a print being taped down.
    const coverPhoto = el.querySelector('.room__cover .photo');
    if (coverPhoto && !quiet) gsap.from(coverPhoto, { y: -26, rotation: -7, autoAlpha: 0, duration: 0.9, delay: 0.15, ease: 'back.out(1.5)' });
    // Its note pops on once it's down, and the arrow is drawn in.
    const coverNote = el.querySelector('.cover-note');
    if (coverNote && !quiet) {
      gsap.from(coverNote, { autoAlpha: 0, scale: 0.6, duration: 0.5, delay: 1.05, ease: 'back.out(2.4)' });
      gsap.fromTo(coverNote.querySelectorAll('path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4, delay: 1.3, stagger: 0.28, ease: 'power2.out' });
    }

    el.querySelectorAll('.beat').forEach((beatEl) => {
      const beat = room.beats[Number(beatEl.dataset.beat)];
      const svg = beatEl.querySelector('.beat__art');
      if (svg) {
        if (ART[beat.art]) ART[beat.art](kit(svg, room.tone)); else sketchPending(svg, beat.art, room.tone);
        boil.observe(svg);
        if (beat.effect && FX[beat.effect]) FX[beat.effect](beatEl, { ...ctx, beat, svg, fx: beatEl.querySelector('.beat__fx') });
      }

      const parts = beatEl.querySelectorAll('.beat__stage, .beat__copy > *, .photos > .photo');
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
    // Each stop ends its own page, so the punch lands as you reach the bottom of it.
    ScrollTrigger.create({ trigger: el, start: 'bottom-=80 bottom', once: true, onEnter: () => punch(room.n) });
  }));

  current = { animations, boil, cleanups };
}
