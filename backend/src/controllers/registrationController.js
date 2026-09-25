const {
  getRegistrationByUid,
  upsertRegistration,
  updateRegistration,
  listAllRegistrations,
} = require('../services/registrationService');
const { validateRegistration } = require('../validators/registrationValidator');

const getMyRegistration = async (req, res, next) => {
  try {
    const reg = await getRegistrationByUid(req.user.uid);
    if (!reg) return res.status(404).json({ error: 'No registration found.' });
    res.json(reg);
  } catch (err) { next(err); }
};

const createRegistration = async (req, res, next) => {
  try {
    const errors = validateRegistration(req.body);
    if (errors.length) return res.status(400).json({ error: 'Validation failed.', details: errors });

    const reg = await upsertRegistration(req.user.uid, {
      ...req.body,
      email: req.user.email,
    });
    res.status(201).json(reg);
  } catch (err) { next(err); }
};

const updateMyRegistration = async (req, res, next) => {
  try {
    const reg = await updateRegistration(req.user.uid, req.body);
    res.json(reg);
  } catch (err) { next(err); }
};

// Admin only
const listRegistrations = async (req, res, next) => {
  try {
    const { limit, startAfter } = req.query;
    const registrations = await listAllRegistrations({
      limit: limit ? Number(limit) : 100,
      startAfter,
    });
    res.json(registrations);
  } catch (err) { next(err); }
};

module.exports = { getMyRegistration, createRegistration, updateMyRegistration, listRegistrations };
