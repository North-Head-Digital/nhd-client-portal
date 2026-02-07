/**
 * Get the API base URL based on environment
 * Uses Vite environment variables with fallback to hostname detection
 */
export const getApiBaseUrl = (): string => {
  // Use environment variable if available (Vite uses VITE_ prefix)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // For development, always use localhost API server
  // This can be overridden with VITE_API_BASE_URL environment variable
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }

  // Fallback to hostname-based detection
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // Production API URL
  return 'https://api.northheaddigital.com';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;