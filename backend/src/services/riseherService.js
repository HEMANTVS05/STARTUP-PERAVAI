// ─── Rise Her Submission Service ─────────────────────────────────────────────
// Handles the separate `riseher` Firestore collection for idea submissions.
// ─────────────────────────────────────────────────────────────────────────────

const { db } = require('../config/firebase');
const COLLECTION = 'riseher';

/**
 * Save or update a Rise Her idea submission.
 * Uses uid as document ID so a user can only have one submission (overwrite allowed).
 */
async function upsertRiseHerSubmission(uid, data) {
  const ref = db.collection(COLLECTION).doc(uid);
  const payload = {
    ...data,
    uid,
    updatedAt: new Date().toISOString(),
  };
  await ref.set(payload, { merge: true });
  return { id: uid, ...payload };
}

/**
 * Get a single Rise Her submission by uid.
 */
async function getRiseHerSubmission(uid) {
  const snap = await db.collection(COLLECTION).doc(uid).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * List all Rise Her submissions (admin only).
 */
async function listRiseHerSubmissions() {
  const snap = await db.collection(COLLECTION).orderBy('updatedAt', 'desc').get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

module.exports = { upsertRiseHerSubmission, getRiseHerSubmission, listRiseHerSubmissions };
