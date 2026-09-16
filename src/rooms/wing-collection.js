// Room 10 · The permanent collection. Finished works in frames, one piece under cloth,
// and the client wing with notes left in the guestbook. On phones the exhibits swipe sideways.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { photo } from '../lib/doodle.js';

const DRAW = {
  'ex-rhodesk': (k) => {
    const { sk, ink, ground, hatch } = k;
    sk.line(40, 300, 560, 300, { strokeWidth: 2.6, seed: 2 });
    sk.rect(90, 50, 300, 210, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 3 });
    k.mono(116, 84, 'RHO DESK', { fill: ground, 'font-size': 14, 'font-weight': 700 });
    for (let i = 0; i < 26; i++) {
      const h = 10 + Math.abs(Math.sin(i * 0.7)) * 70;
      k.el('rect', { x: 116 + i * 10, y: (160 - h / 2).toFixed(1), width: 5, height: h.toFixed(1), fill: ground });
    }
    k.mono(116, 240, "VOICE AI ON RHO'S API", { fill: ground, 'font-size': 10 });
    sk.rect(214, 260, 52, 40, { fill: ink, fillStyle: 'solid', seed: 4 });
    sk.path('M430 206 q0-72 62-72 q62 0 62 72', { strokeWidth: 6, seed: 5 });
    sk.rect(418, 196, 26, 52, { fill: ink, fillStyle: 'solid', seed: 6 });
    sk.rect(540, 196, 26, 52, { fill: ink, fillStyle: 'solid', seed: 7 });
    k.pen('M431 248 q10 40 52 40', { 'stroke-width': 3 });
    sk.circle(130, 362, 84, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 8 });
    [[-18, -12], [18, -12], [0, 20]].forEach(([dx, dy], i) => sk.circle(130 + dx, 362 + dy, 18, { fill: hatch, fillStyle: 'solid', seed: 9 + i }));
    sk.rect(172, 344, 180, 36, { fill: hatch, fillStyle: 'solid', strokeWidth: 2, seed: 12 });
    k.dot(470, 378, '24H', { 'text-anchor': 'middle', 'font-size': 38 });
  },

  'ex-snapinfra': (k) => {
    const { sk, ink, ground } = k;
    let grid = '';
    for (let x = 30; x <= 570; x += 30) grid += `M${x} 30V390`;
    for (let y = 30; y <= 390; y += 30) grid += `M30 ${y}H570`;
    k.el('path', { d: grid, stroke: ink, 'stroke-width': 0.6, opacity: 0.25, fill: 'none' });
    k.pen('M300 100 V150 M260 210 L170 270 M340 210 L430 270 M220 298 H380', { 'stroke-width': 2 });
    const box = (x, y, w, h, label, dark, seed) => {
      sk.rect(x, y, w, h, { fill: dark ? ink : ground, fillStyle: 'solid', stroke: ink, strokeWidth: 2.4, seed });
      k.mono(x + w / 2, y + h / 2 + 4, label, { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: dark ? ground : ink });
    };
    box(230, 50, 140, 50, 'USERS', false, 3);
    box(210, 150, 180, 60, 'WEB APP', true, 4);
    box(80, 270, 140, 56, 'API', false, 5);
    box(380, 270, 140, 56, 'DATABASE', false, 6);
    ['AWS', 'GCP', 'AZURE'].forEach((t, i) => {
      sk.rect(150 + i * 110, 348, 90, 30, { fill: ground, fillStyle: 'solid', strokeWidth: 1.8, seed: 10 + i });
      k.mono(195 + i * 110, 368, t, { 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700 });
    });
    k.hand(396, 84, 'plain English in', { 'font-size': 26 });
    k.hand(40, 250, 'infra out', { 'font-size': 26 });
  },

  'ex-rebateos': (k) => {
    const { sk, ink, ground, muted } = k;
    for (let i = 3; i >= 0; i--) sk.rect(56 + i * 12, 56 + i * 12, 190, 250, { fill: ground, fillStyle: 'solid', strokeWidth: 2, seed: 10 + i });
    k.mono(76, 92, 'REBATE CONTRACT', { 'font-size': 11, 'font-weight': 700 });
    k.el('rect', { x: 74, y: 160, width: 124, height: 18, fill: ink, opacity: 0.16 });
    for (let r = 0; r < 7; r++) k.pen(k.scribble(76, 122 + r * 24, 150, 1.2), { 'stroke-width': 1.5 });
    sk.rect(300, 76, 252, 124, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 20 });
    [106, 130].forEach((y) => k.pen(k.scribble(320, y, 204, 1.2), { stroke: ground, 'stroke-width': 1.8 }));
    ['[1]', '[2]', '[3]'].forEach((t, i) => {
      k.el('rect', { x: 320 + i * 46, y: 156, width: 38, height: 24, rx: 4, fill: 'none', stroke: ground, 'stroke-width': 2 });
      k.mono(339 + i * 46, 173, t, { 'text-anchor': 'middle', 'font-size': 11, fill: ground });
    });
    sk.path('M342 200 l-18 26 v-26', { fill: ink, fillStyle: 'solid', stroke: ink, seed: 21 });
    sk.poly([[318, 330], [350, 272], [382, 330]], { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 22 });
    k.dot(350, 324, '!', { 'text-anchor': 'middle', 'font-size': 28 });
    k.mono(396, 312, 'CONFLICT FOUND', { 'font-size': 11, 'font-weight': 700 });
    k.dot(300, 392, '90%+ ACCURACY', { 'text-anchor': 'middle', 'font-size': 22 });
    k.mono(560, 250, '1,000+ CONTRACTS', { 'text-anchor': 'end', 'font-size': 10, fill: muted });
  },

  'ex-scootpie': (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    [[56, 70, ground], [56, 180, dots], [56, 290, hatch]].forEach(([x, y, fill], i) => {
      sk.rect(x, y, 104, 90, { fill: ground, fillStyle: 'solid', strokeWidth: 2, seed: 30 + i });
      k.into(k.group()).path(`M${x + 38} ${y + 22} l-12 16 10 7 5-5 v30 h22 v-30 l5 5 10-7 -12-16 q-7 5-14 5 q-7 0-14-5z`, { fill, fillStyle: 'solid', seed: 40 + i });
    });
    sk.rect(210, 26, 180, 368, { fill: ground, fillStyle: 'solid', strokeWidth: 3.2, seed: 3 });
    k.el('rect', { x: 224, y: 58, width: 152, height: 296, fill: dots, opacity: 0.2 });
    sk.path('M246 318 q0-112 54-112 q54 0 54 112z', { fill: ground, fillStyle: 'solid', seed: 5 });
    sk.path('M300 206 q54 0 54 112 h-54z', { fill: hatch, fillStyle: 'solid', seed: 6 });
    sk.circle(300, 150, 60, { fill: ground, fillStyle: 'solid', seed: 7 });
    k.el('path', { d: 'M270 146 q-6-40 30-42 q38 0 32 40 q-10-16-30-15 q-20-3-32 17z', fill: ink });
    k.pen('M300 94 V332', { 'stroke-width': 2, 'stroke-dasharray': '6 5' });
    k.el('circle', { cx: 300, cy: 262, r: 12, fill: ground, stroke: ink, 'stroke-width': 3 });
    k.mono(300, 376, 'TRY-ON · SDXL', { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700 });
    sk.rect(440, 246, 112, 124, { fill: hatch, fillStyle: 'solid', strokeWidth: 2.6, seed: 8 });
    k.pen('M468 246 q0-40 28-40 q28 0 28 40', { 'stroke-width': 3 });
    [[470, 90], [540, 150], [420, 170]].forEach(([x, y]) => k.pen(`M${x - 9} ${y} h18 M${x} ${y - 9} v18`, { 'stroke-width': 2.2 }));
  },
};

