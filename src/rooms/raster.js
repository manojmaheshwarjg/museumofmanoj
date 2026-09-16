// Draws the museum's illustrations outside their rooms: live into any SVG (comic panels, Easter egg cards),
// or flattened onto a canvas for the framed pictures on the 3D walls and the postcards.

import { ART } from './registry.js';
import { kit, sketchPending } from './kit.js';

const NS = 'http://www.w3.org/2000/svg';
const cache = new Map();
let stash = null;

// Draws illustration `key` into an SVG on the usual 600 × 420 board. Unknown keys get the pending sketch.
export function drawArt(svg, key, tone = 'paper') {
  svg.setAttribute('viewBox', '0 0 600 420');
  if (key && ART[key]) ART[key](kit(svg, tone));
  else sketchPending(svg, key || 'coming soon', tone);
  return svg;
}

// Flattens an illustration onto a canvas, with the page's hatch and halftone patterns inlined so they survive.
// Resolves null when the browser can't rasterize it, so callers can keep a plain frame.
export function artCanvas(key, tone = 'paper', width = 600) {
  const id = `${key}|${tone}|${width}`;
  if (!cache.has(id)) cache.set(id, flatten(key, tone, width));
  return cache.get(id);
}

async function flatten(key, tone, width) {
  if (!stash) {
    stash = document.createElement('div');
    stash.setAttribute('aria-hidden', 'true');
    stash.style.cssText = 'position:absolute;left:-10000px;top:0;width:600px;height:420px;overflow:hidden;visibility:hidden;pointer-events:none';
    document.body.appendChild(stash);
  }
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('xmlns', NS);
  svg.setAttribute('width', '600');
  svg.setAttribute('height', '420');
  stash.appendChild(svg);
  try {
    drawArt(svg, key, tone);
    const defs = document.querySelector('#fx-defs defs');
    if (defs) svg.insertBefore(defs.cloneNode(true), svg.firstChild);
    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = Math.round(width * 0.7);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = tone === 'night' ? '#070706' : '#F1EDE3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } catch (err) {
    console.warn('[museum] could not flatten the drawing', key, err);
    return null;
  } finally {
    svg.remove();
  }
}
