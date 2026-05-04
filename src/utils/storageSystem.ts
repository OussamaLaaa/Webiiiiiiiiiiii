/**
 * Advanced Storage System for Site Configuration
 * Multi-layer storage with automatic backups, error recovery, and data validation
 */

import { DEFAULT_SITE_CONFIG, type SiteConfig } from '../config/siteConfig';

// Storage keys
const STORAGE_KEYS = {
  PRIMARY: 'portfolio.site-config.v1',
  BACKUP: 'portfolio.site-config.backup.v1',
  SESSION: 'portfolio.site-config.session.v1',
  METADATA: 'portfolio.site-config.metadata.v1',
  RECOVERY: 'portfolio.site-config.recovery.v1',
} as const;

// Storage metadata
interface StorageMetadata {
  lastSaved: number;
  lastBackup: number;
  version: string;
  checksum: string;
  size: number;
  saveCount: number;
}

// Storage result
interface StorageResult {
  success: boolean;
  data?: SiteConfig;
  error?: string;
  source?: 'primary' | 'backup' | 'session' | 'recovery' | 'default';
  metadata?: StorageMetadata;
}

// Compression utilities
const compress = (data: string): string => {
  try {
    // Simple compression using JSON.stringify with space removal
    return JSON.stringify(JSON.parse(data));
  } catch {
    return data;
  }
};

const decompress = (data: string): string => {
  try {
    return JSON.stringify(JSON.parse(data));
  } catch {
    return data;
  }
};

// Checksum calculation
const calculateChecksum = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

// Data validation
const validateSiteConfig = (data: unknown): data is SiteConfig => {
  if (!data || typeof data !== 'object') return false;

  const config = data as Partial<SiteConfig>;

  // Check required top-level properties
  if (typeof config.introText !== 'string') return false;
  if (!Array.isArray(config.projects)) return false;
  if (!Array.isArray(config.testimonials)) return false;
  if (!config.featured || typeof config.featured !== 'object') return false;

  return true;
};

// Safe JSON parse with error handling
const safeParse = <T>(data: string | null, fallback: T): T => {
  if (!data) return fallback;

  try {
    const parsed = JSON.parse(data);
    return parsed as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
};

// Safe JSON stringify with error handling
const safeStringify = (data: unknown): string | null => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Failed to stringify data:', error);
    return null;
  }
};

// Storage operations with error handling
const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set ${key}:`, error);
    return false;
  }
};

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get ${key}:`, error);
    return null;
  }
};

