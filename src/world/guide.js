// Doodle Manoj as one guide for the whole walk in. He waits in the booth window, walks out of the booth's side door
// and over to the museum steps, climbs them holding your hand, and holds the door while you go in.
// He is flat paper: an HTML doodle drawn over the 3D world at a point on the ground, so he keeps his poses and his
// boil while the camera moves around him. The camera's half of the walk is in world.js (the walk and steps keyframes).

import gsap from 'gsap';
import { Vector3 } from 'three';
import { mountManoj } from '../character/manoj.js';
import { visitorArm } from '../character/arm.js';
import { ensureWorld } from './stage.js';

export const GUIDE_INTRO = "I'm Manoj, your guide tonight.";

// The drawing is 220 wide by 372 tall, with his soles at 354. In the world it stands 1.9 m tall.
const VIEW_W = 220;
const VIEW_H = 372;
const SOLES = 354;
const TALL = 1.9;

// Inside the booth he only shows through its window or the guides' doorway, both facing the avenue.
const BOOTH_FRONT = 17.39;
const WINDOW = [[17.36, 2.72, -178.94], [17.36, 2.72, -177.06], [17.36, 1.31, -177.06], [17.36, 1.31, -178.94]];
const DOORWAY = [[17.38, 2.15, -180.3], [17.38, 2.15, -179.4], [17.38, 0, -179.4], [17.38, 0, -180.3]];

// Where he stands on the walk over from the booth (0 to 1). At the window he is up on the booth floor.
const WALK = [
  { at: 0.005, x: 17.42, z: -178, y: 0.81 },
  { at: 0.13, x: 17.42, z: -179.55, y: 0.81 },
  { at: 0.199, x: 17.42, z: -179.55, y: 0.81 },
  { at: 0.2, x: 17.62, z: -179.85 },
  { at: 0.27, x: 16.95, z: -180.15 },
  { at: 0.42, x: 15.9, z: -184.2 },
  { at: 0.6, x: 14.5, z: -190.4 },
  { at: 0.78, x: 13.2, z: -196.6 },
  { at: 0.9, x: 12.4, z: -200.45 },
];

// And on the steps (0 to 1): about five meters ahead of the camera, then beside the open door, then out of your way
// as you walk in. On a tall phone screen he waits nearer the middle, so he's still in view.
const onSteps = (side) => [
  { at: 0.13, x: 12.4, z: -200.45 },
  { at: 0.62, x: 19.7, z: -200.45 },
  { at: 0.74, x: 21.0, z: -200.45 - 0.85 * side },
  { at: 0.87, x: 21.0, z: -200.45 - 0.85 * side },
  { at: 0.93, x: 20.8, z: -202.2 - 1.2 * side },
];

// The ground under a point: the plaza, then the museum's three steps and the landing.
function ground(x, z) {
  if (z < -205.5 || z > -194.5 || x < 12.5 || x > 22.5) return 0;
  if (x < 13.7) return 0.15;
  if (x < 14.9) return 0.3;
  return 0.45;
}

function along(keys, t, out) {
  const end = keys.length - 1;
  let i = 1;
  while (i < end && keys[i].at < t) i += 1;
  const a = keys[i - 1];
  const b = keys[i];
  const u = Math.min(1, Math.max(0, (t - a.at) / Math.max(1e-6, b.at - a.at)));
  out.x = a.x + (b.x - a.x) * u;
  out.z = a.z + (b.z - a.z) * u;
  out.y = a.y !== undefined && b.y !== undefined ? a.y + (b.y - a.y) * u : ground(out.x, out.z);
  return out;
}

let pending = null;

// One guide, made for whichever scene asks first. Without the 3D world there is no guide to share.
export function ensureGuide() {
  if (!pending) pending = ensureWorld().then((world) => (world ? createGuide(world) : null));
  return pending;
}

