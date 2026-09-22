// Room 12 · Skylight: what's next. The top of the spiral opens onto a New York dawn.
// A gallery boarded up for your team with the 90-day plan pasted on the hoarding, the availability
// plaque, a guestbook, the gift shop, and the street outside where the billboard says goodbye.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { manojSVG, mountManoj } from '../character/manoj.js';
import { state, on, formatVisitor, ROOM_COUNT } from '../lib/state.js';
import { LOGO_HTML, drawLogo } from '../lib/logo.js';

const BOOK_KEY = 'manoj-museum:guestbook';
const MODE = { full: 'full tour', express: 'express tour', resume: 'just the resume' };
const readNotes = () => { try { return JSON.parse(localStorage.getItem(BOOK_KEY)) || []; } catch { return []; } };
const saveNotes = (notes) => { try { localStorage.setItem(BOOK_KEY, JSON.stringify(notes.slice(-20))); } catch { /* private mode */ } };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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

// Renders the doodle guide onto a phone-sized wallpaper.
export async function wallpaper() {
  const W = 1170;
  const H = 2532;
  const canvas = Object.assign(document.createElement('canvas'), { width: W, height: H });
  const c = canvas.getContext('2d');
  c.fillStyle = '#F1EDE3';
  c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(14, 13, 11, .14)';
  for (let x = 30; x < W; x += 54) for (let y = 30; y < H; y += 54) { c.beginPath(); c.arc(x, y, 3, 0, Math.PI * 2); c.fill(); }
  const css = document.getElementById('manoj-character-style')?.textContent || '';
  const defs = document.querySelector('#fx-defs defs')?.innerHTML || '';
  const markup = manojSVG({ pose: 'wave' }).trim()
    .replace(/<svg([^>]*)>/, `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="1488"$1><style>${css}</style><defs>${defs}</defs>`);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  await img.decode();
  c.drawImage(img, (W - 880) / 2, 640, 880, 1488);
  c.fillStyle = '#0E0D0B';
  c.textAlign = 'center';
  drawLogo(c, W / 2, 360, 84, '#0E0D0B');
  c.font = '500 66px Caveat, cursive';
  c.fillText(`visitor ${formatVisitor(state.visitor)} was here`, W / 2, 470);
  c.font = '400 34px "JetBrains Mono", monospace';
  c.fillText('manoj.ai', W / 2, H - 180);
  await new Promise((resolve) => canvas.toBlob((blob) => { if (blob) download(blob, 'doodle-manoj-wallpaper.png'); resolve(); }, 'image/png'));
}

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
  let x = 24;
  [90, 140, 70, 180, 110, 60, 150, 96, 130, 76, 160, 88].forEach((h, i) => {
    const w = 34 + (i % 3) * 10;
    k.into(sky).rect(x, 384 - h, w, h + 40, { fill: ink, fillStyle: 'solid', stroke: ink, seed: 20 + i });
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
  k.mono(300, 410, 'THE SKYLIGHT · TOP OF THE SPIRAL', { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700 });
  return { panes, sun };
}

const hoardingHTML = (room) => `
  <section class="hoarding" aria-labelledby="hoarding-title">
    <div class="hoarding__tape" aria-hidden="true"></div>
    <div class="hoarding__wall">
      <div class="poster poster--big">
        <p class="dotf poster__coming">COMING SOON</p>
        <h3 class="poster__team" id="hoarding-title">YOUR TEAM</h3>
        <p class="mono">This gallery is boarded up for whoever I build with next. The plan is already pasted on the wall.</p>
      </div>
      ${room.plan.map((p, i) => `
        <article class="poster" style="--tilt:${[-1.4, 1.1, -0.7][i]}deg">
          <p class="mono poster__days">${p.days}</p>
          <h4 class="poster__phase">${p.phase}</h4>
          <p class="poster__goal">${p.goal}</p>
          <ul class="poster__steps">${p.steps.map((s) => `<li>${s}</li>`).join('')}</ul>
          <p class="poster__result"><span class="mono">By day ${(i + 1) * 30}</span>${p.result}</p>
        </article>`).join('')}
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
      <a class="btn btn--ghost" href="${room.contact.site}" target="_blank" rel="noopener">manoj.ai</a>
    </div>
    <p class="mono plaque__email">${room.contact.email}</p>
  </section>`;

const guestbookHTML = () => `
  <section class="guestbook" aria-labelledby="guestbook-title">
    <div class="guestbook__head">
      <p class="mono">The guestbook</p>
      <h3 class="t-h2" id="guestbook-title">Sign before you go.</h3>
      <p class="guestbook__note">Notes stay on this device until the public guestbook is switched on.</p>
    </div>
    <form class="guestbook__form" data-guestbook>
      <label><span class="mono">Your note</span><textarea name="note" maxlength="180" rows="3" required placeholder="The leap got me."></textarea></label>
      <label><span class="mono">Signed</span><input name="name" maxlength="30" autocomplete="given-name" placeholder="visitor ${formatVisitor(state.visitor)}"></label>
      <button class="btn btn--ink" type="submit">Sign the guestbook</button>
    </form>
    <ol class="guestbook__page" data-notes></ol>
  </section>`;

const giftHTML = () => `
  <section class="gift" aria-labelledby="gift-title">
    <p class="mono">The gift shop</p>
    <h3 class="t-h2" id="gift-title">Take something home.</h3>
    <ul class="gift__shelf">
      <li class="gift__item"><span class="gift__icon" aria-hidden="true">PDF</span><h4>The resume</h4><p>One page, every stop.</p><a class="btn btn--ink" href="/resume.pdf" download>Download</a></li>
      <li class="gift__item"><span class="gift__icon" aria-hidden="true">VCF</span><h4>Contact card</h4><p>Straight into your phone.</p><button class="btn btn--ink" type="button" data-vcard>Save the card</button></li>
      <li class="gift__item"><span class="gift__icon" aria-hidden="true">PNG</span><h4>Doodle wallpaper</h4><p>Your guide, on your lock screen.</p><button class="btn btn--ink" type="button" data-wallpaper>Make wallpaper</button></li>
    </ul>
    <ul class="beat__tell"><li class="tellme">Tell me: drop the latest resume at public/resume.pdf</li></ul>
  </section>`;

const exitHTML = () => `
  <section class="exit" aria-labelledby="exit-title">
    <div class="exit__board">
      <p class="mono exit__kicker">Back on Fifth Avenue</p>
      <h3 class="dotf exit__thanks" id="exit-title">THANKS, VISITOR <span data-visitor>${formatVisitor(state.visitor)}</span></h3>
      <div class="exit__guide"></div>
    </div>
    <div class="receipt">
      <p class="receipt__head">${LOGO_HTML}</p>
      <p class="mono receipt__sub">Fifth Avenue, New York</p>
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
        <svg class="skylight__art" viewBox="0 0 600 420" role="img" aria-label="The skylight at the top of the spiral, opening onto a New York dawn"></svg>
        ${hoardingHTML(room)}
        ${plaqueHTML(room)}
        ${room.tell?.length ? `<ul class="beat__tell">${room.tell.map((t) => `<li class="tellme">Tell me: ${t}</li>`).join('')}</ul>` : ''}
        ${guestbookHTML()}
        ${giftHTML()}
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

      const form = el.querySelector('[data-guestbook]');
      const page = el.querySelector('[data-notes]');
      const paintNotes = () => {
        const notes = readNotes();
        page.innerHTML = notes.length
          ? notes.slice().reverse().map((n, i) => `<li style="--tilt:${i % 2 ? 0.6 : -0.6}deg"><span class="hand">${esc(n.note)}</span><span class="mono">${esc(n.name)} · ${esc(n.date)}</span></li>`).join('')
          : '<li class="guestbook__empty"><span class="hand">No notes on this device yet. Be the first.</span></li>';
      };
      paintNotes();
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const note = String(data.get('note') || '').trim();
        if (!note) return;
        const notes = readNotes();
        notes.push({
          note: note.slice(0, 180),
          name: String(data.get('name') || '').trim().slice(0, 30) || `visitor ${formatVisitor(state.visitor)}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        });
        saveNotes(notes);
        form.reset();
        paintNotes();
      });

      el.querySelector('[data-vcard]').addEventListener('click', () => download(new Blob([vcard(room.contact)], { type: 'text/vcard' }), 'manoj-maheshwar-jagadeesan.vcf'));
      el.querySelector('[data-wallpaper]').addEventListener('click', async (e) => {
        const button = e.currentTarget;
        button.disabled = true;
        button.textContent = 'Drawing...';
        try { await wallpaper(); button.textContent = 'Saved. Make another'; } catch (err) { button.textContent = 'Try again'; console.warn('[museum] wallpaper failed', err); } finally { button.disabled = false; }
      });

      mountManoj(el.querySelector('.exit__guide'), { pose: 'wave', label: 'Doodle Manoj waving goodbye' });
      paintReceipt(el);
      on((type) => {
        if (type === 'punch' || type === 'ticket' || type === 'visitor') paintReceipt(el);
        if (type === 'visitor') el.querySelector('[data-guestbook] input[name="name"]').placeholder = `visitor ${formatVisitor(state.visitor)}`;
      });
      ScrollTrigger.create({ trigger: el.querySelector('.exit'), start: 'top 85%', onEnter: () => paintReceipt(el) });
    },
  },
};
