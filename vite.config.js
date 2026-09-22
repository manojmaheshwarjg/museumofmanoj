import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { fileStore, visitHandler } from './server/visitors.js';
import { STOP_PAGES } from './src/lib/routes.js';

// In development and preview, /api/visit counts unique browsers in .data/visitors.json.
// In production the same endpoint is api/visit.js, backed by Redis.
function localVisitorCounter() {
  const store = fileStore(fileURLToPath(new URL('./.data/visitors.json', import.meta.url)));
  const handler = visitHandler(async () => store);
  const mount = (server) => { server.middlewares.use('/api/visit', handler); };
  return { name: 'museum-visitor-counter', configureServer: mount, configurePreviewServer: mount };
}

// Every stop's page, written at build time with its own title and description, so a link to one previews that stop
// instead of the home page. The page is otherwise the same app, which reads the address and shows the stop.
function stopPages() {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return {
    name: 'museum-stop-pages',
    apply: 'build',
    closeBundle() {
      const dist = fileURLToPath(new URL('./dist/', import.meta.url));
      const home = readFileSync(`${dist}index.html`, 'utf8');
      mkdirSync(`${dist}experience`, { recursive: true });
      STOP_PAGES.forEach(({ slug, title, description }) => {
        const page = home
          .replace(/<title>[^<]*<\/title>/, () => `<title>${esc(title)} · Museum of Manoj</title>`)
          .replace(/(<meta name="description" content=")[^"]*/, (_, head) => head + esc(description))
          .replace(/(<meta property="og:title" content=")[^"]*/, (_, head) => `${head}${esc(title)} · Museum of Manoj`)
          .replace(/(<meta property="og:description" content=")[^"]*/, (_, head) => head + esc(description));
        writeFileSync(`${dist}experience/${slug}.html`, page);
      });
    },
  };
}

export default defineConfig({
  // Absolute, so pages at /experience/<slug> find the same assets as the home page.
  base: '/',
  server: { port: 5174, strictPort: true },
  plugins: [localVisitorCounter(), stopPages()],
});
