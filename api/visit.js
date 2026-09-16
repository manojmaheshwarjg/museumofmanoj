// Vercel function: POST /api/visit with { id } answers this browser's visitor number.
// Needs an Upstash Redis database (Vercel Marketplace, or upstash.com). Set either
// KV_REST_API_URL and KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.

import { redisStore, visitHandler } from '../server/visitors.js';

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export default visitHandler(async () => {
  if (!url || !token) throw new Error('Visitor counter is not configured: missing Redis URL or token.');
  return redisStore({ url, token });
});
