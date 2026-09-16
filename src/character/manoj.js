// Doodle Manoj, the museum guide.
// Drawn from his photo: thick wavy hair, a full beard and a big grin, in a black MANOJ tee
// (or a puffer jacket for the Buffalo and New York rooms). Ink lines, paper skin, a halftone shadow.
// Every pose lives in one SVG and switches with data attributes, so poses change without redrawing.

const STYLE_ID = 'manoj-character-style';

const css = `
.manoj { width: 100%; height: auto; overflow: visible; }
.manoj [data-arm], .manoj [data-outfit] { display: none; }
.manoj[data-pose="idle"] [data-arm="idle"],
.manoj[data-pose="wave"] [data-arm="wave"],
.manoj[data-pose="offer"] [data-arm="offer"],
.manoj[data-pose="point"] [data-arm="point"],
.manoj[data-pose="walk"] [data-arm="walk"],
.manoj[data-outfit="tee"] [data-outfit="tee"],
.manoj[data-outfit="puffer"] [data-outfit="puffer"] { display: inline; }
.manoj .m-body { animation: m-breathe 1.2s steps(2) infinite; }
.manoj .m-eyes { transform-box: fill-box; transform-origin: center; animation: m-blink 4.2s steps(1) infinite; }
.manoj[data-pose="wave"] .m-wave { transform-box: fill-box; transform-origin: 8% 92%; animation: m-wave .9s ease-in-out infinite; }
.manoj.is-walking .m-leg-l { transform-box: fill-box; transform-origin: 50% 0; animation: m-step-l .5s steps(2) infinite; }
.manoj.is-walking .m-leg-r { transform-box: fill-box; transform-origin: 50% 0; animation: m-step-r .5s steps(2) infinite; }
.manoj.is-walking .m-body { animation: m-bob .5s steps(2) infinite; }
.manoj.is-waiting .m-leg-r { transform-box: fill-box; transform-origin: 50% 0; animation: m-tap .6s steps(2) infinite; }
@keyframes m-breathe { 50% { transform: translateY(1.5px); } }
@keyframes m-blink { 0%, 93% { transform: scaleY(1); } 94%, 97% { transform: scaleY(.12); } }
@keyframes m-wave { 50% { transform: rotate(-16deg); } }
@keyframes m-step-l { 0% { transform: rotate(9deg); } 100% { transform: rotate(-9deg); } }
@keyframes m-step-r { 0% { transform: rotate(-9deg); } 100% { transform: rotate(9deg); } }
@keyframes m-bob { 50% { transform: translateY(-3px); } }
@keyframes m-tap { 50% { transform: rotate(-7deg); } }
@media (prefers-reduced-motion: reduce) { .manoj * { animation: none !important; } }
`;

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);
}

const INK = '#0E0D0B';
const PAPER = '#F1EDE3';

// An arm as a thick ink outline with a paper core, ending in a round hand.
const arm = (d, hand, sleeve = false) => `
  <path d="${d}" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="${sleeve ? '#26241F' : PAPER}" stroke-width="10.5" stroke-linecap="round" stroke-linejoin="round"/>
  ${hand}`;

const fist = (x, y) => `<circle cx="${x}" cy="${y}" r="10.5" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>`;
const openHand = (x, y, rot = 0) => `
  <g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="M-10 6C-12-4-6-12 2-12c3-9 11-8 12-1 7-3 11 3 8 9 5 1 6 8 1 11-3 6-11 9-19 7C-4 16-9 12-10 6z" fill="${PAPER}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M2-12v9M14-6l-5 7M22 3l-8 3" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
  </g>`;

