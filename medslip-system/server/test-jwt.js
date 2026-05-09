const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const testJWT = () => {
  console.log('--- JWT Configuration Check ---');
  
  if (!JWT_SECRET) {
    console.error('❌ Error: JWT_SECRET is not defined in your .env file.');
    console.log('Action: Add JWT_SECRET=your_super_secret_string to c:\\Users\\Hp\\OneDrive\\Desktop\\cisco\\medslip-system\\server\\.env');
    process.exit(1);
  }

  console.log('✅ JWT_SECRET found in environment.');

  const payload = { id: 'test-patient-123', department: 'Cardiology' };
  const options = { expiresIn: '1h' };

  try {
    // 1. Test Signing
    const token = jwt.sign(payload, JWT_SECRET, options);
    console.log('✅ Token signed successfully.');
    console.log('Generated Token Sample:', token.substring(0, 20) + '...');

    // 2. Test Verification
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified successfully.');
    console.log('Decoded Payload:', decoded);

    console.log('\nConclusion: Your JWT setup is functional!');
  } catch (error) {
    console.error('❌ JWT Test Failed:', error.message);
  }
};

testJWT();