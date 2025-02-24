const Project = require('../models/Project');

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

    project.currentFunding = (project.currentFunding || 0) + contributionAmount;
    await project.save();

    res.status(200).json({ message: 'Crowdfunding contribution successful', project });
  } catch (error) {
    console.error('Error crowdfunding project:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = crowdfundProject;