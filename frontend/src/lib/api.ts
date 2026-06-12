/**
 * Centralized API base URL.
 *
 * In development, VITE_API_URL is empty so fetch calls use relative paths
 * (proxied by Vite dev server → http://localhost:8000).
 *
 * In production, set VITE_API_URL to the deployed backend URL
 * (e.g. "https://your-backend.koyeb.app").
 */
export const API_URL = import.meta.env.VITE_API_URL || '';
