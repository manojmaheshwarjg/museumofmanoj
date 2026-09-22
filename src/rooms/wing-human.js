// Room 11 · The human wing. Off the clock: a photo exhibition, Nano's aquarium (tap to feed),
// the coffee bar, twelve works in progress, the 2px room and the non-tech friend test.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { photo } from '../lib/doodle.js';

const NANO_KEY = 'manoj-museum:nano';
export const readFed = () => { try { return Number(localStorage.getItem(NANO_KEY)) || 0; } catch { return 0; } };
export const saveFed = (n) => { try { localStorage.setItem(NANO_KEY, String(n)); } catch { /* private mode: count stays in memory */ } };
let clipCount = 0;

const tells = (item) => (item.tell?.length ? `<ul class="beat__tell">${item.tell.map((t) => `<li class="tellme">Tell me: ${t}</li>`).join('')}</ul>` : '');

const INNER = {
  photos: (item) => `
    <p class="dotf alcove__tag">NIKON D3300 · 35MM F/1.8</p>
    <div class="salon">${item.photos.map((file, i) => photo({ file, ar: i === 0 ? '4 / 5' : '1 / 1', alt: 'A photograph by Manoj' })).join('')}</div>`,
  nano: (item) => `
    <div class="tank" data-tank><svg class="tank__art" viewBox="0 0 600 340" role="img" aria-label="Nano the betta fish swimming in an aquarium"></svg></div>
    <div class="alcove__row"><button class="btn" type="button" data-feed>Feed Nano</button><span class="mono" data-fed></span></div>
    ${item.photo ? `<div class="alcove__photo">${photo(item.photo)}</div>` : ''}`,
  coffee: () => `
    <svg class="bar__art" viewBox="0 0 600 290" role="img" aria-label="A coffee bar with a pour-over and four cups"></svg>
    <div class="alcove__row"><button class="btn" type="button" data-pour>Pour a cup</button><span class="hand alcove__status" data-cups>No coffee yet. No code yet.</span></div>`,
  wip: () => '<svg class="wip__art" viewBox="0 0 600 360" role="img" aria-label="Twelve pedestals, each holding an unfinished side project"></svg>',
  pixel: () => `
    <div class="px" data-px>
      <svg class="px__art" viewBox="0 0 600 320" role="img" aria-label="A large frame where one bar sits two pixels out of line"></svg>
      <div class="px__lens" aria-hidden="true"></div>
    </div>
    <p class="mono alcove__hint">Move the magnifying glass over the frame</p>`,
  friends: () => `
    <svg class="friends__art" viewBox="0 0 600 230" data-step="0" role="img" aria-label="Three friends reacting to a new feature"></svg>
    <div class="alcove__row"><button class="btn" type="button" data-test>Show them v1</button><span class="hand alcove__status" data-note aria-live="polite">New feature. Three non-tech friends.</span></div>`,
};

function drawTank(k) {
  const { sk, ink, ground, hatch } = k;
  sk.rect(40, 30, 520, 280, { fill: ground, fillStyle: 'solid', strokeWidth: 3.2, seed: 3 });
  k.pen('M44 70 q40-10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t30 0', { 'stroke-width': 2 });
  let gravel = '';
  for (let x = 54; x < 548; x += 11) gravel += `M${x} ${296 - ((x * 7) % 9)} a4 4 0 1 0 0.1 0`;
  k.pen(gravel, { 'stroke-width': 1.6 });
  k.pen('M110 306 q-20-60 10-120 q-20 50 20 110 M470 306 q30-50 0-110 q30 40 -8 104', { 'stroke-width': 2.4 });
  const food = k.group();
  const bubbles = k.group();
  const nano = k.group({ class: 'nano' });
  const fish = k.group({}, nano);
  const tail = k.el('path', { d: 'M-34 0 q-50 -64 -104 -26 q26 22 16 42 q26 32 -12 62 q58 12 100 -52z', fill: hatch, stroke: ink, 'stroke-width': 2.4 }, fish);
  k.el('path', { d: 'M-14 -18 q8 -56 56 -34 q-12 10 -24 30z', fill: hatch, stroke: ink, 'stroke-width': 2.2 }, fish);
  k.el('path', { d: 'M-4 16 q10 40 44 24 q-14 -6 -20 -22z', fill: hatch, stroke: ink, 'stroke-width': 2 }, fish);
  k.el('ellipse', { cx: 6, cy: 0, rx: 50, ry: 24, fill: ink, stroke: ink, 'stroke-width': 2 }, fish);
  k.el('circle', { cx: 36, cy: -6, r: 5, fill: ground }, fish);
  k.pen('M54 4 q-5 3 -9 1', { stroke: ground, 'stroke-width': 2 }, fish);
  k.mono(300, 332, 'NANO · BETTA · FIRST PET', { 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700 });
  return { nano, fish, tail, food, bubbles };
}

