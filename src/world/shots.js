// The camera's walk from above 26th Avenue down to the ticket booth window.
// Each shot is a keyframe on scroll progress: where the camera is, and what it looks at.

import { CatmullRomCurve3, Vector3 } from 'three';

export const SHOTS = [
  { at: 0.0, pos: [-72, 58, 60], look: [26, 10, -196] },
  { at: 0.17, pos: [-30, 30, 8], look: [12, 10, -150] },
  { at: 0.35, pos: [0, 7.4, -18], look: [3, 8.5, -120] },
  { at: 0.55, pos: [1.6, 3.3, -104], look: [9, 4, -178] },
  { at: 0.72, pos: [7.6, 2.5, -160], look: [18, 2.2, -178] },
  { at: 0.86, pos: [12.4, 2.25, -178], look: [18, 2.3, -178] },
  { at: 1.0, pos: [12.4, 2.25, -178], look: [18, 2.3, -178] },
];

// The booth window and ticket slot, for pinning HTML (the guide, the ticket) onto the 3D booth.
export const ANCHORS = {
  window: new Vector3(17.36, 2.02, -178),
  windowTop: new Vector3(17.36, 2.72, -178),
  windowBottom: new Vector3(17.36, 1.31, -178),
  slot: new Vector3(17.34, 0.9, -178),
};

const positions = new CatmullRomCurve3(SHOTS.map((s) => new Vector3(...s.pos)), false, 'centripetal');
const targets = new CatmullRomCurve3(SHOTS.map((s) => new Vector3(...s.look)), false, 'centripetal');

export function shotAt(progress, outPos, outLook) {
  const p = Math.min(1, Math.max(0, progress));
  const last = SHOTS.length - 1;
  let i = 0;
  while (i < last - 1 && p > SHOTS[i + 1].at) i += 1;
  const a = SHOTS[i];
  const b = SHOTS[i + 1];
  const local = b.at > a.at ? Math.min(1, (p - a.at) / (b.at - a.at)) : 0;
  const u = (i + local) / last;
  positions.getPoint(u, outPos);
  targets.getPoint(u, outLook);
}
