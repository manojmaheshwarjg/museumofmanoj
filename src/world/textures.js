// Hand-drawn textures for the Fifth Avenue scene: painted on canvas with rough.js, handed to three.js.
// Everything stays in the museum's black and white print palette.

import rough from 'roughjs';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { drawLogo } from '../lib/logo.js';

export const NIGHT = '#070706';
export const PAPER = '#F1EDE3';
export const DARK = '#0E0D0B';
const DIM = '#24221E';
const FAINT = 'rgba(241, 237, 227, .28)';

// Light is the only color in the scene: warm windows, the odd cool TV glow.
const WARM = ['255, 214, 150', '255, 198, 122', '255, 232, 196', '248, 206, 158'];
const COOL = '188, 212, 255';
const lightColor = (rnd, alpha) => `rgba(${rnd() < 0.1 ? COOL : WARM[Math.floor(rnd() * WARM.length)]}, ${alpha})`;

export function seeded(seed = 1) {
  let s = Math.max(1, Math.floor(seed)) % 2147483647;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function surface(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext('2d'), rc: rough.canvas(c) };
}

function texture(c, { repeat = false } = {}) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) { t.wrapS = RepeatWrapping; t.wrapT = RepeatWrapping; }
  return t;
}

// Canvas text needs the web fonts in memory first.
export async function loadFonts() {
  if (!document.fonts?.load) return;
  await Promise.allSettled(['900 64px Doto', '800 64px "Bricolage Grotesque"', '500 22px "JetBrains Mono"', '500 40px Caveat', 'italic 400 120px "Instrument Serif"'].map((f) => document.fonts.load(f)));
}

// A building face: a grid of hand-drawn windows, about a third of them lit.
const facades = new Map();
export function facadeTexture({ floors, bays, seed = 1 }) {
  const key = `${floors}:${bays}:${seed % 4}`;
  if (facades.has(key)) return facades.get(key);
  const W = 512;
  const H = 512;
  const { c, ctx, rc } = surface(W, H);
  const rnd = seeded(seed * 97 + floors * 13 + bays);
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);
  const cw = W / bays;
  const ch = H / floors;
  for (let f = 0; f < floors; f++) {
    for (let b = 0; b < bays; b++) {
      const x = b * cw + cw * 0.24;
      const y = f * ch + ch * 0.22;
      const w = cw * 0.52;
      const h = ch * 0.5;
      const lit = rnd() < 0.34;
      const glow = lit ? lightColor(rnd, (0.62 + rnd() * 0.35).toFixed(2)) : FAINT;
      if (lit) {
        ctx.fillStyle = glow;
        ctx.fillRect(x, y, w, h);
        if (rnd() < 0.35) { ctx.fillStyle = DARK; ctx.fillRect(x, y + h * 0.48, w, 2); }
      }
      rc.rectangle(x, y, w, h, { stroke: glow, strokeWidth: 1.3, roughness: 1.1, disableMultiStroke: true, seed: f * 31 + b + 1 });
    }
  }
  rc.line(0, 4, W, 4, { stroke: PAPER, strokeWidth: 3, roughness: 1.4, seed: 7 });
  const t = texture(c);
  facades.set(key, t);
  return t;
}

let hatch;
export function hatchTexture() {
  if (hatch) return hatch;
  const { c, ctx } = surface(128, 128);
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = 'rgba(241, 237, 227, .15)';
  ctx.lineWidth = 2;
  for (let i = -128; i < 256; i += 14) { ctx.beginPath(); ctx.moveTo(i, 128); ctx.lineTo(i + 128, 0); ctx.stroke(); }
  hatch = texture(c, { repeat: true });
  hatch.repeat.set(3, 6);
  return hatch;
}

