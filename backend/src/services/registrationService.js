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

const { syncIndividualEvent } = require('./individualEventService');

/**
 * Create or update a registration.
 * Uses the user's UID as the document ID to enforce one registration per user.
 */
async function upsertRegistration(uid, data) {
  const ref = db.collection(COLLECTION).doc(uid);

  const existing = await ref.get();
  const existingData = existing.exists ? existing.data() : {};

  const payload = {
    checkedInDay1: false,
    checkedInDay2: false,
    ...existingData,
    ...data,
    uid,
    registeredAt: existingData.registeredAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: existingData.status || data.status || 'pending',
  };

  await ref.set(payload, { merge: true });
  await syncIndividualEvent(uid, payload).catch(err => console.error('Failed to sync individual event:', err));
  return { id: uid, ...payload };
}

/**
 * Update a registration (partial update).
 */
async function updateRegistration(uid, data) {
  const ref = db.collection(COLLECTION).doc(uid);
  await ref.set({ ...data, updatedAt: new Date().toISOString() }, { merge: true });
  const updated = await ref.get();
  const fullData = updated.data();
  await syncIndividualEvent(uid, fullData).catch(err => console.error('Failed to sync individual event:', err));
  return { id: uid, ...fullData };
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
