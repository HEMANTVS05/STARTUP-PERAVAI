const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { submitRiseHer, getMyRiseHer, listAllRiseHer } = require('../controllers/riseherController');

// User routes
router.post('/', authenticateUser, submitRiseHer);
router.get('/my', authenticateUser, getMyRiseHer);

// Admin route
router.get('/all', authenticateUser, requireAdmin, listAllRiseHer);

module.exports = router;
