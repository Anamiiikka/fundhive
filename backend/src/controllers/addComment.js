const Project = require('../models/Project');

async function addComment(req, res) {
  try {
    const { userId, content } = req.body;
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.comments.push({ userId, content });
    await project.save();
    res.status(201).json({ message: 'Comment added', project });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = addComment;