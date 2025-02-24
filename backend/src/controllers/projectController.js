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

// Create a new project
const createProject = [
  upload.single('media'),
  async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);

      const { title, description, category, fundingGoal, equityOffered, duration, name } = req.body;
      const userId = req.headers['x-user-id'];

      if (!userId) return res.status(401).json({ message: 'User ID required' });
      if (!title || !description || !category || !fundingGoal || !equityOffered || !duration || !name) {
        return res.status(400).json({ message: 'All fields, including name, are required' });
      }

      let user = await User.findOne({ auth0Id: userId });
      if (!user) {
        // Generate a unique username based on name
        const baseUsername = name.replace(/\s+/g, '').toLowerCase();
        let username = baseUsername;
        let counter = 1;
        while (await User.findOne({ username })) {
          username = `${baseUsername}${counter++}`; // Append number if duplicate
        }

        user = new User({
          auth0Id: userId,
          name,
          username,
        });
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
        startDate: new Date(),
      });

      await project.save();
      res.status(201).json({ message: 'Project created', project });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
];

// Get all projects with optional filtering
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

    const projects = await Project.find(query).populate('userId', 'username'); // Populate username
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('userId', 'username');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like or unlike a project
const likeProject = async (req, res) => {
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
};

// Add a comment to a project
const addComment = async (req, res) => {
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
};

// Invest in a project
const investInProject = async (req, res) => {
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
};

// Crowdfund a project
const crowdfundProject = async (req, res) => {
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
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  likeProject,
  addComment,
  investInProject,
  crowdfundProject,
};