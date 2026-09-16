// Room 04 · Three friends, one studio. Illustrations for each beat, drawn at 600 × 420.

import { WORLD } from '../data/land.js';

let clipCount = 0;

export const ART = {
  napkin: (k) => {
    const { sk, ink, ground, hatch } = k;
    sk.ellipse(300, 236, 560, 330, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 3 });
    // three laptops, one per friend
    const laptop = (x, y, i) => {
      const g = k.group({ class: 'fx-laptop' });
      const s = k.into(g);
      s.rect(x - 52, y - 70, 104, 66, { fill: ground, fillStyle: 'solid', seed: 10 + i });
      k.el('rect', { x: x - 44, y: y - 62, width: 88, height: 50, fill: ink, opacity: 0.9, class: 'fx-screen' }, g);
      s.poly([[x - 60, y], [x + 60, y], [x + 70, y + 18], [x - 70, y + 18]], { fill: hatch, fillStyle: 'solid', seed: 20 + i });
    };
    [[128, 168], [472, 168], [300, 372]].forEach(([x, y], i) => laptop(x, y, i));
    // tea glasses
    [[228, 322], [376, 150]].forEach(([x, y], i) => sk.poly([[x - 12, y - 30], [x + 12, y - 30], [x + 9, y], [x - 9, y]], { fill: hatch, fillStyle: 'solid', seed: 30 + i }));
    // the napkin with a name on it
    const napkin = k.group({ transform: 'rotate(7 300 238)' });
    k.into(napkin).rect(214, 156, 172, 164, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 40 });
    k.hand(300, 222, 'ZEDTRIBE?', { 'text-anchor': 'middle', 'font-size': 36, fill: ground, 'font-weight': 700 }, napkin);
    k.pen(k.scribble(236, 236, 128, 3), { stroke: ground, 'stroke-width': 2.4 }, napkin);
    k.pen('M268 290 q0-28 22-28 q22 0 22 28 q-6 8-6 16 h-32 q0-8-6-16z M282 312 h16', { stroke: ground, 'stroke-width': 2.2 }, napkin);
    k.pen('M332 268 l14-10 M334 290 h18 M254 268 l-14-10', { stroke: ground, 'stroke-width': 2 }, napkin);
  },

  invoice: (k) => {
    const { sk, ink, ground, muted } = k;
    // the email that started it
    const mail = k.group({ class: 'fx-mail' });
    const m = k.into(mail);
    m.rect(34, 34, 228, 84, { fill: ground, fillStyle: 'solid', strokeWidth: 2.4, seed: 3 });
    m.rect(52, 54, 56, 42, { strokeWidth: 2.2, seed: 4 });
    m.path('M52 54 L80 78 L108 54', { strokeWidth: 2 });
    k.mono(124, 70, 'NEW CLIENT', { 'font-size': 13, 'font-weight': 700 }, mail);
    k.pen(k.scribble(124, 92, 116, 1.4), { 'stroke-width': 1.6 }, mail);
    const pings = k.group({ class: 'fx-ping' });
    [26, 40].forEach((r) => k.el('circle', { cx: 80, cy: 76, r, fill: 'none', stroke: ink, 'stroke-width': 1.6, opacity: 0.5 }, pings));

    // the first invoice, half out of the printer
    const inv = k.group({ class: 'fx-invoice' });
    k.into(inv).rect(206, 96, 188, 206, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 5 });
    k.mono(300, 130, 'INVOICE #001', { 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: ground }, inv);
    [158, 178, 198].forEach((y) => k.pen(k.scribble(226, y, 148, 1.2), { stroke: ground, 'stroke-width': 1.6 }, inv));
    k.pen('M226 226 H374', { stroke: ground, 'stroke-width': 1.4, 'stroke-dasharray': '4 4' }, inv);
    k.mono(226, 250, 'TOTAL', { 'font-size': 11, fill: ground }, inv);
    const paid = k.group({ transform: 'rotate(-12 330 262)' }, inv);
    k.el('rect', { x: 290, y: 240, width: 82, height: 36, fill: 'none', stroke: ground, 'stroke-width': 3, rx: 4 }, paid);
    k.dot(331, 266, 'PAID', { 'text-anchor': 'middle', 'font-size': 20, fill: ground }, paid);

    sk.rect(146, 272, 308, 104, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 6 });
    sk.line(190, 290, 410, 290, { strokeWidth: 4, seed: 7 });
    sk.rect(170, 320, 120, 32, { strokeWidth: 1.6, seed: 8 });
    k.el('circle', { cx: 420, cy: 336, r: 7, fill: ink });
    k.mono(452, 400, 'APR 2021 ONWARD', { 'text-anchor': 'end', 'font-size': 11, fill: muted });
  },

  'world-pins': (k) => {
    const { ink, ground, muted, rnd } = k;
    let d = '';
    WORLD.rows.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) if (row[c] === '1') d += `M${30 + c * 3} ${110 + r * 3}h2.2v2.2h-2.2z`;
    });
    k.el('path', { d, fill: ink, opacity: 0.55 });
    k.dot(30, 72, '30+ CLIENT ENGAGEMENTS', { 'font-size': 20 });
    const pins = k.group({ class: 'fx-pins' });
    let placed = 0;
    for (let guard = 0; placed < 8 && guard < 800; guard++) {
      const r = 6 + Math.floor(rnd() * 44);
      const c = Math.floor(rnd() * 180);
      if (WORLD.rows[r][c] !== '1') continue;
      const x = 31 + c * 3;
      const y = 111 + r * 3;
      const g = k.group({ class: 'fx-pin' }, pins);
      k.el('path', { d: `M${x} ${y}c-7-9-11-14-11-20a11 11 0 1 1 22 0c0 6-4 11-11 20z`, fill: ink, stroke: ground, 'stroke-width': 1.5 }, g);
      k.el('circle', { cx: x, cy: y - 20, r: 4, fill: ground }, g);
      placed += 1;
    }
    k.mono(30, 390, 'PIN SPOTS ARE PLACEHOLDERS UNTIL THE CLIENT LIST IS IN', { 'font-size': 10, fill: muted });
  },

  'design-to-code': (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    const frames = [30, 175, 320, 465];
    frames.forEach((x, i) => sk.rect(x, 110, 110, 120, { fill: ground, fillStyle: 'solid', strokeWidth: 2.4, seed: 3 + i }));
    // sketch
    k.pen('M44 126 h82 v26 h-82z M44 164 h38 v52 h-38z M44 164 l38 52 M82 164 l-38 52', { 'stroke-width': 1.8 });
    k.pen(k.scribble(92, 172, 34, 2), { 'stroke-width': 1.6 });
    k.pen(k.scribble(92, 190, 30, 2), { 'stroke-width': 1.6 });
    // design
    sk.rect(189, 124, 82, 20, { fill: ink, fillStyle: 'solid', seed: 10 });
    sk.circle(206, 172, 26, { fill: hatch, fillStyle: 'solid', seed: 11 });
    k.pen('M226 166 h36 M226 180 h24', { 'stroke-width': 2 });
    sk.rect(189, 198, 82, 20, { fill: dots, fillStyle: 'solid', seed: 12 });
    // code
    k.dot(375, 170, '</>', { 'text-anchor': 'middle', 'font-size': 34 });
    [190, 204, 218].forEach((y, i) => k.pen(`M${338 + i * 6} ${y} h${60 - i * 14}`, { 'stroke-width': 2.4 }));
    // launch
    const rocket = k.group({ class: 'fx-rocket' });
    const r = k.into(rocket);
    r.path('M520 124 q20 22 20 58 v26 h-40 v-26 q0-36 20-58z', { fill: ground, fillStyle: 'solid', seed: 13 });
    r.circle(520, 170, 16, { fill: ink, fillStyle: 'solid', seed: 14 });
    r.path('M500 190 l-14 22 h14z M540 190 l14 22 h-14z', { fill: ink, fillStyle: 'solid', seed: 15 });
    k.pen('M510 214 v10 M520 214 v14 M530 214 v10', { 'stroke-width': 2 }, rocket);
    // arrows and labels
    [140, 285, 430].forEach((x) => k.pen(`M${x + 4} 170 q16-14 30 0 m-8-8 l8 8 -10 4`, { 'stroke-width': 2.2 }));
    ['sketch', 'design', 'code', 'launch'].forEach((word, i) => k.hand(frames[i] + 55, 268, word, { 'text-anchor': 'middle', 'font-size': 30 }));
    sk.line(40, 320, 560, 320, { strokeWidth: 2, seed: 20 });
    frames.forEach((x, i) => k.el('circle', { cx: x + 55, cy: 320, r: 7, fill: i === 3 ? ink : ground, stroke: ink, 'stroke-width': 2.4 }));
  },

  jar: (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    const jarPath = 'M232 132 h136 v18 q32 10 32 52 v148 q0 26 -26 26 h-148 q-26 0 -26 -26 v-148 q0-42 32-52 z';
    const id = `jar-clip-${(clipCount += 1)}`;
    const defs = k.el('defs');
    k.el('path', { d: jarPath }, k.el('clipPath', { id }, defs));
    const inside = k.group({ 'clip-path': `url(#${id})` });
    const fill = k.group({ class: 'fx-fill' }, inside);
    k.el('rect', { x: 190, y: 222, width: 220, height: 170, fill: dots, opacity: 0.8 }, fill);
    for (let row = 0; row < 3; row++) {
      for (let c = 0; c < 6; c++) {
        k.el('ellipse', { cx: 222 + c * 32 + (row % 2) * 16, cy: 230 + row * 22, rx: 17, ry: 7, fill: ground, stroke: ink, 'stroke-width': 2 }, fill);
      }
    }
    sk.path(jarPath, { strokeWidth: 3.2, seed: 3 });
    sk.rect(222, 104, 156, 30, { fill: hatch, fillStyle: 'solid', strokeWidth: 2.6, seed: 4 });
    sk.rect(250, 290, 100, 50, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 5 });
    k.dot(300, 324, '$15K', { 'text-anchor': 'middle', 'font-size': 26, fill: ground });
    // coins still falling in
    const coins = k.group({ class: 'fx-coins' });
    [[288, 40], [330, 70], [262, 84]].forEach(([x, y], i) => {
      const g = k.group({ class: 'fx-coin' }, coins);
      k.el('circle', { cx: x, cy: y, r: 15, fill: ink }, g);
      k.el('circle', { cx: x, cy: y, r: 9, fill: 'none', stroke: ground, 'stroke-width': 2 }, g);
      k.pen(`M${x - 26} ${y - 14 + i * 2} l-8-8 M${x + 26} ${y - 12} l8-8`, { 'stroke-width': 1.6 });
    });
  },
};
