// The visitor's own arm, reaching in from the bottom corner to take Manoj's hand:
// a big open hand first, then a forearm that keeps widening far past the corner of the screen. It has to run
// well beyond its own box: end it at the box's edge and you see the cut straight across the picture.

import { INK, PAPER } from '../lib/doodle.js';

export const visitorArm = `
<svg class="steps__hand-svg" viewBox="0 0 400 400" aria-hidden="true" filter="url(#boil)">
  <path d="M176 120Q146 98 126 126Q106 146 120 176L1380 1744L1744 1380Z" fill="${PAPER}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M268 344L344 268" stroke="${INK}" stroke-width="24" stroke-linecap="round"/>
  <path d="M262 338L338 262" stroke="${PAPER}" stroke-width="7" stroke-linecap="round"/>
  <g transform="translate(112 112) rotate(-70) scale(4.4)">
    <path d="M-10 6C-12-4-6-12 2-12c3-9 11-8 12-1 7-3 11 3 8 9 5 1 6 8 1 11-3 6-11 9-19 7C-4 16-9 12-10 6z" fill="${PAPER}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M2-12v9M14-6l-5 7M22 3l-8 3" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M-9 1q-6-6-1-13" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
  </g>
</svg>`;
