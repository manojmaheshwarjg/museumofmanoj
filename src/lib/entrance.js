// Through the doors. The walk in ends at the entrance, and the museum itself starts on its own page: the first stop for
// the full experience, the gift shop for the resume. However you get to the doors (the hands-free walk, a scroll, the
// steps' hold button), this is where you go next.

import { state } from './state.js';
import { pathFor } from './routes.js';
import { reducedMotion } from './doodle.js';

let gone = false;

// The light through the doors fills the screen, and the page on the other side starts as that same light, with the
// stop rising up into it from the bottom (index.html, main.js), the way the welcome used to scroll up when it was part
// of this page. That page does its own entrance, so there's no page-to-page transition on top of it.
export function goInside() {
  if (gone) return;
  gone = true;
  try { sessionStorage.setItem('manoj-museum:through-doors', String(Date.now())); } catch { /* storage blocked: a plain page change */ }
  addEventListener('pageswap', (e) => e.viewTransition?.skipTransition(), { once: true });
  const light = document.createElement('div');
  light.className = 'doorlight';
  light.setAttribute('aria-hidden', 'true');
  document.body.appendChild(light);
  const to = pathFor(state.mode === 'resume' ? 'room-12' : 'room-02');
  setTimeout(() => location.assign(to), reducedMotion() ? 0 : 300);
}

// Back out to the street from the other side (the browser keeps this page as it was): the doors are open again.
addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  document.querySelector('.doorlight')?.remove();
  gone = false;
});
