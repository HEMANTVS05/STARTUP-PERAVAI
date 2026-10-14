const { db } = require('./src/config/firebase');

async function getCounts() {
  try {
    console.log('Fetching Firestore counts...\n');

    // 1. Registrations collection
    const regSnap = await db.collection('registrations').get();

    let visitorPassCount = 0;
    let eventPassCount = 0;

    const paidCounts = {
      'hackathon': 0,
      'scale-up-studio': 0,
      'rupees-to-reality': 0,
      'pitch-perfect': 0,
      'design-thinking-bootcamp': 0,
      'riseher': 0,
      'illogical-marketing': 0,
    };

    const registeredCounts = {
      'hackathon': 0,
      'scale-up-studio': 0,
      'rupees-to-reality': 0,
      'pitch-perfect': 0,
      'design-thinking-bootcamp': 0,
      'riseher': 0,
      'illogical-marketing': 0,
    };

    regSnap.docs.forEach(doc => {
      const data = doc.data();

      // Visitor Pass check (paymentStatus !== 'pending')
      if (data.passType === "Visitor's Pass" && data.paymentStatus !== 'pending') {
        visitorPassCount++;
      }

      const paidEvents = Array.isArray(data.paidEvents) ? data.paidEvents : [];
      const regEvents = Array.isArray(data.registeredEvents) ? data.registeredEvents : [];

      paidEvents.forEach(e => {
        if (paidCounts[e] !== undefined) paidCounts[e]++;
      });

      regEvents.forEach(e => {
        if (registeredCounts[e] !== undefined) registeredCounts[e]++;
      });

      if (data.passType === 'Event Pass' || paidEvents.length > 0 || regEvents.length > 0) {
        eventPassCount++;
      }
    });

    // 2. Teams collection (Hackathon)
    const hackathonTeamsSnap = await db.collection('teams').get();
    const hackathonMembersSnap = await db.collection('team_members').get();

    // 3. eventTeams collections (scale-up-studio, rupees-to-reality, pitch-perfect)
    const scaleUpTeams = await db.collection('eventTeams').doc('scale-up-studio').collection('teams').get();
    const scaleUpMembers = await db.collection('eventTeams').doc('scale-up-studio').collection('team_members').get();

    const rupeesTeams = await db.collection('eventTeams').doc('rupees-to-reality').collection('teams').get();
    const rupeesMembers = await db.collection('eventTeams').doc('rupees-to-reality').collection('team_members').get();

    const pitchTeams = await db.collection('eventTeams').doc('pitch-perfect').collection('teams').get();
    const pitchMembers = await db.collection('eventTeams').doc('pitch-perfect').collection('team_members').get();

    // 4. riseher collection
    const riseherSnap = await db.collection('riseher').get();

    // 5. bootcamp collection (if exists)
    let bootcampSnapCount = 0;
    try {
      const bSnap = await db.collection('bootcamp').get();
      bootcampSnapCount = bSnap.size;
    } catch (e) {}

    // 6. art of selling nothing collection (if exists)
    let sellingSnapCount = 0;
    try {
      const sSnap = await db.collection('art_of_selling_nothing').get();
      sellingSnapCount = sSnap.size;
    } catch (e) {}

    console.log('==============================================');
    console.log('         EVENT & PASS COUNTS SUMMARY          ');
    console.log('==============================================\n');

    console.log('--- GROUP EVENTS ---');
    console.log(`hackathon - ${paidCounts['hackathon']} paid (${hackathonTeamsSnap.size} teams, ${hackathonMembersSnap.size} members)`);
    console.log(`scale-up studios - ${paidCounts['scale-up-studio']} paid (${scaleUpTeams.size} teams, ${scaleUpMembers.size} members)`);
    console.log(`rupees to reality - ${paidCounts['rupees-to-reality']} paid (${rupeesTeams.size} teams, ${rupeesMembers.size} members)`);
    console.log(`pitch perfect - ${paidCounts['pitch-perfect']} paid (${pitchTeams.size} teams, ${pitchMembers.size} members)\n`);

    console.log('--- INDIVIDUAL EVENTS ---');
    console.log(`bootcamp - ${paidCounts['design-thinking-bootcamp']} paid (${bootcampSnapCount} in bootcamp collection)`);
    console.log(`rise her - ${paidCounts['riseher']} paid (${riseherSnap.size} submissions in riseher collection)`);
    console.log(`art of selling nothing - ${paidCounts['illogical-marketing']} paid (${sellingSnapCount} in art collection)\n`);

    console.log('--- PASS COUNTS ---');
    console.log(`general pass - ${visitorPassCount}`);
    console.log(`total event pass holders - ${eventPassCount}`);
    console.log(`total registrations in system - ${regSnap.size}\n`);
    console.log('==============================================\n');

    return {
      hackathon: paidCounts['hackathon'],
      hackathonTeams: hackathonTeamsSnap.size,
      hackathonMembers: hackathonMembersSnap.size,
      scaleUpStudios: paidCounts['scale-up-studio'],
      scaleUpTeams: scaleUpTeams.size,
      scaleUpMembers: scaleUpMembers.size,
      rupeesToReality: paidCounts['rupees-to-reality'],
      rupeesTeams: rupeesTeams.size,
      rupeesMembers: rupeesMembers.size,
      pitchPerfect: paidCounts['pitch-perfect'],
      pitchTeams: pitchTeams.size,
      pitchMembers: pitchMembers.size,
      bootcamp: paidCounts['design-thinking-bootcamp'],
      riseHer: paidCounts['riseher'],
      riseHerSubmissions: riseherSnap.size,
      artOfSellingNothing: paidCounts['illogical-marketing'],
      generalPass: visitorPassCount,
      totalEventPassHolders: eventPassCount,
      totalRegistrations: regSnap.size
    };
  } catch (error) {
    console.error('Error fetching counts:', error);
  }
}

if (require.main === module) {
  getCounts().then(() => process.exit(0));
}

module.exports = { getCounts };
