// Room 08 · Buffalo. Illustrations for each beat, drawn at 600 × 420.

let clipCount = 0;
const clipTo = (k, d) => {
  const id = `buffalo-clip-${(clipCount += 1)}`;
  k.el('path', { d }, k.el('clipPath', { id }, k.el('defs')));
  return `url(#${id})`;
};

export const ART = {
  'snow-window': (k) => {
    const { sk, ink, ground, hatch, dots, rnd } = k;
    const view = k.group({ 'clip-path': clipTo(k, 'M126 56 H474 V316 H126 Z') });
    k.el('rect', { x: 120, y: 50, width: 360, height: 270, fill: dots, opacity: 0.16 }, view);
    [[150, 230, 90], [262, 214, 100], [382, 236, 96]].forEach(([x, y, w], i) => {
      const g = k.into(view);
      g.rect(x, y, w, 110, { fill: hatch, fillStyle: 'solid', seed: 10 + i });
      g.poly([[x - 10, y], [x + w / 2, y - 44], [x + w + 10, y]], { fill: ground, fillStyle: 'solid', seed: 20 + i });
      g.rect(x + w / 2 - 12, y + 30, 24, 28, { fill: ground, fillStyle: 'solid', seed: 30 + i });
    });
    k.pen('M468 320 V150 M468 210 l-30-30 M468 180 l24-26 M438 180 l-10-18', { 'stroke-width': 2.4 }, view);
    const flakes = k.group({ class: 'fx-flakes' }, view);
    for (let i = 0; i < 46; i++) {
      k.el('circle', { cx: (130 + rnd() * 340).toFixed(1), cy: (60 + rnd() * 250).toFixed(1), r: (1.5 + rnd() * 2.5).toFixed(1), fill: ink, opacity: 0.75 }, flakes);
    }
    k.el('path', { d: 'M126 316 V300 q30-18 60-6 q40-20 80-2 q50-16 90 0 q40-14 64-2 q30-8 54 4 V316z', fill: ground, stroke: ink, 'stroke-width': 2 }, view);
    sk.rect(110, 40, 380, 290, { strokeWidth: 3.4, seed: 3 });
    sk.rect(126, 56, 348, 260, { strokeWidth: 2, seed: 4 });
    sk.line(300, 56, 300, 316, { strokeWidth: 3, seed: 5 });
    sk.line(126, 186, 474, 186, { strokeWidth: 3, seed: 6 });
    sk.rect(90, 316, 420, 24, { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 7 });
    sk.rect(170, 356, 260, 64, { fill: ground, fillStyle: 'solid', strokeWidth: 2.4, seed: 8 });
    for (let x = 190; x < 420; x += 20) k.pen(`M${x} 364 V412`, { 'stroke-width': 1.6 });
    sk.path('M404 316 v-30 h36 v30', { fill: ground, fillStyle: 'solid', seed: 9 });
    k.pen('M414 278 q-8-12 0-22 M428 278 q-8-12 0-22', { 'stroke-width': 1.8, class: 'fx-wisp' });
  },

  lecture: (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    sk.rect(70, 30, 460, 200, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 3 });
    const layers = [[150, [80, 130, 180]], [260, [60, 105, 150, 195]], [370, [95, 165]]];
    layers.forEach(([x, ys], li) => {
      const next = layers[li + 1];
      if (next) ys.forEach((y) => next[1].forEach((ny) => k.pen(`M${x} ${y} L${next[0]} ${ny}`, { stroke: ground, 'stroke-width': 1, opacity: 0.6 })));
    });
    layers.forEach(([x, ys]) => ys.forEach((y) => k.el('circle', { cx: x, cy: y, r: 12, fill: ink, stroke: ground, 'stroke-width': 2.4 })));
    k.hand(418, 104, 'loss', { fill: ground, 'font-size': 30 });
    k.pen('M420 126 q18 50 50 60 q30 4 50-6', { stroke: ground, 'stroke-width': 2.4 });
    k.mono(84, 218, 'M.S. ARTIFICIAL INTELLIGENCE', { fill: ground, 'font-size': 10, 'font-weight': 700 });
    k.el('path', { d: 'M556 72 a20 20 0 1 0 24 -26 a15 15 0 1 1 -24 26z', fill: ink });
    [[276, 12, 0], [336, 10, 1]].forEach(([y, n, row]) => {
      k.pen(`M20 ${y + 44} Q300 ${y + 10} 580 ${y + 44}`, { 'stroke-width': 2.4 });
      for (let i = 0; i < n; i++) {
        const x = 50 + i * (500 / (n - 1));
        const yy = y + 36 - Math.sin((i / (n - 1)) * Math.PI) * 16 - 22;
        k.el('circle', { cx: x.toFixed(1), cy: yy.toFixed(1), r: 14 + row * 4, fill: row ? hatch : dots, stroke: ink, 'stroke-width': 2 });
      }
    });
  },

  terminal: (k) => {
    const { sk, ink, ground, muted } = k;
    sk.rect(46, 40, 508, 290, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 3 });
    [70, 90, 110].forEach((x) => k.el('circle', { cx: x, cy: 62, r: 6, fill: 'none', stroke: ground, 'stroke-width': 2 }));
    k.mono(300, 67, 'terminal', { 'text-anchor': 'middle', 'font-size': 11, fill: ground, opacity: 0.7 });
    [['$ pip install snapinfra', 1], ['Collecting snapinfra', 0.6], ['Successfully installed snapinfra', 0.6], ['$ snapinfra', 1]].forEach(([t, o], i) => {
      k.mono(76, 118 + i * 34, t, { 'font-size': 20, fill: ground, opacity: o, 'letter-spacing': 0, class: 'fx-type' });
    });
    k.el('rect', { x: 214, y: 204, width: 12, height: 20, fill: ground, class: 'fx-cursor' });
    const badge = k.group({ class: 'fx-badge', transform: 'rotate(-5 450 350)' });
    k.into(badge).rect(340, 312, 220, 72, { fill: ground, fillStyle: 'solid', strokeWidth: 3, seed: 5 });
    k.dot(450, 352, '5,000+', { 'text-anchor': 'middle', 'font-size': 30 }, badge);
    k.mono(450, 373, 'DOWNLOADS ON PYPI', { 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700 }, badge);
    k.mono(56, 380, 'OPEN SOURCE · APACHE 2.0', { 'font-size': 11, fill: muted });
  },

  contracts: (k) => {
    const { sk, ink, ground, hatch, muted } = k;
    for (let i = 5; i >= 0; i--) {
      const x = 44 + i * 10;
      const y = 70 + i * 14;
      sk.rect(x, y, 170, 220, { fill: ground, fillStyle: 'solid', strokeWidth: 2, seed: 10 + i });
      if (i === 0) {
        k.mono(x + 16, y + 30, 'CONTRACT', { 'font-size': 12, 'font-weight': 700 });
        for (let r = 0; r < 6; r++) k.pen(k.scribble(x + 16, y + 56 + r * 24, 130, 1.2), { 'stroke-width': 1.5 });
      }
    }
    sk.circle(156, 170, 74, { strokeWidth: 3.2, seed: 30 });
    sk.line(182, 196, 218, 232, { strokeWidth: 6, seed: 31 });
    k.mono(44, 396, '1,000+ CONTRACTS · 200,000+ POS', { 'font-size': 11, fill: muted });
    k.pen('M286 196 q24-16 46 0 m-12-10 l12 10 -14 6', { 'stroke-width': 2.6 });
    sk.rect(344, 50, 216, 260, { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 32 });
    k.mono(362, 80, 'ANSWER', { 'font-size': 12, 'font-weight': 700 });
    [108, 132, 156].forEach((y) => k.pen(k.scribble(362, y, 170, 1.2), { 'stroke-width': 1.6 }));
    ['[1]', '[2]'].forEach((t, i) => {
      sk.rect(362 + i * 50, 176, 42, 26, { fill: ground, fillStyle: 'solid', strokeWidth: 1.8, seed: 40 + i });
      k.mono(383 + i * 50, 194, t, { 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700 });
    });
    const flag = k.group({ class: 'fx-flag' });
    k.into(flag).poly([[366, 290], [402, 228], [438, 290]], { fill: ink, fillStyle: 'solid', stroke: ink, seed: 50 });
    k.dot(402, 284, '!', { 'text-anchor': 'middle', 'font-size': 30, fill: ground }, flag);
    k.mono(452, 270, 'CONFLICT', { 'font-size': 10, 'font-weight': 700 });
    k.pen(k.scribble(452, 290, 90, 1), { 'stroke-width': 1.4 });
    k.dot(452, 356, '90%+', { 'text-anchor': 'middle', 'font-size': 30 });
    k.mono(452, 376, 'EXTRACTION ACCURACY', { 'text-anchor': 'middle', 'font-size': 9.5, fill: muted });
  },

  mirror: (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    const glass = k.group({ 'clip-path': clipTo(k, 'M176 58 h108 q48 0 48 48 v220 q0 20 -20 20 h-164 q-20 0-20-20 v-220 q0-48 48-48z') });
    k.el('rect', { x: 110, y: 40, width: 240, height: 320, fill: dots, opacity: 0.12 }, glass);
    k.pen('M150 124 l60-60 M160 176 l110-110', { 'stroke-width': 2, opacity: 0.35 }, glass);
    const who = k.into(glass);
    who.path('M166 350 q0-124 64-124 q64 0 64 124z', { fill: hatch, fillStyle: 'solid', seed: 5 });
    who.path('M212 228 l18 32 18-32', { strokeWidth: 2.4, seed: 6 });
    who.circle(230, 180, 62, { fill: ground, fillStyle: 'solid', seed: 7 });
    k.el('path', { d: 'M197 176 q-6-42 33-44 q41 0 35 42 q-10-18-31-17 q-21-4-37 19z', fill: ink }, glass);
    sk.path('M170 40 h120 q60 0 60 60 v230 q0 30 -30 30 h-180 q-30 0-30-30 v-230 q0-60 60-60z', { strokeWidth: 4, seed: 8 });
    sk.line(150, 360, 128, 410, { strokeWidth: 3, seed: 9 });
    sk.line(310, 360, 332, 410, { strokeWidth: 3, seed: 10 });
    sk.line(384, 96, 574, 96, { strokeWidth: 3, seed: 11 });
    sk.line(394, 96, 388, 404, { strokeWidth: 2.4, seed: 12 });
    sk.line(564, 96, 570, 404, { strokeWidth: 2.4, seed: 13 });
    [[422, ground, ''], [480, dots, 'fx-hanger'], [538, hatch, '']].forEach(([x, fill, cls], i) => {
      const g = k.group({ class: cls });
      k.pen(`M${x} 96 v12 m-22 14 q22-14 44 0`, { 'stroke-width': 2 }, g);
      k.into(g).path(`M${x - 22} 128 l-14 20 12 9 6-7 v68 h36 v-68 l6 7 12-9 -14-20 q-9 7-22 7 q-13 0-22-7z`, { fill, fillStyle: 'solid', seed: 20 + i });
    });
    k.mono(480, 270, 'TRY-ON · SDXL', { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700 });
    [[118, 70], [370, 160], [336, 58]].forEach(([x, y]) => k.pen(`M${x - 8} ${y} h16 M${x} ${y - 8} v16`, { 'stroke-width': 2, class: 'fx-sparkle' }));
  },

  graduation: (k) => {
    const { sk, ink, ground, hatch, dots, rnd } = k;
    sk.poly([[40, 212], [300, 150], [560, 212]], { fill: hatch, fillStyle: 'solid', strokeWidth: 2.6, seed: 4 });
    sk.rect(60, 212, 480, 150, { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 3 });
    sk.line(60, 238, 540, 238, { strokeWidth: 2, seed: 5 });
    k.mono(300, 231, 'M.S. IN AI · JAN 2026', { 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700 });
    for (let i = 0; i < 7; i++) sk.rect(96 + i * 64, 246, 22, 116, { fill: ground, fillStyle: 'solid', strokeWidth: 2, seed: 10 + i });
    k.el('path', { d: 'M0 420 V360 q60-18 120-4 q80-16 160 2 q90-18 170 0 q80-14 150 2 V420z', fill: ground, stroke: ink, 'stroke-width': 2.4 });
    const cap = k.group({ class: 'fx-cap' });
    const c = k.into(cap);
    c.path('M268 98 v22 q32 16 64 0 v-22', { fill: dots, fillStyle: 'solid', seed: 20 });
    c.poly([[236, 84], [300, 56], [364, 84], [300, 112]], { fill: ink, fillStyle: 'solid', stroke: ink, seed: 21 });
    k.pen('M300 84 q46 6 50 48', { 'stroke-width': 2 }, cap);
    k.el('rect', { x: 344, y: 130, width: 12, height: 20, fill: ink }, cap);
    const flakes = k.group({ class: 'fx-flakes' });
    for (let i = 0; i < 40; i++) {
      k.el('circle', { cx: (rnd() * 600).toFixed(1), cy: (rnd() * 340).toFixed(1), r: (1.5 + rnd() * 2).toFixed(1), fill: ink, opacity: 0.6 }, flakes);
    }
  },
};
