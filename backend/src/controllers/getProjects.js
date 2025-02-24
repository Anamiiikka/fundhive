const Project = require('../models/Project');
const { populateProjectUser } = require('../utils/projectUtils');

async function getProjects(req, res) {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(query);
    const populatedProjects = await Promise.all(projects.map(populateProjectUser));

    console.log('Populated projects sent to frontend:', populatedProjects);
    res.status(200).json(populatedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = getProjects;