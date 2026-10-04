import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import api from '../utils/api';

/**
 * Find a team by code in a specific event's teams collection.
 */
export async function findEventTeamByCode(eventId, teamCode) {
  if (!teamCode?.trim() || !eventId) return null;
  const cleanCode = teamCode.trim().toUpperCase();
  const q = query(
    collection(db, 'eventTeams', eventId, 'teams'),
    where('teamCode', '==', cleanCode)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

/**
 * Fetch the team the current user is in for a specific event.
 */
export async function fetchUserEventTeam(uid, eventId) {
  if (!uid || !eventId) return null;
  try {
    // Check eventTeams/{eventId}/team_members for this uid
    const q = query(
      collection(db, 'eventTeams', eventId, 'team_members'),
      where('uid', '==', uid)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const memberData = snap.docs[0].data();
    const teamDoc = await getDoc(
      doc(db, 'eventTeams', eventId, 'teams', memberData.teamId)
    );
    if (!teamDoc.exists()) return null;

    const membersSnap = await getDocs(
      query(
        collection(db, 'eventTeams', eventId, 'team_members'),
        where('teamId', '==', memberData.teamId)
      )
    );

    return {
      team: { id: teamDoc.id, ...teamDoc.data() },
      members: membersSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    };
  } catch (err) {
    console.error(`fetchUserEventTeam(${eventId}):`, err);
    return null;
  }
}

/**
 * Real-time listener for a specific event team.
 */
export function subscribeToEventTeam(eventId, teamId, callback) {
  if (!teamId || !eventId) return () => {};
  const teamRef = doc(db, 'eventTeams', eventId, 'teams', teamId);
  return onSnapshot(teamRef, async teamSnap => {
    if (!teamSnap.exists()) { callback(null); return; }
    const teamData = { id: teamSnap.id, ...teamSnap.data() };
    const membersSnap = await getDocs(
      query(
        collection(db, 'eventTeams', eventId, 'team_members'),
        where('teamId', '==', teamId)
      )
    );
    callback({
      team: teamData,
      members: membersSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    });
  });
}
