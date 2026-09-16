// The camera rail: the page's scroll position mapped to a camera pose, keyframe by keyframe.
// Each scene registers keyframes measured from the DOM, so the path stretches with the page
// and the camera never cuts between scenes.

import { CatmullRomCurve3, Vector3 } from 'three';

export function createRail() {
  const builders = [];
  const ranges = new Map();
  let keys = [];
  let positions = null;
  let targets = null;
  const top = (el) => el.getBoundingClientRect().top + window.scrollY;

  return {
    add(builder) { builders.push(builder); },
    range(name, start, end) { ranges.set(name, [start, end]); },
    span: (name) => ranges.get(name),
    local(name, y) {
      const r = ranges.get(name);
      if (!r) return 0;
      return Math.min(1, Math.max(0, (y - r[0]) / Math.max(1, r[1] - r[0])));
    },
    measure() {
      const vh = window.innerHeight;
      // Keys must climb with the page; a short scene can't fold the path back on itself.
      keys = builders.flatMap((build) => build({ top, vh }) || []).filter((k, i, all) => i === 0 || k.y > all[i - 1].y);
      if (keys.length < 2) { positions = null; return; }
      positions = new CatmullRomCurve3(keys.map((k) => new Vector3(...k.pos)), false, 'centripetal');
      targets = new CatmullRomCurve3(keys.map((k) => new Vector3(...k.look)), false, 'centripetal');
    },
    pose(y, outPos, outLook) {
      if (!positions) return false;
      const last = keys.length - 1;
      if (y <= keys[0].y) { outPos.set(...keys[0].pos); outLook.set(...keys[0].look); return true; }
      if (y >= keys[last].y) { outPos.set(...keys[last].pos); outLook.set(...keys[last].look); return true; }
      let lo = 0;
      let hi = last;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (keys[mid].y <= y) lo = mid; else hi = mid;
      }
      const gap = keys[hi].y - keys[lo].y;
      const local = gap > 0 ? (y - keys[lo].y) / gap : 0;
      const u = (lo + local) / last;
      positions.getPoint(u, outPos);
      targets.getPoint(u, outLook);
      return true;
    },
  };
}
