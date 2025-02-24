const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  fundingGoal: { type: Number, required: true },
  equityOffered: { type: Number, required: true },
  duration: { type: Number, required: true }, // In days
  mediaUrl: { type: String },
  status: { type: String, default: 'active' },
  currentFunding: { type: Number, default: 0 },
  likes: [{ type: String }],
  comments: [{ userId: String, content: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  startDate: { type: Date, default: Date.now }, // Added for accurate time tracking
});

module.exports = mongoose.model('Project', projectSchema);