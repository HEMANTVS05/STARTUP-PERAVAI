const router = require('express').Router({ mergeParams: true });
const { authenticateUser } = require('../middleware/authMiddleware');
const { authLimiter }      = require('../middleware/rateLimiter');
const {
  getMyEventTeam,
  searchEventTeamByCode,
  createNewEventTeam,
  joinExistingEventTeam,
} = require('../controllers/eventTeamController');

// All routes are scoped to /api/event-teams/:eventId/
router.get('/me',     authenticateUser, getMyEventTeam);
router.get('/search', authenticateUser, searchEventTeamByCode);   // ?code=SPV-XXXXX
router.post('/',      authenticateUser, authLimiter, createNewEventTeam);
router.post('/join',  authenticateUser, authLimiter, joinExistingEventTeam);

module.exports = router;