const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove ${key}:`, error);
    return false;
  }
};

// Get storage metadata
const getMetadata = (): StorageMetadata => {
  const metadataStr = safeGetItem(STORAGE_KEYS.METADATA);
  if (!metadataStr) {
    return {
      lastSaved: 0,
      lastBackup: 0,
      version: '1.0.0',
      checksum: '',
      size: 0,
      saveCount: 0,
    };
  }

  return safeParse(metadataStr, {
    lastSaved: 0,
    lastBackup: 0,
    version: '1.0.0',
    checksum: '',
    size: 0,
    saveCount: 0,
  });
};

// Update storage metadata
const updateMetadata = (data: string, isBackup: boolean = false): void => {
  const metadata = getMetadata();
  const now = Date.now();

  metadata.lastSaved = now;
  if (isBackup) {
    metadata.lastBackup = now;
  }
  metadata.checksum = calculateChecksum(data);
  metadata.size = new Blob([data]).size;
  metadata.saveCount += 1;

  safeSetItem(STORAGE_KEYS.METADATA, JSON.stringify(metadata));
};

// Save to primary storage
const saveToPrimary = (config: SiteConfig): boolean => {
  const data = safeStringify(config);
  if (!data) return false;

  const compressed = compress(data);
  const success = safeSetItem(STORAGE_KEYS.PRIMARY, compressed);

  if (success) {
    updateMetadata(compressed, false);
  }

  return success;
};

// Save to backup storage
const saveToBackup = (config: SiteConfig): boolean => {
  const data = safeStringify(config);
  if (!data) return false;

  const compressed = compress(data);
  const success = safeSetItem(STORAGE_KEYS.BACKUP, compressed);

  if (success) {
    updateMetadata(compressed, true);
  }

  return success;
};

// Save to session storage (temporary)
const saveToSession = (config: SiteConfig): boolean => {
  try {
    const data = safeStringify(config);
    if (!data) return false;

    sessionStorage.setItem(STORAGE_KEYS.SESSION, compress(data));
    return true;
  } catch (error) {
    console.error('Failed to save to session storage:', error);
    return false;
  }
};

// Create recovery point
const createRecoveryPoint = (config: SiteConfig): boolean => {
  try {
    const data = safeStringify(config);
    if (!data) return false;

    const recoveryData = {
      timestamp: Date.now(),
      data: compress(data),
      metadata: getMetadata(),
    };

    safeSetItem(STORAGE_KEYS.RECOVERY, JSON.stringify(recoveryData));
    return true;
  } catch (error) {
    console.error('Failed to create recovery point:', error);
    return false;
  }
};

// Load from primary storage
const loadFromPrimary = (): SiteConfig | null => {
  const data = safeGetItem(STORAGE_KEYS.PRIMARY);
  if (!data) return null;

  try {
    const decompressed = decompress(data);
    const parsed = JSON.parse(decompressed);

    if (validateSiteConfig(parsed)) {
      return parsed;
    }

    console.warn('Primary storage data validation failed');
    return null;
  } catch (error) {
    console.error('Failed to load from primary storage:', error);
    return null;
  }
};

// Load from backup storage
const loadFromBackup = (): SiteConfig | null => {
  const data = safeGetItem(STORAGE_KEYS.BACKUP);
  if (!data) return null;

  try {
    const decompressed = decompress(data);
    const parsed = JSON.parse(decompressed);

    if (validateSiteConfig(parsed)) {
      console.info('Loaded from backup storage');
      return parsed;
    }

    console.warn('Backup storage data validation failed');
    return null;
  } catch (error) {
    console.error('Failed to load from backup storage:', error);
    return null;
  }
};

// Load from session storage
const loadFromSession = (): SiteConfig | null => {
  try {
    const data = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (!data) return null;

    const decompressed = decompress(data);
    const parsed = JSON.parse(decompressed);

    if (validateSiteConfig(parsed)) {
      console.info('Loaded from session storage');
      return parsed;
    }

    return null;
  } catch (error) {
    console.error('Failed to load from session storage:', error);
    return null;
  }
};

// Load from recovery point
const loadFromRecovery = (): SiteConfig | null => {
  const data = safeGetItem(STORAGE_KEYS.RECOVERY);
  if (!data) return null;

  try {
    const recovery = JSON.parse(data);
    const decompressed = decompress(recovery.data);
    const parsed = JSON.parse(decompressed);

    if (validateSiteConfig(parsed)) {
      console.info('Loaded from recovery point');
      return parsed;
    }

    return null;
  } catch (error) {
    console.error('Failed to load from recovery point:', error);
    return null;
  }
};

// Main load function with fallback chain
export const loadSiteConfig = (): StorageResult => {
  // Try primary storage first
  const primaryData = loadFromPrimary();
  if (primaryData) {
    return {
      success: true,
      data: primaryData,
      source: 'primary',
      metadata: getMetadata(),
    };
  }

  // Try backup storage
  const backupData = loadFromBackup();
  if (backupData) {
    // Restore primary from backup
    saveToPrimary(backupData);
    return {
      success: true,
      data: backupData,
      source: 'backup',
      metadata: getMetadata(),
    };
  }

  // Try session storage
  const sessionData = loadFromSession();
  if (sessionData) {
    // Restore primary and backup from session
    saveToPrimary(sessionData);
    saveToBackup(sessionData);
    return {
      success: true,
      data: sessionData,
      source: 'session',
      metadata: getMetadata(),
    };
  }

  // Try recovery point
  const recoveryData = loadFromRecovery();
  if (recoveryData) {
    // Restore all storage layers from recovery
    saveToPrimary(recoveryData);
    saveToBackup(recoveryData);
    saveToSession(recoveryData);
    return {
      success: true,
      data: recoveryData,
      source: 'recovery',
      metadata: getMetadata(),
    };
  }

  // All failed, return default
  console.warn('All storage layers failed, using default config');
  return {
    success: false,
    data: DEFAULT_SITE_CONFIG,
    source: 'default',
    error: 'No valid data found in any storage layer',
  };
};

// Main save function with multi-layer redundancy
export const saveSiteConfig = (config: SiteConfig): StorageResult => {
  const results = {
    primary: false,
    backup: false,
    session: false,
    recovery: false,
  };

  // Validate data before saving
  if (!validateSiteConfig(config)) {
    return {
      success: false,
      error: 'Invalid site config data',
    };
  }

  // Save to primary storage
  results.primary = saveToPrimary(config);

  // Save to backup storage (always)
  results.backup = saveToBackup(config);

  // Save to session storage (for current session)
  results.session = saveToSession(config);

  // Create recovery point every 10 saves
  const metadata = getMetadata();
  if (metadata.saveCount % 10 === 0) {
    results.recovery = createRecoveryPoint(config);
  }

  const success = results.primary || results.backup || results.session;

  if (!success) {
    console.error('All storage layers failed to save');
    return {
      success: false,
      error: 'Failed to save to any storage layer',
    };
  }

  // Log warnings for failed layers
  if (!results.primary) {
    console.warn('Failed to save to primary storage');
  }
  if (!results.backup) {
    console.warn('Failed to save to backup storage');
  }
  if (!results.session) {
    console.warn('Failed to save to session storage');
  }

  return {
    success: true,
    metadata: getMetadata(),
  };
};

// Reset all storage
export const resetAllStorage = (): boolean => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      safeRemoveItem(key);
    });

    // Also clear session storage
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        sessionStorage.removeItem(key);
      } catch {
        // Ignore session storage errors
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to reset storage:', error);
    return false;
  }
};

// Get storage info for debugging
export const getStorageInfo = () => {
  const metadata = getMetadata();
  const primarySize = safeGetItem(STORAGE_KEYS.PRIMARY)?.length || 0;
  const backupSize = safeGetItem(STORAGE_KEYS.BACKUP)?.length || 0;
  const sessionSize = sessionStorage.getItem(STORAGE_KEYS.SESSION)?.length || 0;
  const recoverySize = safeGetItem(STORAGE_KEYS.RECOVERY)?.length || 0;

  return {
    metadata,
    sizes: {
      primary: primarySize,
      backup: backupSize,
      session: sessionSize,
      recovery: recoverySize,
    },
    total: primarySize + backupSize + sessionSize + recoverySize,
  };
};

// Export storage data as JSON (for manual backup)
export const exportStorageData = (): string | null => {
  try {
    const data = {
      timestamp: Date.now(),
      version: '1.0.0',
      primary: safeGetItem(STORAGE_KEYS.PRIMARY),
      backup: safeGetItem(STORAGE_KEYS.BACKUP),
      metadata: getMetadata(),
    };

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Failed to export storage data:', error);
    return null;
  }
};

// Import storage data from JSON (for manual restore)
export const importStorageData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);

    if (!data.primary || !data.backup) {
      throw new Error('Invalid storage data format');
    }

    // Validate data before importing
    const primaryParsed = JSON.parse(decompress(data.primary));
    if (!validateSiteConfig(primaryParsed)) {
      throw new Error('Invalid primary data');
    }

    // Save imported data
    safeSetItem(STORAGE_KEYS.PRIMARY, data.primary);
    safeSetItem(STORAGE_KEYS.BACKUP, data.backup);

    if (data.metadata) {
      safeSetItem(STORAGE_KEYS.METADATA, JSON.stringify(data.metadata));
    }

    return true;
  } catch (error) {
    console.error('Failed to import storage data:', error);
    return false;
  }
};
