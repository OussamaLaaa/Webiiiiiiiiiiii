import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

const STORAGE_PATH = path.resolve(process.cwd(), 'data');
const STORAGE_FILE = path.join(STORAGE_PATH, 'site-config.json');
const CONFIG_KEY = 'site:config';

const hasUpstashConfig =
  typeof process.env.UPSTASH_REDIS_REST_URL === 'string' &&
  process.env.UPSTASH_REDIS_REST_URL.length > 0 &&
  typeof process.env.UPSTASH_REDIS_REST_TOKEN === 'string' &&
  process.env.UPSTASH_REDIS_REST_TOKEN.length > 0;

const redis = hasUpstashConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const ensureStorageDir = () => {
  try {
    if (!fs.existsSync(STORAGE_PATH)) {
      fs.mkdirSync(STORAGE_PATH, { recursive: true });
    }
    return true;
  } catch (e) {
    console.warn('Storage dir not available:', e?.message || e);
    return false;
  }
};

const readStoredConfig = () => {
  try {
    if (!fs.existsSync(STORAGE_FILE)) return null;
    const raw = fs.readFileSync(STORAGE_FILE, 'utf8');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read stored config:', e?.message || e);
    return null;
  }
};

const writeStoredConfig = (data) => {
  try {
    if (!ensureStorageDir()) return false;
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Failed to write stored config:', e?.message || e);
    return false;
  }
};

const readFromRedis = async () => {
  if (!redis) return null;
  try {
    const value = await redis.get(CONFIG_KEY);
    if (!value || typeof value !== 'object') return null;
    return value;
  } catch (e) {
    console.error('Failed to read config from Redis:', e?.message || e);
    return null;
  }
};

const writeToRedis = async (data) => {
  if (!redis) return false;
  try {
    await redis.set(CONFIG_KEY, data);
    return true;
  } catch (e) {
    console.error('Failed to write config to Redis:', e?.message || e);
    return false;
  }
};

export default (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // GET - return stored config if available
  if (req.method === 'GET') {
    return (async () => {
      const redisData = await readFromRedis();
      if (redisData) {
        return res.status(200).json({ success: true, data: redisData, source: 'upstash' });
      }

      const stored = readStoredConfig();
      if (stored) {
        return res.status(200).json({ success: true, data: stored, source: 'file' });
      }

      // Fallback: empty but successful response
      return res.status(200).json({ success: true, data: {} });
    })();
  }

  // PUT/POST - persist incoming config
  if (req.method === 'PUT' || req.method === 'POST') {
    return (async () => {
      let body = {};
      try {
        if (req.body && typeof req.body === 'string') {
          body = JSON.parse(req.body);
        } else if (req.body && typeof req.body === 'object') {
          body = req.body;
        }
      } catch (e) {
        console.warn('Invalid JSON body for config update');
        return res.status(400).json({ success: false, error: 'Invalid JSON body' });
      }

      // First priority: shared persistence via Upstash
      const redisOk = await writeToRedis(body);
      if (redisOk) {
        return res.status(200).json({ success: true, lastUpdated: Date.now(), source: 'upstash' });
      }

      // Fallback for local development
      const fileOk = writeStoredConfig(body);
      if (fileOk) {
        return res.status(200).json({ success: true, lastUpdated: Date.now(), source: 'file' });
      }

      return res.status(500).json({
        success: false,
        error: 'No persistent storage available. Configure Upstash env vars for production.',
      });
    })();
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
