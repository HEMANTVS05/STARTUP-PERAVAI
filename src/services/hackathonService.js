import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

// ── Default Problem Statements Seed ──────────────────────────────────────────
export const DEFAULT_PROBLEM_STATEMENTS = [
  {
    id: 'ps-01',
    title: 'AI-Driven Smart Agriculture & Yield Optimization',
    category: 'AI / IoT',
    description: 'Develop intelligent solutions for crop monitoring, soil health analysis, and weather-based yield prediction for farmers.'
  },
  {
    id: 'ps-02',
    title: 'DeCentralized Identity & Web3 Fraud Prevention',
    category: 'Blockchain / Fintech',
    description: 'Build a secure, tamper-proof identity verification system to eliminate financial fraud and credential spoofing.'
  },
  {
    id: 'ps-03',
    title: 'Autonomous Healthcare Diagnostic Assistant',
    category: 'HealthTech',
    description: 'Create an AI assistant that analyzes patient vitals and symptom logs to assist rural clinics with early diagnosis.'
  },
  {
    id: 'ps-04',
    title: 'Clean Energy Grid Monitoring & Carbon Footprint Tracking',
    category: 'ClimateTech',
    description: 'Design real-time telemetry dashboards for renewable energy distribution and automated carbon credit calculations.'
  },
  {
    id: 'ps-05',
    title: 'Gamified Skill-Based Learning Platform for Rural Education',
    category: 'EdTech',
    description: 'Build offline-first interactive learning modules tailored for underprivileged students with low bandwidth access.'
  },
  {
    id: 'ps-06',
    title: 'Open Innovation - Build Your Own Breakthrough Solution',
    category: 'General',
    description: 'Propose and build a novel technological solution tackling any real-world challenge of your choice.'
  }
];

/**
 * Fetch problem statements from `problem_statements` collection.
 * Seeds default items if collection is empty.
 */
export async function fetchProblemStatements() {
  try {
    const colRef = collection(db, 'problem_statements');
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      // Seed default problem statements into Firestore
      const seedPromises = DEFAULT_PROBLEM_STATEMENTS.map(ps =>
        setDoc(doc(db, 'problem_statements', ps.id), ps)
      );
      await Promise.all(seedPromises);
      return DEFAULT_PROBLEM_STATEMENTS;
    }

    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching problem statements:', err);
    return DEFAULT_PROBLEM_STATEMENTS;
  }
}

/**
 * Generate a unique team code formatted like: SPV-7KQ4P
 */
export async function generateUniqueTeamCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous chars like O, 0, I, 1
  let code = '';
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    let randomPart = '';
    for (let i = 0; i < 5; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = `SPV-${randomPart}`;

    // Check if code exists in `teams` collection
    const q = query(collection(db, 'teams'), where('teamCode', '==', code));
    const snap = await getDocs(q);
    if (snap.empty) {
      isUnique = true;
    }
  }

  return code;
}

/**
 * Check if Team Name is unique (case-insensitive)
 */
export async function checkTeamNameUnique(teamName) {
  if (!teamName || !teamName.trim()) return false;
  const cleanName = teamName.trim().toLowerCase();
  
  const q = query(collection(db, 'teams'), where('teamNameLower', '==', cleanName));
  const snap = await getDocs(q);
  return snap.empty;
}

/**
 * Ensure user profile doc exists/updated in `users` collection
 */
export async function updateUserProfile(uid, profileData) {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    uid,
    name: profileData.name || profileData.displayName || '',
    email: profileData.email || '',
    department: profileData.department || '',
    college: profileData.college || '',
    phone: profileData.phone || '',
    updatedAt: serverTimestamp(),
    ...(profileData.teamId ? { teamId: profileData.teamId } : {}),
  }, { merge: true });
}

/**
 * Get user profile doc from `users` collection
 */
export async function getUserProfile(uid) {
  if (!uid) return null;
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
}

/**
 * Create a new team in Firestore:
 * Writes to: `users`, `teams`, `team_members`
 */
