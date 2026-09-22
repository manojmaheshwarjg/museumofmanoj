// Hand-drawn helpers: rough.js sketching into SVG, the shared line boil, and small DOM utilities.

import rough from 'roughjs';
import PHOTO_SIZES from 'virtual:photo-sizes';

export const INK = '#0E0D0B';
export const PAPER = '#F1EDE3';
export const PAPER_2 = '#E4DFD2';
export const MUTED = '#8A867C';
const NS = 'http://www.w3.org/2000/svg';

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isSmall = () => matchMedia('(max-width: 719px)').matches;

export function el(tag, attrs = {}, parent) {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, String(v)));
  if (parent) parent.appendChild(node);
  return node;
}

export function html(strings, ...values) {
  return strings.reduce((out, s, i) => out + s + (i < values.length ? values[i] ?? '' : ''), '');
}

// A rough.js canvas bound to an SVG, with house-style defaults.
export function sketcher(svg, defaults = {}) {
  const rc = rough.svg(svg);
  const base = { stroke: INK, strokeWidth: 2.2, roughness: 1.3, bowing: 1.1, ...defaults };
  const add = (node) => { svg.appendChild(node); return node; };
  return {
    rect: (x, y, w, h, o = {}) => add(rc.rectangle(x, y, w, h, { ...base, ...o })),
    line: (x1, y1, x2, y2, o = {}) => add(rc.line(x1, y1, x2, y2, { ...base, ...o })),
    circle: (x, y, d, o = {}) => add(rc.circle(x, y, d, { ...base, ...o })),
    ellipse: (x, y, w, h, o = {}) => add(rc.ellipse(x, y, w, h, { ...base, ...o })),
    path: (d, o = {}) => add(rc.path(d, { ...base, ...o })),
    poly: (pts, o = {}) => add(rc.polygon(pts, { ...base, ...o })),
    group: (attrs = {}) => el('g', attrs, svg),
    into(group) {
      const addTo = (node) => { group.appendChild(node); return node; };
      return {
        rect: (x, y, w, h, o = {}) => addTo(rc.rectangle(x, y, w, h, { ...base, ...o })),
        line: (x1, y1, x2, y2, o = {}) => addTo(rc.line(x1, y1, x2, y2, { ...base, ...o })),
        circle: (x, y, d, o = {}) => addTo(rc.circle(x, y, d, { ...base, ...o })),
        ellipse: (x, y, w, h, o = {}) => addTo(rc.ellipse(x, y, w, h, { ...base, ...o })),
        path: (d, o = {}) => addTo(rc.path(d, { ...base, ...o })),
        poly: (pts, o = {}) => addTo(rc.polygon(pts, { ...base, ...o })),
      };
    },
  };
}

// Re-seed the shared turbulence so every element using filter="url(#boil)" wobbles like redrawn frames.
export function startBoil() {
  const turb = document.querySelector('#boil feTurbulence');
  if (!turb || reducedMotion()) return;
  const fps = isSmall() ? 4 : 7;
  let seed = 1;
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = document.visibilityState === 'visible'; });
  setInterval(() => {
    if (!visible) return;
    seed = (seed % 5) + 1;
    turb.setAttribute('seed', String(seed));
  }, 1000 / fps);
}

