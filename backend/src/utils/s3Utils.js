const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

console.log('AWS Config:', {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
  bucket: process.env.S3_BUCKET_NAME,
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = (file, filename) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${filename}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    // Remove ACL: 'public-read' since bucket doesn't allow ACLs
  };
  console.log('Uploading to S3 with params:', params);
  return s3.upload(params).promise();
};

module.exports = { uploadToS3 };