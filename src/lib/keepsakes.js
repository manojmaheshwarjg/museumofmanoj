// Things to take home from the museum: a postcard from a room, boarding passes, your ticket, and the gift shop.
// Drawn on canvas from what the museum already knows, so a souvenir never makes anything up.

import rough from 'roughjs';
import { drawLogo } from './logo.js';
import { state, formatVisitor, ROOM_COUNT } from './state.js';
import { roomByN } from '../content/rooms.js';
import { artCanvas } from '../rooms/raster.js';
import { download, vcard, wallpaper } from '../rooms/wing-skylight.js';

const INK = '#0E0D0B';
const PAPER = '#F1EDE3';
const MUTED = '#6F6B62';
const MONO = '"JetBrains Mono", monospace';
const DISPLAY = '"Bricolage Grotesque", sans-serif';
const HAND = 'Caveat, cursive';

const sheet = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  return { c, ctx, rc: rough.canvas(c) };
};
const save = (c, name) => new Promise((resolve) => {
  c.toBlob((blob) => { if (blob) download(blob, name); resolve(Boolean(blob)); }, 'image/png');
});
const fonts = () => Promise.allSettled(['900 80px Doto', `800 60px ${DISPLAY}`, `500 28px ${MONO}`, `500 60px ${HAND}`].map((f) => document.fonts?.load?.(f)));
const traveler = () => state.name || 'One curious visitor';

function text(ctx, str, x, y, font, color = INK, align = 'left') {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(str, x, y);
}

