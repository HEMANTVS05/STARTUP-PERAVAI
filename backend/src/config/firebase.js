// ─── Firebase Admin SDK Configuration ────────────────────────────────────────
// Initialised from secrets/firebase-service-account.json (never from .env or VITE_ vars).
// Exports: admin, db (Firestore), auth (Admin Auth)
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const path    = require('path');
const fs      = require('fs');
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const serviceAccountPath = path.resolve(__dirname, '../../secrets/firebase-service-account.json');
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Option A: Vercel Production uses an environment variable
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error('ERROR: FIREBASE_SERVICE_ACCOUNT environment variable contains invalid JSON.');
    process.exit(1);
  }
} else if (fs.existsSync(serviceAccountPath)) {
  // Option B: Local Development uses the physical file
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
} else {
  console.error('ERROR: Firebase service account key not found.');
  console.error('Expected at:', serviceAccountPath);
  console.error('Or provide it via FIREBASE_SERVICE_ACCOUNT environment variable (Vercel).');
  console.error('Download from: Firebase Console → Project Settings → Service Accounts → Generate new private key');
  process.exit(1);
}

// Validate it is a real service account and not the placeholder
if (serviceAccount._INSTRUCTIONS) {
  console.error('ERROR: Replace secrets/firebase-service-account.json with your real Firebase service account key.');
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId:  process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
  });
}

const db   = getFirestore();
const auth = getAuth();
const admin = { auth: () => auth, firestore: () => db }; // Keep compat for anything that might use admin.auth() / admin.firestore()

module.exports = { admin, db, auth };
