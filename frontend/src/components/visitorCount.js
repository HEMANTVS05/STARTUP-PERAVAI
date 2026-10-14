import api from '../utils/api';
import { db } from '../config/firebase';

/**
 * Fetches and prints registration and pass counts to the console.
 * Can be run manually anytime by typing `getEventCounts()` in the browser console.
 */
export async function getEventCounts() {
  try {
    const res = await api.get('/api/registrations/counts');
    const data = res.data;

    console.log(
      '%c==============================================\n' +
      '         EVENT & PASS COUNTS SUMMARY          \n' +
      '==============================================',
      'color: #a80d11; font-weight: bold; font-size: 14px;'
    );

    console.log(
`hackathon - ${data.hackathon}
scale-up studios - ${data.scaleUpStudios}
rupees to reality - ${data.rupeesToReality}
pitch perfect - ${data.pitchPerfect}

bootcamp - ${data.bootcamp}
rise her - ${data.riseHer}
art of selling nothing - ${data.artOfSellingNothing}

general pass - ${data.generalPass}
`
    );

    console.log(
      '%c--- DETAILED BREAKDOWN ---\n' +
      `Total General Passes: ${data.generalPass}\n` +
      `Total Event Pass Holders: ${data.totalEventPassHolders}\n` +
      `Total Registrations: ${data.totalRegistrations}\n` +
      `Hackathon Teams: ${data.hackathonTeams} (Total Members: ${data.hackathonMembers})\n` +
      `Scale-Up Studio Teams: ${data.scaleUpTeams} (Total Members: ${data.scaleUpMembers})\n` +
      `Rupees To Reality Teams: ${data.rupeesTeams} (Total Members: ${data.rupeesMembers})\n` +
      `Pitch Perfect Teams: ${data.pitchTeams} (Total Members: ${data.pitchMembers})\n` +
      `Rise Her Submissions: ${data.riseHerSubmissions}\n` +
      '==============================================',
      'color: #0b2140; font-weight: bold;'
    );

    return data;
  } catch (error) {
    console.error('Error fetching event counts:', error);
    return null;
  }
}

/**
 * Backward-compatible helper for visitor pass count
 */
export async function getVisitorPassesCount() {
  const counts = await getEventCounts();
  return counts ? counts.generalPass : null;
}

// Expose on window object for easy testing in browser DevTools Console
if (typeof window !== 'undefined') {
  window.getEventCounts = getEventCounts;
  window.getVisitorPassesCount = getVisitorPassesCount;
}

export default getEventCounts;
