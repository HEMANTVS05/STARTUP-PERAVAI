const {
  listEvents,
  getEventById,
  registerForEvent,
  getEventRegistration,
} = require('../services/eventService');

const getEvents = async (req, res, next) => {
  try {
    const events = await listEvents();
    res.json(events);
  } catch (err) { next(err); }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await getEventById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    res.json(event);
  } catch (err) { next(err); }
};

const registerEvent = async (req, res, next) => {
  try {
    const result = await registerForEvent(req.user.uid, req.params.eventId, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

const getMyEventRegistration = async (req, res, next) => {
  try {
    const reg = await getEventRegistration(req.user.uid, req.params.eventId);
    if (!reg) return res.status(404).json({ error: 'Registration not found.' });
    res.json(reg);
  } catch (err) { next(err); }
};

module.exports = { getEvents, getEvent, registerEvent, getMyEventRegistration };
