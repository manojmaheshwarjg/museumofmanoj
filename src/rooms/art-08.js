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
