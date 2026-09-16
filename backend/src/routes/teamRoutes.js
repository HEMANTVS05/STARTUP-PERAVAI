const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const { authLimiter }      = require('../middleware/rateLimiter');
const {
  getMyTeam,
  checkTeamName,
  searchTeamByCode,
  createNewTeam,
  joinExistingTeam,
} = require('../controllers/teamController');

router.get('/me',     authenticateUser, getMyTeam);
router.get('/search', authenticateUser, searchTeamByCode);      // ?code=SPV-XXXXX
router.get('/check',  authenticateUser, checkTeamName);         // ?name=TeamName
router.post('/',      authenticateUser, authLimiter, createNewTeam);
router.post('/join',  authenticateUser, authLimiter, joinExistingTeam);

module.exports = router;
