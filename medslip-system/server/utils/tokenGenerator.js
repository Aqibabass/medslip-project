 const { v4: uuidv4 } = require('uuid');
const Token = require('../models/Token');

const generateUniqueToken = async () => {
  let token;
  let attempts = 0;
  const maxAttempts = 5;
  const chars = '0123456789ABCDEF';

  while (attempts < maxAttempts) {
    let randomPart = '';
    for (let i = 0; i < 8; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    token = `MS-ATM-${randomPart}`;

    // Check uniqueness
    const existing = await Token.findOne({ tokenId: token });
    if (!existing) {
      return token;
    }
    attempts++;
  }

  throw new Error('Failed to generate unique token after max attempts');
};

module.exports = { generateUniqueToken };