const fetch = require('node-fetch');

async function test() {
  try {
    const res = await fetch('https://www.startupperavai.in/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 100, currency: 'INR' })
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
  } catch (err) {
    console.error(err);
  }
}

test();
