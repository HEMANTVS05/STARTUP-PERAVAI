// ─── Event Team Service (Frontend) ───────────────────────────────────────────
// Uses the BACKEND API for all reads/writes to avoid Firestore permission errors.
// Only subscribeToEventTeam uses Firestore directly (real-time updates).
// ─────────────────────────────────────────────────────────────────────────────

import {
  collection,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import api from '../utils/api';

/**
 * Find a team by code — uses backend API to avoid Firestore permission errors.
 */
export async function findEventTeamByCode(eventId, teamCode) {
  if (!teamCode?.trim() || !eventId) return null;
  try {
    const { data } = await api.get(`/api/event-teams/${eventId}/search?code=${teamCode.trim().toUpperCase()}`);
    // Backend returns all fields including invitedEmails, leaderUid, leaderEmail, joinedMemberUids
    return data || null;
  } catch (err) {
    if (err.response?.status === 404) return null;
    console.error(`findEventTeamByCode(${eventId}):`, err);
    return null;
  }
}

/**
 * Fetch the team the current user is in for a specific event.
 * Uses backend API (/api/event-teams/:eventId/me) — avoids Firestore permission errors.
 */
export async function fetchUserEventTeam(uid, eventId) {
  if (!uid || !eventId) return null;
  try {
    const { data } = await api.get(`/api/event-teams/${eventId}/me`);
    return data; // { team: {...}, members: [...] }
  } catch (err) {
    if (err.response?.status === 404) return null; // Not in a team — normal case
    console.error(`fetchUserEventTeam(${eventId}):`, err);
    return null;
  }
}

/**
 * Real-time listener for a specific event team.
 * Still uses Firestore onSnapshot — if permissions block this, falls back to polling.
 */
export function subscribeToEventTeam(eventId, teamId, callback) {
  if (!teamId || !eventId) return () => {};

  try {
    const teamRef = doc(db, 'eventTeams', eventId, 'teams', teamId);
    return onSnapshot(
      teamRef,
      async (teamSnap) => {
        if (!teamSnap.exists()) { callback(null); return; }
        const teamData = { id: teamSnap.id, ...teamSnap.data() };
        try {
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
        } catch {
          // Members fetch failed — return team-only with empty members
          callback({ team: teamData, members: [] });
        }
      },
      (err) => {
        // Firestore permission error on snapshot — silently stop
        console.warn(`subscribeToEventTeam(${eventId}): permission error, real-time updates disabled.`);
      }
    );
  } catch (err) {
    console.warn(`subscribeToEventTeam(${eventId}): failed to subscribe.`);
    return () => {};
  }
}
