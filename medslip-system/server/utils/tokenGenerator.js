const Token = require('../models/Token');

const generateUniqueToken = async () => {
  let token;
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    // Generate random 4-digit number (0000-9999)
    const num = Math.floor(Math.random() * 10000);
    token = String(num).padStart(4, '0');

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