export async function createTeamInFirestore(leaderUser, formData) {
  const {
    teamName,
    college,
    department,
    problemStatement,
    leaderName,
    leaderEmail,
    maxMembers, // 2, 3, or 4
    invitedEmails // Array of strings (emails)
  } = formData;

  // 1. Double check team name uniqueness
  const isUnique = await checkTeamNameUnique(teamName);
  if (!isUnique) {
    throw new Error(`Team name "${teamName}" is already taken. Please choose another name.`);
  }

  // 2. Generate Team Code
  const teamCode = await generateUniqueTeamCode();

  // 3. Create document reference in `teams` collection
  const teamDocRef = doc(collection(db, 'teams'));
  const teamId = teamDocRef.id;

  const cleanInvitedEmails = (invitedEmails || [])
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  const teamData = {
    teamId,
    teamCode,
    teamName: teamName.trim(),
    teamNameLower: teamName.trim().toLowerCase(),
    college: college.trim(),
    department: department.trim(),
    problemStatement: problemStatement.trim(),
    leaderUid: leaderUser.uid,
    leaderName: leaderName.trim(),
    leaderEmail: leaderEmail.trim().toLowerCase(),
    maxMembers: Number(maxMembers),
    invitedEmails: cleanInvitedEmails,
    joinedMemberUids: [leaderUser.uid],
    status: 'active',
    createdAt: serverTimestamp(),
  };

  // Save team doc
  await setDoc(teamDocRef, teamData);

  // 4. Create Leader entry in `team_members` collection
  const memberDocRef = doc(db, 'team_members', `${teamId}_${leaderUser.uid}`);
  await setDoc(memberDocRef, {
    teamId,
    teamCode,
    uid: leaderUser.uid,
    role: 'leader',
    name: leaderName.trim(),
    email: leaderEmail.trim().toLowerCase(),
    department: department.trim(),
    college: college.trim(),
    joinedAt: serverTimestamp(),
  });

  // 5. Update Leader profile in `users` collection
  await updateUserProfile(leaderUser.uid, {
    name: leaderName.trim(),
    email: leaderEmail.trim().toLowerCase(),
    department: department.trim(),
    college: college.trim(),
    teamId,
    teamCode,
    teamRole: 'leader',
  });

  return { teamId, teamCode, teamName: teamName.trim() };
}

/**
 * Update an existing team in Firestore (Leader only)
 */
export async function updateTeamInFirestore(teamId, leaderUser, teamData) {
  const { teamName, problemStatement, maxMembers, invitedEmails, college, department, leaderName, leaderEmail } = teamData;

  const teamRef = doc(db, 'teams', teamId);
  const teamSnap = await getDoc(teamRef);

  if (!teamSnap.exists()) {
    throw new Error("Team not found.");
  }
  
  const currentData = teamSnap.data();

  // If team name changed, verify uniqueness
  if (teamName.trim().toLowerCase() !== currentData.teamName.toLowerCase()) {
    const isUnique = await checkTeamNameUnique(teamName);
    if (!isUnique) {
      throw new Error(`Team Name "${teamName}" is already taken.`);
    }
  }
  
  // Verify maxMembers isn't less than currently joined members
  const joinedCount = currentData.joinedMemberUids?.length || 1;
  if (maxMembers < joinedCount) {
    throw new Error(`Cannot reduce team size to ${maxMembers}. There are already ${joinedCount} members joined.`);
  }

  // Update `teams` doc
  await updateDoc(teamRef, {
    teamName: teamName.trim(),
    problemStatement: problemStatement.trim(),
    maxMembers,
    invitedEmails: invitedEmails.map(e => e.trim().toLowerCase()),
    college: college.trim(),
    department: department.trim(),
    leaderName: leaderName.trim(),
    status: maxMembers === joinedCount ? 'full' : 'open',
    updatedAt: serverTimestamp(),
  });

  // Update Leader's `team_members` doc
  const memberDocRef = doc(db, 'team_members', `${teamId}_${leaderUser.uid}`);
  await updateDoc(memberDocRef, {
    name: leaderName.trim(),
    department: department.trim(),
    college: college.trim(),
  });

  // Update Leader's profile in `users` collection
  await updateUserProfile(leaderUser.uid, {
    name: leaderName.trim(),
    department: department.trim(),
    college: college.trim(),
  });

  return { teamId, teamName: teamName.trim() };
}

/**
 * Search team by team code in `teams` collection
 */
