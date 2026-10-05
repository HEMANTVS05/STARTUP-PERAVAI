// ─── Rise Her Controller ──────────────────────────────────────────────────────
const {
  upsertRiseHerSubmission,
  getRiseHerSubmission,
  listRiseHerSubmissions,
} = require('../services/riseherService');

// POST /api/riseher — save/update logged-in user's submission
async function submitRiseHer(req, res) {
  try {
    const uid = req.user.uid;
    const { startupName, ideaBrief, pitchDeckUrl } = req.body;

    if (!startupName || !startupName.trim()) {
      return res.status(400).json({ error: 'startupName is required.' });
    }
    if (!ideaBrief || !ideaBrief.trim()) {
      return res.status(400).json({ error: 'ideaBrief is required.' });
    }
    if (!pitchDeckUrl || !pitchDeckUrl.trim()) {
      return res.status(400).json({ error: 'pitchDeckUrl is required.' });
    }

    // Pull name/email from registration if available
    const result = await upsertRiseHerSubmission(uid, {
      startupName: startupName.trim(),
      ideaBrief: ideaBrief.trim(),
      pitchDeckUrl: pitchDeckUrl.trim(),
      submitterEmail: req.user.email || '',
      submittedAt: new Date().toISOString(),
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('submitRiseHer error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// GET /api/riseher/my — get the logged-in user's own submission
async function getMyRiseHer(req, res) {
  try {
    const data = await getRiseHerSubmission(req.user.uid);
    if (!data) return res.status(404).json({ error: 'Not found.' });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// GET /api/riseher/all — admin only: list all submissions
async function listAllRiseHer(req, res) {
  try {
    const list = await listRiseHerSubmissions();
    return res.json(list);
  } catch (err) {
    console.error('listAllRiseHer error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { submitRiseHer, getMyRiseHer, listAllRiseHer };
