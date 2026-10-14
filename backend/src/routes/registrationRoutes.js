const router  = require('express').Router();
const { authenticateUser }  = require('../middleware/authMiddleware');
const { requireAdmin }      = require('../middleware/adminMiddleware');
const { authLimiter }       = require('../middleware/rateLimiter');
const {
  getMyRegistration,
  createRegistration,
  updateMyRegistration,
  listRegistrations,
  getRegistrationCounts,
} = require('../controllers/registrationController');

// User routes
router.get('/',       authenticateUser, getMyRegistration);
router.get('/counts', getRegistrationCounts);
router.post('/',      authenticateUser, authLimiter, createRegistration);
router.patch('/',     authenticateUser, updateMyRegistration);

// Admin routes
router.get('/all', authenticateUser, requireAdmin, listRegistrations);

module.exports = router;