export async function findTeamByCode(teamCode) {
  if (!teamCode || !teamCode.trim()) return null;
  const cleanCode = teamCode.trim().toUpperCase();

  const q = query(collection(db, 'teams'), where('teamCode', '==', cleanCode));
  const snap = await getDocs(q);

  if (snap.empty) return null;
  const teamDoc = snap.docs[0];
  return { id: teamDoc.id, ...teamDoc.data() };
}

/**
 * Join an existing team using team code
 */
export async function joinTeamInFirestore(user, teamCode, userProfileData) {
  const cleanCode = teamCode.trim().toUpperCase();
  const team = await findTeamByCode(cleanCode);

  if (!team) {
    throw new Error('Invalid Team Code. Please check the code and try again.');
  }

  if (team.joinedMemberUids?.includes(user.uid)) {
    throw new Error('You are already a member of this team.');
  }

  if ((team.joinedMemberUids?.length || 0) >= team.maxMembers) {
    throw new Error('This team has already reached its maximum member limit.');
  }

  const userEmail = (user.email || userProfileData.email || '').toLowerCase();
  
  // Update User profile in `users` collection
  await updateUserProfile(user.uid, {
    name: userProfileData.name,
    email: userEmail,
    department: userProfileData.department,
    college: userProfileData.college,
    phone: userProfileData.phone || '',
    teamId: team.teamId,
    teamCode: team.teamCode,
    teamRole: 'member'
  });

  // Add entry to `team_members` collection
  const memberDocRef = doc(db, 'team_members', `${team.teamId}_${user.uid}`);
  await setDoc(memberDocRef, {
    teamId: team.teamId,
    teamCode: team.teamCode,
    uid: user.uid,
    role: 'member',
    name: userProfileData.name,
    email: userEmail,
    department: userProfileData.department,
    college: userProfileData.college,
    joinedAt: serverTimestamp(),
  });

  // Update `teams` collection
  const teamRef = doc(db, 'teams', team.teamId);
  const updatedJoined = [...(team.joinedMemberUids || []), user.uid];
  const isFull = updatedJoined.length >= team.maxMembers;

  await updateDoc(teamRef, {
    joinedMemberUids: arrayUnion(user.uid),
    status: isFull ? 'full' : 'active'
  });

  return { teamId: team.teamId, teamCode: team.teamCode, teamName: team.teamName };
}

/**
 * Real-time listener for team and member data
 */
export function subscribeToTeamDetails(teamId, callback) {
  if (!teamId) return () => {};

  const teamRef = doc(db, 'teams', teamId);
  
  const unsubscribeTeam = onSnapshot(teamRef, async (teamSnap) => {
    if (!teamSnap.exists()) {
      callback(null);
      return;
    }

    const teamData = { id: teamSnap.id, ...teamSnap.data() };

    // Fetch team_members documents
    const membersQuery = query(collection(db, 'team_members'), where('teamId', '==', teamId));
    const membersSnap = await getDocs(membersQuery);
    const membersList = membersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    callback({
      team: teamData,
      members: membersList
    });
  });

  return unsubscribeTeam;
}

/**
 * Check if current user is already in a team
 */
export async function fetchUserTeamData(uid) {
  if (!uid) return null;

  // 1. Check user doc first
  const userProfile = await getUserProfile(uid);
  if (userProfile?.teamId) {
    const teamDoc = await getDoc(doc(db, 'teams', userProfile.teamId));
    if (teamDoc.exists()) {
      const teamData = { id: teamDoc.id, ...teamDoc.data() };
      const membersQuery = query(collection(db, 'team_members'), where('teamId', '==', userProfile.teamId));
      const membersSnap = await getDocs(membersQuery);
      const membersList = membersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      return {
        team: teamData,
        members: membersList,
        userProfile
      };
    }
  }

  // 2. Check team_members collection by uid fallback
  const q = query(collection(db, 'team_members'), where('uid', '==', uid));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const memberDoc = snap.docs[0].data();
    const teamDoc = await getDoc(doc(db, 'teams', memberDoc.teamId));
    if (teamDoc.exists()) {
      const teamData = { id: teamDoc.id, ...teamDoc.data() };
      const membersQuery = query(collection(db, 'team_members'), where('teamId', '==', memberDoc.teamId));
      const membersSnap = await getDocs(membersQuery);
      const membersList = membersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      return {
        team: teamData,
        members: membersList,
        userProfile
      };
    }
  }

  return null;
}
