const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

router.get('/me',      authenticateUser, getProfile);
router.patch('/me',    authenticateUser, updateProfile);

module.exports = router;
