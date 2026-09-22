// Room 12 · Skylight: what's next. A skylight opens onto a New York dawn.
// A gallery boarded up for your team, the gift shop (the resume first), the availability plaque, and the street
// outside where the billboard says goodbye.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountManoj } from '../character/manoj.js';
import { state, on, formatVisitor, ROOM_COUNT } from '../lib/state.js';
import { LOGO_HTML } from '../lib/logo.js';
import { openResume } from '../lib/resume.js';

const MODE = { full: 'full tour', express: 'express tour', resume: 'just the resume' };

export function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export const vcard = (c) => [
  'BEGIN:VCARD', 'VERSION:3.0', 'N:Jagadeesan;Manoj Maheshwar;;;', 'FN:Manoj Maheshwar Jagadeesan', 'TITLE:Product builder',
  `EMAIL;TYPE=INTERNET:${c.email}`, `TEL;TYPE=CELL:${c.phone}`, `URL:${c.site}`, 'END:VCARD',
].join('\r\n');

function drawSkylight(k) {
  const { sk, ink, ground, hatch } = k;
  k.el('ellipse', { cx: 300, cy: 206, rx: 268, ry: 178 }, k.el('clipPath', { id: 'skylight-clip' }, k.el('defs')));
  const sky = k.group({ 'clip-path': 'url(#skylight-clip)' });
  k.el('rect', { x: 0, y: 0, width: 600, height: 420, fill: ground }, sky);
  const sun = k.group({}, sky);
  k.el('circle', { cx: 300, cy: 300, r: 70, fill: 'none', stroke: ink, 'stroke-width': 3 }, sun);
  for (let i = 0; i < 12; i++) {
    const a = Math.PI + (i / 11) * Math.PI;
    k.pen(`M${(300 + Math.cos(a) * 92).toFixed(1)} ${(300 + Math.sin(a) * 92).toFixed(1)} L${(300 + Math.cos(a) * 126).toFixed(1)} ${(300 + Math.sin(a) * 126).toFixed(1)}`, { 'stroke-width': 3 }, sun);
  }
  // The skyline, with a window lit here and there: warm yellows and the odd blue, like the street outside.
  const LIT = ['#E3B55A', '#EFCB7A', '#D99A4E', '#86A8DE'];
  let x = 24;
  [90, 140, 70, 180, 110, 60, 150, 96, 130, 76, 160, 88].forEach((h, i) => {
    const w = 34 + (i % 3) * 10;
    k.into(sky).rect(x, 384 - h, w, h + 40, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 20 + i });
    for (let wy = 394 - h; wy < 392; wy += 12) {
      for (let wx = x + 5; wx + 9 <= x + w; wx += 9) {
        const lit = k.rnd() < 0.34;
        k.el('rect', { x: wx, y: wy, width: 5, height: 7, fill: lit ? LIT[Math.floor(k.rnd() * LIT.length)] : 'rgba(14, 13, 11, .45)' }, sky);
      }
    }
    x += w + 4;
  });
  const panes = [0, 300].map((px) => {
    const pane = k.group({}, sky);
    k.el('rect', { x: px, y: 0, width: 300, height: 420, fill: ground, opacity: 0.55 }, pane);
    k.el('rect', { x: px, y: 0, width: 300, height: 420, fill: hatch, opacity: 0.8 }, pane);
    return pane;
  });
  sk.ellipse(300, 206, 540, 360, { strokeWidth: 7, seed: 3 });
  sk.ellipse(300, 206, 500, 330, { strokeWidth: 2, seed: 4 });
  k.mono(300, 410, 'THE SKYLIGHT · NEW YORK', { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700 });
  return { panes, sun };
}

const hoardingHTML = (room) => `
  <section class="hoarding" aria-labelledby="hoarding-title">
    <div class="hoarding__tape" aria-hidden="true"></div>
    <div class="hoarding__wall">
      <div class="poster poster--big">
        <p class="dotf poster__coming">COMING SOON</p>
        <h3 class="poster__team" id="hoarding-title">YOUR TEAM</h3>
        <p class="mono">This gallery is boarded up for whoever I build with next.</p>
      </div>
    </div>
    <div class="hoarding__tape" aria-hidden="true"></div>
  </section>`;

const plaqueHTML = (room) => `
  <section class="plaque" aria-labelledby="plaque-title">
    <p class="mono plaque__kicker">The plaque by the door</p>
    <h3 class="plaque__title" id="plaque-title">Available</h3>
    <ul class="plaque__lines">${room.plaque.map((line) => `<li class="dotf">${line}</li>`).join('')}</ul>
    <div class="plaque__actions">
      <a class="btn" href="mailto:${room.contact.email}">Email me</a>
      <a class="btn btn--ghost" href="tel:${room.contact.phone.replace(/[^+\d]/g, '')}">${room.contact.phone}</a>
      <a class="btn btn--ghost" href="${room.contact.github}" target="_blank" rel="noopener">GitHub</a>
    </div>
  </section>`;