// A billboard of LED dots. draw() re-lights it with new lines of text, so numbers can count up.
export function dotBillboard({ w = 1024, h = 512, cell = 9 } = {}) {
  const { c, ctx } = surface(w, h);
  const cols = Math.floor(w / cell);
  const rows = Math.floor(h / cell);
  const src = document.createElement('canvas');
  src.width = cols;
  src.height = rows;
  const sctx = src.getContext('2d', { willReadFrequently: true });
  const tex = texture(c);
  const draw = (lines) => {
    sctx.clearRect(0, 0, cols, rows);
    sctx.fillStyle = '#fff';
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    lines.forEach(({ text, size, y, weight = 800 }) => {
      let s = size;
      sctx.font = `${weight} ${s}px "Bricolage Grotesque", sans-serif`;
      while (sctx.measureText(text).width > cols - 6 && s > 6) { s -= 1; sctx.font = `${weight} ${s}px "Bricolage Grotesque", sans-serif`; }
      sctx.fillText(text, cols / 2, Math.round(y * rows));
    });
    const data = sctx.getImageData(0, 0, cols, rows).data;
    ctx.fillStyle = NIGHT;
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const lit = data[(y * cols + x) * 4 + 3] > 110;
        ctx.fillStyle = lit ? PAPER : DIM;
        ctx.beginPath();
        ctx.arc(x * cell + cell / 2, y * cell + cell / 2, lit ? cell * 0.43 : cell * 0.26, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.strokeStyle = PAPER;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, w - 8, h - 8);
    tex.needsUpdate = true;
  };
  return { texture: tex, draw };
}

// A band of the spiral: a strip of lit windows, or the museum's name.
export function bandTexture({ sign = '', seed = 1 } = {}) {
  const W = 2048;
  const H = 256;
  const { c, ctx, rc } = surface(W, H);
  const rnd = seeded(seed);
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);
  rc.line(0, 16, W, 16, { stroke: PAPER, strokeWidth: 5, roughness: 1.2, seed: seed + 1 });
  rc.line(0, H - 16, W, H - 16, { stroke: PAPER, strokeWidth: 5, roughness: 1.2, seed: seed + 2 });
  if (sign) {
    // The logo mark, lit warm, wrapping around the spiral.
    ctx.shadowColor = 'rgba(255, 184, 104, .75)';
    ctx.shadowBlur = 26;
    drawLogo(ctx, W / 2, H / 2 + 40, 112, '#FFDDB0');
    ctx.shadowBlur = 0;
    drawLogo(ctx, W / 2, H / 2 + 40, 112, '#FFF3E2');
  } else {
    for (let x = 20; x < W - 20; x += 60) {
      const lit = rnd() < 0.72;
      ctx.fillStyle = lit ? lightColor(rnd, (0.5 + rnd() * 0.45).toFixed(2)) : DIM;
      ctx.fillRect(x, 92, 38, 70);
    }
  }
  const t = texture(c, { repeat: true });
  t.repeat.set(sign ? 2 : 3, 1);
  return t;
}

// The museum plinth with its glowing doors.
export function entranceTexture() {
  const W = 1024;
  const H = 256;
  const { c, ctx, rc } = surface(W, H);
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);
  [352, 462, 572].forEach((x, i) => {
    ctx.fillStyle = '#FFE6C0';
    ctx.fillRect(x, 96, 96, 160);
    rc.rectangle(x, 96, 96, 160, { stroke: DARK, strokeWidth: 4, roughness: 0.8, seed: 20 + i });
    rc.line(x + 48, 96, x + 48, 256, { stroke: DARK, strokeWidth: 3, seed: 30 + i });
  });
  ctx.fillStyle = PAPER;
  ctx.font = '500 28px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ENTRANCE · OPEN LATE TONIGHT', W / 2, 62);
  return texture(c);
}

