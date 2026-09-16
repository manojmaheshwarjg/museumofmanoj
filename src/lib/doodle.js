// Hand-drawn helpers: rough.js sketching into SVG, the shared line boil, and small DOM utilities.

import rough from 'roughjs';

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

export function photo({ file, caption = '', ar = '4 / 5', alt = '' }) {
  return html`<figure class="photo"><div class="photo__img is-empty" style="--ar:${ar}" data-photo="${file}" data-file="public/photos/${file}" role="img" aria-label="${alt || caption}"></div>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
}

// Swaps each photo placeholder for the real file once it exists in public/photos.
export function loadPhotos(root = document) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const box = entry.target;
      const img = new Image();
      img.decoding = 'async';
      img.alt = box.getAttribute('aria-label') || '';
      img.onload = () => { box.classList.remove('is-empty'); box.appendChild(img); };
      img.src = `photos/${box.dataset.photo}`;
    });
  }, { rootMargin: '800px 0px' });
  root.querySelectorAll('[data-photo]').forEach((box) => {
    box.closest('.photo')?.addEventListener('click', (e) => e.currentTarget.classList.toggle('is-color'));
    io.observe(box);
  });
}
