/**
 * API Endpoint for Site Configuration
 * Vercel Serverless Function
 * Handles GET (read) and PUT (update) operations for site config
 */

// Simple in-memory storage (for development - replace with database in production)
let siteConfigStorage = null;
let lastUpdated = Date.now();

// Load default config
try {
  const defaultConfig = require('../src/config/siteConfig.js');
  siteConfigStorage = defaultConfig.DEFAULT_SITE_CONFIG;
} catch (error) {
  console.error('Failed to load default config:', error);
}

// Authentication password (should be in environment variables in production)
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || '00000008';

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
      return res.status(200).json({
        success: true,
        data: siteConfigStorage,
        lastUpdated,
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

      // Update storage
      siteConfigStorage = body;
      lastUpdated = Date.now();

      console.log('Site config updated at:', new Date(lastUpdated).toISOString());

      return res.status(200).json({
        success: true,
        lastUpdated,
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