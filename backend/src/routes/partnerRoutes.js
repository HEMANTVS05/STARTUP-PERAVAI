const router = require('express').Router();
const { authLimiter } = require('../middleware/rateLimiter');
const { submitPartnerEnquiry } = require('../controllers/partnerController');

// Public — no authentication needed, so anyone can enquire
router.post('/', authLimiter, submitPartnerEnquiry);

module.exports = router;
