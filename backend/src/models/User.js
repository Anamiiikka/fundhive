const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true }, // This should match user.sub
  name: { type: String },
  email: { type: String, sparse: true, unique: true },
  avatarUrl: { type: String },
  username: { type: String, required: true, unique: true }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);