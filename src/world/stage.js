// One 3D world behind the whole tour: a fixed canvas the camera never leaves.
// Without WebGL, or with reduced motion, there is no world and every scene keeps its flat look.

import { reducedMotion } from '../lib/doodle.js';
import { loadFonts } from './textures.js';
import { createWorld } from './world.js';

let pending = null;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2'));
  } catch {
    return false;
  }
}

export function ensureWorld() {
  if (!pending) {
    pending = (async () => {
      // ?flat previews the site without the 3D world, the way it looks without WebGL2 or with reduced motion.
      if (reducedMotion() || !hasWebGL() || new URLSearchParams(location.search).has('flat')) return null;
      const canvas = document.createElement('canvas');
      canvas.className = 'world';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
      await loadFonts();
      const world = createWorld(canvas);
      document.documentElement.classList.add('has-world');
      return world;
    })();
  }
  return pending;
}