// Counts a number up in a dot-matrix style, with a little flicker on the way.
export function countUp(node, to, { prefix = '', suffix = '', duration = 1400 } = {}) {
  const start = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - start) / duration);
    let v = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1 && Math.random() < 0.08) v = Math.round(Math.random() * to);
    node.textContent = `${prefix}${v.toLocaleString('en-US')}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// A photograph from public/photos, in a frame the shape of the picture itself (sizes come from virtual:photo-sizes).
// Just the photo: no caption under it. A file that isn't in the folder renders nothing, so it never leaves an empty
// frame. Takes a file name, or { file, alt, marks } (see marksSVG).
export function photo(entry) {
  const { file, alt = '', marks } = typeof entry === 'string' ? { file: entry } : entry;
  const size = PHOTO_SIZES[file];
  if (!size) return '';
  const spots = marks?.faces?.map((face) => face.join(',')).join(';');
  return html`<figure class="photo${marks ? ' photo--marked' : ''}" style="--ar:${(size[0] / size[1]).toFixed(4)}"><div class="photo__img is-empty" data-photo="${file}"${spots ? ` data-spots="${spots}"` : ''} role="img" aria-label="${alt}">${marks ? marksSVG(size, marks) : ''}</div></figure>`;
}

// Marks drawn on a photo, the way you'd mark up a print: an ink circle around each face that matters, and a note
// beside the first one with an arrow to it. marks = { faces: [[x, y, rx, ry], ...], note: { text, x, y } }, all in the
// photo's own pixels; the note's x is where its last letter ends. The strokes are drawn in, one after another, when the
// photo comes into view (loadPhotos).
const inkPen = rough.generator();
function marksSVG([w, h], { faces = [], note } = {}) {
  let at = 0.5;
  const strokes = (drawable, each = 0.34) => inkPen.toPaths(drawable).flatMap(({ d }) => d.split(/(?=M)/).filter(Boolean)).map((d) => {
    const path = `<path d="${d}" pathLength="1" style="--d:${at.toFixed(2)}s"/>`;
    at += each;
    return path;
  }).join('');
  const pen = (seed) => ({ roughness: 1.3, bowing: 1.2, seed });
  let out = faces.map(([x, y, rx, ry], i) => strokes(inkPen.ellipse(x, y, rx * 2, ry * 2, pen(11 + i)), 0.18)).join('');
  if (note && faces.length) {
    const [x, y, rx, ry] = faces[0];
    out += `<text class="photo__note" x="${note.x}" y="${note.y}" text-anchor="end" style="--d:${at.toFixed(2)}s">${note.text}</text>`;
    at += 0.45;
    // Then the arrow: from just after the note's last letter, across and down onto the first circle.
    const sx = note.x + 14;
    const sy = note.y - 20;
    const ex = x - rx * 0.92;
    const ey = y - ry * 0.42;
    const bend = [ex + 2, sy + 4];
    const heading = Math.atan2(ey - bend[1], ex - bend[0]);
    const head = (turn) => `${(ex - 24 * Math.cos(heading + turn)).toFixed(1)} ${(ey - 24 * Math.sin(heading + turn)).toFixed(1)}`;
    out += strokes(inkPen.curve([[sx, sy], bend, [ex, ey]], { ...pen(31), disableMultiStroke: true }), 0.3);
    out += strokes(inkPen.path(`M ${head(0.55)} L ${ex} ${ey} L ${head(-0.55)}`, { ...pen(37), roughness: 0.6, disableMultiStroke: true }));
  }
  return `<svg class="photo__marks" viewBox="0 0 ${w} ${h}" aria-hidden="true">${out}</svg>`;
}

// The faces a marked photo keeps in colour: a second copy of the picture over the first, showing only through soft
// ovals around each face, so when the rest goes black and white they stay as they were.
function spotlight(box, img) {
  const [w, h] = PHOTO_SIZES[box.dataset.photo];
  const pct = (v, of) => `${((v / of) * 100).toFixed(2)}%`;
  const mask = box.dataset.spots.split(';').map((face) => {
    const [x, y, rx, ry] = face.split(',').map(Number);
    return `radial-gradient(ellipse ${pct(rx, w)} ${pct(ry, h)} at ${pct(x, w)} ${pct(y, h)}, #000 68%, transparent 104%)`;
  }).join(', ');
  const spot = img.cloneNode();
  spot.className = 'photo__spot';
  spot.alt = '';
  spot.style.maskImage = mask;
  spot.style.webkitMaskImage = mask;
  return spot;
}

