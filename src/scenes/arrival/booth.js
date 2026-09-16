// The ticket booth at the end of the walk: three ways to visit, a name for the ticket,
// and a paper ticket that prints from the booth's slot, then docks in the corner.

import gsap from 'gsap';
import { state, on, printTicket, formatVisitor, ROOM_COUNT } from '../../lib/state.js';
import { reducedMotion } from '../../lib/doodle.js';

const MODE_LABEL = { full: 'full tour', express: 'express tour', resume: 'just the resume' };
const MODE_LINE = {
  full: "Great. Get comfy, it's a good story.",
  express: "Express it is. I'll talk faster.",
  resume: 'No judgment. The gift shop is at the top.',
};

export const panelHTML = () => `
  <form class="arrival__panel" novalidate data-panel>
    <p class="mono arrival__kicker">Ticket booth · admission is free</p>
    <h2 class="arrival__panel-title">Choose your tour.</h2>
    <fieldset class="booth__modes">
      <legend class="sr-only">How long do you want to stay?</legend>
      <label class="mode"><input type="radio" name="mode" value="full" checked><span class="mode__card"><b>Full tour</b><span class="mono">about 15 min · every room</span></span></label>
      <label class="mode"><input type="radio" name="mode" value="express"><span class="mode__card"><b>Express</b><span class="mono">about 3 min · the highlights</span></span></label>
      <label class="mode"><input type="radio" name="mode" value="resume"><span class="mode__card"><b>Just the resume</b><span class="mono">straight to the gift shop</span></span></label>
    </fieldset>
    <label class="booth__name">
      <span class="mono">Name on your ticket (optional)</span>
      <input name="name" maxlength="22" placeholder="Alex" autocomplete="given-name" enterkeyhint="done">
    </label>
    <div class="arrival__actions">
      <button class="btn booth__print" type="submit">Print my ticket</button>
      <a class="btn btn--ghost" href="#steps" data-go="#steps" data-next hidden>Walk to the entrance</a>
    </div>
    <p class="mono arrival__gate" role="status" data-gate hidden>Print your ticket to go inside.</p>
    <p class="hand arrival__note" data-after hidden>Don't lose it. It gets a punch in every room.</p>
  </form>`;

export const ticketHTML = () => {
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  return `
    <div class="ticket" data-ticket>
      <div class="ticket__head"><span class="mono">museum of manoj</span><span class="mono">admit one</span></div>
      <div class="ticket__no dotf" data-visitor>${formatVisitor(state.visitor)}</div>
      <div class="ticket__rows">
        <div><span class="mono">name</span><b data-t-name>one curious visitor</b></div>
        <div><span class="mono">tour</span><b data-t-mode>full tour</b></div>
        <div><span class="mono">date</span><b>${date}</b></div>
      </div>
      <div class="ticket__holes">${Array.from({ length: ROOM_COUNT }, () => '<i></i>').join('')}</div>
      <div class="ticket__foot"><span class="ticket__barcode"></span><span class="mono">12 rooms · 12 punches</span></div>
    </div>`;
};

export function initBooth({ panel, ticket, bubble, guide }) {
  const after = panel.querySelector('[data-after]');
  const next = panel.querySelector('[data-next]');
  const printButton = panel.querySelector('.booth__print');
  const gate = panel.querySelector('[data-gate]');
  let spoken = false;

  const say = (line) => {
    bubble.textContent = line;
    if (!reducedMotion()) gsap.fromTo(bubble, { scale: 0.88, rotate: -3 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(3)' });
  };
  const greeting = () => {
    if (state.ticketPrinted) return 'Welcome back. Your ticket still works.';
    if (Number.isInteger(state.visitor)) return `Visitor ${formatVisitor(state.visitor)}, right on time. How long can you stay?`;
    return 'Hi! How long can you stay?';
  };
  bubble.textContent = greeting();
  on((type) => { if (type === 'visitor' && !spoken) bubble.textContent = greeting(); });

  const reflect = () => {
    ticket.querySelector('[data-t-name]').textContent = state.name || 'one curious visitor';
    ticket.querySelector('[data-t-mode]').textContent = MODE_LABEL[state.mode] || 'full tour';
    const toResume = state.mode === 'resume';
    next.textContent = toResume ? 'Take me to the resume' : 'Walk to the entrance';
    next.dataset.go = toResume ? '#room-12' : '#steps';
    next.setAttribute('href', next.dataset.go);
    next.hidden = false;
    after.hidden = false;
    gate.hidden = true;
    printButton.textContent = 'Reprint my ticket';
    printButton.classList.add('btn--ghost');
  };

  if (state.ticketPrinted) {
    reflect();
    ticket.classList.add('is-printed');
    const current = panel.querySelector(`input[value="${state.mode}"]`);
    if (current) current.checked = true;
    panel.elements.name.value = state.name;
  }

  panel.addEventListener('change', (e) => {
    if (e.target.name !== 'mode') return;
    spoken = true;
    say(MODE_LINE[e.target.value]);
  });

  // Trying to walk on without a ticket: Manoj points at the printer and the button gives a little shake.
  window.addEventListener('museum:gate', () => {
    if (state.ticketPrinted) return;
    spoken = true;
    guide.pose('point');
    say("Print your ticket first. I'll wait right here.");
    gate.hidden = false;
    printButton.classList.remove('is-nudged');
    void printButton.offsetWidth;
    printButton.classList.add('is-nudged');
  });

  panel.addEventListener('submit', (e) => {
    e.preventDefault();
    spoken = true;
    const data = new FormData(panel);
    printTicket({ name: data.get('name'), mode: data.get('mode') || 'full' });
    reflect();
    guide.pose('point');
    say('Here you go. Keep it on you.');
    if (reducedMotion()) { ticket.classList.add('is-printed'); return; }
    ticket.classList.remove('is-printed');
    gsap.timeline()
      .set(ticket, { yPercent: -102 })
      .to(ticket, { yPercent: 0, duration: 1.1, ease: 'steps(11)' })
      .add(() => { ticket.classList.add('is-printed'); gsap.set(ticket, { clearProps: 'transform' }); });
  });
}
