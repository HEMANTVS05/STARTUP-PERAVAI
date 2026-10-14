// ─── Individual Event Service ───────────────────────────────────────────────
// Handles collections for individual events:
// - `bootcamp` (Design Thinking Bootcamp)
// - `art_of_selling_nothing` (The Art of Selling Nothing / illogical-marketing)
// ─────────────────────────────────────────────────────────────────────────────

const { db } = require('../config/firebase');

const BOOTCAMP_COLLECTION = 'bootcamp';
const ART_COLLECTION = 'art_of_selling_nothing';

/**
 * Syncs a user's registration data to individual event collections
 * if they are registered or paid for bootcamp or art of selling nothing.
 */
async function syncIndividualEvent(uid, userData) {
  if (!uid || !userData) return;

  const paid = Array.isArray(userData.paidEvents) ? userData.paidEvents : [];
  const registered = Array.isArray(userData.registeredEvents) ? userData.registeredEvents : [];
  const allEvents = new Set([...paid, ...registered]);

  const baseInfo = {
    uid,
    name: userData.name || '',
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    email: userData.email || '',
    phone: userData.phone || '',
    college: userData.college || '',
    year: userData.year || '',
    department: userData.department || '',
    location: userData.location || '',
    role: userData.role || 'student',
    passType: userData.passType || 'Event Pass',
    paymentStatus: userData.paymentStatus || 'paid',
    registeredAt: userData.registeredAt || new Date().toISOString(),
    updatedAt: userData.updatedAt || new Date().toISOString(),
    status: 'confirmed',
  };

  const tasks = [];

  // Bootcamp check
  if (allEvents.has('design-thinking-bootcamp') || allEvents.has('bootcamp')) {
    const bootcampDoc = {
      ...baseInfo,
      eventId: 'design-thinking-bootcamp',
      eventName: 'Design Thinking Bootcamp',
    };
    tasks.push(db.collection(BOOTCAMP_COLLECTION).doc(uid).set(bootcampDoc, { merge: true }));
  }

  // Art of Selling Nothing check
  if (allEvents.has('illogical-marketing') || allEvents.has('art-of-selling-nothing') || allEvents.has('art_of_selling_nothing')) {
    const artDoc = {
      ...baseInfo,
      eventId: 'illogical-marketing',
      eventName: 'The Art of Selling Nothing',
    };
    tasks.push(db.collection(ART_COLLECTION).doc(uid).set(artDoc, { merge: true }));
  }

  if (tasks.length > 0) {
    await Promise.all(tasks);
  }
}

/**
 * Scans all registrations and populates individual collections.
 * Also ensures metadata exists so collections appear in Firebase Console.
 */
async function syncAllExistingIndividualEvents() {
  console.log('Syncing all existing individual event registrations to collections...');

  // Ensure art_of_selling_nothing metadata exists so collection is visible in Firebase Console
  await db.collection(ART_COLLECTION).doc('_meta').set({
    eventId: 'illogical-marketing',
    eventName: 'The Art of Selling Nothing',
    description: 'Registrations collection for The Art of Selling Nothing',
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  const snap = await db.collection('registrations').get();
  let bootcampCount = 0;
  let artCount = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const paid = Array.isArray(data.paidEvents) ? data.paidEvents : [];
    const reg = Array.isArray(data.registeredEvents) ? data.registeredEvents : [];
    const all = new Set([...paid, ...reg]);

    if (all.has('design-thinking-bootcamp') || all.has('bootcamp')) {
      await syncIndividualEvent(doc.id, data);
      bootcampCount++;
    }
    if (all.has('illogical-marketing') || all.has('art-of-selling-nothing')) {
      await syncIndividualEvent(doc.id, data);
      artCount++;
    }
  }

  console.log(`Synced ${bootcampCount} bootcamp registrations to /${BOOTCAMP_COLLECTION}`);
  console.log(`Synced ${artCount} registrations to /${ART_COLLECTION}`);
  return { bootcampCount, artCount };
}

module.exports = {
  BOOTCAMP_COLLECTION,
  ART_COLLECTION,
  syncIndividualEvent,
  syncAllExistingIndividualEvents,
};
