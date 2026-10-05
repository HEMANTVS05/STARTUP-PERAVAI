const {
  findEventTeamByCode,
  getUserEventTeam,
  createEventTeam,
  joinEventTeam,
} = require('../services/eventTeamService');

const getMyEventTeam = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    if (!eventId) return res.status(400).json({ error: 'eventId is required.' });
    const data = await getUserEventTeam(req.user.uid, eventId);
    if (!data) return res.status(404).json({ error: 'You are not in a team for this event.' });
    res.json(data);
  } catch (err) { next(err); }
};

const searchEventTeamByCode = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'code query parameter is required.' });
    const team = await findEventTeamByCode(eventId, code);
    if (!team) return res.status(404).json({ error: 'Team not found.' });
    const { id, teamId, teamCode, teamName, leaderName, leaderUid, leaderEmail, maxMembers, invitedEmails, joinedMemberUids, status } = team;
    res.json({ id: id || teamId, teamId: id || teamId, teamCode, teamName, leaderName, leaderUid, leaderEmail, maxMembers, invitedEmails: invitedEmails || [], currentMembers: joinedMemberUids?.length || 0, joinedMemberUids: joinedMemberUids || [], status });
  } catch (err) { next(err); }
};

const createNewEventTeam = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    if (!req.body.teamName || !req.body.leaderName) {
      return res.status(400).json({ error: 'teamName and leaderName are required.' });
    }
    const result = await createEventTeam(eventId, { uid: req.user.uid, email: req.user.email }, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

const joinExistingEventTeam = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { teamCode, ...profileData } = req.body;
    if (!teamCode) return res.status(400).json({ error: 'teamCode is required.' });
    const result = await joinEventTeam(eventId, { uid: req.user.uid, email: req.user.email }, teamCode, profileData);
    res.json(result);
  } catch (err) { next(err); }
};

module.exports = { getMyEventTeam, searchEventTeamByCode, createNewEventTeam, joinExistingEventTeam };
