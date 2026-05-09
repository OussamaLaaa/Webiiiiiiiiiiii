/**
 * API Endpoint for Site Configuration
 * Vercel Serverless Function
 * Handles GET (read) and PUT (update) operations for site config
 * Uses Upstash Redis for persistent storage
 */

const { Redis } = require('@upstash/redis');

// Load default config
let defaultConfig = null;
try {
  const defaultConfigModule = require('../src/config/siteConfig.js');
  defaultConfig = defaultConfigModule.DEFAULT_SITE_CONFIG;
} catch (error) {
  console.error('Failed to load default config:', error);
}

// Authentication password (should be in environment variables in production)
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || '00000008';

// Initialize Redis client
let redis = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.error('Failed to initialize Redis client:', error);
}

/**
 * Get site config from Redis or return default
 */
async function getSiteConfig() {
  if (!redis) {
    console.warn('Redis not initialized, returning default config');
    return defaultConfig;
  }

  try {
    const config = await redis.get('site-config');
    if (config) {
      return config;
    }
    return defaultConfig;
  } catch (error) {
    console.error('Failed to get config from Redis:', error);
    return defaultConfig;
  }
}

/**
 * Save site config to Redis
 */
async function saveSiteConfig(config) {
  if (!redis) {
    console.warn('Redis not initialized, config not saved');
    return false;
  }

  try {
    await redis.set('site-config', config);
    return true;
  } catch (error) {
    console.error('Failed to save config to Redis:', error);
    return false;
  }
}

/**
 * GET /api/config
 * Returns the current site configuration
 */
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const config = await getSiteConfig();
      return res.status(200).json({
        success: true,
        data: config,
        lastUpdated: Date.now(),
        version: '1.0.0',
      });
    } catch (error) {
      console.error('Error fetching config:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch configuration',
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      // Check authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Missing or invalid authorization header',
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      if (token !== DASHBOARD_PASSWORD) {
        return res.status(403).json({
          success: false,
          error: 'Invalid authentication token',
        });
      }

      // Parse request body
      const body = req.body;
      
      // Validate the config structure
      if (!body || typeof body !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Invalid request body',
        });
      }

      // Save to Redis
      const saved = await saveSiteConfig(body);
      if (!saved) {
        return res.status(500).json({
          success: false,
          error: 'Failed to save configuration to database',
        });
      }

      console.log('Site config updated at:', new Date().toISOString());

      return res.status(200).json({
        success: true,
        lastUpdated: Date.now(),
        version: '1.0.0',
      });
    } catch (error) {
      console.error('Error updating config:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update configuration',
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
};