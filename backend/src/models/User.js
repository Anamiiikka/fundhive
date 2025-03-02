// backend/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, sparse: true, unique: true },
  avatarUrl: { type: String },
  username: { type: String, required: true, unique: true },
  aadhaarCardUrl: { type: String }, // New field for Aadhaar card URL
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);