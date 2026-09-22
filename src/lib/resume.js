// The resume, read right here instead of downloaded: the PDF drawn onto a sheet over the page, with its links still
// links and its words there for screen readers. PDF.js only loads the first time someone opens it.

import { getLenis } from './scroll.js';

export const RESUME = '/ManojMaheshwarJagadeesan_Resume.pdf';

let viewer = null;
let pages = null;
let sheets = [];
let opener = null;

const pct = (value, of) => `${((value / of) * 100).toFixed(3)}%`;

function build() {
  const el = document.createElement('div');
  el.className = 'resume-viewer';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'resume-viewer-title');
  el.innerHTML = `
    <div class="resume-viewer__bar">
      <p class="mono resume-viewer__title" id="resume-viewer-title">The resume</p>
      <a class="mono resume-viewer__action" href="${RESUME}" download>Download</a>
      <button class="mono resume-viewer__action" type="button" data-close>Close</button>
    </div>
    <div class="resume-viewer__scroll" data-lenis-prevent>
      <div class="resume-viewer__pages"><p class="mono resume-viewer__status" role="status">Loading the resume</p></div>
    </div>`;
  document.body.appendChild(el);
  el.querySelector('[data-close]').addEventListener('click', close);
  // A click on the dark around the sheet closes it too.
  el.addEventListener('click', (e) => {
    if (e.target.matches('.resume-viewer, .resume-viewer__scroll, .resume-viewer__pages')) close();
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && el.classList.contains('is-open')) close(); });
  let resizing;
  addEventListener('resize', () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => { if (el.classList.contains('is-open')) paint(); }, 150);
  });
  return el;
}

// Each page as a sheet the shape of the page, its links laid over it where they sit in the PDF.
async function load(host) {
  const [pdfjs, worker] = await Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]);
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const doc = await pdfjs.getDocument({ url: RESUME }).promise;
  const words = [];
  const made = [];
  for (let n = 1; n <= doc.numPages; n += 1) {
    const page = await doc.getPage(n);
    const [x1, y1, x2, y2] = page.view;
    const w = x2 - x1;
    const h = y2 - y1;
    const sheet = document.createElement('div');
    sheet.className = 'resume-viewer__page';
    sheet.style.aspectRatio = `${w} / ${h}`;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    sheet.appendChild(canvas);
    (await page.getAnnotations()).forEach((note) => {
      if (note.subtype !== 'Link' || !note.url) return;
      const [ax1, ay1, ax2, ay2] = note.rect;
      const link = document.createElement('a');
      link.className = 'resume-viewer__link';
      link.href = note.url;
      if (!note.url.startsWith('mailto:')) { link.target = '_blank'; link.rel = 'noopener'; }
      link.setAttribute('aria-label', note.url.replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''));
      Object.assign(link.style, { left: pct(ax1 - x1, w), top: pct(y2 - ay2, h), width: pct(ax2 - ax1, w), height: pct(ay2 - ay1, h) });
      sheet.appendChild(link);
    });
    const text = await page.getTextContent();
    words.push(text.items.map((item) => `${item.str}${item.hasEOL ? '\n' : ''}`).join(''));
    made.push({ page, canvas, sheet, task: null });
  }
  const read = document.createElement('div');
  read.className = 'sr-only';
  read.textContent = words.join('\n\n');
  host.replaceChildren(...made.map((s) => s.sheet), read);
  sheets = made;
  await paint();
}

// Drawn sharp for the screen it's on, and with room to spare, so pinching in on a phone stays crisp.
async function paint() {
  await Promise.all(sheets.map(async (s) => {
    const cssWidth = s.sheet.clientWidth;
    if (!cssWidth) return;
    const pixels = Math.min(2200, Math.max(cssWidth * (devicePixelRatio || 1), 1400));
    const viewport = s.page.getViewport({ scale: pixels / (s.page.view[2] - s.page.view[0]) });
    if (s.canvas.width === Math.round(viewport.width)) return;
    s.task?.cancel();
    s.canvas.width = Math.round(viewport.width);
    s.canvas.height = Math.round(viewport.height);
    s.task = s.page.render({ canvas: s.canvas, viewport });
    try { await s.task.promise; } catch (err) { if (err?.name !== 'RenderingCancelledException') throw err; }
  }));
}

function fail(host, err) {
  console.warn('[museum] the resume viewer failed to load', err);
  host.innerHTML = `<p class="resume-viewer__status">The viewer couldn't open here. <a href="${RESUME}" target="_blank" rel="noopener">Open the PDF</a> instead.</p>`;
}

export function openResume(trigger) {
  viewer ||= build();
  opener = trigger || document.activeElement;
  viewer.classList.add('is-open');
  document.documentElement.classList.add('has-viewer');
  getLenis()?.stop();
  viewer.querySelector('[data-close]').focus();
  const host = viewer.querySelector('.resume-viewer__pages');
  pages ||= load(host).catch((err) => { pages = null; fail(host, err); });
  if (sheets.length) paint();
}

function close() {
  viewer.classList.remove('is-open');
  document.documentElement.classList.remove('has-viewer');
  getLenis()?.start();
  opener?.focus?.();
}
