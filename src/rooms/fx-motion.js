// 4D effects that move things: steam, confetti, sticky notes, cards walking into shipped, a meter,
// a printer, a coin jar, stacks of screens, stamps, frost on landing, and a few quiet loops.
// Every drawing already shows its finished state, so with reduced motion these simply do nothing.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const $$ = (root, selector) => [...root.querySelectorAll(selector)];
const enter = (el, fn, start = 'top 72%') => ScrollTrigger.create({ trigger: el, start, once: true, onEnter: fn });
// Loops only run while their beat is on screen.
const loop = (el, tl) => {
  tl.pause();
  ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? tl.play() : tl.pause()) });
  return tl;
};

export const FX = {
  // Marina Beach: the crests roll back and forth, the foam breathes at the shoreline, and the bike rides in.
  tide: (beat, { quiet }) => {
    if (quiet) return;
    const bike = beat.querySelector('.fx-bike');
    if (bike) enter(beat, () => gsap.from(bike, { x: 380, duration: 1.7, ease: 'power2.out' }));
    const swell = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
    $$(beat, '.fx-wave').forEach((wave, i) => swell.to(wave, { x: i % 2 ? -14 : 14, duration: 2.4 }, i * 0.4));
    const foam = beat.querySelector('.fx-foam');
    if (foam) swell.to(foam, { y: 5, duration: 2.4 }, 0);
    loop(beat, swell);
  },
  steam: (beat, { quiet }) => {
    if (quiet) return;
    const puff = gsap.timeline({ repeat: -1 });
    $$(beat, '.fx-wisp').forEach((wisp, i) => {
      puff.fromTo(wisp, { y: 8, opacity: 0 }, { y: -6, opacity: 0.8, duration: 0.9, ease: 'sine.out' }, i * 0.5)
        .to(wisp, { y: -22, opacity: 0, duration: 0.9, ease: 'sine.in' }, i * 0.5 + 0.9);
    });
    loop(beat, puff);
    const auto = beat.querySelector('.fx-auto');
    if (!auto) return;
    enter(beat, () => gsap.from(auto, { x: -320, duration: 1.6, ease: 'power2.out' }));
    loop(beat, gsap.timeline({ repeat: -1 }).to(auto, { rotation: -0.8, svgOrigin: '256 360', duration: 0.1, ease: 'steps(1)' }).to(auto, { rotation: 0.6, svgOrigin: '256 360', duration: 0.1, ease: 'steps(1)' }));
  },

  confetti: (beat, { quiet, fx }) => {
    if (quiet) return;
    const caps = $$(beat, '.fx-cap');
    const letter = beat.querySelector('.fx-letter');
    const phone = beat.querySelector('.fx-buzz');
    enter(beat, () => {
      if (letter) gsap.from(letter, { y: 120, duration: 1.1, ease: 'power3.out' });
      if (caps.length) gsap.from(caps, { y: 90, rotation: -40, duration: 1, stagger: 0.12, ease: 'back.out(1.8)' });
      if (phone) gsap.fromTo(phone, { rotation: -2.5, svgOrigin: '300 210' }, { rotation: 2.5, svgOrigin: '300 210', duration: 0.06, repeat: 11, yoyo: true, ease: 'none', onComplete: () => gsap.set(phone, { rotation: 0, svgOrigin: '300 210' }) });
      for (let i = 0; i < 34; i++) {
        const bit = document.createElement('i');
        fx.appendChild(bit);
        gsap.fromTo(bit, { x: 0, y: 0, rotation: 0, opacity: 1 }, {
          x: gsap.utils.random(-320, 320), y: gsap.utils.random(-70, 320), rotation: gsap.utils.random(-540, 540),
          duration: gsap.utils.random(1.2, 2.2), delay: 0.15, ease: 'power2.out',
          onComplete: () => gsap.to(bit, { opacity: 0, duration: 0.4, onComplete: () => bit.remove() }),
        });
      }
    }, 'top 60%');
  },

  stickies: (beat, { quiet }) => {
    const notes = $$(beat, '.fx-sticky');
    if (quiet || !notes.length) return;
    gsap.set(notes, { scale: 0, transformOrigin: '50% 0%' });
    enter(beat, () => gsap.to(notes, { scale: 1, duration: 0.45, ease: 'back.out(2.4)', stagger: { each: 0.035, from: 'random' } }));
    // scroll fast and the notes flutter
    let last = 0;
    ScrollTrigger.create({
      trigger: beat, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const now = performance.now();
        if (Math.abs(self.getVelocity()) < 1400 || now - last < 500) return;
        last = now;
        gsap.to(notes, { rotation: () => gsap.utils.random(-7, 7), duration: 0.14, yoyo: true, repeat: 1, ease: 'sine.inOut', stagger: 0.01 });
      },
    });
  },

  kanban: (beat, { quiet }) => {
    const cards = $$(beat, '.fx-card');
    const stamp = beat.querySelector('.fx-stamp');
    const shipped = (card) => ({ x: Number(card.dataset.dx), y: Number(card.dataset.dy) });
    if (quiet) { cards.forEach((card) => gsap.set(card, shipped(card))); return; }
    gsap.set(stamp, { autoAlpha: 0 });
    enter(beat, () => {
      const tl = gsap.timeline();
      cards.forEach((card, i) => tl.to(card, { ...shipped(card), duration: 0.55, ease: 'power2.inOut' }, i * 0.22));
      tl.fromTo(stamp, { autoAlpha: 0, scale: 2.2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power4.in' });
    });
  },

  meter: (beat, { quiet }) => {
    const needle = beat.querySelector('.fx-needle');
    if (quiet || !needle) return;
    gsap.set(needle, { rotation: -135, svgOrigin: '300 290' });
    enter(beat, () => gsap.to(needle, { rotation: 0, svgOrigin: '300 290', duration: 1.8, ease: 'elastic.out(1, 0.35)' }));
  },

  invoice: (beat, { quiet }) => {
    const paper = beat.querySelector('.fx-invoice');
    const mail = beat.querySelector('.fx-mail');
    const pings = $$(beat, '.fx-ping circle');
    if (quiet || !paper) return;
    gsap.set(paper, { y: 76, autoAlpha: 0 });
    gsap.set(mail, { autoAlpha: 0, y: -20 });
    enter(beat, () => gsap.timeline()
      .to(mail, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(2)' })
      .fromTo(pings, { scale: 0.4, opacity: 0.9, transformOrigin: '50% 50%' }, { scale: 1.6, opacity: 0, duration: 0.8, stagger: 0.2, repeat: 2 }, '<')
      .to(paper, { autoAlpha: 1, duration: 0.15 }, '-=1.4')
      .to(paper, { y: 0, duration: 1.3, ease: 'steps(10)' }, '<'));
  },

  jar: (beat, { quiet }) => {
    const fill = beat.querySelector('.fx-fill');
    const coins = $$(beat, '.fx-coin');
    if (quiet || !fill) return;
    gsap.set(fill, { y: 160 });
    gsap.set(coins, { y: -120, autoAlpha: 0 });
    enter(beat, () => gsap.timeline()
      .to(coins, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.25, ease: 'bounce.out' })
      .to(fill, { y: 0, duration: 1.8, ease: 'power2.out' }, 0.2));
  },

  ab: (beat, { quiet }) => {
    const bars = $$(beat, '.fx-bars > g');
    if (quiet || !bars.length) return;
    gsap.set(bars, { scaleY: 0, transformOrigin: '50% 100%' });
    enter(beat, () => gsap.to(bars, { scaleY: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }));
  },

  stack: (beat, { quiet }) => {
    const items = $$(beat, '.fx-app, .fx-floor');
    if (quiet || !items.length) return;
    gsap.set(items, { y: -40, autoAlpha: 0 });
    enter(beat, () => gsap.to(items, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.09, ease: 'bounce.out' }));
  },

  stamp: (beat, { quiet }) => {
    const stamp = beat.querySelector('.fx-stamp');
    const words = beat.querySelector('.fx-words');
    const stage = beat.querySelector('.beat__stage');
    if (quiet || !stamp) return;
    gsap.set(stamp, { autoAlpha: 0 });
    if (words) gsap.set(words, { autoAlpha: 0, scale: 0.6, transformOrigin: '20% 100%' });
    enter(beat, () => {
      const tl = gsap.timeline();
      if (words) tl.to(words, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' });
      tl.fromTo(stamp, { autoAlpha: 0, scale: 2.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'power4.in' }, words ? '+=0.35' : 0)
        .fromTo(stage, { x: -4 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
    });
  },

  // Landing: a stamp, then a frosty white breath of cold air across the scene.
  frost: (beat, { quiet, fx }) => {
    if (quiet) return;
    const flakes = $$(beat, '.fx-frost path');
    const stamp = beat.querySelector('.fx-stamp');
    const veil = document.createElement('div');
    veil.className = 'beat__frost';
    fx.appendChild(veil);
    gsap.set(flakes, { scale: 0, transformOrigin: '50% 50%' });
    if (stamp) gsap.set(stamp, { autoAlpha: 0 });
    enter(beat, () => {
      const tl = gsap.timeline();
      if (stamp) tl.fromTo(stamp, { autoAlpha: 0, scale: 2.4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power4.in' });
      tl.to(veil, { opacity: 0.85, duration: 0.5, ease: 'power2.in' }, '+=0.4')
        .to(veil, { opacity: 0, duration: 1.6, ease: 'power2.out' })
        .to(flakes, { scale: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(2)' }, '-=1.4');
    }, 'top 55%');
  },

  laptops: (beat, { quiet }) => {
    const screens = $$(beat, '.fx-screen');
    if (quiet || !screens.length) return;
    gsap.set(screens, { opacity: 0.08 });
    enter(beat, () => gsap.to(screens, { opacity: 0.9, duration: 0.25, stagger: 0.45, ease: 'steps(3)' }));
  },

  rocket: (beat, { quiet }) => {
    const rocket = beat.querySelector('.fx-rocket');
    if (quiet || !rocket) return;
    enter(beat, () => gsap.fromTo(rocket, { y: 40 }, { y: -6, duration: 1.4, ease: 'power2.out' }));
    loop(beat, gsap.timeline({ repeat: -1, yoyo: true }).fromTo(rocket, { rotation: -1.5, svgOrigin: '520 200' }, { rotation: 1.5, svgOrigin: '520 200', duration: 0.1, ease: 'steps(1)' }));
  },

  typing: (beat, { quiet }) => {
    const dots = $$(beat, '.fx-typing circle');
    if (quiet || !dots.length) return;
    loop(beat, gsap.timeline({ repeat: -1, repeatDelay: 0.3 }).to(dots, { y: -7, duration: 0.25, stagger: 0.14, yoyo: true, repeat: 1, ease: 'sine.inOut' }));
  },

  sign: (beat, { quiet }) => {
    const sign = beat.querySelector('.fx-sign');
    const glow = $$(beat, '.fx-glow');
    const bulbs = $$(beat, '.fx-bulb');
    if (quiet || !sign) return;
    gsap.set([sign, ...glow], { opacity: 0.15 });
    enter(beat, () => gsap.timeline()
      .to(sign, { opacity: 1, duration: 0.05 }).to(sign, { opacity: 0.25, duration: 0.08 })
      .to(sign, { opacity: 1, duration: 0.05 }).to(sign, { opacity: 0.4, duration: 0.1 })
      .to(sign, { opacity: 1, duration: 0.05 })
      .to(glow, { opacity: 1, duration: 0.2, stagger: 0.05 }));
    loop(beat, gsap.timeline({ repeat: -1 }).to(bulbs, { opacity: 0.2, duration: 0.2, stagger: { each: 0.12, repeat: 1, yoyo: true } }));
  },

  submit: (beat, { quiet }) => {
    const btn = beat.querySelector('.fx-submit');
    if (quiet || !btn) return;
    enter(beat, () => gsap.timeline({ delay: 0.6 })
      .to(btn, { scale: 0.92, transformOrigin: '50% 50%', duration: 0.1, yoyo: true, repeat: 1 })
      .fromTo(beat.querySelector('.beat__stage'), { x: 0 }, { x: 3, duration: 0.05, yoyo: true, repeat: 5 }));
  },

  scale: (beat, { quiet }) => {
    const scale = beat.querySelector('.fx-scale');
    const needle = beat.querySelector('.fx-needle');
    if (quiet || !scale) return;
    loop(beat, gsap.timeline({ repeat: -1, yoyo: true }).fromTo(scale, { rotation: -4, svgOrigin: '300 0' }, { rotation: 4, svgOrigin: '300 0', duration: 1.2, ease: 'sine.inOut' }));
    if (needle) enter(beat, () => gsap.fromTo(needle, { rotation: -60, svgOrigin: '300 94' }, { rotation: 20, svgOrigin: '300 94', duration: 1.6, ease: 'elastic.out(1, 0.3)' }));
  },

  // The quietest room: the walk away follows your scroll, slowly.
  walk: (beat, { quiet }) => {
    const walker = beat.querySelector('.fx-walk');
    if (quiet || !walker) return;
    gsap.fromTo(walker, { x: -150 }, { x: 40, ease: 'none', scrollTrigger: { trigger: beat, start: 'top 60%', end: 'bottom 45%', scrub: 1 } });
  },

  flakes: (beat, { quiet }) => {
    const flakes = $$(beat, '.fx-flakes circle');
    if (quiet || !flakes.length) return;
    const snow = gsap.timeline();
    flakes.forEach((flake) => {
      snow.add(gsap.timeline({ repeat: -1, delay: Math.random() * 3 })
        .fromTo(flake, { y: -10, opacity: 0 }, { y: 6, opacity: 0.8, duration: 0.6, ease: 'none' })
        .to(flake, { y: 44, opacity: 0, duration: 2.2, ease: 'none' }), 0);
    });
    loop(beat, snow);
  },

  tryon: (beat, { quiet }) => {
    const hanger = beat.querySelector('.fx-hanger');
    const sparkles = $$(beat, '.fx-sparkle');
    if (quiet) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    if (hanger) tl.fromTo(hanger, { rotation: -6, svgOrigin: '480 96' }, { rotation: 6, svgOrigin: '480 96', duration: 1.1, ease: 'sine.inOut' }, 0);
    if (sparkles.length) tl.fromTo(sparkles, { scale: 0.4, opacity: 0.2, transformOrigin: '50% 50%' }, { scale: 1.1, opacity: 1, duration: 0.55, stagger: 0.18 }, 0);
    loop(beat, tl);
  },

  // Office windows across the skyline switch on and off.
  windows: (beat, { quiet }) => {
    const lights = $$(beat, '.beat__art > rect[width="5"]');
    if (quiet || !lights.length) return;
    loop(beat, gsap.timeline({ repeat: -1 }).to({}, {
      duration: 0.3,
      onComplete: () => {
        const light = lights[Math.floor(Math.random() * lights.length)];
        light.setAttribute('opacity', light.getAttribute('opacity') === '0.55' ? '0.08' : '0.55');
      },
    }));
  },
};