export function manojSVG({ pose = 'idle', outfit = 'tee', label = 'Doodle Manoj' } = {}) {
  ensureStyle();
  return `
<svg class="manoj" data-pose="${pose}" data-outfit="${outfit}" viewBox="0 0 220 372" role="img" aria-label="${label}" filter="url(#boil)">
  <g class="m-body">
    <!-- legs -->
    <g class="m-leg-l">
      <path d="M72 262h38l-5 82H80z" fill="${PAPER}"/>
      <path d="M72 262h38l-5 82H80z" fill="url(#ht-ink)" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M58 340h48c4 0 6 4 5 8l-1 6H56c-4 0-6-4-4-8z" fill="${INK}"/>
    </g>
    <g class="m-leg-r">
      <path d="M110 262h38l-6 82h-25z" fill="${PAPER}"/>
      <path d="M110 262h38l-6 82h-25z" fill="url(#ht-ink)" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M114 340h48c4 0 6 4 4 8l-2 6h-52c-4 0-5-4-4-8z" fill="${INK}"/>
    </g>

    <!-- outfit: black MANOJ tee -->
    <g data-outfit="tee">
      <path d="M58 150c20-12 84-12 104 0l26 46-22 11-10-19v80H64v-80l-10 19-22-11z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M92 144c10 12 26 12 36 0" fill="none" stroke="${PAPER}" stroke-width="2.4" stroke-linecap="round"/>
      <text x="110" y="214" text-anchor="middle" font-family="Doto, monospace" font-weight="900" font-size="23" letter-spacing="1.5" fill="${PAPER}">MANOJ</text>
    </g>
    <!-- outfit: puffer jacket for the cold rooms -->
    <g data-outfit="puffer">
      <path d="M52 150c24-16 92-16 116 0l28 50-26 12-8-18v82H60v-82l-8 18-26-12z" fill="#26241F" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>
      <g fill="none" stroke="${PAPER}" stroke-opacity=".38" stroke-width="2"><path d="M62 176q48 8 96 0M62 202q48 8 96 0M62 228q48 8 96 0M62 254q48 8 96 0"/></g>
      <path d="M110 148v116" stroke="${PAPER}" stroke-opacity=".6" stroke-width="2" stroke-dasharray="3 3"/>
      <path d="M84 146c6-10 46-10 52 0l-4 12c-10 6-34 6-44 0z" fill="#26241F" stroke="${INK}" stroke-width="3"/>
      <path d="M74 156l-4 60M146 156l4 60" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    </g>

    <!-- arms, one set per pose -->
    <g data-arm="idle">${arm('M62 172q-12 40-8 78', fist(54, 254))}${arm('M158 172q12 40 8 78', fist(166, 254))}</g>
    <g data-arm="wave">${arm('M62 172q-12 40-8 78', fist(54, 254))}<g class="m-wave">${arm('M158 170q30-24 34-72', openHand(194, 86, -8))}</g></g>
    <g data-arm="offer">${arm('M62 172q-12 40-8 78', fist(54, 254))}${arm('M158 176q26 26 42 54', openHand(204, 238, 38))}</g>
    <g data-arm="point">${arm('M62 172q-12 40-8 78', fist(54, 254))}${arm('M158 176q34-6 52-14', `<g transform="translate(212 158)"><circle r="10" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M6-4h16" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M6-4h16" stroke="${PAPER}" stroke-width="3" stroke-linecap="round"/></g>`)}</g>
    <g data-arm="walk">${arm('M62 172q-20 34-22 70', fist(40, 246))}${arm('M158 172q22 30 28 66', fist(188, 242))}</g>

    <!-- neck -->
    <path d="M96 126h28v22c-8 6-20 6-28 0z" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>

    <!-- head -->
    <g class="m-head">
      <ellipse cx="62" cy="86" rx="8" ry="12" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="158" cy="86" rx="8" ry="12" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
      <path d="M66 74C66 44 84 28 110 28s44 16 44 46c0 28-8 50-24 62-11 8-29 8-40 0C74 124 66 102 66 74z" fill="${PAPER}" stroke="${INK}" stroke-width="3.2"/>
      <path d="M130 44c14 10 20 30 16 56-4 18-12 30-22 36 10-18 14-44 6-92z" fill="url(#ht-ink-fine)" opacity=".7"/>
      <!-- beard and moustache -->
      <path d="M67 90c2 26 14 46 43 52 29-6 41-26 43-52-6 14-16 20-26 19-6-8-28-8-34 0-10 1-20-5-26-19z" fill="${INK}"/>
      <path d="M88 104c10-8 34-8 44 0-8 5-36 5-44 0z" fill="${INK}"/>
      <g fill="none" stroke="${PAPER}" stroke-opacity=".32" stroke-width="1.6" stroke-linecap="round"><path d="M78 118l5 4M140 118l-5 4M96 134l3 3M122 134l-3 3M110 138v3"/></g>
      <!-- the grin -->
      <path d="M90 110q20 22 40 0z" fill="${INK}" stroke="${PAPER}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M93 111q17 9 34 0v4q-17 9-34 0z" fill="${PAPER}"/>
      <!-- nose, brows, eyes -->
      <path d="M109 80q-6 13-1 18 5 2 9-1" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M80 67q10-6 21-2M119 65q11-4 21 2" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      <g class="m-eyes" fill="${INK}"><ellipse cx="91" cy="79" rx="3.6" ry="4.4"/><ellipse cx="129" cy="79" rx="3.6" ry="4.4"/></g>
      <path d="M84 86q7 4 14 0M122 86q7 4 14 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
      <!-- the hair: a big wavy mass with a curl falling on the forehead -->
      <path d="M58 84C48 54 58 20 90 12c14-4 34-3 48 4 26 12 34 40 24 70-2-14-8-24-16-28 2-12-8-20-18-16-6-10-22-12-28-2-10-8-26-2-26 10-10 0-18 12-22 34z" fill="${INK}"/>
      <path d="M92 54c-4 10 2 18 10 16-6-6-6-12-2-18z" fill="${INK}"/>
      <g fill="none" stroke="${PAPER}" stroke-opacity=".5" stroke-width="2.2" stroke-linecap="round"><path d="M76 34q10-8 22-4M108 22q14-4 26 6M70 56q4-12 14-14M140 44q8 8 8 20"/></g>
    </g>
  </g>
</svg>`;
}

export function mountManoj(container, options = {}) {
  container.innerHTML = manojSVG(options);
  const svg = container.querySelector('svg.manoj');
  return {
    el: svg,
    pose(name) { svg.dataset.pose = name; return this; },
    outfit(name) { svg.dataset.outfit = name; return this; },
    walking(on = true) { svg.classList.toggle('is-walking', on); if (on) svg.classList.remove('is-waiting'); return this; },
    waiting(on = true) { svg.classList.toggle('is-waiting', on); if (on) svg.classList.remove('is-walking'); return this; },
  };
}
