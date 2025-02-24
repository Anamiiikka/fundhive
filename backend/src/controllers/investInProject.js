const Project = require('../models/Project');

async function investInProject(req, res) {
  try {
    const { userId, amount } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const investmentAmount = Number(amount);
    if (isNaN(investmentAmount) || investmentAmount < 1000) {
      return res.status(400).json({ message: 'Investment amount must be at least $1,000' });
    }

    project.currentFunding = (project.currentFunding || 0) + investmentAmount;
    await project.save();

    res.status(200).json({ message: 'Investment successful', project });
  } catch (error) {
    console.error('Error investing in project:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = investInProject;