import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { fileStore, visitHandler } from './server/visitors.js';

// In development and preview, /api/visit counts unique browsers in .data/visitors.json.
// In production the same endpoint is api/visit.js, backed by Redis.
function localVisitorCounter() {
  const store = fileStore(fileURLToPath(new URL('./.data/visitors.json', import.meta.url)));
  const handler = visitHandler(async () => store);
  const mount = (server) => { server.middlewares.use('/api/visit', handler); };
  return { name: 'museum-visitor-counter', configureServer: mount, configurePreviewServer: mount };
}

export default defineConfig({
  base: './',
  server: { port: 5174, strictPort: true },
  plugins: [localVisitorCounter()],
});
