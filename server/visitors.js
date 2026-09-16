// The museum's visitor counter. Every browser gets one number the first time it arrives,
// in true order of arrival: the first browser ever is #00,001. Returning browsers keep theirs.
// Two stores share one contract: a JSON file for local development, Upstash Redis in production.

import { promises as fs } from 'node:fs';
import path from 'node:path';

export const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Local development and preview: a small JSON file, one write per new visitor.
export function fileStore(file) {
  let data = null;
  let queue = Promise.resolve();
  const load = async () => {
    if (data) return data;
    try { data = JSON.parse(await fs.readFile(file, 'utf8')); } catch { data = { count: 0, visitors: {} }; }
    return data;
  };
  return {
    visit(id) {
      const run = async () => {
        const d = await load();
        if (d.visitors[id]) return { number: d.visitors[id], total: d.count, returning: true };
        d.count += 1;
        d.visitors[id] = d.count;
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, JSON.stringify(d));
        return { number: d.count, total: d.count, returning: false };
      };
      queue = queue.then(run, run);
      return queue;
    },
    async total() {
      return (await load()).count;
    },
  };
}

// Production: one atomic step in Redis, so two visitors can never get the same number.
const ASSIGN = `
local existing = redis.call('HGET', KEYS[1], ARGV[1])
if existing then return {tonumber(existing), tonumber(redis.call('GET', KEYS[2]) or '0'), 1} end
local n = redis.call('INCR', KEYS[2])
redis.call('HSET', KEYS[1], ARGV[1], n)
return {n, n, 0}`;

export function redisStore({ url, token, prefix = 'manoj-museum' }) {
  const call = async (command) => {
    const res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(command) });
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(json.error || `Redis answered ${res.status}`);
    return json.result;
  };
  return {
    async visit(id) {
      const [number, total, returning] = await call(['EVAL', ASSIGN, '2', `${prefix}:visitors`, `${prefix}:count`, id]);
      return { number, total, returning: returning === 1 };
    },
    async total() {
      return Number(await call(['GET', `${prefix}:count`])) || 0;
    },
  };
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 2048) break;
  }
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

// POST { id } registers a visit and answers { number, total, returning }. GET answers { total }.
export function visitHandler(getStore) {
  return async (req, res) => {
    const send = (status, body) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(body));
    };
    try {
      const store = await getStore();
      if (req.method === 'GET') return send(200, { total: await store.total() });
      if (req.method !== 'POST') return send(405, { error: 'Use POST to register a visit.' });
      const { id } = await readJson(req);
      if (!ID_PATTERN.test(String(id || ''))) return send(400, { error: 'Send a visitor id (a v4 UUID).' });
      return send(200, await store.visit(String(id).toLowerCase()));
    } catch (err) {
      console.error('[visitors]', err);
      return send(503, { error: 'The visitor counter is unavailable right now.' });
    }
  };
}
