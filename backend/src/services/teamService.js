// ─── Team Service ─────────────────────────────────────────────────────────────
// All Firestore operations for /teams and /team_members collections.
// Enforces all business rules server-side (spec §16–18).
// ─────────────────────────────────────────────────────────────────────────────

const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

const TEAMS      = 'teams';
const MEMBERS    = 'team_members';
const USERS      = 'users';

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateTeamCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = 'SPV-';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function ensureUniqueTeamCode() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateTeamCode();
    const snap = await db.collection(TEAMS).where('teamCode', '==', code).limit(1).get();
    if (snap.empty) return code;
  }
  throw new Error('Could not generate a unique team code. Please try again.');
}

// ── Public service functions ──────────────────────────────────────────────────

/**
 * Find a team by its team code (case-insensitive).
 */
async function findTeamByCode(rawCode) {
  const code = rawCode.trim().toUpperCase();
  const snap = await db.collection(TEAMS).where('teamCode', '==', code).limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

/**
 * Check that a team name is not already taken.
 */
async function isTeamNameAvailable(teamName) {
  const lower = teamName.trim().toLowerCase();
  const snap = await db.collection(TEAMS).where('teamNameLower', '==', lower).limit(1).get();
  return snap.empty;
}

/**
 * Get a user's current team membership (if any).
 */
async function getUserTeam(uid) {
  const userSnap = await db.collection(USERS).doc(uid).get();
  if (!userSnap.exists || !userSnap.data().teamId) return null;
  const teamId = userSnap.data().teamId;
  const teamSnap = await db.collection(TEAMS).doc(teamId).get();
  if (!teamSnap.exists) return null;
  const membersSnap = await db.collection(MEMBERS).where('teamId', '==', teamId).get();
  return {
    team: { id: teamSnap.id, ...teamSnap.data() },
    members: membersSnap.docs.map(d => ({ id: d.id, ...d.data() })),
  };
}

/**
 * Create a new team. Runs as a Firestore batch to ensure atomicity.
 * Spec §17: use transactions/batches for concurrent-safe operations.
 */
async function createTeam(leaderUser, formData) {
  const { teamName, college, department, problemStatement, leaderName, leaderEmail, maxMembers, invitedEmails } = formData;

  // 1. Check name uniqueness
  const available = await isTeamNameAvailable(teamName);
  if (!available) {
    throw Object.assign(new Error(`Team name "${teamName}" is already taken.`), { status: 409 });
  }

  // 2. Check leader doesn't already have a team
  const existing = await getUserTeam(leaderUser.uid);
  if (existing) {
    throw Object.assign(new Error('You are already in a team.'), { status: 409 });
  }

  // 3. Generate unique team code
  const teamCode = await ensureUniqueTeamCode();

  // 4. Build refs
  const teamRef   = db.collection(TEAMS).doc();
  const teamId    = teamRef.id;
  const memberRef = db.collection(MEMBERS).doc(`${teamId}_${leaderUser.uid}`);
  const userRef   = db.collection(USERS).doc(leaderUser.uid);
  const now       = new Date().toISOString();
  const cleanEmails = (invitedEmails || []).map(e => e.trim().toLowerCase()).filter(Boolean);

  // 5. Atomic batch write
  const batch = db.batch();

  batch.set(teamRef, {
    teamId,
    teamCode,
    teamName:      teamName.trim(),
    teamNameLower: teamName.trim().toLowerCase(),
    college:       college.trim(),
    department:    department.trim(),
    problemStatement: problemStatement.trim(),
    leaderUid:     leaderUser.uid,
    leaderName:    leaderName.trim(),
    leaderEmail:   leaderEmail.trim().toLowerCase(),
    maxMembers:    Number(maxMembers),
    invitedEmails: cleanEmails,
    joinedMemberUids: [leaderUser.uid],
    status:        'active',
    createdAt:     now,
  });

  batch.set(memberRef, {
    teamId, teamCode,
    uid:        leaderUser.uid,
    role:       'leader',
    name:       leaderName.trim(),
    email:      leaderEmail.trim().toLowerCase(),
    department: department.trim(),
    college:    college.trim(),
    joinedAt:   now,
  });

  batch.set(userRef, {
    uid:       leaderUser.uid,
    teamId,
    teamCode,
    teamRole:  'leader',
    updatedAt: now,
  }, { merge: true });

  await batch.commit();
  return { teamId, teamCode, teamName: teamName.trim() };
}

/**
 * Join an existing team using a team code.
 * Uses a Firestore transaction for concurrent-safe seat counting (spec §17).
 */
async function joinTeam(user, teamCode, profileData) {
  const team = await findTeamByCode(teamCode);
  if (!team) throw Object.assign(new Error('Invalid team code.'), { status: 404 });

  return db.runTransaction(async (txn) => {
    const teamRef = db.collection(TEAMS).doc(team.id);
    const teamDoc = await txn.get(teamRef);

    if (!teamDoc.exists) throw Object.assign(new Error('Team not found.'), { status: 404 });

    const data = teamDoc.data();

    if (data.joinedMemberUids?.includes(user.uid)) {
      throw Object.assign(new Error('You are already in this team.'), { status: 409 });
    }
    if ((data.joinedMemberUids?.length || 0) >= data.maxMembers) {
      throw Object.assign(new Error('This team is already full.'), { status: 409 });
    }

    const now       = new Date().toISOString();
    const memberRef = db.collection(MEMBERS).doc(`${team.id}_${user.uid}`);
    const userRef   = db.collection(USERS).doc(user.uid);
    const updatedJoined = [...(data.joinedMemberUids || []), user.uid];
    const isFull    = updatedJoined.length >= data.maxMembers;

    txn.update(teamRef, {
      joinedMemberUids: FieldValue.arrayUnion(user.uid),
      status: isFull ? 'full' : 'active',
    });

    txn.set(memberRef, {
      teamId:     team.id,
      teamCode:   data.teamCode,
      uid:        user.uid,
      role:       'member',
      name:       profileData.name,
      email:      (user.email || profileData.email || '').toLowerCase(),
      department: profileData.department,
      college:    profileData.college,
      joinedAt:   now,
    });

    txn.set(userRef, {
      uid:      user.uid,
      teamId:   team.id,
      teamCode: data.teamCode,
      teamRole: 'member',
      updatedAt: now,
    }, { merge: true });

    return { teamId: team.id, teamCode: data.teamCode, teamName: data.teamName };
  });
}

module.exports = { findTeamByCode, isTeamNameAvailable, getUserTeam, createTeam, joinTeam };
