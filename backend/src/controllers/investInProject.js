const Project = require('../models/Project');
const { generateMockTransactionId } = require('../utils/blockchainUtils');

async function investInProject(req, res) {
  try {
    const { userId, amount } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const investmentAmount = Number(amount);
    if (isNaN(investmentAmount) || investmentAmount < 10) {
      return res.status(400).json({ message: 'Investment amount must be at least $10' });
    }

    // Simulate blockchain escrow transaction
    const transactionId = generateMockTransactionId({ userId, projectId, amount, type: 'investment' });
    const escrowTransaction = {
      type: 'investment',
      userId,
      amount: investmentAmount,
      transactionId,
      status: 'pending', // Funds held in escrow until conditions met
    };

    project.escrowTransactions.push(escrowTransaction);
    project.currentFunding = (project.currentFunding || 0) + investmentAmount;
    await project.save();

    res.status(200).json({ 
      message: 'Investment successful - held in escrow', 
      project, 
      transactionId 
    });
  } catch (error) {
    console.error('Error investing in project:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = investInProject;