function drawBar(k) {
  const { sk, ground, hatch, dots } = k;
  sk.line(20, 250, 580, 250, { strokeWidth: 3, seed: 2 });
  sk.poly([[80, 120], [170, 120], [140, 170], [110, 170]], { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 3 });
  sk.rect(92, 176, 66, 70, { fill: hatch, fillStyle: 'solid', strokeWidth: 2.6, seed: 4 });
  const steam = k.group();
  ['M110 108 q-10-14 0-26 q10-12 0-26', 'M126 106 q-10-16 0-30 q10-14 0-30', 'M142 108 q-8-12 0-24 q8-10 0-22'].forEach((d) => k.pen(d, { 'stroke-width': 2, opacity: 0.7 }, steam));
  sk.path('M200 246 v-70 q0-20 20-20 h44 q20 0 20 20 v70z', { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 5 });
  k.pen('M200 190 q-40 -10 -52 -40', { 'stroke-width': 4 });
  const fills = [330, 400, 470, 540].map((x, i) => {
    const cup = `M${x - 26} 196 h52 v40 q0 14 -14 14 h-24 q-14 0 -14 -14z`;
    const id = `cup-clip-${(clipCount += 1)}`;
    k.el('path', { d: cup }, k.el('clipPath', { id }, k.el('defs')));
    const fill = k.el('rect', { x: x - 26, y: 196, width: 52, height: 56, fill: dots }, k.el('g', { 'clip-path': `url(#${id})` }));
    sk.path(cup, { strokeWidth: 2.6, seed: 10 + i });
    k.pen(`M${x + 26} 206 q16 4 0 24`, { 'stroke-width': 2.2 });
    k.mono(x, 274, `CUP ${i + 1}`, { 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700 });
    return fill;
  });
  k.pen('M378 158 h180 M378 158 v10 M558 158 v10', { 'stroke-width': 2.2 });
  k.hand(468, 146, 'best code', { 'text-anchor': 'middle', 'font-size': 26 });
  return { fills, steam };
}

function drawWip(k) {
  const { sk, ink, ground, hatch } = k;
  for (let i = 0; i < 12; i++) {
    const x = 50 + (i % 6) * 100;
    const y = 30 + Math.floor(i / 6) * 150;
    if (i % 3 === 0) {
      sk.rect(x + 22, y + 20, 36, 42, { strokeWidth: 2, strokeLineDash: [5, 4], seed: 50 + i });
      sk.rect(x + 22, y + 42, 36, 20, { fill: hatch, fillStyle: 'solid', seed: 60 + i });
    } else if (i % 3 === 1) {
      k.pen(`M${x + 40} ${y + 62} v-46 M${x + 24} ${y + 62} l16-28 16 28 M${x + 28} ${y + 44} h24`, { 'stroke-width': 2 });
    } else {
      k.pen(`M${x + 58} ${y + 42} a18 18 0 1 0 -18 18`, { 'stroke-width': 2.6 });
      k.pen(`M${x + 58} ${y + 42} a18 18 0 0 1 -18 18`, { 'stroke-width': 1.4, 'stroke-dasharray': '3 4' });
    }
    sk.rect(x, y + 62, 80, 10, { fill: ink, fillStyle: 'solid', seed: 30 + i });
    sk.rect(x + 10, y + 72, 60, 68, { fill: ground, fillStyle: 'solid', strokeWidth: 2, seed: 10 + i });
    k.mono(x + 40, y + 112, `WIP ${String(i + 1).padStart(2, '0')}`, { 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700 });
  }
  k.hand(300, 350, 'work in progress, no regrets', { 'text-anchor': 'middle', 'font-size': 28 });
}

function drawPixel(k) {
  const { sk, ink, ground, hatch } = k;
  sk.rect(60, 26, 480, 268, { fill: ground, fillStyle: 'solid', strokeWidth: 8, roughness: 0.6, seed: 3 });
  k.pen('M150 46 V274', { 'stroke-width': 0.8, 'stroke-dasharray': '3 3', opacity: 0.7 });
  k.el('rect', { x: 150, y: 80, width: 300, height: 56, fill: ink });
  k.el('rect', { x: 152, y: 164, width: 300, height: 56, fill: hatch, stroke: ink, 'stroke-width': 1.2 });
  k.pen('M150 240 H152 M150 237 v6 M152 237 v6', { 'stroke-width': 0.6 });
  k.hand(151, 252, '2px', { 'text-anchor': 'middle', 'font-size': 7 });
}

