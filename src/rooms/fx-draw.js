// 4D effects that draw and tick: lines drawing themselves in, circuits lighting up, a departures board flipping,
// a 24-hour countdown and wall clocks on real time.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { paintClocks } from './art-06.js';

const enter = (el, fn, start = 'top 72%') => ScrollTrigger.create({ trigger: el, start, once: true, onEnter: fn });
const whileVisible = (el, play, pause) => ScrollTrigger.create({
  trigger: el, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? play() : pause()),
});

// Strokes start hidden, then draw themselves in when the beat arrives.
function drawIn(beat, selector, { quiet, stagger = 0.16, duration = 0.5, after } = {}) {
  const paths = [...beat.querySelectorAll(selector)];
  if (!paths.length) return;
  if (quiet) { after?.(); return; }
  paths.forEach((p) => {
    const length = p.getTotalLength();
    p.style.strokeDasharray = `${length}`;
    p.style.strokeDashoffset = `${length}`;
  });
  enter(beat, () => gsap.to(paths, { strokeDashoffset: 0, duration, stagger, ease: 'none', onComplete: after }));
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const FX = {
  underline: (beat, { quiet }) => drawIn(beat, '.fx-underline, .fx-circle', { quiet, stagger: 0.5, duration: 0.7 }),
  checklist: (beat, { quiet }) => drawIn(beat, '.fx-check', { quiet, stagger: 0.45, duration: 0.35 }),

  circuit: (beat, { quiet }) => {
    const leds = [...beat.querySelectorAll('.fx-led')];
    const lit = leds[0]?.getAttribute('stroke');
    drawIn(beat, '.fx-trace', {
      quiet, stagger: 0.25, duration: 0.6,
      after: () => {
        if (quiet) { leds.forEach((led) => led.setAttribute('fill', lit)); return; }
        gsap.to(leds, { attr: { fill: lit }, duration: 0.01, stagger: 0.18 });
        const blink = gsap.to(leds[1], { opacity: 0.25, duration: 0.5, repeat: -1, yoyo: true, ease: 'steps(1)', paused: true, delay: 1 });
        whileVisible(beat, () => blink.play(), () => blink.pause());
      },
    });
  },

  departures: (beat, { quiet }) => {
    if (quiet) return;
    const flaps = [...beat.querySelectorAll('.fx-flap')];
    enter(beat, () => flaps.forEach((node, i) => {
      const final = node.textContent;
      const total = 16 + i * 6;
      let step = 0;
      const timer = setInterval(() => {
        step += 1;
        const settled = Math.floor((step / total) * final.length);
        node.textContent = [...final].map((ch, j) => (j < settled || ch === ' ' ? ch : LETTERS[Math.floor(Math.random() * LETTERS.length)])).join('');
        if (step >= total) { clearInterval(timer); node.textContent = final; }
      }, 55);
    }));
  },

  // 24 hours run out as you scroll through the RhoHack beat.
  countdown: (beat, { quiet }) => {
    const clock = beat.querySelector('.fx-countdown');
    if (!clock) return;
    const pad = (v) => String(v).padStart(2, '0');
    const format = (s) => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
    ScrollTrigger.create({
      trigger: beat, start: 'top 85%', end: 'bottom 25%',
      onUpdate: (self) => { clock.textContent = format(Math.round((1 - self.progress) * 86399)); },
    });
    const bars = [...beat.querySelectorAll('.fx-wave .fx-bar')];
    if (quiet || !bars.length) return;
    const wave = gsap.to(bars, {
      scaleY: () => gsap.utils.random(0.3, 1.4), transformOrigin: '50% 50%', duration: 0.18, paused: true,
      stagger: { each: 0.02, from: 'center', repeat: -1, yoyo: true, repeatRefresh: true },
    });
    whileVisible(beat, () => wave.play(), () => wave.pause());
  },

  clocks: (beat, { onDispose } = {}) => {
    let timer = 0;
    whileVisible(beat, () => {
      paintClocks(beat);
      clearInterval(timer);
      timer = setInterval(() => paintClocks(beat), 20000);
    }, () => clearInterval(timer));
    // Moving on to another stop: the clocks stop with it.
    onDispose?.(() => clearInterval(timer));
  },
};
