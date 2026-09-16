// 00 · Arrival. A 3D walk up Fifth Avenue at night. Billboards greet you by visitor number,
// and scrolling carries you past the park, the cabs and the lampposts to the ticket booth
// outside the museum, where Doodle Manoj is waiting in the window.

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureWorld } from '../../world/stage.js';
import { ensureGuide } from '../../world/guide.js';
import { mountManoj } from '../../character/manoj.js';
import { state, on } from '../../lib/state.js';
import { panelHTML, ticketHTML, initBooth } from './booth.js';

const clamp = (v) => Math.min(1, Math.max(0, v));
const CROSS_STREETS = [[40, 'E 85 ST'], [-40, 'E 86 ST'], [-120, 'E 87 ST'], [-200, 'E 88 ST']];

export async function init() {
  const root = document.getElementById('plaza');
  root.innerHTML = `
    <div class="stage arrival">
      <h1 class="sr-only">Museum of Manoj: one life, from Chennai to New York</h1>
      <div class="arrival__cue">
        <span class="arrival__cue-track" aria-hidden="true"><i></i></span>
        <p class="arrival__cue-text"><span class="mono">Scroll to walk up Fifth Avenue</span><a class="mono" href="#booth" data-go="#booth">or skip to the tickets</a></p>
      </div>
      <p class="mono arrival__street" aria-hidden="true"><span>5 AV</span><span data-street>E 85 ST</span></p>
      <div class="arrival__window" aria-hidden="true"><div class="arrival__guide"></div></div>
      <p class="bubble arrival__bubble" aria-live="polite" data-bubble></p>
      <div class="arrival__slot" aria-hidden="true">${ticketHTML()}</div>
      ${panelHTML()}
    </div>
    <span class="arrival__mark" id="booth" aria-hidden="true"></span>`;

  const stage = root.querySelector('.arrival');
  const cue = root.querySelector('.arrival__cue');
  const street = root.querySelector('.arrival__street');
  const streetName = root.querySelector('[data-street]');
  const bubble = root.querySelector('[data-bubble]');
  const slot = root.querySelector('.arrival__slot');
  const panel = root.querySelector('[data-panel]');
  const ticket = root.querySelector('[data-ticket]');

  const world = await ensureWorld();
  if (!world) {
    // The flat booth: the guide waves from its window card.
    const guide = mountManoj(root.querySelector('.arrival__guide'), { pose: 'wave', label: 'Doodle Manoj waving from the ticket booth window' });
    initBooth({ panel, ticket, bubble, guide });
    root.classList.add('is-flat');
    return;
  }
  // In the 3D world one Manoj walks you all the way in (world/guide.js). At the booth he speaks the booth's lines.
  const actor = await ensureGuide();
  initBooth({ panel, ticket, bubble, guide: { pose: (name) => actor.pose('booth', name) } });
  const echo = () => actor.say('booth', bubble.textContent);
  echo();
  new MutationObserver(echo).observe(bubble, { childList: true, characterData: true, subtree: true });
  world.showVisitor(state.visitor);
  on((type) => { if (type === 'visitor') world.showVisitor(state.visitor); });


  // HTML that lives on the 3D booth: the window with the guide, the bubble, and the ticket slot.
  let atBooth = null;
  const place = () => {
    const p = world.progress;
    cue.style.opacity = String(1 - clamp(p / 0.03));
    cue.style.visibility = p > 0.035 ? 'hidden' : 'visible';

    const z = world.camera.position.z;
    const passed = CROSS_STREETS.find(([limit]) => z > limit);
    streetName.textContent = passed ? passed[1] : 'E 88 ST';
    street.style.opacity = String(clamp((p - 0.2) / 0.05) * (1 - clamp((p - 0.74) / 0.05)));

    // The ticket slot lives on the 3D booth. Past the end of the avenue the stage scrolls away as the walk to the
    // steps begins, so the slot keeps following the booth and lets go.
    const plaza = world.rail.span('plaza');
    const leaving = plaza ? clamp((window.scrollY - plaza[1]) / (innerHeight * 0.3)) : 0;
    const arrive = clamp((p - 0.78) / 0.07) * (1 - leaving);
    const lift = stage.getBoundingClientRect().top;
    const top = world.anchor('windowTop');
    const bottom = world.anchor('windowBottom');
    const hole = world.anchor('slot');
    const h = Math.max(1, bottom.y - top.y);
    slot.style.opacity = arrive > 0 && top.visible ? String(arrive) : '0';
    slot.style.setProperty('--s', (h / 300).toFixed(3));
    slot.style.translate = `${hole.x.toFixed(1)}px ${(hole.y - lift).toFixed(1)}px`;

    // The tour panel stays up at the booth, right to the end of the avenue, until you walk on.
    const here = p > 0.82 && (p < 0.985 || window.scrollY <= (plaza ? plaza[1] : 0) + 4);
    if (here !== atBooth) {
      atBooth = here;
      root.classList.toggle('is-at-booth', here);
      document.body.classList.toggle('is-at-booth', here);
    }
  };

  // Development only: jump the camera to any point of the walk, for checking shots.
  if (import.meta.env.DEV) {
    window.__arrival = {
      world,
      jump: (p) => { const at = world.jump('plaza', p); place(); return at; },
    };
  }


  // Keep the HTML pinned to the booth while the avenue is on screen.
  let running = false;
  const start = () => { if (!running) { running = true; world.onFrame(place); } };
  const stop = () => {
    if (running) { running = false; world.offFrame(place); }
    atBooth = null;
    document.body.classList.remove('is-at-booth');
  };
  const onScreen = ScrollTrigger.create({
    trigger: root, start: 'top bottom', end: 'bottom top',
    onToggle: (self) => (self.isActive ? start() : stop()),
  });
  if (onScreen.isActive || root.getBoundingClientRect().top < innerHeight) start();
}

