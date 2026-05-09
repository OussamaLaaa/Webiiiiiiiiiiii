/**
 * API Client for Site Configuration
 * Handles communication with the backend API
 */

import { type SiteConfig } from '../config/siteConfig';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const DASHBOARD_PASSWORD = '00000008'; // Should match server password

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  lastUpdated?: number;
  version?: string;
}

/**
 * Fetch site configuration from API
 */
export async function fetchSiteConfig(): Promise<ApiResponse<SiteConfig>> {
  try {
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching site config from API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch configuration',
    };
  }
}

/**
 * Update site configuration via API
 */
export async function updateSiteConfig(config: SiteConfig): Promise<ApiResponse<SiteConfig>> {
  try {
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHBOARD_PASSWORD}`,
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating site config via API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update configuration',
    };
  }
}

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'GET',
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}