const Project = require('../models/Project');

async function releaseEscrow(req, res) {
  try {
    const { projectId } = req.params;
    const userId = req.headers['x-user-id'];

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.userId !== userId) {
      return res.status(403).json({ message: 'Only the project creator can release escrow' });
    }

    // Update all pending transactions to 'released'
    project.escrowTransactions = project.escrowTransactions.map(tx => 
      tx.status === 'pending' ? { ...tx, status: 'released' } : tx
    );
    await project.save();

    res.status(200).json({ message: 'Escrow funds released', project });
  } catch (error) {
    console.error('Error releasing escrow:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = releaseEscrow;