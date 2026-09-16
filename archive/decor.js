// Painted surfaces for the rooms inside the museum: room plates, door signs, the lobby logo, the signs on
// Easter egg objects, framed drawings, and the comic panels in the corridors. Paper and ink, like the rest.
// Drawings are flattened lazily: a texture starts as blank paper and paints itself when `load()` is called.

import { CanvasTexture, SRGBColorSpace } from 'three';
import rough from 'roughjs';
import { drawLogo } from '../lib/logo.js';
import { artCanvas } from '../rooms/raster.js';

const INK = '#0E0D0B';
const PAPER = '#F1EDE3';
const MONO = '"JetBrains Mono", monospace';
const HAND = 'Caveat, cursive';
const DISPLAY = '"Bricolage Grotesque", sans-serif';

function surface(w, h, fill) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (fill) { ctx.fillStyle = fill; ctx.fillRect(0, 0, w, h); }
  return { c, ctx, rc: rough.canvas(c) };
}

export function toTexture(canvas) {
  const t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const repainted = () => window.dispatchEvent(new Event('museum:repaint'));
const seedOf = (str) => [...String(str)].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) % 9973, 7) + 1;

function wrapLines(ctx, str, x, y, maxWidth, lineHeight, font, maxLines = 3) {
  ctx.font = font;
  const rows = [];
  let row = '';
  str.split(' ').forEach((word) => {
    const test = row ? `${row} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && row) { rows.push(row); row = word; } else row = test;
  });
  rows.push(row);
  rows.slice(0, maxLines).forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
  return rows.length;
}

// A little "?" tag: this object does something when you find it.
function badge(ctx, x, y, dark) {
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fillStyle = dark ? PAPER : INK;
  ctx.fill();
  ctx.fillStyle = dark ? INK : PAPER;
  ctx.font = `800 28px ${DISPLAY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('?', x, y + 1);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

// The room's wall label: its number, title, and where and when.
export function plateTexture(room) {
  const dark = room.tone === 'night';
  const ink = dark ? PAPER : INK;
  const { c, ctx } = surface(1024, 512, dark ? '#141311' : '#F7F3EA');
  ctx.strokeStyle = ink;
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, 996, 484);
  ctx.fillStyle = ink;
  ctx.font = '900 250px Doto, monospace';
  ctx.fillText(room.no, 48, 340);
  ctx.font = `500 24px ${MONO}`;
  ctx.fillText(`ROOM ${room.no} · ${room.time.toUpperCase()}`, 460, 104);
  wrapLines(ctx, room.title, 460, 196, 520, 68, `800 62px ${DISPLAY}`, 3);
  ctx.font = `500 20px ${MONO}`;
  ctx.fillText(`${room.place} · ${room.dates}`.toUpperCase(), 460, 446);
  return toTexture(c);
}

// A door leaf: dark, with a warm porthole and a paper outline.
export function doorTexture() {
  const { c, ctx } = surface(256, 512, INK);
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 6;
  ctx.strokeRect(22, 22, 212, 468);
  ctx.beginPath();
  ctx.arc(128, 150, 48, 0, Math.PI * 2);
  ctx.fillStyle = '#FFE3B8';
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = PAPER;
  ctx.fillRect(196, 260, 12, 64);
  return toTexture(c);
}

// A short sign over a door or an archway.
export function signTexture(text) {
  const { c, ctx, rc } = surface(512, 128, INK);
  rc.rectangle(8, 8, 496, 112, { stroke: PAPER, strokeWidth: 3, roughness: 1, seed: seedOf(text) });
  ctx.fillStyle = PAPER;
  ctx.font = `500 46px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 66);
  return toTexture(c);
}

export function logoTexture() {
  const { c, ctx } = surface(1024, 256, '#EEE9DF');
  drawLogo(ctx, 512, 170, 96, INK);
  return toTexture(c);
}

// The painted front of an Easter egg object that has no drawing: a word, the egg's title, and the "?" tag.
export function eggSignTexture(egg, tone) {
  const dark = tone === 'night';
  const ink = dark ? PAPER : INK;
  const { c, ctx, rc } = surface(512, 358, dark ? '#1C1A17' : '#F7F3EA');
  rc.rectangle(16, 16, 480, 326, { stroke: ink, strokeWidth: 4, roughness: 1.2, seed: seedOf(egg.id) });
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let size = 96;
  ctx.font = `900 ${size}px Doto, monospace`;
  while (ctx.measureText(egg.sign).width > 400 && size > 36) { size -= 4; ctx.font = `900 ${size}px Doto, monospace`; }
  ctx.fillText(egg.sign, 256, 168);
  ctx.font = `500 20px ${MONO}`;
  ctx.fillStyle = dark ? '#B9B3A6' : '#6F6B62';
  ctx.fillText(egg.title.toUpperCase().slice(0, 34), 256, 268);
  badge(ctx, 460, 58, dark);
  return toTexture(c);
}

// A potted plant, cut from paper, for the corner of a room.
export function plantTexture() {
  const { c, rc } = surface(256, 320);
  [[128, 236, 128, 92], [128, 218, 76, 128], [128, 218, 180, 130], [128, 228, 98, 168], [128, 228, 164, 170]].forEach(([x1, y1, x2, y2], i) => {
    rc.line(x1, y1, x2, y2, { stroke: INK, strokeWidth: 4, roughness: 1.2, seed: 50 + i });
  });
  [[128, 84, 36, 56], [72, 118, 32, 48], [184, 120, 32, 48], [96, 158, 27, 41], [166, 160, 27, 41]].forEach(([x, y, rx, ry], i) => {
    rc.ellipse(x, y, rx * 2, ry * 2, { stroke: INK, strokeWidth: 4, fill: PAPER, fillStyle: 'solid', roughness: 1.1, seed: 60 + i });
  });
  rc.polygon([[92, 236], [164, 236], [152, 310], [104, 310]], { stroke: INK, strokeWidth: 5, fill: PAPER, fillStyle: 'solid', seed: 41 });
  rc.line(92, 252, 164, 252, { stroke: INK, strokeWidth: 4, seed: 42 });
  return toTexture(c);
}

// A framed drawing from one of the rooms. Blank paper until loaded; eggs get the "?" tag.
export function pictureTexture(key, tone, { egg = false } = {}) {
  const dark = tone === 'night';
  const { c } = surface(512, 358, dark ? '#070706' : PAPER);
  const texture = toTexture(c);
  let started = false;
  texture.userData.load = () => {
    if (started) return;
    started = true;
    artCanvas(key, tone, 512).then((art) => {
      if (!art) return;
      const ctx = c.getContext('2d');
      ctx.drawImage(art, 0, 0, 512, 358);
      if (egg) badge(ctx, 476, 36, dark);
      texture.needsUpdate = true;
      repainted();
    });
  };
  return texture;
}

// One comic panel for a corridor wall: caption box, drawing, and what Manoj says. Gaps are dashed "Tell me" panels.
export function comicTexture(panel, index) {
  const { c } = surface(512, 400, PAPER);
  const texture = toTexture(c);
  const paint = (art) => {
    const ctx = c.getContext('2d');
    const rc = rough.canvas(c);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, 512, 400);
    rc.rectangle(12, 12, 488, 376, { stroke: INK, strokeWidth: 5, roughness: 1.1, seed: 60 + index, ...(panel.tell ? { strokeLineDash: [16, 11] } : {}) });
    if (art) ctx.drawImage(art, 106, 70, 300, 210);
    else if (panel.tell) {
      rc.rectangle(126, 84, 260, 180, { stroke: '#6F6B62', strokeWidth: 3, strokeLineDash: [10, 8], roughness: 0.8, seed: 70 + index });
      ctx.fillStyle = INK;
      ctx.font = `700 110px ${HAND}`;
      ctx.textAlign = 'center';
      ctx.fillText('?', 256, 214);
      ctx.textAlign = 'left';
    }
    ctx.font = `500 22px ${MONO}`;
    const cap = panel.caption.toUpperCase();
    const capWidth = Math.min(460, ctx.measureText(cap).width + 34);
    ctx.fillStyle = INK;
    ctx.fillRect(12, 12, capWidth, 46);
    ctx.fillStyle = PAPER;
    ctx.fillText(cap, 28, 44);
    ctx.fillStyle = INK;
    if (!art && !panel.tell) {
      ctx.textAlign = 'center';
      wrapLines(ctx, panel.line, 256, 170, 420, 58, `700 52px ${HAND}`, 3);
      ctx.textAlign = 'left';
    } else {
      wrapLines(ctx, panel.tell ? `Tell me: ${panel.line}` : panel.line, 40, 322, 432, 36, `600 34px ${HAND}`, 2);
    }
    texture.needsUpdate = true;
  };
  paint(null);
  let started = false;
  texture.userData.load = () => {
    if (started || !panel.art) return;
    started = true;
    artCanvas(panel.art, 'paper', 512).then((art) => { if (art) { paint(art); repainted(); } });
  };
  return texture;
}
