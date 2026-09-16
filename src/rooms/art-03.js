// Room 03 · Teknuance, the first job. Illustrations for each beat, drawn at 600 × 420.

export const ART = {
  'desk-badge': (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    sk.poly([[20, 300], [580, 300], [600, 420], [0, 420]], { fill: ground, fillStyle: 'solid', seed: 3 });
    // the monitor, mid-spec
    sk.rect(170, 70, 260, 170, { fill: ink, fillStyle: 'solid', seed: 4 });
    sk.rect(184, 84, 232, 142, { fill: ground, fillStyle: 'solid', seed: 5 });
    [[200, 110, 120], [200, 132, 170], [216, 154, 110], [216, 176, 150], [200, 198, 80]].forEach(([x, y, w], i) => {
      sk.line(x, y, x + w, y, { strokeWidth: 3, roughness: 0.6, seed: 10 + i });
    });
    sk.rect(282, 240, 36, 40, { fill: ink, fillStyle: 'solid', seed: 6 });
    sk.rect(236, 278, 128, 18, { fill: ink, fillStyle: 'solid', seed: 7 });
    sk.rect(392, 50, 62, 58, { fill: ground, fillStyle: 'solid', seed: 8 });
    k.hand(423, 88, 'day 1', { 'text-anchor': 'middle', 'font-size': 24 });
    // keyboard and mug
    sk.poly([[200, 318], [400, 318], [414, 356], [186, 356]], { fill: dots, fillStyle: 'solid', seed: 9 });
    sk.path('M470 290 h44 v52 q0 14 -14 14 h-16 q-14 0 -14 -14 z', { fill: ground, fillStyle: 'solid', seed: 11 });
    sk.path('M514 302 q20 4 0 30', { strokeWidth: 2.4 });
    // the badge slides across the desk
    const badge = k.group({ class: 'fx-badge', transform: 'rotate(-12 110 330)' });
    const b = k.into(badge);
    b.rect(52, 286, 116, 84, { fill: ground, fillStyle: 'solid', seed: 12 });
    b.rect(62, 298, 34, 40, { fill: hatch, fillStyle: 'solid', seed: 13 });
    k.mono(104, 314, 'ANALYST', { 'font-size': 11, 'font-weight': 700 }, badge);
    k.pen(k.scribble(104, 332, 52, 1.2), { 'stroke-width': 1.6 }, badge);
    k.pen('M110 286 Q120 240 180 232', { 'stroke-width': 2 }, badge);
  },

  team: (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    const person = (x, y, fill, i) => {
      sk.path(`M${x - 26} ${y + 52} q0-32 26-32 q26 0 26 32`, { fill, fillStyle: 'solid', seed: 40 + i });
      sk.circle(x, y, 34, { fill: ground, fillStyle: 'solid', seed: 20 + i });
    };
    [110, 173, 236, 300, 364, 427, 490].forEach((x, i) => person(x, 192 + Math.abs(3 - i) * 6, i % 2 ? dots : hatch, i));
    sk.circle(300, 126, 46, { strokeWidth: 1.8 });
    k.hand(300, 142, '?', { 'text-anchor': 'middle', 'font-size': 44 });
    sk.ellipse(300, 300, 470, 120, { fill: ground, fillStyle: 'solid', seed: 3 });
    [[190, 262], [300, 256], [410, 262]].forEach(([x, y], i) => {
      sk.poly([[x - 30, y + 18], [x + 30, y + 18], [x + 24, y], [x - 24, y]], { fill: ink, fillStyle: 'solid', seed: 60 + i });
    });
    // the rest of the team, seen from behind
    [150, 225, 300, 375, 450].forEach((x, i) => {
      sk.path(`M${x - 40} 422 q0-52 40-52 q40 0 40 52`, { fill: ink, fillStyle: 'solid', seed: 80 + i });
      sk.circle(x, 352, 44, { fill: hatch, fillStyle: 'solid', seed: 90 + i });
    });
  },

  'story-wall': (k) => {
    const { sk, ink, ground, hatch, dots, rnd } = k;
    k.el('rect', { x: 34, y: 30, width: 532, height: 360, fill: ground });
    k.el('rect', { x: 34, y: 30, width: 532, height: 360, fill: dots, opacity: 0.28 });
    sk.rect(34, 30, 532, 360, { strokeWidth: 3, seed: 4 });
    [70, 196, 322, 448].forEach((x, i) => {
      sk.rect(x, 46, 96, 60, { fill: ground, fillStyle: 'solid', seed: 10 + i });
      sk.circle(x + 22, 70, 24, { fill: hatch, fillStyle: 'solid', seed: 14 + i });
      k.mono(x + 42, 74, `PERSONA ${i + 1}`, { 'font-size': 8.5, 'font-weight': 700 });
      k.pen(k.scribble(x + 10, 96, 76, 1), { 'stroke-width': 1.4 });
      k.el('circle', { cx: x + 48, cy: 46, r: 4, fill: ink });
    });
    const wall = k.group({ class: 'fx-stickies' });
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        const x = 58 + c * 72 + (rnd() - 0.5) * 8;
        const y = 130 + r * 82 + (rnd() - 0.5) * 8;
        const g = k.group({ class: 'fx-sticky', transform: `rotate(${((rnd() - 0.5) * 10).toFixed(1)} ${(x + 28).toFixed(1)} ${(y + 27).toFixed(1)})` }, wall);
        const s = k.into(g);
        s.rect(x, y, 56, 54, { fill: ground, fillStyle: 'solid', roughness: 1, seed: 30 + r * 7 + c });
        k.pen(k.scribble(x + 8, y + 18, 38, 1), { 'stroke-width': 1.4 }, g);
        k.pen(k.scribble(x + 8, y + 32, 30, 1), { 'stroke-width': 1.4 }, g);
        if ((r + c) % 3 === 0) s.poly([[x + 40, y + 54], [x + 56, y + 38], [x + 56, y + 54]], { fill: hatch, fillStyle: 'solid', strokeWidth: 1 });
      }
    }
  },

  kanban: (k) => {
    const { sk, ink, ground } = k;
    k.el('rect', { x: 30, y: 30, width: 540, height: 360, fill: ground });
    sk.rect(30, 30, 540, 360, { strokeWidth: 3, seed: 3 });
    [210, 390].forEach((x, i) => sk.line(x, 44, x, 376, { strokeWidth: 1.8, seed: 4 + i }));
    [['TO DO', 120], ['BUILD', 300], ['SHIPPED', 480]].forEach(([t, x]) => k.mono(x, 64, t, { 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700 }));
    sk.line(44, 78, 556, 78, { strokeWidth: 1.6 });
    // eight products start in to do and build; the effect walks them into shipped
    const cards = k.group({ class: 'fx-kanban' });
    for (let i = 0; i < 8; i++) {
      const col = i < 5 ? 0 : 1;
      const row = col ? i - 5 : i;
      const x = 48 + col * 180;
      const y = 92 + row * 40;
      const g = k.group({ class: 'fx-card', 'data-dx': 408 - x, 'data-dy': 92 + i * 34 - y }, cards);
      const s = k.into(g);
      s.rect(x, y, 144, 30, { fill: ground, fillStyle: 'solid', seed: 20 + i });
      s.rect(x, y, 10, 30, { fill: ink, fillStyle: 'solid', seed: 40 + i });
      k.mono(x + 18, y + 20, `0${i + 1}`, { 'font-size': 12, 'font-weight': 700 }, g);
      k.pen(k.scribble(x + 48, y + 15, 84, 1), { 'stroke-width': 1.6 }, g);
    }
    const stamp = k.group({ class: 'fx-stamp', transform: 'rotate(-8 120 332)' });
    k.into(stamp).rect(52, 304, 136, 54, { strokeWidth: 3, seed: 50 });
    k.dot(120, 334, '85%', { 'text-anchor': 'middle', 'font-size': 26 }, stamp);
    k.mono(120, 350, 'ON MVP TIMELINES', { 'text-anchor': 'middle', 'font-size': 8.5 }, stamp);
  },

  meter: (k) => {
    const { sk, ink, muted, hatch, dots } = k;
    const cx = 300;
    const cy = 290;
    const r = 180;
    sk.path(`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`, { strokeWidth: 3 });
    sk.path(`M${cx - r + 26} ${cy} A${r - 26} ${r - 26} 0 0 1 ${cx + r - 26} ${cy}`, { strokeWidth: 1.4 });
    for (let i = 0; i <= 10; i++) {
      const a = Math.PI + (i / 10) * Math.PI;
      const inner = r - (i % 5 ? 22 : 36);
      sk.line(cx + Math.cos(a) * (r - 4), cy + Math.sin(a) * (r - 4), cx + Math.cos(a) * inner, cy + Math.sin(a) * inner, { strokeWidth: i % 5 ? 1.6 : 3, roughness: 0.6, seed: 10 + i });
    }
    k.hand(cx - r + 4, cy + 40, 'slow', { 'font-size': 26 });
    k.hand(cx + r - 4, cy + 40, 'fast', { 'font-size': 26, 'text-anchor': 'end' });
    const needle = k.group({ class: 'fx-needle' });
    k.pen(`M${cx} ${cy} L406 184`, { 'stroke-width': 6 }, needle);
    sk.circle(cx, cy, 30, { fill: ink, fillStyle: 'solid' });
    k.dot(cx, cy + 82, '+35%', { 'text-anchor': 'middle', 'font-size': 40 });
    k.mono(cx, cy + 106, 'DEVELOPMENT VELOCITY', { 'text-anchor': 'middle', 'font-size': 11, fill: muted });
    // the four personas who were interviewed
    [[58, 58], [124, 34], [476, 34], [542, 58]].forEach(([x, y], i) => {
      sk.path(`M${x - 22} ${y + 74} q0-26 22-26 q22 0 22 26`, { fill: i % 2 ? hatch : dots, fillStyle: 'solid', seed: 70 + i });
      sk.circle(x, y + 32, 30, { fill: k.ground, fillStyle: 'solid', seed: 60 + i });
    });
  },
};