// A plate sign: a street name, or a label on paper.
export function plateTexture(text, { w = 512, h = 128, size = 62, invert = false, font = 'Bricolage Grotesque', weight = 800 } = {}) {
  const { c, ctx, rc } = surface(w, h);
  ctx.fillStyle = invert ? DARK : PAPER;
  ctx.fillRect(0, 0, w, h);
  rc.rectangle(9, 9, w - 18, h - 18, { stroke: invert ? PAPER : DARK, strokeWidth: 5, roughness: 1, seed: text.length + 3 });
  ctx.fillStyle = invert ? PAPER : DARK;
  ctx.font = `${weight} ${size}px "${font}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2 + 4);
  return texture(c);
}

// A tall banner for the lampposts.
export function bannerTexture(text) {
  const { c, ctx, rc } = surface(128, 512);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, 128, 512);
  rc.rectangle(10, 10, 108, 492, { stroke: DARK, strokeWidth: 5, roughness: 1.2, seed: text.length });
  ctx.save();
  ctx.translate(64, 256);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = DARK;
  ctx.font = '900 52px Doto, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 4);
  ctx.restore();
  return texture(c);
}

// Doodle pedestrians: eight people, two walking frames each.
export function walkerSheet() {
  const CW = 64;
  const CH = 128;
  const VARIANTS = 8;
  const { c, rc } = surface(CW * VARIANTS, CH * 2);
  for (let v = 0; v < VARIANTS; v++) {
    for (let f = 0; f < 2; f++) {
      const cx = v * CW + CW / 2;
      const oy = f * CH;
      const o = { stroke: PAPER, strokeWidth: 2.4, roughness: 1.2, fill: DARK, fillStyle: 'solid', seed: v * 7 + f + 1 };
      const spread = f ? 11 : 3;
      rc.line(cx - 4, oy + 84, cx - spread, oy + 122, { ...o, strokeWidth: 4 });
      rc.line(cx + 4, oy + 84, cx + spread, oy + 122, { ...o, strokeWidth: 4 });
      const long = v % 3 === 0;
      rc.path(`M${cx - 13} ${oy + 40} Q${cx} ${oy + 33} ${cx + 13} ${oy + 40} L${cx + (long ? 18 : 15)} ${oy + 90} L${cx - (long ? 18 : 15)} ${oy + 90} Z`, o);
      rc.circle(cx, oy + 25, 22, o);
      if (v % 4 === 1) rc.rectangle(cx + 13, oy + 56, 12, 18, o);
      if (v % 4 === 2) rc.rectangle(cx - 24, oy + 44, 11, 26, o);
      if (v % 4 === 3) rc.path(`M${cx - 26} ${oy + 18} Q${cx} ${oy - 14} ${cx + 26} ${oy + 18} Z`, o);
      if (v % 4 === 0) rc.line(cx - 12, oy + 14, cx + 12, oy + 14, { ...o, strokeWidth: 5 });
    }
  }
  return { texture: texture(c), variants: VARIANTS, frames: 2 };
}

// A Central Park tree: overlapping canopy blobs on a sketched trunk.
export function treeTexture(seed) {
  const { c, rc } = surface(256, 256);
  const rnd = seeded(seed);
  rc.line(128, 252, 128, 140, { stroke: PAPER, strokeWidth: 6, roughness: 1.6, seed });
  rc.line(128, 190, 100, 160, { stroke: PAPER, strokeWidth: 3, roughness: 1.6, seed: seed + 1 });
  for (let i = 0; i < 6; i++) {
    rc.circle(66 + rnd() * 124, 58 + rnd() * 84, 66 + rnd() * 58, { stroke: PAPER, strokeWidth: 2.4, roughness: 2, fill: DARK, fillStyle: 'solid', seed: seed + i * 3 });
  }
  return texture(c);
}

// Light on the pavement, printed as halftone dots.
let pool;
export function poolTexture() {
  if (pool) return pool;
  const S = 256;
  const { c, ctx } = surface(S, S);
  const step = 10;
  ctx.fillStyle = PAPER;
  for (let y = step / 2; y < S; y += step) {
    for (let x = step / 2; x < S; x += step) {
      const d = Math.hypot(x - S / 2, y - S / 2) / (S / 2);
      if (d >= 1) continue;
      ctx.beginPath();
      ctx.arc(x, y, (1 - d) * step * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  pool = texture(c);
  return pool;
}

// Uptown skyline on the horizon.
export function skylineTexture() {
  const W = 2048;
  const H = 512;
  const { c, ctx, rc } = surface(W, H);
  const rnd = seeded(21);
  for (let x = 0; x < W;) {
    const w = 40 + rnd() * 90;
    const h = 110 + rnd() * 330;
    rc.rectangle(x, H - h, w, h + 10, { stroke: 'rgba(241, 237, 227, .32)', strokeWidth: 2, roughness: 1, fill: DARK, fillStyle: 'solid', disableMultiStroke: true, seed: Math.floor(rnd() * 999) + 1 });
    for (let wy = H - h + 14; wy < H - 10; wy += 22) {
      for (let wx = x + 8; wx < x + w - 8; wx += 16) {
        if (rnd() > 0.74) { ctx.fillStyle = lightColor(rnd, (0.22 + rnd() * 0.34).toFixed(2)); ctx.fillRect(wx, wy, 5, 8); }
      }
    }
    x += w + 4;
  }
  return texture(c);
}

// The ticket booth front: a lit window, the counter and the ticket slot.
export function boothFrontTexture() {
  const W = 512;
  const H = 640;
  const { c, ctx, rc } = surface(W, H);
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#FFF0D6';
  ctx.fillRect(56, 60, 400, 300);
  rc.rectangle(56, 60, 400, 300, { stroke: PAPER, strokeWidth: 7, roughness: 1, seed: 2 });
  for (let i = 0; i < 5; i++) { ctx.fillStyle = DARK; ctx.beginPath(); ctx.arc(216 + i * 20, 92, 4, 0, Math.PI * 2); ctx.fill(); }
  rc.rectangle(30, 372, 452, 30, { stroke: PAPER, strokeWidth: 3, fill: PAPER, fillStyle: 'solid', seed: 3 });
  ctx.fillStyle = '#000';
  ctx.fillRect(176, 440, 160, 18);
  rc.rectangle(176, 440, 160, 18, { stroke: PAPER, strokeWidth: 3, seed: 4 });
  ctx.fillStyle = PAPER;
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TICKETS PRINT HERE', W / 2, 500);
  rc.rectangle(60, 530, 180, 86, { stroke: 'rgba(241, 237, 227, .5)', strokeWidth: 2, seed: 5 });
  rc.rectangle(272, 530, 180, 86, { stroke: 'rgba(241, 237, 227, .5)', strokeWidth: 2, seed: 6 });
  return texture(c);
}

// The TICKETS sign, twice, with its bulbs in alternate phases for a chase.
// The guides' door beside the booth window: a dark wall with a lit doorway, and the door that swings open over it.
export function boothDoorTextures() {
  // The wall is 1.3 m wide and 3 m tall at 160 px a meter; the doorway is 0.9 m by 2.15 m.
  const wall = surface(208, 480);
  wall.ctx.fillStyle = DARK;
  wall.ctx.fillRect(0, 0, 208, 480);
  wall.ctx.fillStyle = '#FFE3B8';
  wall.ctx.fillRect(32, 136, 144, 344);
  wall.rc.rectangle(32, 136, 144, 344, { stroke: PAPER, strokeWidth: 5, roughness: 1, seed: 21 });
  wall.ctx.fillStyle = PAPER;
  wall.ctx.font = '500 17px "JetBrains Mono", monospace';
  wall.ctx.textAlign = 'center';
  wall.ctx.fillText('GUIDES', 104, 112);
  const leaf = surface(180, 430);
  leaf.ctx.fillStyle = DARK;
  leaf.ctx.fillRect(0, 0, 180, 430);
  leaf.rc.rectangle(12, 12, 156, 406, { stroke: PAPER, strokeWidth: 4, roughness: 1, seed: 22 });
  leaf.ctx.fillStyle = '#FFE3B8';
  leaf.ctx.beginPath();
  leaf.ctx.arc(90, 118, 32, 0, Math.PI * 2);
  leaf.ctx.fill();
  leaf.rc.circle(90, 118, 64, { stroke: PAPER, strokeWidth: 4, roughness: 1, seed: 23 });
  leaf.ctx.fillStyle = PAPER;
  leaf.ctx.fillRect(138, 226, 10, 46);
  return { wall: texture(wall.c), leaf: texture(leaf.c) };
}

export function boothSignTextures() {
  const make = (phase) => {
    const W = 1024;
    const H = 256;
    const { c, ctx, rc } = surface(W, H);
    ctx.fillStyle = DARK;
    ctx.fillRect(0, 0, W, H);
    rc.rectangle(12, 12, W - 24, H - 24, { stroke: PAPER, strokeWidth: 6, roughness: 1, seed: 9 });
    ctx.fillStyle = PAPER;
    ctx.font = '900 148px Doto, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TICKETS', W / 2, H / 2 + 8);
    let i = 0;
    for (let x = 44; x < W - 30; x += 44) {
      [36, H - 36].forEach((y) => {
        ctx.fillStyle = (i + phase) % 2 === 0 ? '#FFC766' : DIM;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        i += 1;
      });
    }
    return texture(c);
  };
  return [make(0), make(1)];
}

// A tiling facade for the towers behind Fifth Avenue: eight floors by eight bays per tile.
let tower;
export function towerTexture() {
  if (tower) return tower;
  const S = 512;
  const { c, ctx } = surface(S, S);
  const rnd = seeded(404);
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, S, S);
  const cell = S / 8;
  for (let r = 0; r < 8; r++) {
    for (let col = 0; col < 8; col++) {
      const x = col * cell + cell * 0.26;
      const y = r * cell + cell * 0.22;
      if (rnd() < 0.3) {
        ctx.fillStyle = lightColor(rnd, (0.5 + rnd() * 0.45).toFixed(2));
        ctx.fillRect(x, y, cell * 0.48, cell * 0.5);
      } else {
        ctx.strokeStyle = 'rgba(241, 237, 227, .16)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, cell * 0.48, cell * 0.5);
      }
    }
  }
  tower = texture(c, { repeat: true });
  return tower;
}

// Kids playing football in the park: two teams (paper shirts, dark shirts), two running frames.
export function kidSheet() {
  const CW = 64;
  const CH = 96;
  const VARIANTS = 4;
  const { c, rc } = surface(CW * VARIANTS, CH * 2);
  for (let v = 0; v < VARIANTS; v++) {
    for (let f = 0; f < 2; f++) {
      const cx = v * CW + CW / 2;
      const oy = f * CH;
      const o = { stroke: PAPER, strokeWidth: 2.4, roughness: 1.1, seed: v * 11 + f + 3 };
      const stride = f ? 12 : 4;
      rc.line(cx - 3, oy + 62, cx - stride, oy + 90, { ...o, strokeWidth: 4 });
      rc.line(cx + 3, oy + 62, cx + stride, oy + 88, { ...o, strokeWidth: 4 });
      rc.line(cx - 10, oy + 40, cx - 20, oy + (f ? 30 : 54), { ...o, strokeWidth: 3 });
      rc.line(cx + 10, oy + 40, cx + 20, oy + (f ? 54 : 30), { ...o, strokeWidth: 3 });
      rc.rectangle(cx - 11, oy + 34, 22, 30, { ...o, fill: v % 2 ? DARK : PAPER, fillStyle: 'solid' });
      rc.circle(cx, oy + 22, 18, { ...o, fill: DARK, fillStyle: 'solid' });
    }
  }
  return { texture: texture(c), variants: VARIANTS };
}
