// Room 05 · Flight to Delhi. Illustrations for each beat, drawn at 600 × 420.

import { SOUTH_ASIA } from '../data/land.js';

// A small plane pointing up, drawn around 0,0.
export const PLANE = 'M0 -15 L3 -5 L15 2 L15 6 L3 3 L2 10 L6 13 L6 16 L0 14 L-6 16 L-6 13 L-2 10 L-3 3 L-15 6 L-15 2 L-3 -5 Z';

export const ART = {
  suitcase: (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    sk.line(-10, 372, 610, 372, { strokeWidth: 2.4, seed: 2 });
    // the door out
    sk.rect(24, 58, 104, 314, { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 3 });
    k.el('circle', { cx: 112, cy: 222, r: 6, fill: ink });
    // the suitcase
    sk.path('M236 150 v-26 q0-12 12-12 h104 q12 0 12 12 v26', { strokeWidth: 5, seed: 4 });
    sk.rect(170, 150, 260, 200, { fill: ground, fillStyle: 'solid', strokeWidth: 3.2, seed: 5 });
    [230, 300, 370].forEach((x, i) => sk.line(x, 158, x, 342, { strokeWidth: 1.4, seed: 6 + i }));
    k.pen('M178 250 H422', { 'stroke-width': 2.4, 'stroke-dasharray': '3 5', class: 'fx-zip' });
    sk.rect(410, 238, 22, 26, { fill: ink, fillStyle: 'solid', seed: 9 });
    [[196, 360], [404, 360]].forEach(([x, y], i) => sk.circle(x, y, 22, { fill: ink, fillStyle: 'solid', seed: 10 + i }));
    // stickers and a tag
    const sticker = k.group({ transform: 'rotate(-10 222 196)' });
    k.into(sticker).rect(186, 176, 72, 40, { fill: dots, fillStyle: 'solid', seed: 12 });
    k.into(sticker).rect(194, 184, 56, 24, { fill: ground, fillStyle: 'solid', stroke: ground, seed: 13 });
    k.dot(222, 203, 'MAA', { 'text-anchor': 'middle', 'font-size': 18 }, sticker);
    sk.circle(376, 300, 50, { fill: hatch, fillStyle: 'solid', seed: 14 });
    k.pen('M300 112 q30 30 64 40', { 'stroke-width': 1.6 });
    const tag = k.group({ transform: 'rotate(14 392 170)' });
    k.into(tag).rect(362, 150, 80, 40, { fill: ground, fillStyle: 'solid', seed: 15 });
    k.hand(402, 178, 'Chennai', { 'text-anchor': 'middle', 'font-size': 22 }, tag);
  },

  'india-map': (k) => {
    const { ink, ground, muted } = k;
    const X0 = 102;
    const Y0 = 43;
    const S = 5.2;
    let d = '';
    SOUTH_ASIA.rows.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) if (row[c] === '1') d += `M${(X0 + c * S).toFixed(1)} ${(Y0 + r * S).toFixed(1)}h3.6v3.6h-3.6z`;
    });
    k.el('path', { d, fill: ink, opacity: 0.45 });
    const at = (lat, lon) => [X0 + ((lon - SOUTH_ASIA.lon0) / SOUTH_ASIA.step) * S + 1.8, Y0 + ((SOUTH_ASIA.lat0 - lat) / SOUTH_ASIA.step) * S + 1.8];
    const [cx, cy] = at(13.08, 80.27);
    const [dx, dy] = at(28.61, 77.21);
    const qx = cx + 120;
    const qy = (cy + dy) / 2;
    k.pen(`M${cx.toFixed(1)} ${cy.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${dx.toFixed(1)} ${dy.toFixed(1)}`, { 'stroke-width': 2.6, 'stroke-dasharray': '6 7', class: 'fx-arc' });
    const heading = (Math.atan2(dy - qy, dx - qx) * 180) / Math.PI + 90;
    k.el('path', { d: PLANE, fill: ink, stroke: ground, 'stroke-width': 1.5, class: 'fx-plane', transform: `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${heading.toFixed(1)}) scale(1.4)` });
    [[cx, cy, 'CHENNAI · MAA', 14, 6], [dx, dy, 'DELHI · DEL', 16, -12]].forEach(([x, y, label, ox, oy]) => {
      k.el('circle', { cx: x, cy: y, r: 8, fill: ground, stroke: ink, 'stroke-width': 3 });
      k.mono(x + ox, y + oy, label, { 'font-size': 12, 'font-weight': 700 });
    });
    k.dot(qx - 24, qy + 8, '1,760 KM', { 'font-size': 24 });
    k.mono(560, 396, 'LAND ONLY, NO BORDERS', { 'text-anchor': 'end', 'font-size': 9.5, fill: muted });
  },

  'pm-desk': (k) => {
    const { sk, ink, ground, hatch, dots, muted } = k;
    sk.rect(50, 34, 500, 206, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 3 });
    // a roadmap on the whiteboard
    k.pen('M84 150 H330', { 'stroke-width': 3 });
    k.pen('M320 142 l12 8 -12 8', { 'stroke-width': 3 });
    [['discover', 100], ['build', 196], ['launch', 292]].forEach(([word, x], i) => {
      k.el('circle', { cx: x, cy: 150, r: 9, fill: i === 2 ? ink : ground, stroke: ink, 'stroke-width': 2.6 });
      k.hand(x, 124, word, { 'text-anchor': 'middle', 'font-size': 24 });
    });
    k.pen(k.scribble(84, 196, 200, 1.6), { 'stroke-width': 1.6, stroke: muted });
    // a revenue portfolio chart
    const bars = k.group({ class: 'fx-bars' });
    [[372, 62], [406, 92], [440, 118], [474, 150], [508, 176]].forEach(([x, h], i) => {
      k.into(bars).rect(x, 214 - h, 24, h, { fill: i === 4 ? ink : hatch, fillStyle: 'solid', seed: 10 + i });
    });
    k.mono(372, 64, '$2M+ PORTFOLIO', { 'font-size': 11, 'font-weight': 700 });
    // the desk
    sk.line(-10, 318, 610, 318, { strokeWidth: 2.6, seed: 20 });
    sk.poly([[200, 318], [360, 318], [372, 300], [212, 300]], { fill: dots, fillStyle: 'solid', seed: 21 });
    sk.rect(222, 232, 128, 68, { fill: ink, fillStyle: 'solid', seed: 22 });
    sk.poly([[420, 318], [540, 318], [528, 282], [432, 282]], { fill: ground, fillStyle: 'solid', seed: 23 });
    k.dot(480, 308, 'APM', { 'text-anchor': 'middle', 'font-size': 22 });
    sk.path('M100 318 v-34 h40 v34', { fill: ground, fillStyle: 'solid', seed: 24 });
    k.pen('M112 284 q-6-16 6-26 M126 284 q8-14-2-26', { 'stroke-width': 1.8, opacity: 0.7 });
  },

  'llm-features': (k) => {
    const { sk, ink, ground, hatch, muted } = k;
    sk.rect(60, 40, 480, 330, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 3 });
    sk.line(60, 76, 540, 76, { strokeWidth: 2, seed: 4 });
    [84, 104, 124].forEach((x) => k.el('circle', { cx: x, cy: 58, r: 5, fill: 'none', stroke: ink, 'stroke-width': 2 }));
    sk.line(170, 76, 170, 370, { strokeWidth: 1.6, seed: 5 });
    // the four features in the sidebar
    const icons = [
      ['SEARCH', 'M96 118 a12 12 0 1 1 0.1 0 M105 127 l10 10'],
      ['CHAT', 'M84 176 h26 q6 0 6 6 v12 q0 6-6 6 h-14 l-8 8 v-8 h-4 q-6 0-6-6 v-12 q0-6 6-6z'],
      ['RECS', 'M96 236 l5 10 11 1 -8 8 2 11 -10-5 -10 5 2-11 -8-8 11-1z'],
      ['WRITE', 'M86 318 l24-24 8 8 -24 24 -10 2z'],
    ];
    icons.forEach(([label, d], i) => {
      k.pen(d, { 'stroke-width': 2.2 });
      k.mono(126, 132 + i * 60, label, { 'font-size': 9.5, 'font-weight': 700, 'text-anchor': 'middle', fill: muted });
    });
    // a conversation
    sk.rect(330, 100, 186, 50, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 6 });
    k.pen(k.scribble(346, 126, 150, 1.4), { stroke: ground, 'stroke-width': 2 });
    sk.rect(194, 170, 230, 78, { fill: ground, fillStyle: 'solid', strokeWidth: 2.2, seed: 7 });
    k.pen(k.scribble(210, 196, 190, 1.4), { 'stroke-width': 2 });
    k.pen(k.scribble(210, 222, 140, 1.4), { 'stroke-width': 2 });
    sk.rect(194, 262, 150, 48, { fill: hatch, fillStyle: 'solid', strokeWidth: 2.2, seed: 8 });
    const typing = k.group({ class: 'fx-typing' });
    [222, 246, 270].forEach((x) => k.el('circle', { cx: x, cy: 340, r: 6, fill: ink }, typing));
    sk.rect(380, 324, 136, 30, { strokeWidth: 1.8, seed: 9 });
    k.mono(448, 344, 'FINE-TUNED', { 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700 });
  },

  'ab-test': (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    [[110, 'A'], [330, 'B']].forEach(([x, letter], i) => {
      sk.rect(x, 70, 160, 250, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 3 + i });
      k.dot(x + 80, 56, letter, { 'text-anchor': 'middle', 'font-size': 40 });
      sk.rect(x + 18, 92, 124, 70, { fill: i ? dots : hatch, fillStyle: 'solid', seed: 10 + i });
      k.pen(k.scribble(x + 18, 186, 110, 1.2), { 'stroke-width': 1.8 });
      k.pen(k.scribble(x + 18, 206, 80, 1.2), { 'stroke-width': 1.8 });
      if (i) sk.rect(x + 30, 248, 100, 36, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 12 });
      else sk.rect(x + 30, 248, 100, 36, { strokeWidth: 2.4, seed: 13 });
    });
    // results under each variant
    const bars = k.group({ class: 'fx-bars' });
    k.into(bars).rect(150, 356, 80, 24, { fill: hatch, fillStyle: 'solid', seed: 20 });
    k.into(bars).rect(370, 346, 80, 34, { fill: ink, fillStyle: 'solid', seed: 21 });
    sk.line(80, 382, 520, 382, { strokeWidth: 2, seed: 22 });
    k.pen('M476 346 l12 14 26-32', { 'stroke-width': 4 });
    // interview notes around the tests
    [[46, 120], [554, 150]].forEach(([x, y], i) => {
      sk.path(`M${x - 30} ${y - 24} h60 v40 h-36 l-12 12 v-12 h-12z`, { fill: ground, fillStyle: 'solid', strokeWidth: 2, seed: 30 + i });
      k.mono(x, y + 2, '...', { 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700 });
    });
  },
};
