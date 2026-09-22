// The first stop, every time you land on it. The walk in was hands-free, so once the stop is in place the page softly
// blurs behind one line asking you to scroll, with the avenue's scroll cue beside it, for a moment and no longer.
// Anyone already scrolling never sees it, and any scroll, swipe, key or tap clears it sooner.

const MOVES = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'scroll'];
const OPTIONS = { passive: true, capture: true };
// How long it stays before it clears by itself.
const SHOWN_FOR = 1500;

let current = null; // the cue on screen, and its way out

function show() {
  current?.clear();
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
  let timer = 0;
  const clear = (e) => {
    if (e?.type === 'scroll' && Math.abs(window.scrollY - from) < 4) return;
    clearTimeout(timer);
    MOVES.forEach((type) => removeEventListener(type, clear, OPTIONS));
    el.classList.remove('is-in');
    setTimeout(() => el.remove(), 400);
    if (current?.el === el) current = null;
  };
  MOVES.forEach((type) => addEventListener(type, clear, OPTIONS));
  timer = setTimeout(clear, SHOWN_FOR);
  current = { el, clear };
}

// Shows the cue a moment after `ready` settles. Returns a way to call it off: leaving the stop takes the cue with it.
export function yourTurn(ready) {
  let moved = false;
  let dropped = false;
  const early = (e) => { if (e.type !== 'scroll' || window.scrollY > 40) moved = true; };
  const quiet = () => MOVES.forEach((type) => removeEventListener(type, early, OPTIONS));
  MOVES.forEach((type) => addEventListener(type, early, OPTIONS));
  ready.then(() => new Promise((resolve) => { setTimeout(resolve, 600); })).then(() => {
    quiet();
    if (!moved && !dropped) show();
  });
  return () => {
    dropped = true;
    quiet();
    current?.clear();
  };
}
