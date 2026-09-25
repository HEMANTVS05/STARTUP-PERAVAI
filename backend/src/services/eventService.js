// ─── Event Service ────────────────────────────────────────────────────────────
const { db } = require('../config/firebase');

const COLLECTION   = 'events';
const EVENT_REGS   = 'eventRegistrations';

/**
 * List all published events.
 */
async function listEvents() {
  const snap = await db.collection(COLLECTION).orderBy('date', 'asc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Get a single event by ID.
 */
async function getEventById(eventId) {
  const snap = await db.collection(COLLECTION).doc(eventId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Register a user for a specific event.
 * Uses a Firestore transaction to enforce seat limits concurrently (spec §17).
 */
async function registerForEvent(uid, eventId, extraData = {}) {
  const registrationDocId = `${eventId}_${uid}`;
  const eventRef = db.collection(COLLECTION).doc(eventId);
  const regRef   = db.collection(EVENT_REGS).doc(registrationDocId);

  return db.runTransaction(async (txn) => {
    const [eventDoc, regDoc] = await Promise.all([txn.get(eventRef), txn.get(regRef)]);

    if (!eventDoc.exists) throw Object.assign(new Error('Event not found.'), { status: 404 });
    if (regDoc.exists)    throw Object.assign(new Error('Already registered for this event.'), { status: 409 });

    const event = eventDoc.data();

    // Seat-limit check (spec §17 — concurrent-safe)
    if (event.maxSeats !== undefined && event.seatsBooked >= event.maxSeats) {
      throw Object.assign(new Error('This event is fully booked.'), { status: 409 });
    }

    const payload = {
      uid,
      eventId,
      ...extraData,
      registeredAt: new Date().toISOString(),
      status: 'confirmed',
    };

    txn.set(regRef, payload);

    // Increment booked seat counter
    if (event.maxSeats !== undefined) {
      const { FieldValue } = require('firebase-admin/firestore');
      txn.update(eventRef, { seatsBooked: FieldValue.increment(1) });
    }

    return { id: registrationDocId, ...payload };
  });
}

/**
 * Check if a user is already registered for an event.
 */
async function getEventRegistration(uid, eventId) {
  const snap = await db.collection(EVENT_REGS).doc(`${eventId}_${uid}`).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

module.exports = { listEvents, getEventById, registerForEvent, getEventRegistration };
