// ─── User Service ─────────────────────────────────────────────────────────────
// All Firestore operations for the /users collection live here.
// Called by controllers. Never called directly from routes.
// ─────────────────────────────────────────────────────────────────────────────

const { db } = require('../config/firebase');

/**
 * Get a user document by UID.
 */
async function getUserById(uid) {
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) return null;
  return { uid: snap.id, ...snap.data() };
}

/**
 * Create or merge a user document.
 * Called on first login and on profile update.
 */
async function upsertUser(uid, data) {
  const ref = db.collection('users').doc(uid);
  await ref.set(
    {
      ...data,
      uid,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  const snap = await ref.get();
  return { uid: snap.id, ...snap.data() };
}

module.exports = { getUserById, upsertUser };
