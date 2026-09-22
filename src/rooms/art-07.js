// Room 07 · The leap. Nine scenes from the decision to landing, drawn at 600 × 420.
// Documents are drawn, never scanned: no passport, visa or I-20 numbers anywhere.

import { WORLD } from '../data/land.js';
import { PLANE } from './art-05.js';

let clipCount = 0;

export const ART = {
  decision: (k) => {
    const { sk, ink, ground, dots } = k;
    k.el('polygon', { points: '270,54 330,54 480,420 120,420', fill: dots, opacity: 0.14 });
    k.pen('M300 0 V26', { 'stroke-width': 2 });
    sk.poly([[266, 26], [334, 26], [350, 54], [250, 54]], { fill: ink, fillStyle: 'solid', stroke: ink, seed: 3 });
    const page = k.group({ transform: 'rotate(-3 300 250)' });
    k.into(page).rect(140, 110, 320, 250, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 5 });
    k.hand(172, 196, 'take a break.', { fill: ground, 'font-size': 40 }, page);
    k.hand(172, 268, 'go deep on AI.', { fill: ground, 'font-size': 48, 'font-weight': 700 }, page);
    k.pen('M172 284 q130 14 256 -4', { stroke: ground, 'stroke-width': 3, class: 'fx-underline' }, page);
    k.pen(k.scribble(172, 322, 160, 1.4), { stroke: ground, 'stroke-width': 1.6, opacity: 0.6 }, page);
    sk.path('M486 330 h46 v40 q0 14-14 14 h-18 q-14 0-14-14z', { fill: ground, fillStyle: 'solid', seed: 6 });
    sk.path('M532 340 q16 4 0 22', { strokeWidth: 2.4, seed: 7 });
  },

  applications: (k) => {
    const { sk, ink, ground, muted } = k;
    sk.rect(50, 40, 500, 330, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 3 });
    for (let i = 0; i < 9; i++) sk.path(`M${60 + i * 54} 72 l8-22 h36 l8 22`, { fill: i === 8 ? ink : ground, fillStyle: 'solid', strokeWidth: 1.6, seed: 10 + i });
    sk.line(50, 72, 550, 72, { strokeWidth: 2, seed: 4 });
    k.mono(80, 100, 'STATEMENT OF PURPOSE', { 'font-size': 11, 'font-weight': 700, fill: muted });
    for (let r = 0; r < 7; r++) k.pen(k.scribble(80, 124 + r * 24, r === 6 ? 150 : 290, 1.6), { 'stroke-width': 1.8 });
    [0, 1, 2].forEach((i) => sk.rect(412 + i * 8, 96 + i * 10, 92, 112, { fill: ground, fillStyle: 'solid', strokeWidth: 1.8, seed: 20 + i }));
    k.mono(470, 240, 'LETTERS', { 'text-anchor': 'middle', 'font-size': 10, fill: muted });
    const btn = k.group({ class: 'fx-submit' });
    k.into(btn).rect(360, 288, 160, 52, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 30 });
    k.dot(440, 323, 'SUBMIT', { 'text-anchor': 'middle', 'font-size': 22, fill: ground }, btn);
    k.el('path', { d: 'M474 320 l0 34 9-9 7 15 7-3 -7-15 12 0z', fill: ground, stroke: ink, 'stroke-width': 2 });
    k.el('path', { d: 'M92 338 a26 26 0 1 0 30 -34 a20 20 0 1 1 -30 34z', fill: ink });
  },

  admit: (k) => {
    const { sk, ink, ground } = k;
    const phone = k.group({ class: 'fx-buzz' });
    const p = k.into(phone);
    p.rect(205, 30, 190, 360, { fill: ground, fillStyle: 'solid', strokeWidth: 3.2, seed: 3 });
    p.rect(218, 62, 164, 294, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 4 });
    k.mono(300, 104, 'UNIVERSITY AT BUFFALO', { 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 700, fill: ground }, phone);
    k.mono(300, 122, 'M.S. ARTIFICIAL INTELLIGENCE', { 'text-anchor': 'middle', 'font-size': 8.5, fill: ground }, phone);
    k.hand(300, 202, 'Congrats!', { 'text-anchor': 'middle', 'font-size': 50, 'font-weight': 700, fill: ground }, phone);
    k.pen('M262 264 l24 26 52-58', { stroke: ground, 'stroke-width': 7 }, phone);
    [['M180 110 l-18-8 M176 140 h-22 M180 170 l-18 8'], ['M420 110 l18-8 M424 140 h22 M420 170 l18 8']].forEach(([d]) => k.pen(d, { 'stroke-width': 2.6, class: 'fx-buzz-lines' }));
  },

  visa: (k) => {
    const { sk, ink, ground, hatch, muted } = k;
    sk.rect(40, 40, 250, 170, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 3 });
    for (let x = 62; x < 290; x += 22) k.pen(`M${x} 44 V206`, { 'stroke-width': 1, opacity: 0.35 });
    k.mono(165, 30, 'CONSULATE WINDOW', { 'text-anchor': 'middle', 'font-size': 10, fill: muted });
    const words = k.group({ class: 'fx-words' });
    k.into(words).path('M300 60 h256 v84 h-200 l-26 22 v-22 h-30z', { fill: ink, fillStyle: 'solid', stroke: ink, seed: 5 });
    k.hand(428, 112, 'Your visa is approved.', { 'text-anchor': 'middle', 'font-size': 28, fill: ground }, words);
    sk.rect(70, 238, 92, 58, { fill: ground, fillStyle: 'solid', strokeWidth: 2, seed: 6 });
    k.mono(116, 262, 'TOKEN', { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700 });
    k.mono(116, 284, '• • •', { 'text-anchor': 'middle', 'font-size': 12 });
    const i20 = k.group({ transform: 'rotate(5 446 310)' });
    k.into(i20).rect(362, 216, 170, 190, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 9 });
    k.dot(447, 258, 'I-20', { 'text-anchor': 'middle', 'font-size': 32, fill: ground }, i20);
    [290, 312, 334, 356].forEach((y) => k.pen(k.scribble(382, y, 130, 1.2), { stroke: ground, 'stroke-width': 1.6 }, i20));
    const passport = k.group({ transform: 'rotate(-8 256 330)' });
    k.into(passport).rect(196, 250, 120, 160, { fill: hatch, fillStyle: 'solid', strokeWidth: 3, seed: 7 });
    k.into(passport).rect(212, 272, 88, 28, { fill: ground, fillStyle: 'solid', stroke: ground, seed: 11 });
    k.mono(256, 291, 'PASSPORT', { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700 }, passport);
    k.into(passport).circle(256, 350, 44, { fill: ground, fillStyle: 'solid', strokeWidth: 2.2, seed: 8 });
    const stamp = k.group({ class: 'fx-stamp', transform: 'rotate(-14 318 372)' });
    k.el('rect', { x: 262, y: 350, width: 112, height: 42, rx: 6, fill: ground, stroke: ink, 'stroke-width': 3.5 }, stamp);
    k.dot(318, 379, 'F-1 VISA', { 'text-anchor': 'middle', 'font-size': 18 }, stamp);
  },

  packing: (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    sk.line(-10, 384, 610, 384, { strokeWidth: 2.4, seed: 2 });
    [40, 320].forEach((x, i) => {
      sk.poly([[x, 250], [x + 240, 250], [x + 220, 172], [x + 20, 172]], { fill: hatch, fillStyle: 'solid', strokeWidth: 2.6, seed: 10 + i });
      sk.rect(x, 250, 240, 124, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 3 + i });
    });
    [[58, 270], [140, 270]].forEach(([x, y], i) => {
      sk.rect(x, y, 72, 62, { fill: i ? dots : ground, fillStyle: 'solid', seed: 20 + i });
      k.pen(`M${x + 25} ${y} l11 12 11-12`, { 'stroke-width': 2 });
    });
    [0, 1, 2].forEach((j) => sk.rect(222, 344 - j * 18, 44, 16, { fill: ground, fillStyle: 'solid', seed: 30 + j }));
    sk.rect(340, 280, 92, 60, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 40 });
    sk.circle(386, 310, 42, { fill: ground, fillStyle: 'solid', seed: 41 });
    sk.circle(386, 310, 20, { fill: hatch, fillStyle: 'solid', seed: 42 });
    sk.rect(450, 280, 94, 64, { fill: ground, fillStyle: 'solid', seed: 43 });
    const scale = k.group({ class: 'fx-scale' });
    k.pen('M300 0 V44', { 'stroke-width': 2 }, scale);
    k.into(scale).circle(300, 94, 104, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 50 });
    k.pen('M300 94 L330 70', { 'stroke-width': 3, class: 'fx-needle' }, scale);
    k.el('circle', { cx: 300, cy: 94, r: 5, fill: ink }, scale);
    k.dot(300, 128, '23 KG?', { 'text-anchor': 'middle', 'font-size': 18 }, scale);
    k.pen('M300 146 V168 q0 12 -12 12', { 'stroke-width': 2.4 }, scale);
  },

  goodbye: (k) => {
    const { sk, ink, ground, hatch } = k;
    k.el('path', { d: 'M520 70 a28 28 0 1 0 32 -36 a22 22 0 1 1 -32 36z', fill: ink });
    sk.poly([[40, 92], [210, 12], [380, 92]], { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 4 });
    sk.rect(60, 90, 300, 290, { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 3 });
    k.el('rect', { x: 170, y: 190, width: 100, height: 190, fill: ink, opacity: 0.92 });
    sk.rect(170, 190, 100, 190, { strokeWidth: 2.6, seed: 5 });
    [[202, 0], [240, 1]].forEach(([x, i]) => {
      k.el('circle', { cx: x, cy: 250 + i * 6, r: 13, fill: ground });
      k.el('path', { d: `M${x - 18} 380 V${290 + i * 6} q0-22 18-22 q18 0 18 22 V380z`, fill: ground });
    });
    k.el('polygon', { points: '170,380 270,380 440,420 40,420', fill: hatch, opacity: 0.35 });
    sk.line(-10, 380, 610, 380, { strokeWidth: 2, seed: 6 });
    // walking away, backpack on, suitcase in tow
    const walker = k.group({ class: 'fx-walk' });
    const w = k.into(walker);
    k.pen('M474 322 L462 380 M490 322 L504 380', { 'stroke-width': 7 }, walker);
    w.path('M450 332 q-2-60 32-62 q34 2 32 62z', { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 8 });
    w.rect(462, 282, 40, 46, { fill: hatch, fillStyle: 'solid', strokeWidth: 2.2, seed: 9 });
    w.circle(482, 248, 38, { fill: hatch, fillStyle: 'solid', strokeWidth: 2.6, seed: 7 });
    k.pen('M462 242 q6-20 20-18 q14-4 22 14 q-8-6-12-2 q-8-8-16 0 q-8-4-14 6', { 'stroke-width': 3 }, walker);
    k.pen('M512 300 L534 328', { 'stroke-width': 3 }, walker);
    w.rect(528, 326, 44, 54, { fill: ground, fillStyle: 'solid', strokeWidth: 2.4, seed: 10 });
  },

  departures: (k) => {
    const { sk, ink, ground, muted } = k;
    sk.rect(30, 26, 540, 254, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 3 });
    k.dot(50, 62, 'DEPARTURES · MAA', { 'font-size': 22 });
    k.mono(60, 92, 'DESTINATION', { 'font-size': 10, fill: muted });
    k.mono(400, 92, 'STATUS', { 'font-size': 10, fill: muted });
    [['DUBAI', 'DEPARTED'], ['SINGAPORE', 'DEPARTED'], ['BUFFALO VIA JFK', 'BOARDING'], ['LONDON', 'ON TIME'], ['FRANKFURT', 'ON TIME']].forEach(([dest, status], r) => {
      const y = 124 + r * 31;
      const mine = r === 2;
      if (mine) k.el('rect', { x: 44, y: y - 21, width: 512, height: 29, fill: ink, opacity: 0.92 });
      k.dot(60, y, dest, { 'font-size': 18, fill: mine ? ground : ink, class: mine ? 'fx-flap' : '' });
      k.dot(400, y, status, { 'font-size': 18, fill: mine ? ground : ink, class: mine ? 'fx-flap' : '' });
    });
    const pass = k.group({ transform: 'rotate(-4 300 350)' });
    k.into(pass).rect(130, 300, 340, 104, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 20 });
    k.mono(150, 324, 'BOARDING PASS', { 'font-size': 11, 'font-weight': 700, fill: ground }, pass);
    k.dot(150, 364, 'MAA', { 'font-size': 30, fill: ground }, pass);
    k.pen('M226 354 H290 m-10-8 l10 8 -10 8', { stroke: ground, 'stroke-width': 2.4 }, pass);
    k.dot(300, 364, 'BUF', { 'font-size': 30, fill: ground }, pass);
    k.mono(150, 390, 'SEAT: WINDOW', { 'font-size': 11, fill: ground }, pass);
    k.pen('M398 306 V398', { stroke: ground, 'stroke-width': 1.6, 'stroke-dasharray': '4 4' }, pass);
    for (let i = 0; i < 12; i++) k.pen(`M${412 + i * 4.4} 324 v${i % 3 ? 46 : 58}`, { stroke: ground, 'stroke-width': i % 2 ? 1.2 : 2.4 }, pass);
  },

  'window-seat': (k) => {
    const { sk, ink, ground, hatch } = k;
    const outer = 'M110 50 h130 q50 0 50 50 v200 q0 50 -50 50 h-130 q-50 0 -50 -50 v-200 q0 -50 50 -50z';
    const inner = 'M125 72 h100 q43 0 43 43 v170 q0 43 -43 43 h-100 q-43 0 -43 -43 v-170 q0 -43 43 -43z';
    sk.path(outer, { fill: ground, fillStyle: 'solid', strokeWidth: 3.2, seed: 3 });
    const id = `window-clip-${(clipCount += 1)}`;
    k.el('path', { d: inner }, k.el('clipPath', { id }, k.el('defs')));
    const view = k.group({ 'clip-path': `url(#${id})` });
    k.el('rect', { x: 60, y: 50, width: 240, height: 320, fill: ink }, view);
    const clouds = k.group({ class: 'fx-clouds' }, view);
    [[120, 262], [206, 300], [150, 330], [256, 246], [96, 316]].forEach(([x, y]) => {
      k.el('path', { d: `M${x - 40} ${y} q0-22 22-22 q8-18 28-12 q18-10 30 8 q22 2 20 26z`, fill: ink, stroke: ground, 'stroke-width': 2 }, clouds);
    });
    k.el('polygon', { points: '82,214 300,162 300,198 122,236', fill: ground }, view);
    k.el('polygon', { points: '82,214 300,162 300,198 122,236', fill: hatch }, view);
    sk.path(inner, { strokeWidth: 2.4, seed: 4 });

    // the seat-back map
    sk.rect(330, 84, 240, 176, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 5 });
    const S = 220 / 180;
    let d = '';
    WORLD.rows.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) if (row[c] === '1') d += `M${(340 + c * S).toFixed(1)} ${(104 + r * S).toFixed(1)}h1v1h-1z`;
    });
    k.el('path', { d, fill: ink, opacity: 0.7 });
    const at = (lat, lon) => [340 + ((lon + 180) / 2) * S, 104 + ((76 - lat) / 2) * S];
    const [ax, ay] = at(13.08, 80.27);
    const [bx, by] = at(42.89, -78.88);
    k.pen(`M${ax.toFixed(1)} ${ay.toFixed(1)} Q450 86 ${bx.toFixed(1)} ${by.toFixed(1)}`, { 'stroke-width': 1.8, 'stroke-dasharray': '4 4', class: 'fx-arc' });
    k.el('path', { d: PLANE, fill: ink, class: 'fx-plane', transform: 'translate(450 108) rotate(-80) scale(0.7)' });
    k.mono(344, 222, 'MAA TO BUF', { 'font-size': 11, 'font-weight': 700 });
    k.dot(344, 248, '13,400 KM', { 'font-size': 18 });
    // tray table
    sk.rect(330, 300, 240, 26, { fill: hatch, fillStyle: 'solid', strokeWidth: 2.4, seed: 6 });
    sk.path('M420 300 v-24 h30 v24', { fill: ground, fillStyle: 'solid', seed: 7 });
  },

  landing: (k) => {
    const { sk, ink, ground, hatch, rnd } = k;
    sk.rect(330, 44, 240, 336, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 3 });
    sk.line(450, 44, 450, 380, { strokeWidth: 2.4, seed: 4 });
    k.mono(450, 32, 'EXIT · BUFFALO', { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700 });
    const frost = k.group({ class: 'fx-frost' });
    for (let i = 0; i < 16; i++) {
      const x = 350 + rnd() * 200;
      const y = 64 + rnd() * 296;
      const r = 5 + rnd() * 7;
      k.pen(`M${(x - r).toFixed(1)} ${y.toFixed(1)} h${(2 * r).toFixed(1)} M${x.toFixed(1)} ${(y - r).toFixed(1)} v${(2 * r).toFixed(1)} M${(x - r * 0.7).toFixed(1)} ${(y - r * 0.7).toFixed(1)} l${(1.4 * r).toFixed(1)} ${(1.4 * r).toFixed(1)} M${(x + r * 0.7).toFixed(1)} ${(y - r * 0.7).toFixed(1)} l${(-1.4 * r).toFixed(1)} ${(1.4 * r).toFixed(1)}`, { 'stroke-width': 1.4, opacity: 0.75 }, frost);
    }
    sk.rect(30, 190, 270, 30, { fill: hatch, fillStyle: 'solid', strokeWidth: 2.4, seed: 6 });
    sk.rect(30, 220, 270, 160, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 5 });
    k.dot(165, 172, 'PORT OF ENTRY', { 'text-anchor': 'middle', 'font-size': 22 });
    const page = k.group({ transform: 'rotate(-6 150 290)' });
    k.into(page).rect(76, 240, 160, 104, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 7 });
    [264, 284].forEach((y) => k.pen(k.scribble(92, y, 70, 1), { stroke: ground, 'stroke-width': 1.4 }, page));
    const stamp = k.group({ class: 'fx-stamp' }, page);
    k.el('circle', { cx: 186, cy: 304, r: 32, fill: 'none', stroke: ground, 'stroke-width': 3.4 }, stamp);
    k.mono(186, 308, 'ARRIVED', { 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: ground }, stamp);
    k.hand(56, 110, 'first cold breath', { 'font-size': 30 });
    k.pen('M250 96 q30-20 50 0 q24-10 34 12 q-20 22-44 10 q-24 10-40-22z', { 'stroke-width': 2, opacity: 0.7 });
    sk.line(-10, 380, 610, 380, { strokeWidth: 2.4, seed: 8 });
  },
};
