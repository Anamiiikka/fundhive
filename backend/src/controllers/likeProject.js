const Project = require('../models/Project');

async function likeProject(req, res) {
  try {
    const { userId } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const alreadyLiked = project.likes.includes(userId);
    if (alreadyLiked) {
      project.likes = project.likes.filter((id) => id !== userId);
    } else {
      project.likes.push(userId);
    }

    await project.save();
    res.status(200).json({ message: alreadyLiked ? 'Unliked' : 'Liked', project });
  } catch (error) {
    console.error('Error liking project:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = likeProject;