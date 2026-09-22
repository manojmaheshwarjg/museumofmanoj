// One 3D world behind the whole tour: a fixed canvas the camera never leaves.
// Without WebGL, or with reduced motion, there is no world and every scene keeps its flat look.

import { reducedMotion } from '../lib/doodle.js';
import { loadFonts } from './textures.js';
import { createWorld } from './world.js';

let pending = null;
const watchers = new Set();

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2'));
  } catch {
    return false;
  }
}

// Callers can follow the build as it goes (the loader does, to draw its progress), or just wait for it.
export function ensureWorld(onProgress) {
  if (onProgress) watchers.add(onProgress);
  if (!pending) {
    pending = (async () => {
      // ?flat previews the site without the 3D world, the way it looks without WebGL2 or with reduced motion.
      if (reducedMotion() || !hasWebGL() || new URLSearchParams(location.search).has('flat')) return null;
      const canvas = document.createElement('canvas');
      canvas.className = 'world';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
      await loadFonts();
      const world = await createWorld(canvas, { onProgress: (done) => watchers.forEach((fn) => fn(done)) });
      document.documentElement.classList.add('has-world');
      // For checking shots against a production build (?shots), where the modules can't be imported by path.
      if (import.meta.env.DEV || new URLSearchParams(location.search).has('shots')) window.__world = world;
      return world;
    })();
  }
  return pending;
}
