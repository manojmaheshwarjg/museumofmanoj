import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
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

// The width and height a photo displays at, read from the file itself: JPEG (turned by its EXIF orientation, the way
// browsers show it) and PNG. Anything else, or a file it can't read, gives null.
function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let turned = false;
  for (let i = 2; i + 9 < buf.length;) {
    if (buf[i] !== 0xff) { i += 1; continue; }
    const marker = buf[i + 1];
    const length = buf.readUInt16BE(i + 2);
    if (marker === 0xe1 && buf.toString('latin1', i + 4, i + 8) === 'Exif') {
      const tiff = i + 10;
      const little = buf.toString('latin1', tiff, tiff + 2) === 'II';
      const u16 = (o) => (little ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
      const u32 = (o) => (little ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
      const ifd = tiff + u32(tiff + 4);
      for (let k = 0, n = u16(ifd); k < n; k += 1) {
        const entry = ifd + 2 + k * 12;
        if (u16(entry) === 0x0112) turned = u16(entry + 8) >= 5;
      }
    }
    // Start of frame: every SOF marker except the huffman, arithmetic and restart tables that share the range.
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      const height = buf.readUInt16BE(i + 5);
      const width = buf.readUInt16BE(i + 7);
      return turned ? [height, width] : [width, height];
    }
    i += 2 + length;
  }
  return null;
}

// Every photo's size, from public/photos, as a module the app imports (virtual:photo-sizes). A frame takes the shape of
// its picture before the picture loads, so nothing on the page moves when it arrives. In development, adding or
// changing a photo reloads the page with its new size.
function photoSizes() {
  const dir = fileURLToPath(new URL('./public/photos/', import.meta.url));
  const id = 'virtual:photo-sizes';
  const read = () => Object.fromEntries(readdirSync(dir)
    .filter((file) => /\.(jpe?g|png)$/i.test(file))
    .map((file) => [file, imageSize(readFileSync(dir + file))])
    .filter(([, size]) => size));
  return {
    name: 'museum-photo-sizes',
    resolveId: (source) => (source === id ? `\0${id}` : null),
    load: (resolved) => (resolved === `\0${id}` ? `export default ${JSON.stringify(read())};` : null),
    configureServer(server) {
      const refresh = (file) => {
        if (!file.startsWith(dir)) return;
        const mod = server.moduleGraph.getModuleById(`\0${id}`);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.add(dir);
      ['add', 'change', 'unlink'].forEach((event) => server.watcher.on(event, refresh));
    },
  };
}

// The 3D city's code, named in the page so the walk in can start downloading it before the app runs (index.html
// reads the list). Only the build knows the hashed file names.
function preloadCity() {
  return {
    name: 'museum-preload-city',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle, chunk: entry }) {
        const chunks = Object.values(bundle || {}).filter((c) => c.type === 'chunk');
        const city = chunks.find((c) => c.facadeModuleId?.endsWith('/src/world/stage.js'));
        if (!city) return html;
        const loaded = new Set([entry?.fileName, ...(entry?.imports || [])]);
        const files = [city.fileName, ...city.imports].filter((f) => !loaded.has(f)).map((f) => `/${f}`);
        return html.replace("'__CITY_CHUNKS__'", JSON.stringify(files));
      },
    },
  };
}

export default defineConfig({
  // Absolute, so pages at /experience/<slug> find the same assets as the home page.
  base: '/',
  server: { port: 5174, strictPort: true },
  // The resume viewer loads PDF.js on demand; bundled up front in development, so opening it doesn't reload the page.
  optimizeDeps: { include: ['pdfjs-dist'] },
  plugins: [localVisitorCounter(), stopPages(), photoSizes(), preloadCity()],
});
