const Project = require('../models/Project');
const { generateMockTransactionId } = require('../utils/blockchainUtils');

async function crowdfundProject(req, res) {
  try {
    const { userId, amount } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if funding goal is already met
    if (project.currentFunding >= project.fundingGoal) {
      return res.status(400).json({ message: 'Funding goal has been reached; no further crowdfunding is allowed.' });
    }

    const contributionAmount = Number(amount);
    if (isNaN(contributionAmount) || contributionAmount < 10) {
      return res.status(400).json({ message: 'Crowdfunding amount must be at least $10' });
    }

    // Check if this contribution would exceed the funding goal
    const potentialFunding = project.currentFunding + contributionAmount;
    if (potentialFunding > project.fundingGoal) {
      return res.status(400).json({
        message: `Contribution exceeds funding goal. Maximum allowed contribution is $${(project.fundingGoal - project.currentFunding).toFixed(2)}.`,
      });
    }

    // Simulate blockchain escrow transaction
    const transactionId = generateMockTransactionId({ userId, projectId, amount, type: 'crowdfunding' });
    const escrowTransaction = {
      type: 'crowdfunding',
      userId,
      amount: contributionAmount,
      transactionId,
      status: 'pending',
    };

    project.escrowTransactions.push(escrowTransaction);
    project.currentFunding = project.currentFunding + contributionAmount;

    // Check if funding goal is reached and release escrow if so
    if (project.currentFunding >= project.fundingGoal) {
      project.escrowTransactions = project.escrowTransactions.map(tx => 
        tx.status === 'pending' ? { ...tx, status: 'released' } : tx
      );
    }

    await project.save();

    res.status(200).json({ 
      message: project.currentFunding >= project.fundingGoal 
        ? 'Crowdfunding contribution successful - funding goal reached, escrow released' 
        : 'Crowdfunding contribution successful - held in escrow', 
      project, 
      transactionId 
    });
  } catch (error) {
    console.error('Error crowdfunding project:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = crowdfundProject;