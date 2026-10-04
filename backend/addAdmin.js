const { db } = require('./src/config/firebase');

async function run() {
  try {
    await db.collection('admins').doc('QbTRlKoEQ0bpgfcWEhtMw6fG51I2').set({
      role: 'admin',
      email: 'admin@startupperavai.com',
      createdAt: new Date().toISOString()
    });
    console.log('Added admin successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

run();
