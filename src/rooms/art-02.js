// Room 02 · Chennai is where my story starts. Illustrations for each beat, drawn at 600 × 420.
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

    // The Gixxer SF 155, parked on the sand facing the lighthouse, in its Suzuki blue: the full fairing and windscreen,
    // the split seat and the tail, lime pinstripes, SUZUKI across the side the way the livery splits it, and the red S.
    // Drawn in a real photo's proportions, then scaled down onto the sand.
    k.el('ellipse', { cx: 420, cy: 402, rx: 158, ry: 9, fill: dots, opacity: 0.55 });
    const bike = k.group({ class: 'fx-bike' });
    const body = k.group({ transform: 'translate(322 358) scale(0.453) translate(-137 -300)' }, bike);
    const b = k.into(body);
    const BLUE = '#1E56C8';
    const DEEP = '#16409B';
    const LIME = '#D6E43C';
    const BLACK = '#15161A';
    const RED = '#E0262B';
    const WHITE = '#F4F6FA';
    const solid = (fill, seed, o = {}) => ({ fill, fillStyle: 'solid', strokeWidth: 4.4, roughness: 1.1, bowing: 0.7, seed, ...o });
    const wheel = (cx, cy, seed, disc) => {
      b.circle(cx, cy, 170, solid(BLACK, seed));
      b.circle(cx, cy, 118, solid(ground, seed + 1, { stroke: 'none' }));
      if (disc) b.circle(cx, cy, 92, solid('#8E959F', seed + 2, { strokeWidth: 3 }));
      for (let i = 0; i < 5; i += 1) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const d = `M${cx} ${cy} L${(cx + Math.cos(a - 0.12) * 60).toFixed(1)} ${(cy + Math.sin(a - 0.12) * 60).toFixed(1)} M${cx} ${cy} L${(cx + Math.cos(a + 0.12) * 60).toFixed(1)} ${(cy + Math.sin(a + 0.12) * 60).toFixed(1)}`;
        k.pen(d, { 'stroke-width': 12 }, body);
        k.pen(d, { stroke: BLACK, 'stroke-width': 7 }, body);
      }
      b.circle(cx, cy, 124, { stroke: LIME, strokeWidth: 5, roughness: 0.5, seed: seed + 3 });
      b.circle(cx, cy, 26, solid(BLACK, seed + 4));
    };

    b.path('M586 126 L604 122 L652 258 L636 268 Z', solid(BLACK, 60));
    b.path('M626 204 L652 198 L664 262 L640 268 Z', solid(BLACK, 61));
    wheel(543, 300, 62, false);
    b.path('M418 246 L548 290 L540 314 L412 272 Z', solid(BLACK, 67));
    b.path('M296 246 L372 236 L394 300 L362 338 L290 330 Z', solid(BLACK, 68));
    b.path('M352 150 L400 148 L446 252 L420 262 Z', solid(BLACK, 69));
    b.path('M402 282 L456 270 L460 284 L406 296 Z', solid('#A7ADB6', 70, { strokeWidth: 3 }));
    b.path('M440 150 L520 118 L606 102 L616 114 L596 126 L520 160 L470 172 Z', solid(BLUE, 71));
    b.path('M596 104 L614 106 L612 120 L594 124 Z', solid(RED, 72, { strokeWidth: 3 }));
    b.path('M354 118 Q400 104 452 106 L472 98 Q520 92 562 96 L590 108 L560 118 Q506 118 470 130 L448 142 L366 148 Z', solid(BLACK, 73));
    b.path('M244 118 Q290 78 332 84 Q358 90 372 120 L378 176 L318 196 L262 188 Z', solid(BLUE, 74));
    b.path('M98 176 L112 150 Q160 118 214 106 L252 114 L266 188 L322 198 L382 178 L392 212 L352 262 L340 340 Q300 354 250 342 L214 300 L186 262 L148 228 L106 206 Z', solid(BLUE, 75));
    b.path('M218 304 L252 342 Q300 354 340 340 L346 296 Z', solid(DEEP, 76, { stroke: 'none' }));
    wheel(137, 300, 77, true);
    b.path('M166 212 L184 206 L146 302 L128 296 Z', solid(BLACK, 82));
    b.path('M78 262 Q110 212 178 236 L192 252 Q128 234 94 270 Z', solid(BLUE, 83));
    b.path('M118 150 Q140 90 176 54 Q198 70 214 106 Q170 114 118 150 Z', solid('rgba(196, 214, 238, .62)', 84, { strokeWidth: 3.4 }));
    b.path('M100 172 L134 158 L140 170 L106 190 Z', solid('#E8ECF2', 85, { strokeWidth: 3 }));
    b.path('M74 58 L112 52 L118 76 L84 84 Z', solid(BLACK, 86));
    k.pen('M112 72 L142 112', { stroke: BLACK, 'stroke-width': 6 }, body);
    b.path('M196 94 L258 110 L254 124 L192 108 Z', solid(BLACK, 87));
    [['M104 196 Q150 186 198 188'], ['M214 208 Q292 188 378 160'], ['M500 146 Q556 128 606 118']].forEach(([d]) => k.pen(d, { stroke: LIME, 'stroke-width': 5 }, body));
    k.display(192, 266, 'SU', { fill: WHITE, 'font-size': 60, 'font-style': 'italic' }, body);
    k.display(300, 186, 'KI', { fill: WHITE, 'font-size': 54, 'font-style': 'italic' }, body);
    k.display(262, 162, 'S', { fill: RED, 'font-size': 30, 'font-style': 'italic' }, body);
    k.display(258, 336, 'SUZUKI', { fill: WHITE, 'font-size': 15, 'font-style': 'italic' }, body);
    k.text(196, 212, 'GIXXER', { fill: WHITE, 'font-size': 13, 'font-weight': 700 }, body);
    // The side stand, on its own so it can swing: up while the bike rolls in, down once it's parked (fx-motion.js).
    k.pen('M350 330 L364 402 M358 402 L376 400', { 'stroke-width': 6 }, k.group({ class: 'fx-stand' }, body));

    // a note in the margin, with the plate
    k.hand(484, 50, 'my Gixxer SF 155', { 'text-anchor': 'middle', 'font-size': 28 });
    sk.rect(396, 62, 176, 36, { fill: ground, fillStyle: 'solid', strokeWidth: 2.2, seed: 77 });
    k.mono(484, 86, 'TN 02 BD 6**6', { 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700 });
    k.pen('M470 104 Q500 168 434 238', { 'stroke-width': 2, 'stroke-dasharray': '5 5' });
    k.pen('M434 238 l4 -13 M434 238 l13 -4', { 'stroke-width': 2 });
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
