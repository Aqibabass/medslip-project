const http = require('http');

const PORT = 5000;
const HEALTH_URL = `http://localhost:${PORT}/api/health`;

console.log(`--- Port ${PORT} Connectivity Test ---`);
console.log(`Attempting to reach: ${HEALTH_URL}`);

const req = http.get(HEALTH_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ Success! The backend server is active.');
    console.log(`HTTP Status: ${res.statusCode}`);
    console.log(`Response: ${data}`);
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('❌ Connection Failed!');
  if (err.code === 'ECONNREFUSED') {
    console.error(`Error: No server found running on port ${PORT}.`);
    console.log(`\nTroubleshooting:\n1. Start your server: 'cd server && npm start' or 'node server.js'\n2. Check if your .env file defines a different PORT.\n3. Ensure your firewall isn't blocking localhost:${PORT}.`);
  } else {
    console.error(`Error: ${err.message}`);
  }
  process.exit(1);
});

req.setTimeout(3000, () => {
  console.error('❌ Timeout: Server took too long to respond.');
  req.destroy();
  process.exit(1);
});