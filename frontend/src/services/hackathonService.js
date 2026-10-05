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
import { db } from '../config/firebase';
import api from '../utils/api';

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
 * Check if Team Name is unique (case-insensitive)
 */
export async function checkTeamNameUnique(teamName) {
  if (!teamName || !teamName.trim()) return false;
  try {
    const { data } = await api.get(`/api/teams/check?name=${encodeURIComponent(teamName.trim())}`);
    return data.available;
  } catch (err) {
    console.error('checkTeamNameUnique error:', err);
    return false; // Fail safe
  }
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
 * Create a new team via Backend API:
 */
export async function createTeamInFirestore(leaderUser, formData) {
  const { data } = await api.post('/api/teams', formData);
  return data; // returns { teamId, teamCode, teamName }
}

/**
 * Update an existing team in Firestore (Leader only)
 */
export async function updateTeamInFirestore(teamId, leaderUser, teamData) {
  const { data } = await api.put(`/api/teams/${teamId}`, teamData);
  return data;
}

/**
 * Search team by team code in `teams` collection
 */
export async function findTeamByCode(teamCode) {
  if (!teamCode || !teamCode.trim()) return null;
  const cleanCode = teamCode.trim().toUpperCase();
  try {
    const { data } = await api.get(`/api/teams/search?code=${cleanCode}`);
    return data || null;
  } catch (err) {
    if (err.response?.status === 404) return null;
    console.error('findTeamByCode:', err);
    return null;
  }
}

/**
 * Join an existing team using team code via Backend API
 */
export async function joinTeamInFirestore(user, teamCode, userProfileData) {
  const { data } = await api.post('/api/teams/join', {
    teamCode,
    ...userProfileData
  });
  return data;
}

/**
 * Real-time listener for team and member data
 */
export function subscribeToTeamDetails(teamId, callback) {
  if (!teamId) return () => {};

  try {
    const teamRef = doc(db, 'teams', teamId);
    
    return onSnapshot(
      teamRef,
      async (teamSnap) => {
        if (!teamSnap.exists()) {
          callback(null);
          return;
        }

        const teamData = { id: teamSnap.id, ...teamSnap.data() };

        try {
          // Fetch team_members documents
          const membersQuery = query(collection(db, 'team_members'), where('teamId', '==', teamId));
          const membersSnap = await getDocs(membersQuery);
          const membersList = membersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

          callback({
            team: teamData,
            members: membersList
          });
        } catch (err) {
          // If members fetch fails, return just the team data
          callback({ team: teamData, members: [] });
        }
      },
      (err) => {
        console.warn(`subscribeToTeamDetails(${teamId}): permission error, real-time updates disabled.`);
      }
    );
  } catch (err) {
    console.warn(`subscribeToTeamDetails(${teamId}): failed to subscribe.`);
    return () => {};
  }
}

/**
 * Check if current user is already in a team
 */
export async function fetchUserTeamData(uid) {
  if (!uid) return null;
  try {
    const { data } = await api.get('/api/teams/me');
    return data; // { team, members }
  } catch (err) {
    if (err.response?.status === 404) return null;
    console.error('fetchUserTeamData:', err);
    return null;
  }
}