const giftHTML = () => `
  <section class="gift" aria-labelledby="gift-title">
    <p class="mono">The gift shop</p>
    <h3 class="t-h2" id="gift-title">Take something home.</h3>
    <ul class="gift__shelf">
      <li class="gift__item"><span class="hand gift__tag" aria-hidden="true">start here</span><span class="gift__icon" aria-hidden="true">PDF</span><div class="gift__copy"><h4>The resume</h4><p>One page, every stop.</p></div><button class="btn btn--ink" type="button" data-resume>View the resume</button></li>
      <li class="gift__item"><span class="gift__icon" aria-hidden="true">VCF</span><div class="gift__copy"><h4>Contact card</h4><p>Straight into your phone.</p></div><button class="btn btn--ink" type="button" data-vcard>Save the card</button></li>
    </ul>
  </section>`;

const exitHTML = () => `
  <section class="exit" aria-labelledby="exit-title">
    <div class="exit__board">
      <p class="mono exit__kicker">Back on 26th Avenue</p>
      <h3 class="dotf exit__thanks" id="exit-title">THANKS, VISITOR <span data-visitor>${formatVisitor(state.visitor)}</span></h3>
      <div class="exit__guide"></div>
    </div>
    <div class="receipt">
      <p class="receipt__head">${LOGO_HTML}</p>
      <p class="mono receipt__sub">26th Avenue, New York</p>
      <dl class="receipt__rows">
        <div><dt>Visitor</dt><dd data-r-visitor></dd></div>
        <div><dt>Tour</dt><dd data-r-mode></dd></div>
        <div><dt>Time inside</dt><dd data-r-time></dd></div>
        <div><dt>Stops punched</dt><dd data-r-rooms></dd></div>
        <div><dt>Admission</dt><dd>$0.00</dd></div>
        <div><dt>Tip</dt><dd><a href="mailto:manojmaheshwarjg@gmail.com">Say hi</a></dd></div>
      </dl>
      <p class="receipt__bar" aria-hidden="true"></p>
      <a class="mono receipt__again" href="/">Walk around again</a>
    </div>
  </section>`;

function paintReceipt(el) {
  el.querySelector('[data-r-visitor]').textContent = formatVisitor(state.visitor);
  el.querySelector('[data-r-mode]').textContent = MODE[state.mode] || 'walk-in';
  el.querySelector('[data-r-time]').textContent = `${Math.max(1, Math.round(performance.now() / 60000))} min`;
  el.querySelector('[data-r-rooms]').textContent = `${state.punched.size} of ${ROOM_COUNT}`;
}

export const WINGS = {
  skylight: {
    html: (room) => `
      <div class="skylight">
        <svg class="skylight__art" viewBox="0 0 600 420" role="img" aria-label="A skylight opening onto a New York dawn"></svg>
        ${hoardingHTML(room)}
        ${giftHTML()}
        ${plaqueHTML(room)}
        ${exitHTML()}
      </div>`,

    init: (el, room, { kit, quiet }) => {
      const art = el.querySelector('.skylight__art');
      const { panes, sun } = drawSkylight(kit(art, room.tone));
      if (!quiet) {
        gsap.timeline({ scrollTrigger: { trigger: art, start: 'top 85%', end: 'center 40%', scrub: 0.8 } })
          .to(panes[0], { x: -300, ease: 'none' }, 0)
          .to(panes[1], { x: 300, ease: 'none' }, 0)
          .fromTo(sun, { y: 90 }, { y: 0, ease: 'none' }, 0);
        const posters = el.querySelectorAll('.poster');
        gsap.set(posters, { y: 30, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: el.querySelector('.hoarding'), start: 'top 78%', once: true,
          onEnter: () => gsap.to(posters, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.6)' }),
        });
      }

      el.querySelector('[data-resume]').addEventListener('click', (e) => openResume(e.currentTarget));
      el.querySelector('[data-vcard]').addEventListener('click', () => download(new Blob([vcard(room.contact)], { type: 'text/vcard' }), 'manoj-maheshwar-jagadeesan.vcf'));

      mountManoj(el.querySelector('.exit__guide'), { pose: 'wave', label: 'Doodle Manoj waving goodbye' });
      paintReceipt(el);
      on((type) => {
        if (type === 'punch' || type === 'ticket' || type === 'visitor') paintReceipt(el);
      });
      ScrollTrigger.create({ trigger: el.querySelector('.exit'), start: 'top 85%', onEnter: () => paintReceipt(el) });
    },
  },
};
