const Project = require('../models/Project');
const User = require('../models/User');
const { upload } = require('../config/multerConfig');
const { ensureUser } = require('../utils/userUtils');
const { uploadToS3 } = require('../utils/s3Utils');

const createProject = [
  upload.single('media'),
  async (req, res) => {
    try {
      const { title, description, category, fundingGoal, equityOffered, duration, name, email } = req.body;
      const userId = req.headers['x-user-id'];
      const userPicture = req.headers['x-user-picture'];
      console.log('Creating project with userId:', userId);

      if (!userId) return res.status(401).json({ message: 'User ID required' });
      if (!title || !description || !category || !fundingGoal || !equityOffered || !duration) {
        return res.status(400).json({ message: 'All project fields are required' });
      }

      // Check if user has uploaded Aadhaar card
      const user = await User.findOne({ auth0Id: userId });
      if (!user || !user.aadhaarCardUrl) {
        return res.status(403).json({ message: 'Please upload your Aadhaar card in your profile before creating a project.' });
      }

      await ensureUser(userId, name, email, userPicture);

      let mediaUrl = null;
      if (req.file) {
        const filename = `${Date.now()}-${req.file.originalname}`;
        const s3Response = await uploadToS3(req.file, filename);
        mediaUrl = s3Response.Location;
      }

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
      console.error('Error creating project:', error.stack);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
];

module.exports = createProject;