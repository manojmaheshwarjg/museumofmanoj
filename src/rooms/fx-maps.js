// 4D effects on maps and in the air: client pins dropping in, planes that fly their route
// as you scroll, and the snowfall that follows you through Buffalo.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const enter = (el, fn, start = 'top 72%') => ScrollTrigger.create({ trigger: el, start, once: true, onEnter: fn });

// Moves the plane along its dashed route, nose first, tied to scroll.
function flyAlong(beat, quiet) {
  const route = beat.querySelector('.fx-arc');
  const plane = beat.querySelector('.fx-plane');
  if (!route || !plane || quiet) return;
  const length = route.getTotalLength();
  const scale = (/scale\(([\d.]+)\)/.exec(plane.getAttribute('transform')) || [])[1] || 1;
  const place = (p) => {
    const at = route.getPointAtLength(length * p);
    const ahead = route.getPointAtLength(Math.min(length, length * p + 1));
    const behind = route.getPointAtLength(Math.max(0, length * p - 1));
    const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI + 90;
    plane.setAttribute('transform', `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${scale})`);
  };
  place(0);
  ScrollTrigger.create({ trigger: beat, start: 'top 75%', end: 'bottom 40%', scrub: 0.6, onUpdate: (self) => place(self.progress) });
}

export const FX = {
  pins: (beat, { quiet }) => {
    const pins = [...beat.querySelectorAll('.fx-pin')];
    if (quiet || !pins.length) return;
    gsap.set(pins, { y: -60, autoAlpha: 0 });
    enter(beat, () => gsap.to(pins, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'bounce.out', stagger: 0.28 }));
  },

  'flight-india': (beat, { quiet }) => flyAlong(beat, quiet),

  'flight-world': (beat, { quiet }) => {
    flyAlong(beat, quiet);
    const clouds = beat.querySelector('.fx-clouds');
    const stage = beat.querySelector('.beat__stage');
    if (quiet) return;
    // a little rumble on takeoff
    enter(beat, () => gsap.fromTo(stage, { rotation: -0.25 }, { rotation: 0.25, duration: 0.05, repeat: 13, yoyo: true, ease: 'none', onComplete: () => gsap.set(stage, { rotation: 0 }) }), 'top 45%');
    if (!clouds) return;
    const drift = gsap.fromTo(clouds, { x: 70 }, { x: -70, duration: 7, ease: 'none', repeat: -1, paused: true });
    ScrollTrigger.create({ trigger: beat, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? drift.play() : drift.pause()) });
  },

  // Snow falls across the whole Buffalo room. Tap anywhere in the room for a blizzard.
  snow: (layer, { quiet, onDispose }) => {
    const canvas = layer?.querySelector('canvas');
    if (!canvas || quiet) return;
    const room = layer.closest('.room');
    const paint = canvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const color = getComputedStyle(room).color;
    let flakes = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let gust = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      paint.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = matchMedia('(max-width: 719px)').matches ? 9000 : 6000;
      flakes = Array.from({ length: Math.round((w * h) / density) }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: 0.8 + Math.random() * 2.4, speed: 0.4 + Math.random() * 1.1, phase: Math.random() * 6.28,
      }));
    };
    const tick = () => {
      paint.clearRect(0, 0, w, h);
      paint.fillStyle = color;
      paint.globalAlpha = 0.5;
      const wind = Math.sin(performance.now() / 2400) * 0.5 + gust;
      flakes.forEach((f) => {
        f.phase += 0.01;
        f.y += f.speed * (1 + gust * 2);
        f.x += wind + Math.sin(f.phase) * 0.3;
        if (f.y > h + 4) { f.y = -4; f.x = Math.random() * w; }
        if (f.x > w + 4) f.x = -4;
        if (f.x < -4) f.x = w + 4;
        paint.beginPath();
        paint.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        paint.fill();
      });
      gust *= 0.97;
      if (running) raf = requestAnimationFrame(tick);
    };
    const start = () => { if (running) return; running = true; resize(); raf = requestAnimationFrame(tick); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    ScrollTrigger.create({ trigger: room, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? start() : stop()) });
    const onResize = () => { if (running) resize(); };
    addEventListener('resize', onResize);
    room.addEventListener('pointerdown', () => { gust = 2.5; });
    // Moving on to another stop: the snow stops falling, and lets go of the window.
    onDispose?.(() => { stop(); removeEventListener('resize', onResize); });
  },
};
