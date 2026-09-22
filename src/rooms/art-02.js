// Room 02 · Chennai is where the story starts. Illustrations for each beat, drawn at 600 × 420.
// Elements with fx-* classes are the parts the 4D effects animate.

export const ART = {
  // Marina Beach: the sun coming up out of the Bay of Bengal, the lighthouse, the sound of the water, and the bike.
  marina: (k) => {
    const { sk, ink, ground, hatch, dots, muted } = k;
    sk.circle(300, 204, 116, { fill: hatch, fillStyle: 'solid', strokeWidth: 2, seed: 2 });
    k.pen('M176 74 q8 -8 16 0 q8 -8 16 0', { 'stroke-width': 1.8 });
    k.pen('M216 100 q6 -6 12 0 q6 -6 12 0', { 'stroke-width': 1.6 });

    // the sea, with rows of crests rolling in
    sk.rect(-10, 204, 620, 62, { fill: ground, fillStyle: 'solid', stroke: 'none', seed: 3 });
    sk.line(-10, 204, 610, 204, { strokeWidth: 2.2 });
    const waves = k.group({ class: 'fx-waves' });
    [[218, 0, 30], [234, 18, 36], [252, 6, 44]].forEach(([y, offset, step], row) => {
      let d = '';
      for (let x = -40 + offset; x < 640; x += step + 16) d += `M${x} ${y} q${step / 4} ${-5 - row} ${step / 2} 0 `;
      k.pen(d, { 'stroke-width': 1.7 + row * 0.2, opacity: 0.7 + row * 0.1, class: 'fx-wave' }, waves);
    });

    // the sand, a line of foam where the water runs up it, and footprints
    sk.path('M-10 268 Q150 256 300 266 Q450 276 610 262 V430 H-10 Z', { fill: ground, fillStyle: 'solid', seed: 5 });
    let foam = 'M-10 268';
    for (let x = -10; x < 610; x += 24) foam += ` q12 ${x % 48 ? 7 : 5} 24 ${x % 48 ? -1 : 1}`;
    k.pen(foam, { 'stroke-width': 1.8, class: 'fx-foam' });
    for (let i = 0; i < 70; i += 1) k.el('circle', { cx: (k.rnd() * 600).toFixed(1), cy: (290 + k.rnd() * 124).toFixed(1), r: 1.1, fill: muted });
    [[118, 404], [138, 380], [150, 354], [170, 332], [180, 306]].forEach(([x, y], i) => {
      k.el('ellipse', { cx: x + (i % 2 ? 7 : -7), cy: y, rx: 4, ry: 7, fill: ink, opacity: 0.45, transform: `rotate(-24 ${x} ${y})` });
    });

    // the lighthouse on the Marina, banded, with its lamp lit
    const edge = (y) => ((300 - y) / 214) * 12;
    sk.path('M58 300 L70 86 H100 L112 300 Z', { fill: ground, fillStyle: 'solid', seed: 11 });
    [[128, 150], [196, 218], [262, 284]].forEach(([a, b], i) => {
      sk.poly([[58 + edge(a), a], [112 - edge(a), a], [112 - edge(b), b], [58 + edge(b), b]], { fill: ink, fillStyle: 'solid', seed: 12 + i });
    });
    sk.rect(62, 78, 46, 8, { fill: ink, fillStyle: 'solid', seed: 16 });
    sk.rect(72, 54, 26, 24, { fill: ground, fillStyle: 'solid', seed: 17 });
    sk.path('M70 54 Q85 34 100 54 Z', { fill: ink, fillStyle: 'solid', seed: 18 });
    k.pen('M102 60 L176 40 M102 70 L182 94', { 'stroke-width': 1.6, 'stroke-dasharray': '6 6', opacity: 0.7 });

    // the Gixxer SF 150, parked on the sand, facing the lighthouse
    k.el('ellipse', { cx: 414, cy: 402, rx: 152, ry: 9, fill: dots, opacity: 0.55 });
    const bike = k.group({ class: 'fx-bike' });
    const b = k.into(bike);
    b.path('M452 262 L500 256 L560 236 L568 246 L520 272 L468 284 Z', { fill: ink, fillStyle: 'solid', seed: 60 });
    b.rect(556, 238, 9, 6, { fill: ground, fillStyle: 'solid', seed: 61 });
    b.path('M372 264 Q384 238 414 236 Q444 236 456 264 Z', { fill: ink, fillStyle: 'solid', seed: 62 });
    b.rect(392, 318, 64, 38, { fill: hatch, fillStyle: 'solid', seed: 63 });
    for (let x = 400; x < 452; x += 9) k.pen(`M${x} 323 V351`, { 'stroke-width': 1.4 }, bike);
    b.path('M444 356 L480 350 L534 328 L542 340 L488 364 L446 366 Z', { fill: dots, fillStyle: 'solid', seed: 64 });
    b.path('M456 344 L506 352 L504 362 L456 356 Z', { fill: ink, fillStyle: 'solid', seed: 65 });
    b.path('M286 298 L302 270 L346 258 L378 264 L458 266 L474 298 L448 336 L372 338 Q322 328 286 298 Z', { fill: ink, fillStyle: 'solid', seed: 66 });
    b.path('M302 270 L318 244 L346 250 L346 258 Z', { fill: dots, fillStyle: 'solid', seed: 67 });
    b.path('M286 298 L296 280 L312 284 L304 300 Z', { fill: ground, fillStyle: 'solid', seed: 68 });
    k.dot(334, 314, 'GIXXER SF', { 'font-size': 15, fill: ground }, bike);
    k.pen('M352 256 L368 250 M346 252 L338 238', { 'stroke-width': 3 }, bike);
    b.circle(336, 233, 12, { fill: ink, fillStyle: 'solid', seed: 69 });
    k.pen('M312 302 L320 356 M322 300 L330 354', { 'stroke-width': 3.2 }, bike);
    [[322, 358], [506, 358]].forEach(([cx, cy], i) => {
      b.circle(cx, cy, 82, { fill: ink, fillStyle: 'solid', seed: 70 + i });
      b.circle(cx, cy, 52, { fill: ground, fillStyle: 'solid', seed: 72 + i });
      for (let spoke = 0; spoke < 5; spoke += 1) {
        const a = (spoke / 5) * Math.PI * 2 - Math.PI / 2;
        k.pen(`M${cx} ${cy} L${(cx + Math.cos(a) * 24).toFixed(1)} ${(cy + Math.sin(a) * 24).toFixed(1)}`, { 'stroke-width': 3 }, bike);
      }
      b.circle(cx, cy, 12, { fill: ink, fillStyle: 'solid', seed: 74 + i });
    });
    b.path('M294 334 Q322 308 350 334', { strokeWidth: 3, seed: 76 });
    k.pen('M436 358 L420 394', { 'stroke-width': 3 }, bike);

    // a note in the margin, with the plate
    k.hand(484, 50, 'my Gixxer SF 150', { 'text-anchor': 'middle', 'font-size': 28 });
    sk.rect(412, 62, 144, 36, { fill: ground, fillStyle: 'solid', strokeWidth: 2.2, seed: 77 });
    k.mono(484, 86, 'TN 02 BD 6**6', { 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700 });
    k.pen('M470 104 Q500 168 444 226', { 'stroke-width': 2, 'stroke-dasharray': '5 5' });
    k.pen('M444 226 l4 -13 M444 226 l13 -4', { 'stroke-width': 2 });
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