// Photos come to life two ways, and neither with reduced motion. The first time one comes into view it develops like
// instant film: out of focus, then sharp in black and white, then its colour. And now and then one print
// on screen catches a breeze: it lifts a little where it hangs, sways and settles.
const DEVELOP = [
  { filter: 'grayscale(1) blur(10px)', transform: 'scale(1.08)' },
  { filter: 'grayscale(1) blur(0px)', transform: 'scale(1)', offset: 0.4 },
  { filter: 'grayscale(1) blur(0px)', transform: 'scale(1)', offset: 0.64 },
  { filter: 'grayscale(0) blur(0px)', transform: 'scale(1)' },
];
// A marked photo's background stays black and white under its marks, so it develops only that far.
const DEVELOP_GRAY = DEVELOP.slice(0, 3).concat({ filter: 'grayscale(1) blur(0px)', transform: 'scale(1)' });
const SWAY = [
  { transform: 'none' },
  { transform: 'translateY(-3px) rotate(-1.8deg)', offset: 0.2 },
  { transform: 'translateY(-2px) rotate(1.3deg)', offset: 0.45 },
  { transform: 'rotate(-.6deg)', offset: 0.7 },
  { transform: 'none' },
];
const FLUTTER = [{ transform: 'none' }, { transform: 'rotate(-4deg) scaleY(1.15)', offset: 0.25 }, { transform: 'rotate(4deg) scaleY(.9)', offset: 0.55 }, { transform: 'none' }];
const hanging = new Set();
let breezeWatch = null;
let breezeTimer = 0;

function sway(figure) {
  figure.animate(SWAY, { duration: 2600, easing: 'ease-in-out' });
  // The cover hangs by a strip of tape, and the tape flutters with it.
  if (figure.closest('.room__cover')) figure.animate(FLUTTER, { duration: 2600, easing: 'ease-in-out', pseudoElement: '::before' });
}

// Every 8 to 14 seconds, one print on screen that isn't still developing.
function breezeLater() {
  clearTimeout(breezeTimer);
  breezeTimer = setTimeout(() => {
    const ready = [...hanging].filter((f) => f.isConnected && !f.dataset.developing);
    if (ready.length && !document.hidden) sway(ready[Math.floor(Math.random() * ready.length)]);
    breezeLater();
  }, 8000 + Math.random() * 6000);
}

function hangInBreeze(figure) {
  breezeWatch ||= new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) hanging.add(entry.target); else hanging.delete(entry.target);
  }), { threshold: 0.6 });
  breezeWatch.observe(figure);
  if (!breezeTimer) breezeLater();
}

// Loads each photo as it nears the screen, from the site root, so the stops' own pages (/experience/...) find them too.
// It waits undeveloped until it's in view, then develops. Hover (or tap) shows the picture without its film treatment.
// A marked photo starts drawing its marks as it arrives, while it develops: its faces come up in colour inside them.
export function loadPhotos(root = document) {
  const still = reducedMotion();
  const marking = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      marking.unobserve(entry.target);
      entry.target.classList.add('is-marked');
    });
  }, { threshold: 0.55 });
  const develop = (box) => {
    const figure = box.closest('.photo');
    const marked = Boolean(box.dataset.spots);
    box.classList.remove('is-latent');
    figure.dataset.developing = '1';
    if (marked) figure.classList.add('is-marked');
    const runs = [...box.querySelectorAll('img')].map((img) => {
      const frames = marked && !img.classList.contains('photo__spot') ? DEVELOP_GRAY : DEVELOP;
      return img.animate(frames, { duration: 5200, easing: 'cubic-bezier(.35, .1, .5, 1)', fill: 'backwards' });
    });
    const developed = () => { delete figure.dataset.developing; };
    Promise.all(runs.map((run) => run.finished)).then(developed, developed);
  };
  const arrivals = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      arrivals.unobserve(entry.target);
      develop(entry.target);
    });
  }, { threshold: 0.35 });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const box = entry.target;
      const img = new Image();
      img.decoding = 'async';
      img.alt = box.getAttribute('aria-label') || '';
      img.src = `/photos/${encodeURIComponent(box.dataset.photo)}`;
      img.decode().then(() => {
        box.prepend(img);
        if (box.dataset.spots) img.after(spotlight(box, img));
        if (!still) box.classList.add('is-latent');
        requestAnimationFrame(() => {
          box.classList.remove('is-empty');
          const figure = box.closest('.photo');
          if (still) {
            if (box.dataset.spots) marking.observe(figure);
            return;
          }
          arrivals.observe(box);
          hangInBreeze(figure);
        });
      }, () => box.closest('.photo')?.classList.add('is-missing'));
    });
  }, { rootMargin: '800px 0px' });
  root.querySelectorAll('[data-photo]').forEach((box) => {
    box.closest('.photo')?.addEventListener('click', (e) => e.currentTarget.classList.toggle('is-plain'));
    io.observe(box);
  });
}
