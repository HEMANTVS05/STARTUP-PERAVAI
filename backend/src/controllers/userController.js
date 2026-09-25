const { getUserById, upsertUser } = require('../services/userService');

const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.uid);
    if (!user) return res.status(404).json({ error: 'User profile not found.' });
    res.json(user);
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, college, department } = req.body;
    const user = await upsertUser(req.user.uid, { name, phone, college, department, email: req.user.email });
    res.json(user);
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile };
