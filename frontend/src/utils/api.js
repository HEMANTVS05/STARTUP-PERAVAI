// ─── Authenticated API Client ─────────────────────────────────────────────────
// All calls from the frontend to the Express backend go through this file.
// It automatically attaches the Firebase ID Token as a Bearer token.
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';
import { auth } from '../config/firebase';

// If both frontend and backend are deployed on the same domain (Vercel Monorepo),
// we can use an empty string as the base URL in production to make relative requests to /api
const BASE_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the Firebase ID Token to every outgoing request
api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error || error.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default api;
