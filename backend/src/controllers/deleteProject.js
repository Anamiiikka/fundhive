const Project = require('../models/Project');

async function deleteProject(req, res) {
  try {
    const projectId = req.params.id;
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the requester is the project creator
    if (project.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this project' });
    }

    // Check if the project has zero investments
    if (project.currentFunding > 0) {
      return res.status(400).json({ message: 'Cannot delete a project with investments' });
    }

    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = deleteProject;