function drawFriends(k) {
  const { sk, ink, ground, hatch } = k;
  [130, 300, 470].forEach((x, i) => {
    sk.path(`M${x - 64} 228 q0-62 64-62 q64 0 64 62`, { fill: hatch, fillStyle: 'solid', strokeWidth: 2.4, seed: 10 + i });
    sk.circle(x, 104, 112, { fill: ground, fillStyle: 'solid', strokeWidth: 2.6, seed: 20 + i });
    const neutral = k.group({ class: 'f-neutral' });
    [x - 20, x + 20].forEach((ex) => k.el('circle', { cx: ex, cy: 96, r: 5, fill: ink }, neutral));
    k.pen(`M${x - 18} 132 h36`, { 'stroke-width': 3 }, neutral);
    const confused = k.group({ class: 'f-confused' });
    [x - 20, x + 20].forEach((ex) => k.el('circle', { cx: ex, cy: 98, r: 5, fill: ink }, confused));
    k.pen(`M${x - 32} 76 l18 6 M${x + 32} 72 l-18 10 M${x - 20} 136 q10-8 20 0 q10 8 20 0`, { 'stroke-width': 3 }, confused);
    k.hand(x + 48, 46, '?', { 'font-size': 46, 'font-weight': 700 }, confused);
    const happy = k.group({ class: 'f-happy' });
    k.pen(`M${x - 28} 98 q8-10 16 0 M${x + 12} 98 q8-10 16 0 M${x - 24} 122 q24 26 48 0`, { 'stroke-width': 3 }, happy);
    k.pen(`M${x + 52} 40 h14 M${x + 59} 33 v14`, { 'stroke-width': 2.4 }, happy);
  });
}

