// One place to scroll from, whether Lenis is running (desktop) or not (phones).

let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function scrollToTarget(target, { offset = 0, duration = 1.6 } = {}) {
  const node = typeof target === 'string' ? document.querySelector(target) : target;
  if (!node) return;
  if (lenis) {
    lenis.scrollTo(node, { offset, duration });
  } else {
    const top = node.getBoundingClientRect().top + scrollY + offset;
    scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}

// Scroll to a fraction of a tall scene, so hold-to-walk can drive the page.
export function scrollToProgress(section, progress) {
  const start = section.offsetTop;
  const end = start + section.offsetHeight - innerHeight;
  const top = start + (end - start) * Math.min(1, Math.max(0, progress));
  if (lenis) lenis.scrollTo(top, { immediate: true });
  else scrollTo({ top, behavior: 'auto' });
}
