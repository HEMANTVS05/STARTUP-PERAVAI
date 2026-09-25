// ─── Registration Service ─────────────────────────────────────────────────────
// All Firestore operations for /registrations collection.
// ─────────────────────────────────────────────────────────────────────────────

const { db } = require('../config/firebase');

const COLLECTION = 'registrations';

/**
 * Get a registration by its document ID (uid is used as ID).
 */
async function getRegistrationById(registrationId) {
  const snap = await db.collection(COLLECTION).doc(registrationId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Get registration for a specific user.
 */
async function getRegistrationByUid(uid) {
  return getRegistrationById(uid);
}

/**
 * Create or update a registration.
 * Uses the user's UID as the document ID to enforce one registration per user.
 */
async function upsertRegistration(uid, data) {
  const ref = db.collection(COLLECTION).doc(uid);

  // Check for existing registration
  const existing = await ref.get();
  if (existing.exists) {
    throw Object.assign(new Error('Registration already exists for this user.'), { status: 409 });
  }

  const payload = {
    checkedInDay1: true,
    checkedInDay2: false,
    ...data,
    uid,
    registeredAt: new Date().toISOString(),
    status: 'pending',
  };

  await ref.set(payload);
  return { id: uid, ...payload };
}

/**
 * Update a registration (partial update).
 */
async function updateRegistration(uid, data) {
  const ref = db.collection(COLLECTION).doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    throw Object.assign(new Error('Registration not found.'), { status: 404 });
  }
  await ref.update({ ...data, updatedAt: new Date().toISOString() });
  const updated = await ref.get();
  return { id: uid, ...updated.data() };
}

/**
 * List all registrations (admin only).
 */
async function listAllRegistrations({ limit = 100, startAfter } = {}) {
  let query = db.collection(COLLECTION).orderBy('registeredAt', 'desc').limit(limit);
  if (startAfter) {
    const cursor = await db.collection(COLLECTION).doc(startAfter).get();
    if (cursor.exists) query = query.startAfter(cursor);
  }
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

module.exports = {
  getRegistrationById,
  getRegistrationByUid,
  upsertRegistration,
  updateRegistration,
  listAllRegistrations,
};
