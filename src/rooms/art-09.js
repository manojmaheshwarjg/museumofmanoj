// Room 09 · New York. Illustrations for each beat, drawn at 600 × 420.

export const ART = {
  'skyline-suitcase': (k) => {
    const { sk, ink, ground, hatch, rnd } = k;
    k.el('path', { d: 'M514 64 a26 26 0 1 0 30 -32 a20 20 0 1 1 -30 32z', fill: ink });
    k.pen('M341 92 V22', { 'stroke-width': 2.4 });
    [[20, 190, 60], [84, 150, 48], [136, 210, 70], [210, 120, 40], [254, 170, 58], [318, 92, 46], [368, 180, 64], [436, 140, 52], [492, 200, 90]].forEach(([x, top, w], i) => {
      sk.rect(x, top, w, 330 - top, { fill: ground, fillStyle: 'solid', strokeWidth: 2, seed: 10 + i });
      for (let y = top + 14; y < 320; y += 18) {
        for (let wx = x + 8; wx < x + w - 8; wx += 12) if (rnd() > 0.55) k.el('rect', { x: wx, y, width: 5, height: 8, fill: ink, opacity: 0.55 });
      }
    });
    sk.rect(330, 70, 22, 22, { fill: ground, fillStyle: 'solid', strokeWidth: 2, seed: 20 });
    sk.line(-10, 330, 610, 330, { strokeWidth: 2.6, seed: 21 });
    for (let i = 0; i < 14; i++) k.pen(`M${20 + i * 42 + (i % 2) * 12} ${344 + (i % 3) * 10} h${16 + (i % 4) * 6}`, { 'stroke-width': 1.6, opacity: 0.5 });
    sk.line(-10, 384, 610, 384, { strokeWidth: 2.6, seed: 22 });
    // the suitcase at the edge of it all
    sk.path('M112 296 v-14 q0-8 8-8 h34 q8 0 8 8 v14', { strokeWidth: 4, seed: 23 });
    sk.rect(88, 296, 98, 84, { fill: hatch, fillStyle: 'solid', strokeWidth: 3, seed: 24 });
    [[104, 386], [170, 386]].forEach(([x, y], i) => k.el('circle', { cx: x, cy: y, r: 7, fill: ink, key: i }));
    sk.line(540, 384, 540, 232, { strokeWidth: 3, seed: 25 });
    sk.path('M540 232 q0-16 20-16', { strokeWidth: 2.6, seed: 26 });
    k.el('rect', { x: 552, y: 214, width: 20, height: 10, fill: ink });
  },

  'prototype-tower': (k) => {
    const { sk, ink, ground, muted } = k;
    sk.line(-10, 396, 610, 396, { strokeWidth: 2.6, seed: 2 });
    k.dot(34, 70, '15+', { 'font-size': 44 });
    k.mono(34, 96, 'PROTOTYPES ON THE REAL STACK', { 'font-size': 10, fill: muted });
    const tower = k.group({ class: 'fx-floors' });
    for (let i = 0; i < 15; i++) {
      const w = 190 - (i % 3) * 14;
      const x = 300 - w / 2;
      const y = 374 - i * 22;
      const g = k.group({ class: 'fx-floor' }, tower);
      k.into(g).rect(x, y, w, 20, { fill: i % 4 === 0 ? ink : ground, fillStyle: 'solid', strokeWidth: 1.8, seed: 10 + i });
      if (i % 4) {
        k.el('rect', { x: x + 8, y: y + 6, width: 20, height: 8, fill: ink, opacity: 0.8 }, g);
        k.pen(`M${x + 36} ${y + 10} h${w - 56}`, { 'stroke-width': 1.6 }, g);
      }
    }
    // a crane still lifting the next one
    sk.line(470, 396, 470, 26, { strokeWidth: 3, seed: 40 });
    sk.line(330, 30, 580, 30, { strokeWidth: 3, seed: 41 });
    for (let y = 60; y < 390; y += 30) k.pen(`M462 ${y} l16 22 M478 ${y} l-16 22`, { 'stroke-width': 1.2, opacity: 0.6 });
    k.pen('M360 30 V52', { 'stroke-width': 1.8, class: 'fx-hook' });
    sk.rect(330, 52, 60, 16, { fill: ground, fillStyle: 'solid', strokeWidth: 1.8, seed: 42 });
  },

  'team-table': (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    sk.ellipse(300, 262, 500, 220, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 3 });
    sk.rect(226, 190, 148, 96, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 4 });
    sk.poly([[210, 302], [390, 302], [374, 286], [226, 286]], { fill: hatch, fillStyle: 'solid', seed: 5 });
    k.el('rect', { x: 238, y: 202, width: 40, height: 72, fill: ground });
    [214, 236, 258].forEach((y) => k.pen(`M290 ${y} h70`, { stroke: ground, 'stroke-width': 3 }));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      sk.circle(300 + Math.cos(a) * 270, 262 + Math.sin(a) * 128, 38, { fill: i % 2 ? dots : hatch, fillStyle: 'solid', strokeWidth: 2.2, seed: 20 + i });
    }
    const spec = k.group({ transform: 'rotate(-6 150 76)' });
    k.into(spec).rect(90, 40, 124, 72, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 40 });
    k.mono(152, 66, 'BUILD SPEC', { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: ground }, spec);
    k.pen('M126 86 l10 10 22-22', { stroke: ground, 'stroke-width': 3 }, spec);
    k.mono(424, 52, 'REWORK', { 'font-size': 11, 'font-weight': 700 });
    k.pen('M424 66 l40 18 30-2 44 38', { 'stroke-width': 3, class: 'fx-trend' });
    k.pen('M524 120 h16 v-16', { 'stroke-width': 3 });
  },

  checklist: (k) => {
    const { sk, ink, ground, hatch } = k;
    sk.rect(150, 40, 300, 360, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 3 });
    sk.rect(240, 22, 120, 40, { fill: hatch, fillStyle: 'solid', strokeWidth: 2.6, seed: 4 });
    k.mono(300, 102, 'BEFORE ANY SCREEN SHIPS', { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: ground });
    ['REGULATORY', 'COMPLIANCE', 'DATA HANDLING'].forEach((label, i) => {
      const y = 158 + i * 72;
      k.el('rect', { x: 180, y: y - 24, width: 34, height: 34, fill: 'none', stroke: ground, 'stroke-width': 3 });
      k.pen(`M185 ${y - 8} l10 12 22-28`, { stroke: ground, 'stroke-width': 4.5, class: 'fx-check' });
      k.dot(230, y + 4, label, { 'font-size': 22, fill: ground });
    });
    const capsule = k.group({ transform: 'rotate(-30 526 120)' });
    k.into(capsule).path('M496 104 h60 q16 0 16 16 q0 16 -16 16 h-60 q-16 0 -16 -16 q0 -16 16 -16z', { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 5 });
    k.into(capsule).path('M526 104 h30 q16 0 16 16 q0 16 -16 16 h-30z', { fill: hatch, fillStyle: 'solid', seed: 6 });
    sk.path('M30 250 q30-10 50-26 q20 16 50 26 q0 60-50 90 q-50-30-50-90z', { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 7 });
    k.pen('M62 282 l12 14 24-28', { 'stroke-width': 4 });
  },

  countdown: (k) => {
    const { sk, ink, ground, hatch, muted } = k;
    sk.rect(70, 26, 460, 156, { fill: ground, fillStyle: 'solid', strokeWidth: 3.2, seed: 3 });
    k.mono(300, 58, 'RHOHACK · 24 HOURS', { 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700 });
    k.dot(300, 146, '23:59:59', { 'text-anchor': 'middle', 'font-size': 72, class: 'fx-countdown' });
    sk.line(-10, 382, 610, 382, { strokeWidth: 2.4, seed: 4 });
    k.mono(150, 222, 'RHO DESK · VOICE AI', { 'font-size': 11, 'font-weight': 700, fill: muted });
    sk.rect(150, 232, 220, 128, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 5 });
    sk.poly([[130, 382], [390, 382], [370, 360], [150, 360]], { fill: hatch, fillStyle: 'solid', seed: 6 });
    const wave = k.group({ class: 'fx-wave' });
    for (let i = 0; i < 24; i++) {
      const h = 8 + Math.abs(Math.sin(i * 0.9)) * 38;
      k.el('rect', { x: 168 + i * 8, y: (296 - h / 2).toFixed(1), width: 4, height: h.toFixed(1), fill: ground, class: 'fx-bar' }, wave);
    }
    sk.rect(428, 250, 34, 60, { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 7 });
    k.pen('M418 290 q0 34 27 34 q27 0 27-34 M445 324 V362 M425 362 h40', { 'stroke-width': 2.6 });
    sk.poly([[490, 300], [580, 300], [574, 280], [484, 280]], { fill: hatch, fillStyle: 'solid', seed: 9 });
    sk.rect(490, 300, 90, 62, { fill: ground, fillStyle: 'solid', strokeWidth: 2.4, seed: 8 });
    k.mono(535, 337, 'FILM', { 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700 });
  },
};
