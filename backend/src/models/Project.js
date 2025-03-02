const mongoose = require('mongoose');

const escrowTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['investment', 'crowdfunding'], required: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true }, // Mock blockchain transaction ID
  status: { type: String, enum: ['pending', 'released', 'refunded'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

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
  likes: [{ type: String }],
  comments: [{ userId: String, content: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  startDate: { type: Date, default: Date.now },
  negotiationRequests: [{
    investorId: { type: String, required: true },
    proposedAmount: { type: Number, required: true },
    proposedEquity: { type: Number, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] },
    createdAt: { type: Date, default: Date.now }
  }],
  escrowTransactions: [escrowTransactionSchema], // New field for escrow transactions
});

module.exports = mongoose.model('Project', projectSchema);