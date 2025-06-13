const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const CV_BUCKET = process.env.CV_BUCKET_NAME || 'jobquest-cvs';

// Get pre-signed URL for CV upload
const getPreSignedUrl = async (req, res) => {
  try {
    const fileKey = `cvs/${uuidv4()}.pdf`;
    
    const command = new PutObjectCommand({
      Bucket: CV_BUCKET,
      Key: fileKey,
      ContentType: 'application/pdf',
      Metadata: {
        uploadedAt: new Date().toISOString()
      }
    });

    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600 // 1 hour
    });

    res.json({
      uploadUrl: signedUrl,
      fileKey,
      expiresIn: 3600
    });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
};

module.exports = {
  getPreSignedUrl
};