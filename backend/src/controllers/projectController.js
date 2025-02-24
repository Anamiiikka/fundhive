const Project = require('../models/Project');
const User = require('../models/User');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const createProject = [
  upload.single('media'), // Handle single file upload with field name 'media'
  async (req, res) => {
    try {
      // Log incoming data for debugging
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);

      const { title, description, category, fundingGoal, equityOffered, duration } = req.body;
      const userId = req.headers['x-user-id'];

      if (!userId) {
        return res.status(401).json({ message: 'User ID required' });
      }

      // Validate required fields
      if (!title || !description || !category || !fundingGoal || !equityOffered || !duration) {
        return res.status(400).json({
          message: 'All fields are required',
          missing: { title, description, category, fundingGoal, equityOffered, duration },
        });
      }

      // Check if user exists, create if not
      let user = await User.findOne({ auth0Id: userId });
      if (!user) {
        user = new User({ auth0Id: userId });
        await user.save();
      }

      const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const project = new Project({
        userId,
        title,
        description,
        category,
        fundingGoal: Number(fundingGoal),
        equityOffered: Number(equityOffered),
        duration: Number(duration),
        mediaUrl,
      });

      await project.save();
      res.status(201).json({ message: 'Project created', project });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
];

const getProjects = async (req, res) => {
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
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProject, getProjects, getProjectById };