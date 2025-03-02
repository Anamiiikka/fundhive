const multer = require('multer');

// Configure multer to use memory storage (files are kept in memory before S3 upload)
const storage = multer.memoryStorage();

// Set up multer with storage, limits, and file filter
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Define allowed file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'video/mp4',
    ];

    // Check if the uploaded file's MIME type is allowed
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and MP4 are allowed.'), false); // Reject the file
    }
  },
});

module.exports = { upload };