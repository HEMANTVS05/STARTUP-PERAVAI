// ─── Firebase Client SDK Configuration ───────────────────────────────────────
// This file initialises the Firebase Web SDK for the browser.
// It handles CLIENT-SIDE authentication only.
// All sensitive operations go through the Express backend via API calls.
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from 'firebase/auth';
// NOTE: db is exported for real-time listeners (onSnapshot) only.
// All WRITE operations must go through the Express backend via src/utils/api.js.
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const analytics    = getAnalytics(app);
export const auth         = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// db — FOR READ-ONLY / REAL-TIME LISTENERS ONLY.
// All write operations MUST go through the Express backend via src/utils/api.js.
export const db = getFirestore(app);

// Re-export auth helpers so the rest of the app never needs to import from 'firebase/auth' directly
export {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
};
