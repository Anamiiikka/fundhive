const User = require('../models/User');
const { upload } = require('../config/multerConfig');
const { uploadToS3 } = require('../utils/s3Utils');

const uploadAadhaar = [
  upload.single('aadhaar'),
  async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) return res.status(401).json({ message: 'User ID required' });

      let user = await User.findOne({ auth0Id: userId });
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (!req.file) return res.status(400).json({ message: 'Aadhaar card file required' });

      const filename = `${userId}-aadhaar-${Date.now()}.pdf`; // Assuming PDF format
      const s3Response = await uploadToS3(req.file, filename);
      const aadhaarCardUrl = s3Response.Location;

      user.aadhaarCardUrl = aadhaarCardUrl;
      await user.save();

      res.status(200).json({ message: 'Aadhaar card uploaded successfully', aadhaarCardUrl });
    } catch (error) {
      console.error('Error uploading Aadhaar card:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
];

module.exports = uploadAadhaar;