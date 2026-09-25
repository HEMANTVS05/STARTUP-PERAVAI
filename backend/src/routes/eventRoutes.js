const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const { authLimiter }      = require('../middleware/rateLimiter');
const {
  getEvents,
  getEvent,
  registerEvent,
  getMyEventRegistration,
} = require('../controllers/eventController');

router.get('/',                          authenticateUser, getEvents);
router.get('/:eventId',                  authenticateUser, getEvent);
router.post('/:eventId/register',        authenticateUser, authLimiter, registerEvent);
router.get('/:eventId/my-registration',  authenticateUser, getMyEventRegistration);

module.exports = router;