function wrap(ctx, str, x, y, maxWidth, lineHeight, font) {
  ctx.font = font;
  const words = str.split(' ');
  let row = '';
  words.forEach((word) => {
    const test = row ? `${row} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && row) {
      ctx.fillText(row, x, y);
      row = word;
      y += lineHeight;
    } else row = test;
  });
  ctx.fillText(row, x, y);
  return y + lineHeight;
}

// Barcode stripes that stay the same for the same visitor.
function barcode(ctx, x, y, w, h, seed) {
  let s = Math.max(1, seed) % 2147483647;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  ctx.fillStyle = INK;
  for (let cx = x; cx < x + w;) {
    const bar = 2 + Math.floor(rnd() * 6);
    if (rnd() > 0.35) ctx.fillRect(cx, y, bar, h);
    cx += bar + 2;
  }
}

async function postcardFor(room) {
  await fonts();
  const { c, ctx, rc } = sheet(1500, 1000);
  rc.rectangle(28, 28, 1444, 944, { stroke: INK, strokeWidth: 5, roughness: 1.2, seed: 3 });
  const art = await artCanvas(room.beats?.[0]?.art || room.exhibits?.[0]?.art, room.tone, 900);
  if (art) ctx.drawImage(art, 70, 150, 720, 504);
  rc.rectangle(70, 150, 720, 504, { stroke: INK, strokeWidth: 4, roughness: 1, seed: 5 });
  text(ctx, `Room ${room.no}`, 72, 118, `500 30px ${MONO}`, MUTED);
  wrap(ctx, room.fourD, 72, 720, 720, 44, `500 36px ${HAND}`);
  rc.line(840, 70, 840, 930, { stroke: INK, strokeWidth: 3, seed: 7 });
  rc.rectangle(1250, 70, 170, 200, { stroke: INK, strokeWidth: 3, strokeLineDash: [10, 7], seed: 9 });
  text(ctx, room.no, 1335, 200, '900 110px Doto, monospace', INK, 'center');
  text(ctx, 'Greetings from', 890, 350, `500 64px ${HAND}`);
  const after = wrap(ctx, room.title, 890, 430, 540, 70, `800 62px ${DISPLAY}`);
  text(ctx, `${room.place} · ${room.dates}`.toUpperCase(), 890, after + 10, `500 24px ${MONO}`, MUTED);
  [700, 770, 840].forEach((y, i) => rc.line(890, y, 1420, y, { stroke: MUTED, strokeWidth: 2, seed: 11 + i }));
  text(ctx, `To: ${traveler()}`, 900, 690, `500 44px ${HAND}`);
  text(ctx, `Visitor ${formatVisitor(state.visitor)}`, 900, 760, `500 44px ${HAND}`);
  drawLogo(ctx, 1155, 915, 30, INK);
  return save(c, `museum-of-manoj-room-${room.no}-postcard.png`);
}

async function boardingPass(a) {
  await fonts();
  const { c, ctx, rc } = sheet(1600, 640);
  rc.rectangle(20, 20, 1560, 600, { stroke: INK, strokeWidth: 5, roughness: 1, seed: 21 });
  ctx.fillStyle = INK;
  ctx.fillRect(20, 20, 1560, 90);
  text(ctx, 'BOARDING PASS', 60, 80, `500 34px ${MONO}`, PAPER);
  drawLogo(ctx, 1380, 80, 26, PAPER);
  for (let y = 130; y < 610; y += 26) rc.line(1160, y, 1160, y + 12, { stroke: INK, strokeWidth: 3, seed: y });
  text(ctx, 'VISITOR', 60, 180, `500 22px ${MONO}`, MUTED);
  text(ctx, traveler(), 60, 232, `500 56px ${HAND}`);
  text(ctx, a.from, 60, 380, '900 150px Doto, monospace');
  text(ctx, a.to, 700, 380, '900 150px Doto, monospace');
  rc.line(410, 330, 640, 330, { stroke: INK, strokeWidth: 4, seed: 23 });
  rc.polygon([[640, 330], [612, 314], [612, 346]], { stroke: INK, fill: INK, fillStyle: 'solid', seed: 25 });
  text(ctx, a.fromCity.toUpperCase(), 64, 425, `500 26px ${MONO}`, MUTED);
  text(ctx, a.toCity.toUpperCase(), 704, 425, `500 26px ${MONO}`, MUTED);
  [['DISTANCE', a.distance], ['WHEN', a.when], ['TICKET', formatVisitor(state.visitor)]].forEach(([label, value], i) => {
    text(ctx, label, 60 + i * 340, 510, `500 22px ${MONO}`, MUTED);
    text(ctx, value, 60 + i * 340, 560, `800 40px ${DISPLAY}`);
  });
  text(ctx, `${a.from} → ${a.to}`, 1370, 220, '900 56px Doto, monospace', INK, 'center');
  text(ctx, traveler(), 1370, 290, `500 40px ${HAND}`, INK, 'center');
  barcode(ctx, 1220, 380, 300, 150, (state.visitor || 7) * 31 + a.to.charCodeAt(0));
  return save(c, `museum-of-manoj-${a.from}-${a.to}-boarding-pass.png`.toLowerCase());
}

async function ticketCopy() {
  await fonts();
  const { c, ctx, rc } = sheet(900, 1400);
  rc.rectangle(24, 24, 852, 1352, { stroke: INK, strokeWidth: 5, roughness: 1, seed: 31 });
  text(ctx, 'MUSEUM OF MANOJ', 70, 110, `500 30px ${MONO}`);
  text(ctx, 'ADMIT ONE', 830, 110, `500 30px ${MONO}`, INK, 'right');
  text(ctx, formatVisitor(state.visitor), 450, 330, '900 150px Doto, monospace', INK, 'center');
  const mode = { full: 'full tour', express: 'express tour', resume: 'just the resume' }[state.mode] || 'full tour';
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  [['NAME', traveler()], ['TOUR', mode], ['DATE', date]].forEach(([label, value], i) => {
    const y = 470 + i * 110;
    text(ctx, label, 70, y, `500 26px ${MONO}`, MUTED);
    text(ctx, value, 830, y, `800 44px ${DISPLAY}`, INK, 'right');
    rc.line(70, y + 34, 830, y + 34, { stroke: MUTED, strokeWidth: 2, seed: 40 + i });
  });
  for (let i = 0; i < ROOM_COUNT; i++) {
    const x = 125 + (i % 6) * 130;
    const y = 900 + Math.floor(i / 6) * 130;
    rc.circle(x, y, 80, { stroke: INK, strokeWidth: 3, seed: 50 + i, ...(state.punched.has(i + 1) ? { fill: INK, fillStyle: 'solid' } : {}) });
  }
  barcode(ctx, 70, 1180, 520, 110, (state.visitor || 7) * 97);
  text(ctx, `${state.punched.size} of ${ROOM_COUNT} punched`, 830, 1250, `500 26px ${MONO}`, MUTED, 'right');
  return save(c, 'museum-of-manoj-ticket.png');
}

async function resumeFile() {
  try {
    const res = await fetch('resume.pdf', { method: 'HEAD' });
    if (!res.ok || !(res.headers.get('content-type') || '').includes('pdf')) return false;
  } catch { return false; }
  const link = Object.assign(document.createElement('a'), { href: 'resume.pdf', download: 'manoj-maheshwar-jagadeesan-resume.pdf' });
  document.body.appendChild(link);
  link.click();
  link.remove();
  return true;
}

// Makes the souvenir an Easter egg asks for. Resolves true once the file is on its way.
export function keepsake(action, room) {
  switch (action.what) {
    case 'postcard': return postcardFor(room);
    case 'boarding': return boardingPass(action);
    case 'ticket': return ticketCopy();
    case 'resume': return resumeFile();
    case 'vcard': download(new Blob([vcard(roomByN(12).contact)], { type: 'text/vcard' }), 'manoj-maheshwar-jagadeesan.vcf'); return Promise.resolve(true);
    case 'wallpaper': return wallpaper().then(() => true, () => false);
    default: return Promise.resolve(false);
  }
}
