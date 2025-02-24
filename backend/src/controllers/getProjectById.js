const Project = require('../models/Project');
const { populateProjectUser } = require('../utils/projectUtils');

async function getProjectById(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const populatedProject = await populateProjectUser(project);

    console.log('Populated project by ID:', populatedProject);
    res.status(200).json(populatedProject);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = getProjectById;