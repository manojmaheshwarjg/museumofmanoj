// The museum's logo mark: MUSEUM and MANOJ in the dot-matrix face, with a small serif italic "of" between them.

export const LOGO_HTML = '<span class="logo"><span>MUSEUM</span><span class="logo__of">of</span><span>MANOJ</span></span>';

const SERIF = '"Instrument Serif", "Iowan Old Style", Georgia, serif';

// Draws the mark on a canvas, centered on x with its baseline at y. Returns its width.
export function drawLogo(ctx, x, y, size, color = '#F1EDE3') {
  const parts = [
    ['MUSEUM', `900 ${size}px Doto, monospace`],
    ['of', `italic 400 ${Math.round(size * 1.34)}px ${SERIF}`],
    ['MANOJ', `900 ${size}px Doto, monospace`],
  ];
  const gap = size * 0.26;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = color;
  const widths = parts.map(([text, font]) => { ctx.font = font; return ctx.measureText(text).width; });
  const total = widths.reduce((sum, w) => sum + w, 0) + gap * 2;
  let cursor = x - total / 2;
  parts.forEach(([text, font], i) => {
    ctx.font = font;
    ctx.fillText(text, cursor, y);
    cursor += widths[i] + gap;
  });
  ctx.restore();
  return total;
}