function drawCloth(k) {
  const { ink, ground, hatch } = k;
  const d = 'M-10 -10 H610 V372 q-44 44 -96 18 q-62 34 -124 8 q-64 30 -132 4 q-62 28 -134 -2 q-52 22 -134 -12 Z';
  k.el('path', { d, fill: ground, stroke: ink, 'stroke-width': 3 });
  k.el('path', { d, fill: hatch, opacity: 0.3 });
  [90, 190, 300, 410, 510].forEach((x, i) => k.pen(`M${x} 0 q${i % 2 ? 18 : -18} 180 ${i % 2 ? -8 : 8} 380`, { 'stroke-width': 2, opacity: 0.55 }));
  const tag = k.group({ transform: 'rotate(-8 300 190)' });
  k.into(tag).rect(186, 158, 228, 62, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 3 });
  k.dot(300, 200, 'CONFIDENTIAL', { 'text-anchor': 'middle', 'font-size': 24, fill: ground }, tag);
}

const exhibitHTML = (ex, i) => `
  <li class="exhibit${ex.cover ? ' exhibit--cloth' : ''}">
    <div class="exhibit__frame">
      <svg class="exhibit__art" viewBox="0 0 600 420" data-seed="${i + 11}" role="img" aria-label="${ex.title}"></svg>
      <svg class="exhibit__spot" viewBox="0 0 600 420" aria-hidden="true"><polygon points="250,0 350,0 620,420 -20,420" fill="url(#ht-ink)" opacity=".14"/></svg>
      ${ex.cover ? `<div class="exhibit__under" aria-hidden="true"><span class="hand">${ex.reveal}</span></div><svg class="exhibit__cloth" viewBox="0 0 600 420" aria-hidden="true"></svg>` : ''}
    </div>
    <div class="exhibit__label">
      <p class="mono exhibit__no"><span>${ex.no}</span><span>${ex.year}</span></p>
      <h3 class="t-h2 exhibit__title">${ex.title}</h3>
      <p class="dotf exhibit__tag">${ex.tag}</p>
      <p class="exhibit__text">${ex.text}</p>
      ${ex.links?.length ? `<p class="exhibit__links">${ex.links.map((l) => `<a class="mono" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('')}</p>` : ''}
      ${ex.cover ? '<button class="btn btn--ink exhibit__lift" type="button" aria-pressed="false">Lift the cloth</button>' : ''}
      ${ex.photo ? `<div class="exhibit__photo">${photo(ex.photo)}</div>` : ''}
    </div>
  </li>`;

const clientsHTML = (clients) => `
  <section class="clients" aria-labelledby="clients-title">
    <p class="mono clients__kicker">exhibit 6 · the client wing</p>
    <h3 class="t-h2" id="clients-title">Built for them, and they said so.</h3>
    <ul class="clients__wall">${clients.names.map((name) => `<li class="dotf">${name}</li>`).join('')}</ul>
    <div class="clients__book">
      ${clients.quotes.map((q) => `
        <figure class="clients__note"><blockquote class="hand">“${q.text}”</blockquote><figcaption class="mono">${q.who}</figcaption></figure>`).join('')}
    </div>
  </section>`;

export const WINGS = {
  collection: {
    html: (room) => `
      <div class="gallery">
        <p class="mono gallery__hint">Swipe through the exhibits</p>
        <ol class="gallery__exhibits">${room.exhibits.map(exhibitHTML).join('')}</ol>
        ${clientsHTML(room.clients)}
        ${room.tell?.length ? `<ul class="beat__tell">${room.tell.map((t) => `<li class="tellme">Tell me: ${t}</li>`).join('')}</ul>` : ''}
      </div>`,

    init: (el, room, { kit, quiet }) => {
      el.querySelectorAll('.exhibit').forEach((node, i) => {
        const ex = room.exhibits[i];
        DRAW[ex.art]?.(kit(node.querySelector('.exhibit__art'), room.tone));
        if (!quiet) {
          gsap.fromTo(node.querySelector('.exhibit__spot'), { opacity: 0 }, {
            opacity: 1, ease: 'none', scrollTrigger: { trigger: node, start: 'top 90%', end: 'top 35%', scrub: true },
          });
        }
        if (!ex.cover) return;
        const cloth = node.querySelector('.exhibit__cloth');
        drawCloth(kit(cloth, room.tone));
        const button = node.querySelector('.exhibit__lift');
        button.addEventListener('click', () => {
          const open = button.getAttribute('aria-pressed') !== 'true';
          button.setAttribute('aria-pressed', String(open));
          button.textContent = open ? 'Lower the cloth' : 'Lift the cloth';
          gsap.to(cloth, { yPercent: open ? -92 : 0, rotation: open ? -2 : 0, duration: quiet ? 0 : 0.8, ease: 'power3.inOut' });
        });
        node.querySelector('.exhibit__frame').addEventListener('click', () => button.click());
      });

      const notes = el.querySelectorAll('.clients__note');
      if (quiet || !notes.length) return;
      gsap.set(notes, { y: 30, autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: el.querySelector('.clients'), start: 'top 75%', once: true,
        onEnter: () => gsap.to(notes, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out' }),
      });
    },
  },
};

// The exhibit drawings, shared through the registry (framed on the 3D walls and in the Easter eggs).
export { DRAW as ART };
