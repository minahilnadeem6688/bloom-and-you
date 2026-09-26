// Backend address. Set VITE_API_URL in Vercel (or a .env file); falls back to the local server.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
