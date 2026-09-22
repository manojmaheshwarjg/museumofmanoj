// Room 07 · The leap. Four scenes, from the decision to the flight, drawn at 600 × 420.
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

};
