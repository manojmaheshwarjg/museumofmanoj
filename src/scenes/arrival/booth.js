// The ticket booth at the end of the walk: two ways to visit, the full experience or just the resume. Choosing one is
// your way in: your ticket docks in the corner (main.js), and Manoj walks you in through the entrance, on to the first
// stop or straight to the gift shop (lib/autopilot.js, lib/entrance.js).

import gsap from 'gsap';
import { state, on, printTicket, formatVisitor } from '../../lib/state.js';
import { reducedMotion } from '../../lib/doodle.js';
import { heldStop } from '../../lib/routes.js';

const MODE_LINE = {
  full: "Great. Get comfy, it's a good story.",
  resume: 'No judgment. The gift shop is at the top.',
};

export const panelHTML = () => `
  <div class="arrival__panel" data-panel>
    <p class="mono arrival__kicker">Ticket booth · admission is free</p>
    <h2 class="arrival__panel-title">Choose your tour.</h2>
    <div class="booth__modes" role="group" aria-label="How long do you want to stay?">
      <button class="mode" type="button" data-mode="full" aria-pressed="false"><span class="mode__card"><b>Full experience</b><span class="mono">about 15 min · every stop</span></span></button>
      <button class="mode" type="button" data-mode="resume" aria-pressed="false"><span class="mode__card"><b>Resume</b><span class="mono">straight to the gift shop</span></span></button>
    </div>
    <p class="mono arrival__gate" role="status" data-gate hidden>Choose a tour to go inside.</p>
    <p class="hand arrival__note" data-after hidden>Your ticket's in the corner. It gets a punch at every stop.</p>
  </div>`;

export function initBooth({ panel, bubble, guide }) {
  const after = panel.querySelector('[data-after]');
  const modes = panel.querySelector('.booth__modes');
  const gate = panel.querySelector('[data-gate]');
  let spoken = false;
  // Arrived by a link to one page: choosing a tour is the way in, and that page is where it leads.
  const bound = heldStop();

  const say = (line) => {
    bubble.textContent = line;
    if (!reducedMotion()) gsap.fromTo(bubble, { scale: 0.88, rotate: -3 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(3)' });
  };
  const greeting = () => {
    if (state.ticketPrinted) return 'Welcome back. Which tour this time?';
    if (bound) return `Here for ${bound.title}? Choose a tour and I'll take you straight there.`;
    if (Number.isInteger(state.visitor)) return `Visitor ${formatVisitor(state.visitor)}, right on time. How long can you stay?`;
    return 'Hi! How long can you stay?';
  };
  bubble.textContent = greeting();
  if (bound && !state.ticketPrinted) {
    gate.textContent = `Choose a tour to see ${bound.title}.`;
    gate.hidden = false;
  }
  on((type) => { if (type === 'visitor' && !spoken) bubble.textContent = greeting(); });

  // Once chosen, that card stays lit. The choice itself is the way in, so there's nothing more to press. Nothing starts
  // out lit, even with a ticket from earlier in this visit: the booth asks every time.
  const reflect = () => {
    const mode = state.mode === 'resume' ? 'resume' : 'full';
    modes.querySelectorAll('button[data-mode]').forEach((choice) => choice.setAttribute('aria-pressed', String(choice.dataset.mode === mode)));
    after.hidden = mode === 'resume';
    gate.hidden = true;
  };

  // Trying to walk on without choosing: Manoj points at the choices and they give a little shake.
  window.addEventListener('museum:gate', () => {
    if (state.ticketPrinted) return;
    spoken = true;
    guide.pose('point');
    say("Choose a tour first. I'll wait right here.");
    gate.hidden = false;
    modes.classList.remove('is-nudged');
    void modes.offsetWidth;
    modes.classList.add('is-nudged');
  });

  // One click is the whole of it: the choice, and the way in (main.js takes it from there).
  modes.addEventListener('click', (e) => {
    // Only the cards themselves: <body> carries a data-mode of its own, and a click between the cards isn't a choice.
    const choice = e.target.closest('button[data-mode]');
    if (!choice) return;
    spoken = true;
    printTicket({ mode: choice.dataset.mode });
    reflect();
    guide.pose('point');
    say(MODE_LINE[choice.dataset.mode]);
  });
}
