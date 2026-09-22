// The first stop, the first time this visit. The walk in was hands-free, so once the stop has risen into place the page
// softly blurs behind one line asking you to scroll, with the avenue's scroll cue beside it. Anyone already
// scrolling never sees it. Any scroll, swipe, key or tap clears it, and it doesn't come back this visit.

const SEEN = 'manoj-museum:your-turn';
const MOVES = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'scroll'];
const OPTIONS = { passive: true, capture: true };

function show() {
  const el = document.createElement('div');
  el.className = 'your-turn';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="your-turn__cue">
      <span class="arrival__cue-track"><i></i></span>
      <p class="hand your-turn__text">Scroll to know more about me.</p>
    </div>`;
  document.body.appendChild(el);
  void el.offsetWidth;
  el.classList.add('is-in');
  const from = window.scrollY;
  const clear = (e) => {
    if (e.type === 'scroll' && Math.abs(window.scrollY - from) < 4) return;
    MOVES.forEach((type) => removeEventListener(type, clear, OPTIONS));
    el.classList.remove('is-in');
    setTimeout(() => el.remove(), 450);
  };
  MOVES.forEach((type) => addEventListener(type, clear, OPTIONS));
}

export function yourTurn(ready) {
  try {
    if (sessionStorage.getItem(SEEN)) return;
    sessionStorage.setItem(SEEN, '1');
  } catch { /* storage blocked: it shows each time */ }
  let moved = false;
  const early = (e) => { if (e.type !== 'scroll' || window.scrollY > 40) moved = true; };
  MOVES.forEach((type) => addEventListener(type, early, OPTIONS));
  ready.then(() => new Promise((resolve) => { setTimeout(resolve, 600); })).then(() => {
    MOVES.forEach((type) => removeEventListener(type, early, OPTIONS));
    if (!moved) show();
  });
}