export const WINGS = {
  wing: {
    html: (room) => `
      <div class="wing">
        ${room.items.map((item) => `
          <article class="alcove alcove--${item.kind}">
            <header class="alcove__label">
              <p class="mono">${item.label}</p>
              <h3 class="t-h2">${item.title}</h3>
              <p class="alcove__text">${item.text}</p>
            </header>
            ${INNER[item.kind](item)}
            ${tells(item)}
          </article>`).join('')}
      </div>`,

    init: (el, room, { kit, quiet, onDispose }) => {
      const tone = room.tone;

      // Nano's aquarium
      const tankBox = el.querySelector('[data-tank]');
      if (tankBox) {
        const k = kit(tankBox.querySelector('svg'), tone);
        const { nano, fish, tail, food, bubbles } = drawTank(k);
        const fedLabel = el.querySelector('[data-fed]');
        let fed = readFed();
        const paintFed = () => { fedLabel.textContent = fed ? `Fed ${fed} ${fed === 1 ? 'time' : 'times'} on this device` : 'Not fed yet today'; };
        paintFed();
        gsap.set(nano, { x: 300, y: 180 });
        let swim = null;
        const makeSwim = () => {
          swim?.kill();
          if (quiet) return;
          swim = gsap.timeline({ repeat: -1 })
            .add(() => gsap.set(fish, { scaleX: 1, transformOrigin: '50% 50%' }))
            .to(nano, { x: 440, y: 160, duration: 4, ease: 'sine.inOut' })
            .add(() => gsap.set(fish, { scaleX: -1, transformOrigin: '50% 50%' }))
            .to(nano, { x: 160, y: 205, duration: 5, ease: 'sine.inOut' });
        };
        makeSwim();
        if (!quiet) {
          gsap.to(tail, { rotation: 9, transformOrigin: '100% 50%', duration: 0.45, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          ScrollTrigger.create({ trigger: tankBox, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? swim?.play() : swim?.pause()) });
        }
        const feed = () => {
          fed += 1;
          saveFed(fed);
          paintFed();
          const target = gsap.utils.random(150, 450);
          for (let i = 0; i < 5; i++) {
            const flake = k.el('rect', { x: (target + gsap.utils.random(-30, 30)).toFixed(1), y: 64, width: 5, height: 5, fill: k.ink }, food);
            gsap.to(flake, { y: gsap.utils.random(40, 90), rotation: 90, duration: quiet ? 0 : gsap.utils.random(1.2, 2), ease: 'sine.in', onComplete: () => gsap.to(flake, { opacity: 0, duration: 0.4, delay: 0.8, onComplete: () => flake.remove() }) });
          }
          for (let i = 0; i < 5; i++) {
            const bubble = k.el('circle', { cx: target, cy: 150, r: gsap.utils.random(3, 7).toFixed(1), fill: 'none', stroke: k.ink, 'stroke-width': 1.6 }, bubbles);
            gsap.to(bubble, { attr: { cy: 72 }, x: gsap.utils.random(-14, 14), opacity: 0, delay: 1 + i * 0.15, duration: gsap.utils.random(1.2, 1.9), ease: 'sine.out', onComplete: () => bubble.remove() });
          }
          if (quiet) return;
          swim?.kill();
          gsap.set(fish, { scaleX: target > gsap.getProperty(nano, 'x') ? 1 : -1, transformOrigin: '50% 50%' });
          gsap.timeline({ onComplete: makeSwim })
            .to(nano, { x: target, y: 130, duration: 1.3, ease: 'power2.out' })
            .to(nano, { y: 180, duration: 1.4, ease: 'sine.inOut', delay: 0.6 });
        };
        el.querySelector('[data-feed]').addEventListener('click', feed);
        tankBox.addEventListener('click', feed);
      }

      // The coffee bar, one cup at a time
      const barSvg = el.querySelector('.bar__art');
      if (barSvg) {
        const { fills, steam } = drawBar(kit(barSvg, tone));
        const status = el.querySelector('[data-cups]');
        const lines = ['No coffee yet. No code yet.', 'Cup 1. Warming up.', 'Cup 2. The best code starts here.', 'Cup 3. Still the good stuff.', 'Cup 4. Last call for the best code.'];
        let cups = 0;
        gsap.set(fills, { scaleY: 0, transformOrigin: '50% 100%' });
        if (!quiet) gsap.to(steam.children, { y: -10, opacity: 0.1, duration: 1.2, stagger: 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        el.querySelector('[data-pour]').addEventListener('click', (e) => {
          if (cups === 4) {
            cups = 0;
            gsap.to(fills, { scaleY: 0, duration: quiet ? 0 : 0.4, stagger: 0.05 });
            status.textContent = 'Fresh pot. Start again.';
            e.currentTarget.textContent = 'Pour a cup';
            return;
          }
          gsap.to(fills[cups], { scaleY: 1, duration: quiet ? 0 : 0.9, ease: 'power2.out' });
          cups += 1;
          status.textContent = lines[cups];
          if (cups === 4) e.currentTarget.textContent = 'Wash the cups';
        });
      }

      // Twelve works in progress
      const wipSvg = el.querySelector('.wip__art');
      if (wipSvg) drawWip(kit(wipSvg, tone));

      // The 2px room: a magnifying glass that follows the pointer
      const px = el.querySelector('[data-px]');
      if (px) {
        const art = px.querySelector('.px__art');
        drawPixel(kit(art, tone));
        const lens = px.querySelector('.px__lens');
        const zoom = art.cloneNode(true);
        zoom.removeAttribute('role');
        zoom.removeAttribute('aria-label');
        zoom.setAttribute('class', 'px__zoom');
        lens.appendChild(zoom);
        const Z = 4;
        const place = (x, y) => {
          const box = px.getBoundingClientRect();
          const r = lens.offsetWidth / 2;
          lens.style.transform = `translate(${(x - r).toFixed(1)}px, ${(y - r).toFixed(1)}px)`;
          zoom.style.width = `${box.width * Z}px`;
          zoom.style.height = `${box.height * Z}px`;
          zoom.style.transform = `translate(${(r - x * Z).toFixed(1)}px, ${(r - y * Z).toFixed(1)}px)`;
        };
        const home = () => { const box = px.getBoundingClientRect(); place(box.width * (151 / 600), box.height * (150 / 320)); };
        const follow = (e) => { const box = px.getBoundingClientRect(); place(e.clientX - box.left, e.clientY - box.top); };
        px.addEventListener('pointermove', follow);
        px.addEventListener('pointerdown', follow);
        addEventListener('resize', home);
        onDispose?.(() => removeEventListener('resize', home));
        requestAnimationFrame(home);
        ScrollTrigger.create({ trigger: px, start: 'top bottom', once: true, onEnter: home });
      }

      // The non-tech friend test
      const friendsSvg = el.querySelector('.friends__art');
      if (friendsSvg) {
        drawFriends(kit(friendsSvg, tone));
        const steps = [
          { button: 'Show them v1', note: 'New feature. Three non-tech friends.' },
          { button: 'Show them v2', note: 'Three confused faces. Back to the drawing board.' },
          { button: 'Start over', note: 'Everyone gets it. Ship it.' },
        ];
        const button = el.querySelector('[data-test]');
        const note = el.querySelector('[data-note]');
        let step = 0;
        button.addEventListener('click', () => {
          step = (step + 1) % steps.length;
          friendsSvg.dataset.step = String(step);
          button.textContent = steps[step].button;
          note.textContent = steps[step].note;
          if (!quiet) gsap.fromTo(friendsSvg, { scale: 0.96 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
        });
      }

      // Alcoves arrive as you walk in
      const alcoves = el.querySelectorAll('.alcove');
      if (quiet) return;
      alcoves.forEach((alcove) => {
        gsap.set(alcove, { y: 40, autoAlpha: 0 });
        ScrollTrigger.create({ trigger: alcove, start: 'top 82%', once: true, onEnter: () => gsap.to(alcove, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }) });
      });
    },
  },
};
