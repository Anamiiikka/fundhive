const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  fundingGoal: { type: Number, required: true },
  equityOffered: { type: Number, required: true },
  duration: { type: Number, required: true },
  mediaUrl: { type: String },
  status: { type: String, default: 'active' },
  currentFunding: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema);