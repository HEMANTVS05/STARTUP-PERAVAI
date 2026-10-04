// ─── Event Team Service ────────────────────────────────────────────────────────
// Manages teams for NON-HACKATHON group events.
// Collections: eventTeams/{eventId}/teams  &  eventTeams/{eventId}/team_members
// ─────────────────────────────────────────────────────────────────────────────

const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

function generateTeamCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = 'SPV-';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function ensureUniqueCode(eventId) {
  for (let i = 0; i < 10; i++) {
    const code = generateTeamCode();
    const snap = await db.collection('eventTeams').doc(eventId)
      .collection('teams').where('teamCode', '==', code).limit(1).get();
    if (snap.empty) return code;
  }
  throw new Error('Could not generate a unique team code. Please try again.');
}

/** Find a team by code within an event */
async function findEventTeamByCode(eventId, rawCode) {
  const code = rawCode.trim().toUpperCase();
  const snap = await db.collection('eventTeams').doc(eventId)
    .collection('teams').where('teamCode', '==', code).limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

/** Check team name uniqueness within event */
async function isEventTeamNameAvailable(eventId, teamName) {
  const lower = teamName.trim().toLowerCase();
  const snap = await db.collection('eventTeams').doc(eventId)
    .collection('teams').where('teamNameLower', '==', lower).limit(1).get();
  return snap.empty;
}

/** Get the event team a user belongs to */
async function getUserEventTeam(uid, eventId) {
  const snap = await db.collection('eventTeams').doc(eventId)
    .collection('team_members').where('uid', '==', uid).limit(1).get();
  if (snap.empty) return null;
  const memberData = snap.docs[0].data();
  const teamDoc = await db.collection('eventTeams').doc(eventId)
    .collection('teams').doc(memberData.teamId).get();
  if (!teamDoc.exists) return null;
  const membersSnap = await db.collection('eventTeams').doc(eventId)
    .collection('team_members').where('teamId', '==', memberData.teamId).get();
  return {
    team: { id: teamDoc.id, ...teamDoc.data() },
    members: membersSnap.docs.map(d => ({ id: d.id, ...d.data() })),
  };
}

/** Create a new event team */
async function createEventTeam(eventId, leaderUser, formData) {
  const { teamName, leaderName, maxMembers, invitedEmails } = formData;

  const available = await isEventTeamNameAvailable(eventId, teamName);
  if (!available) {
    throw Object.assign(new Error(`Team name "${teamName}" is already taken.`), { status: 409 });
  }

  const existing = await getUserEventTeam(leaderUser.uid, eventId);
  if (existing) {
    throw Object.assign(new Error('You are already in a team for this event.'), { status: 409 });
  }

  const teamCode = await ensureUniqueCode(eventId);
  const teamRef = db.collection('eventTeams').doc(eventId).collection('teams').doc();
  const teamId = teamRef.id;
  const memberRef = db.collection('eventTeams').doc(eventId)
    .collection('team_members').doc(`${teamId}_${leaderUser.uid}`);
  const userRef = db.collection('users').doc(leaderUser.uid);
  const now = new Date().toISOString();
  const cleanEmails = (invitedEmails || []).map(e => e.trim().toLowerCase()).filter(Boolean);

  const batch = db.batch();
  batch.set(teamRef, {
    eventId,
    teamId,
    teamCode,
    teamName: teamName.trim(),
    teamNameLower: teamName.trim().toLowerCase(),
    leaderUid: leaderUser.uid,
    leaderName: leaderName.trim(),
    leaderEmail: leaderUser.email.toLowerCase(),
    maxMembers: Number(maxMembers),
    invitedEmails: cleanEmails,
    joinedMemberUids: [leaderUser.uid],
    status: 'active',
    createdAt: now,
  });
  batch.set(memberRef, {
    teamId, teamCode, eventId,
    uid: leaderUser.uid,
    role: 'leader',
    name: leaderName.trim(),
    email: leaderUser.email.toLowerCase(),
    joinedAt: now,
  });
  // Store event team reference on user doc
  batch.set(userRef, {
    uid: leaderUser.uid,
    [`eventTeams.${eventId}`]: { teamId, teamCode, role: 'leader' },
    updatedAt: now,
  }, { merge: true });

  await batch.commit();
  return { teamId, teamCode, teamName: teamName.trim() };
}

/** Join an existing event team by code */
async function joinEventTeam(eventId, user, teamCode, profileData) {
  const team = await findEventTeamByCode(eventId, teamCode);
  if (!team) throw Object.assign(new Error('Invalid team code.'), { status: 404 });

  return db.runTransaction(async (txn) => {
    const teamRef = db.collection('eventTeams').doc(eventId).collection('teams').doc(team.id);
    const teamDoc = await txn.get(teamRef);
    if (!teamDoc.exists) throw Object.assign(new Error('Team not found.'), { status: 404 });

    const data = teamDoc.data();
    
    const userEmail = (user.email || '').toLowerCase().trim();
    if (!data.invitedEmails || !data.invitedEmails.includes(userEmail)) {
      throw Object.assign(new Error('Invalid: You have not been invited to join this team. Please ask the team leader to add your email address.'), { status: 403 });
    }

    if (data.joinedMemberUids?.includes(user.uid)) {
      throw Object.assign(new Error('You are already in this team.'), { status: 409 });
    }
    if ((data.joinedMemberUids?.length || 0) >= data.maxMembers) {
      throw Object.assign(new Error('This team is already full.'), { status: 409 });
    }

    const now = new Date().toISOString();
    const memberRef = db.collection('eventTeams').doc(eventId)
      .collection('team_members').doc(`${team.id}_${user.uid}`);
    const userRef = db.collection('users').doc(user.uid);
    const updatedJoined = [...(data.joinedMemberUids || []), user.uid];
    const isFull = updatedJoined.length >= data.maxMembers;

    txn.update(teamRef, {
      joinedMemberUids: FieldValue.arrayUnion(user.uid),
      status: isFull ? 'full' : 'active',
    });
    txn.set(memberRef, {
      teamId: team.id, teamCode: data.teamCode, eventId,
      uid: user.uid,
      role: 'member',
      name: profileData.name || '',
      email: (user.email || '').toLowerCase(),
      joinedAt: now,
    });
    txn.set(userRef, {
      uid: user.uid,
      [`eventTeams.${eventId}`]: { teamId: team.id, teamCode: data.teamCode, role: 'member' },
      updatedAt: now,
    }, { merge: true });

    return { teamId: team.id, teamCode: data.teamCode, teamName: data.teamName };
  });
}

module.exports = { findEventTeamByCode, isEventTeamNameAvailable, getUserEventTeam, createEventTeam, joinEventTeam };
