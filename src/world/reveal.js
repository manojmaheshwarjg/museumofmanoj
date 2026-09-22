// The city drawing itself in, the first time you see it. Every ink stroke is drawn like a pen line, from one end to
// the other; walls and windows fill upward behind their outlines once the outlines are down; the ground and the road
// paint wash in as halftone. Only stand-in copies of the materials, used for the length of the intro, carry this
// shader work. When it ends the city gets its own materials back, so from then on it renders exactly as it always has.

// One clock for every intro material: seconds since the drawing began.
export const REVEAL = { value: 0 };
// How long one stroke takes to draw, and how long a wall takes to fill.
const DRAW = { value: 0.2 };
const FILL = { value: 0.45 };

// A 4 x 4 ordered dither, for the halftone wash.
const BAYER = `
float revealBayer2( vec2 a ) { a = floor( a ); return fract( a.x / 2.0 + a.y * a.y * 0.75 ); }
float revealBayer( vec2 a ) { return revealBayer2( 0.5 * a ) * 0.25 + revealBayer2( a ); }
`;

// A stand-in for one of the city's MeshBasicMaterials. Each geometry drawn with it carries aReveal: when its fill
// starts, and how high it reaches. A height of zero means it washes in as halftone instead of filling upward.
export function revealMaterial(material) {
  const m = material.clone();
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uReveal = REVEAL;
    shader.uniforms.uFill = FILL;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 aReveal;\nvarying vec2 vReveal;\nvarying float vRevealY;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n\tvReveal = aReveal;\n\tvRevealY = ( modelMatrix * vec4( transformed, 1.0 ) ).y;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nuniform float uReveal;\nuniform float uFill;\nvarying vec2 vReveal;\nvarying float vRevealY;\n${BAYER}`)
      .replace('void main() {', `void main() {
	float revealK = clamp( ( uReveal - vReveal.x ) / uFill, 0.0, 1.0 );
	if ( revealK < 1.0 ) {
		if ( vReveal.y <= 0.0 ) { if ( revealK <= revealBayer( gl_FragCoord.xy ) ) discard; }
		else if ( vRevealY > revealK * vReveal.y ) discard;
	}`);
  };
  return m;
}

// A stand-in for an ink LineMaterial. Each segment carries instanceReveal, the moment its stroke starts. Until then it
// is not drawn at all; while it draws, its far end runs out from its near end.
export function revealLine(material) {
  const m = material.clone();
  // The same uniforms as the original, so a resize (the line width is in screen pixels) reaches both.
  m.uniforms = { ...material.uniforms, uReveal: REVEAL, uDraw: DRAW };
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('attribute vec3 instanceEnd;', 'attribute vec3 instanceEnd;\n\t\tattribute float instanceReveal;\n\t\tuniform float uReveal;\n\t\tuniform float uDraw;')
      .replace(
        'vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );',
        'float drawn = clamp( ( uReveal - instanceReveal ) / uDraw, 0.0, 1.0 );\n\t\t\tvec4 end = modelViewMatrix * vec4( drawn < 1.0 ? mix( instanceStart, instanceEnd, drawn ) : instanceEnd, 1.0 );',
      )
      .replace('#include <fog_vertex>', '#include <fog_vertex>\n\t\t\tif ( drawn <= 0.0 ) gl_Position = vec4( 2.0, 2.0, 2.0, 1.0 );');
  };
  return m;
}

// Eases for the pieces that pop in (trees, the kids) and the ones that fade.
export const popIn = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2);
export const between = (t, start, span) => Math.min(1, Math.max(0, (t - start) / span));
