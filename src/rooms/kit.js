// A drawing kit for gallery illustrations: rough.js strokes plus text helpers,
// with colors that flip in night rooms so lines always read against the wall.

import { sketcher, el, INK, PAPER } from '../lib/doodle.js';

const NIGHT = '#070706';

function seeded(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function kit(svg, tone = 'paper') {
  const dark = tone === 'night';
  const ink = dark ? PAPER : INK;
  const ground = dark ? NIGHT : PAPER;
  const sk = sketcher(svg, { stroke: ink });
  const add = (tag, attrs = {}, parent = svg) => el(tag, attrs, parent);
  const text = (x, y, str, attrs = {}, parent = svg) => {
    const node = add('text', { x, y, fill: ink, 'font-family': 'JetBrains Mono, monospace', 'font-size': 14, ...attrs }, parent);
    node.textContent = str;
    return node;
  };
  const rnd = seeded(svg.dataset.seed ? Number(svg.dataset.seed) : 7);
  return {
    svg, sk, ink, ground, dark,
    muted: dark ? '#8A867C' : '#6F6B62',
    hatch: dark ? 'url(#hatch-paper)' : 'url(#hatch-ink)',
    dots: dark ? 'url(#ht-paper)' : 'url(#ht-ink)',
    el: add,
    group: (attrs = {}, parent = svg) => add('g', attrs, parent),
    into: (group) => sk.into(group),
    text,
    mono: (x, y, str, attrs, parent) => text(x, y, str, { 'letter-spacing': 1, ...attrs }, parent),
    hand: (x, y, str, attrs, parent) => text(x, y, str, { 'font-family': 'Caveat, cursive', 'font-size': 30, ...attrs }, parent),
    dot: (x, y, str, attrs, parent) => text(x, y, str, { 'font-family': 'Doto, monospace', 'font-weight': 900, 'font-size': 28, ...attrs }, parent),
    display: (x, y, str, attrs, parent) => text(x, y, str, { 'font-family': 'Bricolage Grotesque, sans-serif', 'font-weight': 800, 'font-size': 34, ...attrs }, parent),
    rnd,
    // A hand-written line of words, for notes, letters and documents.
    scribble: (x, y, w, amp = 2) => {
      const n = Math.max(3, Math.round(w / 16));
      let d = `M${x} ${y}`;
      for (let i = 1; i <= n; i++) {
        d += ` Q${(x + (w * (i - 0.5)) / n).toFixed(1)} ${(y + (rnd() - 0.5) * amp * 3).toFixed(1)} ${(x + (w * i) / n).toFixed(1)} ${(y + (rnd() - 0.5) * amp).toFixed(1)}`;
      }
      return d;
    },
    // A clean ink line (not rough), for strokes an effect will draw or animate.
    pen: (d, attrs = {}, parent = svg) => add('path', { d, fill: 'none', stroke: ink, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs }, parent),
  };
}

// Shown while an illustration has not been drawn yet, so a new beat never renders empty.
export function sketchPending(svg, key, tone) {
  const k = kit(svg, tone);
  k.sk.rect(40, 40, 520, 340, { strokeLineDash: [10, 8], roughness: 0.8 });
  k.hand(300, 205, 'sketch coming soon', { 'text-anchor': 'middle', 'font-size': 38 });
  k.mono(300, 240, key, { 'text-anchor': 'middle', fill: k.muted });
}
