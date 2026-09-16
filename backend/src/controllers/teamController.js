const {
  findTeamByCode,
  isTeamNameAvailable,
  getUserTeam,
  createTeam,
  joinTeam,
} = require('../services/teamService');
const { validateCreateTeam, validateJoinTeam } = require('../validators/teamValidator');

const getMyTeam = async (req, res, next) => {
  try {
    const data = await getUserTeam(req.user.uid);
    if (!data) return res.status(404).json({ error: 'You are not in a team.' });
    res.json(data);
  } catch (err) { next(err); }
};

const checkTeamName = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'name query parameter is required.' });
    const available = await isTeamNameAvailable(name);
    res.json({ available });
  } catch (err) { next(err); }
};

const searchTeamByCode = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'code query parameter is required.' });
    const team = await findTeamByCode(code);
    if (!team) return res.status(404).json({ error: 'Team not found.' });
    // Return only safe public fields
    const { teamId, teamCode, teamName, college, department, problemStatement, maxMembers, joinedMemberUids, status } = team;
    res.json({ teamId, teamCode, teamName, college, department, problemStatement, maxMembers, currentMembers: joinedMemberUids?.length || 0, status });
  } catch (err) { next(err); }
};

const createNewTeam = async (req, res, next) => {
  try {
    const errors = validateCreateTeam(req.body);
    if (errors.length) return res.status(400).json({ error: 'Validation failed.', details: errors });
    const result = await createTeam({ uid: req.user.uid, email: req.user.email }, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

const joinExistingTeam = async (req, res, next) => {
  try {
    const errors = validateJoinTeam(req.body);
    if (errors.length) return res.status(400).json({ error: 'Validation failed.', details: errors });
    const { teamCode, ...profileData } = req.body;
    const result = await joinTeam({ uid: req.user.uid, email: req.user.email }, teamCode, profileData);
    res.json(result);
  } catch (err) { next(err); }
};

module.exports = { getMyTeam, checkTeamName, searchTeamByCode, createNewTeam, joinExistingTeam };
