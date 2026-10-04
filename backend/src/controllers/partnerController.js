// ─── Partner Controller ────────────────────────────────────────────────────────
// Handles partner/collaboration enquiry submissions.
// Data is stored in Firestore under the `partners` collection,
// sub-organised by role so they are easy to query from the console.
// ─────────────────────────────────────────────────────────────────────────────

const { db } = require('../config/firebase');

const VALID_ROLES = [
  'Sponsor',
  'Product Showcase / Brand Display',
  'Investor',
  'Ecosystem Partner',
  'Startup Enabler',
  'Corporate Partner',
  'Incubator / Accelerator',
  'Mentor / Industry Expert',
  'Government / Institutional Partner',
  'Media / Content Partner',
  'Community / Student Organisation',
  'Other',
];

/**
 * POST /api/partners
 * Public endpoint — no auth required so anyone can enquire.
 */
const submitPartnerEnquiry = async (req, res, next) => {
  try {
    const {
      role,
      name,
      organization,
      designation,
      email,
      phone,
      location,
      website,
      message,
    } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });
    if (!organization?.trim()) return res.status(400).json({ error: 'Organization is required.' });
    if (!email?.trim()) return res.status(400).json({ error: 'Email is required.' });
    if (!phone?.trim()) return res.status(400).json({ error: 'Phone number is required.' });
    if (!VALID_ROLES.includes(role)) return res.status(400).json({ error: 'Invalid partner role.' });

    // Basic e-mail format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    // ── Build the document ────────────────────────────────────────────────────
    const payload = {
      role:         role.trim(),
      name:         name.trim(),
      organization: organization.trim(),
      designation:  designation?.trim() || '',
      email:        email.trim().toLowerCase(),
      phone:        phone.trim(),
      location:     location?.trim() || '',
      website:      website?.trim() || '',
      message:      message?.trim() || '',
      submittedAt:  new Date().toISOString(),
      createdAt:    db.constructor.name === 'Firestore'
        ? require('firebase-admin/firestore').FieldValue.serverTimestamp()
        : new Date(),
    };

    // ── Sanitize role into a safe Firestore document ID ──────────────────────
    // Slashes in role names (e.g. "Product Showcase / Brand Display") would
    // break the Firestore path — replace them and spaces with underscores.
    const roleDocId = role.trim()
      .replace(/\s*\/\s*/g, '_')   // " / " → "_"
      .replace(/\s+/g, '_')        // remaining spaces → "_"
      .replace(/[^a-zA-Z0-9_\-]/g, ''); // strip any other invalid chars

    // ── Write to `partners/{roleDocId}/enquiries/{docId}` ────────────────────
    // e.g. partners/Sponsor/enquiries/<id>
    //      partners/Product_Showcase_Brand_Display/enquiries/<id>
    const { FieldValue } = require('firebase-admin/firestore');
    payload.createdAt = FieldValue.serverTimestamp();

    const docRef = await db
      .collection('partners')
      .doc(roleDocId)
      .collection('enquiries')
      .add(payload);

    return res.status(201).json({
      success: true,
      id: docRef.id,
      message: 'Partner enquiry received successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitPartnerEnquiry };
