// Room 02 · Chennai, where it began. Illustrations for each beat, drawn at 600 × 420.
// Elements with fx-* classes are the parts the 4D effects animate.

export const ART = {
  'chennai-street': (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    // power lines and a pole
    k.pen('M-10 116 Q260 150 560 94', { 'stroke-width': 1.4, opacity: 0.6 });
    k.pen('M-10 132 Q270 168 560 110', { 'stroke-width': 1.4, opacity: 0.6 });
    sk.line(556, 78, 556, 332, { strokeWidth: 3 });
    sk.line(538, 94, 574, 94, { strokeWidth: 2 });
    sk.circle(452, 120, 84, { fill: hatch, fillStyle: 'solid', strokeWidth: 2 });

    // a temple gopuram, tier on tier
    [[250, 82, 110], [216, 34, 92], [186, 30, 74], [160, 26, 56], [138, 22, 38]].forEach(([y, h, w], i) => {
      sk.rect(140 - w / 2, y, w, h, { fill: i % 2 ? dots : ground, fillStyle: 'solid', seed: 10 + i });
    });
    sk.circle(140, 128, 14, { fill: ink, fillStyle: 'solid' });
    sk.path('M126 332 v-26 q14-22 28 0 v26', { fill: ink, fillStyle: 'solid' });

    // a low building
    sk.rect(214, 226, 96, 106, { fill: ground, fillStyle: 'solid', seed: 21 });
    [[230, 246], [268, 246], [230, 282], [268, 282]].forEach(([x, y]) => sk.rect(x, y, 22, 22, { strokeWidth: 1.6 }));

    // the tea stall and its kettle
    sk.rect(368, 250, 112, 82, { fill: ground, fillStyle: 'solid', seed: 31 });
    sk.path('M356 250 L372 214 H476 L492 250 Z', { fill: hatch, fillStyle: 'solid', seed: 32 });
    for (let x = 356; x < 492; x += 17) k.pen(`M${x} 250 q8.5 12 17 0`, { 'stroke-width': 1.8 });
    k.mono(424, 300, 'TEA', { 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700 });
    sk.path('M398 250 q0-22 18-22 q18 0 18 22 z', { fill: ink, fillStyle: 'solid' });
    sk.line(434, 238, 448, 228, { strokeWidth: 3 });
    const steam = k.group({ class: 'fx-steam' });
    ['M408 222 q-10-14 0-26 q10-12 0-26', 'M420 220 q-10-16 0-30 q10-14 0-30', 'M432 222 q-8-12 0-24 q8-10 0-22'].forEach((d) => {
      k.pen(d, { 'stroke-width': 2, opacity: 0.75, class: 'fx-wisp' }, steam);
    });

    // the road
    sk.line(-10, 332, 610, 332, { strokeWidth: 2.6 });
    for (let x = 10; x < 600; x += 60) sk.line(x, 394, x + 30, 394, { strokeWidth: 2 });

    // an auto rickshaw, rattling past
    const auto = k.group({ class: 'fx-auto' });
    const a = k.into(auto);
    a.path('M186 354 V300 Q188 254 236 250 H292 Q322 254 326 300 V354 Z', { fill: dots, fillStyle: 'solid', seed: 41 });
    a.rect(198, 298, 44, 46, { fill: ground, fillStyle: 'solid', seed: 42 });
    a.path('M292 262 H314 Q320 280 320 300 H292 Z', { fill: ground, fillStyle: 'solid', seed: 43 });
    a.circle(214, 362, 32, { fill: ink, fillStyle: 'solid', seed: 44 });
    a.circle(306, 362, 32, { fill: ink, fillStyle: 'solid', seed: 45 });
    a.line(150, 326, 176, 326, { strokeWidth: 2 });
    a.line(138, 340, 172, 340, { strokeWidth: 2 });
  },

  notebook: (k) => {
    const { sk, ground, muted, hatch } = k;
    const book = k.group({ transform: 'rotate(-3 300 220)' });
    const b = k.into(book);
    b.rect(92, 70, 208, 290, { fill: ground, fillStyle: 'solid', seed: 3 });
    b.rect(300, 70, 208, 290, { fill: ground, fillStyle: 'solid', seed: 4 });
    for (let y = 104; y < 350; y += 24) {
      k.pen(`M110 ${y}H286`, { stroke: muted, 'stroke-width': 1 }, book);
      k.pen(`M314 ${y}H490`, { stroke: muted, 'stroke-width': 1 }, book);
    }
    for (let y = 86; y < 350; y += 22) b.circle(300, y, 9, { strokeWidth: 1.6 });
    const lines = k.group({ class: 'fx-write' }, book);
    [[120, 100, 150], [120, 124, 162], [120, 148, 124], [120, 172, 158], [120, 196, 140], [120, 220, 104], [120, 244, 150],
      [322, 100, 150], [322, 124, 132], [322, 148, 156], [322, 172, 92]].forEach(([x, y, w]) => {
      k.pen(k.scribble(x, y - 4, w, 2.2), { 'stroke-width': 2, class: 'fx-line' }, lines);
    });
    k.pen('M404 230 l10 22 24 2 -18 16 6 24 -22-12 -22 12 6-24 -18-16 24-2z', { 'stroke-width': 2 }, book);
    const pencil = k.group({ transform: 'rotate(-32 470 330)' });
    const p = k.into(pencil);
    p.rect(404, 318, 130, 22, { fill: hatch, fillStyle: 'solid', seed: 8 });
    p.poly([[404, 318], [404, 340], [380, 329]], { fill: ground, fillStyle: 'solid', seed: 9 });
  },

  circuit: (k) => {
    const { sk, ink, ground, muted, dots } = k;
    sk.rect(60, 70, 480, 290, { fill: ground, fillStyle: 'solid', seed: 5 });
    let holes = '';
    for (let x = 84; x < 520; x += 16) for (let y = 94; y < 340; y += 16) holes += `M${x} ${y}h2.4v2.4h-2.4z`;
    k.el('path', { d: holes, fill: muted, opacity: 0.45 });
    sk.rect(84, 180, 56, 110, { fill: dots, fillStyle: 'solid', seed: 6 });
    k.mono(112, 170, '+', { 'text-anchor': 'middle', 'font-size': 22 });
    [[220, 150], [360, 230]].forEach(([x, y], i) => {
      sk.rect(x, y, 90, 56, { fill: ink, fillStyle: 'solid', seed: 50 + i });
      for (let j = 0; j < 5; j++) {
        sk.line(x + 10 + j * 17, y - 12, x + 10 + j * 17, y, { strokeWidth: 2 });
        sk.line(x + 10 + j * 17, y + 56, x + 10 + j * 17, y + 68, { strokeWidth: 2 });
      }
    });
    const traces = k.group({ class: 'fx-traces' });
    ['M140 200 H180 V178 H220', 'M310 178 H340 V120 H440', 'M140 260 H200 V300 H360 V258', 'M450 258 H500 V336', 'M265 218 V250 H330']
      .forEach((d) => k.pen(d, { 'stroke-width': 3.2, class: 'fx-trace' }, traces));
    const leds = k.group({ class: 'fx-leds' });
    [[180, 178], [440, 120], [330, 250], [500, 336], [200, 300]].forEach(([x, y]) => {
      k.el('circle', { cx: x, cy: y, r: 9, fill: ground, stroke: ink, 'stroke-width': 2.6, class: 'fx-led' }, leds);
    });
    k.dot(300, 52, 'ANNA UNIVERSITY', { 'text-anchor': 'middle', 'font-size': 22 });
    k.mono(532, 390, 'ECE LAB · 2015 TO 2019', { 'text-anchor': 'end', 'font-size': 11, fill: muted });
  },

  'offer-letter': (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    const letter = k.group({ class: 'fx-letter' });
    k.into(letter).rect(206, 70, 188, 190, { fill: ground, fillStyle: 'solid', seed: 61 });
    k.dot(300, 114, 'OFFER', { 'text-anchor': 'middle', 'font-size': 32 }, letter);
    k.mono(300, 140, 'TEKNUANCE · CHENNAI', { 'text-anchor': 'middle', 'font-size': 11 }, letter);
    [164, 184, 204, 224].forEach((y, i) => k.pen(k.scribble(226, y, i === 3 ? 90 : 148, 1.6), { 'stroke-width': 1.6 }, letter));

    sk.rect(170, 190, 260, 170, { fill: ground, fillStyle: 'solid', seed: 62 });
    sk.path('M170 190 L300 286 L430 190', { strokeWidth: 2.4 });
    sk.path('M170 360 L268 270 M430 360 L332 270', { strokeWidth: 1.8 });
    sk.rect(380, 206, 34, 40, { fill: hatch, fillStyle: 'solid', seed: 63 });

    const caps = k.group({ class: 'fx-caps' });
    [[96, 110, -18], [512, 92, 14], [522, 270, -8]].forEach(([x, y, r], i) => {
      const cap = k.group({ class: 'fx-cap', transform: `rotate(${r} ${x} ${y})` }, caps);
      const c = k.into(cap);
      c.path(`M${x - 22} ${y + 6} v18 q22 12 44 0 v-18`, { fill: dots, fillStyle: 'solid', seed: 80 + i });
      c.poly([[x - 44, y], [x, y - 18], [x + 44, y], [x, y + 18]], { fill: ink, fillStyle: 'solid', seed: 70 + i });
      c.path(`M${x} ${y} q30 4 34 30`, { strokeWidth: 1.8 });
    });
  },
};