function createGuide(world) {
  const layer = document.createElement('div');
  layer.className = 'guide-layer';
  layer.hidden = true;
  layer.innerHTML = `
    <div class="guide-layer__manoj"></div>
    <div class="guide-layer__hand" aria-hidden="true"><div class="guide-layer__reach">${visitorArm}</div></div>
    <p class="bubble guide-layer__bubble" aria-live="polite"></p>`;
  (document.getElementById('tour') || document.body).prepend(layer);

  const figure = layer.querySelector('.guide-layer__manoj');
  const character = mountManoj(figure, { pose: 'wave', label: 'Doodle Manoj, your guide' });
  const hand = layer.querySelector('.guide-layer__hand');
  const bubble = layer.querySelector('.guide-layer__bubble');
  // Scenes speak through him while the walk is theirs: the booth at the window, the steps scene on the steps.
  const lines = { booth: '', steps: '' };
  const poses = { booth: 'wave', steps: 'wave' };

  const spot = {};
  const feet = new Vector3();
  const lastFeet = new Vector3();
  const point = new Vector3();
  const base = {};
  const crown = {};
  const corner = {};
  let shownPose = '';
  let shownLine = '';
  let bubbleW = 0;
  let bubbleH = 0;
  let movingUntil = 0;
  let walking = false;
  let fresh = true;

  const project = (x, y, z, out) => world.project(point.set(x, y, z), out);

  world.onFrame((time) => {
    const y = world.railY;
    const walk = world.rail.span('walk');
    const steps = world.rail.span('steps');
    const arriving = Math.min(1, Math.max(0, (world.progress - 0.78) / 0.07));
    const intro = walk && steps && arriving > 0 && y < steps[1];
    if (!intro) {
      if (!layer.hidden) { layer.hidden = true; fresh = true; }
      return;
    }
    layer.hidden = false;

    let pose;
    let line;
    let holding = false;
    if (y < walk[0]) {
      along(WALK, 0, spot);
      pose = poses.booth;
      line = lines.booth;
    } else if (y < steps[0]) {
      const w = world.rail.local('walk', y);
      along(WALK, w, spot);
      pose = w < 0.005 ? poses.booth : w < 0.88 ? 'walk' : 'wave';
      // His answer at the booth stays with him on the way to his door (the walk in sets off as you choose, so there's
      // no time for another line in there), then he's out and leading the way.
      line = w < 0.2 ? lines.booth : w < 0.26 ? '' : w < 0.84 ? 'Right this way.' : GUIDE_INTRO;
    } else {
      along(onSteps(window.innerHeight > window.innerWidth ? 0.35 : 1), world.rail.local('steps', y), spot);
      pose = poses.steps;
      line = lines.steps;
      holding = true;
    }

    // Stand the drawing on the ground: project his soles and the top of the drawing.
    project(spot.x, spot.y, spot.z, base);
    project(spot.x, spot.y + TALL * (SOLES / VIEW_H), spot.z, crown);
    const height = Math.max(1, (base.y - crown.y) * (VIEW_H / SOLES));
    const width = height * (VIEW_W / VIEW_H);
    const left = base.x - width / 2;
    // He stays behind as the camera walks past him into the museum.
    const alpha = arriving * Math.min(1, Math.max(0, (base.depth - 1.6) / 0.8));
    figure.style.width = `${width.toFixed(1)}px`;
    figure.style.translate = `${left.toFixed(1)}px ${crown.y.toFixed(1)}px`;
    figure.style.opacity = alpha.toFixed(3);

    // Inside the booth he only shows through its window, or through the doorway on his way out.
    const inBooth = spot.x > BOOTH_FRONT && spot.x < 19.6 && spot.z > -180.5 && spot.z < -176.8;
    const quad = inBooth ? (spot.y > 0.4 ? WINDOW : DOORWAY) : null;
    figure.style.clipPath = quad
      ? `polygon(${quad.map(([qx, qy, qz]) => {
        project(qx, qy, qz, corner);
        return `${(corner.x - left).toFixed(1)}px ${(corner.y - crown.y).toFixed(1)}px`;
      }).join(', ')})`
      : '';

    // His legs move while he does.
    feet.set(spot.x, spot.y, spot.z);
    if (fresh) { lastFeet.copy(feet); fresh = false; }
    if (feet.distanceToSquared(lastFeet) > 1e-6) movingUntil = time + 0.18;
    lastFeet.copy(feet);
    const moving = time < movingUntil;
    if (moving !== walking) { walking = moving; character.walking(moving); }
    if (pose !== shownPose) { shownPose = pose; character.pose(pose); }

    // The bubble sits over his head.
    const text = alpha > 0.05 ? line : '';
    if (text !== shownLine) {
      shownLine = text;
      if (text) {
        bubble.textContent = text;
        bubbleW = bubble.offsetWidth;
        bubbleH = bubble.offsetHeight;
        gsap.fromTo(bubble, { scale: 0.86, rotate: -3 }, { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(3)', overwrite: true });
      }
    }
    bubble.style.opacity = text ? alpha.toFixed(3) : '0';
    if (text) {
      const bx = Math.min(window.innerWidth - bubbleW - 12, Math.max(12, base.x - width * 0.14));
      const by = Math.max(66, crown.y - bubbleH - 2);
      bubble.style.translate = `${bx.toFixed(1)}px ${by.toFixed(1)}px`;
    }

    // On the steps, your hand holds his.
    hand.style.opacity = holding ? alpha.toFixed(3) : '0';
    if (holding) {
      const reach = Math.min(window.innerWidth * 0.55, width * 1.45);
      hand.style.width = `${reach.toFixed(1)}px`;
      hand.style.translate = `${(left + width * 0.93 - reach * 0.27).toFixed(1)}px ${(crown.y + height - width * 0.608 - reach * 0.27).toFixed(1)}px`;
    }
  });

  return {
    hand: layer.querySelector('.guide-layer__reach'),
    say(owner, line) { lines[owner] = line || ''; },
    pose(owner, name) { poses[owner] = name; },
    waiting(on) { character.waiting(on); },
  };
}
