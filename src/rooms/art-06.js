// Room 06 · A studio of my own. Illustrations for each beat, drawn at 600 × 420.

// Sets each wall clock's hands to the real time in its city.
export function paintClocks(root) {
  root.querySelectorAll('.fx-clock').forEach((clock) => {
    const { tz, cx, cy } = clock.dataset;
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const h = Number(parts.find((p) => p.type === 'hour').value) % 12;
    const m = Number(parts.find((p) => p.type === 'minute').value);
    clock.querySelector('.fx-hour').setAttribute('transform', `rotate(${(h + m / 60) * 30} ${cx} ${cy})`);
    clock.querySelector('.fx-minute').setAttribute('transform', `rotate(${m * 6} ${cx} ${cy})`);
  });
}

export const ART = {
  'studio-sign': (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    k.pen('M20 40 Q300 140 580 40', { 'stroke-width': 1.6 });
    for (let i = 0; i < 9; i++) {
      const t = (i + 0.5) / 9;
      k.el('circle', { cx: 20 + 560 * t, cy: 40 + 100 * t * (1 - t) + 10, r: 6, fill: ink, class: 'fx-bulb' });
    }
    sk.rect(60, 96, 480, 304, { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 3 });
    // the sign, lit for the first time
    const sign = k.group({ class: 'fx-sign' });
    k.into(sign).rect(150, 116, 300, 76, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 4 });
    k.dot(300, 170, 'HURRAE', { 'text-anchor': 'middle', 'font-size': 48, fill: ground }, sign);
    [[140, 120, -14, -8], [140, 188, -14, 8], [460, 120, 14, -8], [460, 188, 14, 8], [300, 106, 0, -14]].forEach(([x, y, dx, dy]) => {
      k.pen(`M${x} ${y} l${dx} ${dy}`, { 'stroke-width': 2.4, class: 'fx-glow' });
    });
    // the window, with a lamp on late
    sk.rect(100, 220, 190, 130, { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 5 });
    k.el('polygon', { points: '150,262 186,262 236,346 110,346', fill: dots, opacity: 0.55 });
    sk.path('M150 262 h36 l-8-20 h-20z', { fill: ink, fillStyle: 'solid', seed: 6 });
    sk.rect(210, 296, 64, 42, { fill: ink, fillStyle: 'solid', seed: 7 });
    sk.line(195, 220, 195, 350, { strokeWidth: 1.8, seed: 8 });
    // the door, open for clients
    sk.rect(330, 220, 120, 180, { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 9 });
    sk.rect(348, 238, 84, 80, { fill: hatch, fillStyle: 'solid', seed: 10 });
    k.pen('M372 238 l18 28 18-28', { 'stroke-width': 1.6 });
    k.into(k.group()).rect(358, 266, 64, 26, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 11 });
    k.mono(390, 284, 'OPEN', { 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: ground });
    k.el('circle', { cx: 438, cy: 330, r: 5, fill: ink });
    sk.line(-10, 400, 610, 400, { strokeWidth: 2.4, seed: 12 });
  },

  clocks: (k) => {
    const { sk, ink, ground, hatch } = k;
    sk.line(30, 300, 570, 300, { strokeWidth: 2.4, seed: 2 });
    [['NEW YORK', 'America/New_York', 120], ['SAN FRANCISCO', 'America/Los_Angeles', 300], ['CHENNAI', 'Asia/Kolkata', 480]].forEach(([label, tz, cx], i) => {
      const cy = 162;
      sk.circle(cx, cy, 150, { fill: ground, fillStyle: 'solid', strokeWidth: 3.2, seed: 3 + i });
      for (let t = 0; t < 12; t++) {
        const a = (t / 12) * Math.PI * 2;
        const r2 = t % 3 ? 58 : 50;
        k.pen(`M${(cx + Math.sin(a) * 64).toFixed(1)} ${(cy - Math.cos(a) * 64).toFixed(1)} L${(cx + Math.sin(a) * r2).toFixed(1)} ${(cy - Math.cos(a) * r2).toFixed(1)}`, { 'stroke-width': t % 3 ? 1.6 : 3 });
      }
      const clock = k.group({ class: 'fx-clock', 'data-tz': tz, 'data-cx': cx, 'data-cy': cy });
      k.pen(`M${cx} ${cy} V${cy - 36}`, { 'stroke-width': 5, class: 'fx-hour' }, clock);
      k.pen(`M${cx} ${cy} V${cy - 54}`, { 'stroke-width': 3, class: 'fx-minute' }, clock);
      k.el('circle', { cx, cy, r: 6, fill: ink });
      k.mono(cx, 266, label, { 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700 });
    });
    paintClocks(k.svg);
    // a desk lamp that stays on late
    k.el('polygon', { points: '468,334 506,322 470,400 380,400', fill: hatch, opacity: 0.5 });
    sk.path('M470 400 h84 M514 400 v-52 l-30-28', { strokeWidth: 3, seed: 20 });
    sk.poly([[456, 314], [500, 300], [508, 322], [466, 336]], { fill: ink, fillStyle: 'solid', seed: 21 });
    sk.rect(90, 350, 120, 50, { fill: ground, fillStyle: 'solid', strokeWidth: 2.2, seed: 22 });
    sk.path('M250 400 h40 v-36 h-40z', { fill: ground, fillStyle: 'solid', seed: 23 });
  },

  'app-stack': (k) => {
    const { sk, ink, ground, hatch, dots } = k;
    k.dot(34, 66, '10+', { 'font-size': 44 });
    const stack = k.group({ class: 'fx-apps' });
    for (let i = 9; i >= 0; i--) {
      const x = 170 + i * 12;
      const y = 140 - i * 10;
      const g = k.group({ class: 'fx-app' }, stack);
      const s = k.into(g);
      s.rect(x, y, 280, 190, { fill: ground, fillStyle: 'solid', strokeWidth: 2.2, seed: 10 + i });
      s.line(x, y + 24, x + 280, y + 24, { strokeWidth: 1.4, seed: 30 + i });
      if (i === 0) {
        s.rect(x, y + 24, 60, 166, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 50 });
        s.rect(x + 76, y + 40, 90, 54, { fill: hatch, fillStyle: 'solid', seed: 51 });
        s.rect(x + 176, y + 40, 90, 54, { fill: dots, fillStyle: 'solid', seed: 52 });
        k.pen(`M${x + 78} ${y + 170} l40-30 30 16 40-44 50 20`, { 'stroke-width': 3 }, g);
      }
    }
    let x = 70;
    ['HR TECH', 'INSURTECH', 'ENERGY INVESTMENT', 'PORTFOLIOS'].forEach((label, i) => {
      const w = label.length * 7.6 + 22;
      sk.rect(x, 362, w, 30, { strokeWidth: 1.8, seed: 60 + i });
      k.mono(x + w / 2, 382, label, { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700 });
      x += w + 10;
    });
  },

  'notebook-ai': (k) => {
    const { ink, ground, hatch } = k;
    const page = k.group({ transform: 'rotate(-4 300 210)' });
    k.into(page).rect(120, 34, 360, 350, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 3 });
    for (let y = 76; y < 380; y += 28) k.pen(`M140 ${y} H460`, { stroke: ground, 'stroke-width': 1, opacity: 0.3 }, page);
    k.dot(150, 104, '$20K', { fill: ground, 'font-size': 40 }, page);
    k.hand(150, 142, 'delivery revenue', { fill: ground, 'font-size': 26 }, page);
    k.pen(k.scribble(150, 176, 250, 1.6), { stroke: ground }, page);
    k.hand(150, 244, 'what next?', { fill: ground, 'font-size': 46, 'font-weight': 700 }, page);
    k.hand(318, 340, 'AI.', { fill: ground, 'font-size': 66, 'font-weight': 700 }, page);
    k.pen('M300 300 q44-40 92-8 q30 30-8 58 q-62 22-90-14 q-10-20 6-36', { stroke: ground, 'stroke-width': 3, class: 'fx-circle' }, page);
    k.pen('M404 336 q40 2 58-26 m-16 2 l16-2 2 16', { stroke: ground, 'stroke-width': 2.6 }, page);
    const pen = k.group({ transform: 'rotate(38 512 330)' });
    k.into(pen).rect(452, 322, 140, 18, { fill: hatch, fillStyle: 'solid', seed: 4 });
  },
};
