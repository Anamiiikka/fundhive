const crypto = require('crypto');

function generateMockTransactionId(data) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(data) + Date.now()); // Ensure uniqueness with timestamp
  return hash.digest('hex');
}

module.exports = { generateMockTransactionId };