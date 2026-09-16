// ─── Admin Authorization Middleware ───────────────────────────────────────────
// Authentication  = "Who is this user?"     → handled by authMiddleware.js
// Authorization   = "Can this user do this?" → handled HERE
//
// Per spec §10: Prefer Firebase Custom Claims for high-level roles.
// We check the decoded token's `role` claim first (fastest, no DB call).
// If no claim exists yet we fall back to a Firestore lookup so the system
// still works while Custom Claims are being backfilled.
// ─────────────────────────────────────────────────────────────────────────────

const { db } = require('../config/firebase');

const ADMIN_ROLES = ['admin', 'organizer'];

/**
 * requireAdmin — allows only users whose role Custom Claim (or Firestore
 * fallback) is included in ADMIN_ROLES.
 * Must be placed AFTER authenticateUser in the middleware chain.
 */
const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Not authenticated.' });
  }

  // 1. Check Firebase Custom Claims (zero Firestore reads — fastest path)
  const claimRole = req.user.role;
  if (claimRole && ADMIN_ROLES.includes(claimRole)) {
    return next();
  }

  // 2. Firestore fallback — used until Custom Claims are set for all admins
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(403).json({ error: 'Forbidden: User record not found.' });
    }

    const firestoreRole = userDoc.data().role;
    if (!firestoreRole || !ADMIN_ROLES.includes(firestoreRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
    }

    // Attach for downstream use
    req.user.resolvedRole = firestoreRole;
    return next();
  } catch (error) {
    console.error('adminMiddleware error:', error.message);
    return res.status(500).json({ error: 'Internal server error during authorization.' });
  }
};

/**
 * requireRole(roles) — granular role check for specific route groups.
 * Example: router.delete('/event', requireRole(['admin']), controller)
 */
const requireRole = (roles = []) => async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Not authenticated.' });
  }

  const claimRole = req.user.role;
  if (claimRole && roles.includes(claimRole)) {
    return next();
  }

  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const firestoreRole = userDoc.exists ? userDoc.data().role : null;

    if (!firestoreRole || !roles.includes(firestoreRole)) {
      return res.status(403).json({ error: `Forbidden: Role '${roles.join(' or ')}' required.` });
    }

    req.user.resolvedRole = firestoreRole;
    return next();
  } catch (error) {
    console.error('requireRole error:', error.message);
    return res.status(500).json({ error: 'Internal server error during authorization.' });
  }
};

module.exports = { requireAdmin, requireRole };
