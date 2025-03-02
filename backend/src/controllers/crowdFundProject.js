const Project = require('../models/Project');
const { generateMockTransactionId } = require('../utils/blockchainUtils');

async function crowdfundProject(req, res) {
  try {
    const { userId, amount } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const contributionAmount = Number(amount);
    if (isNaN(contributionAmount) || contributionAmount < 10) {
      return res.status(400).json({ message: 'Crowdfunding amount must be at least $10' });
    }

    // Simulate blockchain escrow transaction
    const transactionId = generateMockTransactionId({ userId, projectId, amount, type: 'crowdfunding' });
    const escrowTransaction = {
      type: 'crowdfunding',
      userId,
      amount: contributionAmount,
      transactionId,
      status: 'pending', // Funds held in escrow
    };

    project.escrowTransactions.push(escrowTransaction);
    project.currentFunding = (project.currentFunding || 0) + contributionAmount;
    await project.save();

    res.status(200).json({ 
      message: 'Crowdfunding contribution successful - held in escrow', 
      project, 
      transactionId 
    });
  } catch (error) {
    console.error('Error crowdfunding project:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = crowdfundProject;