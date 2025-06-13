const { docClient } = require('../../../config/database');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { callGeminiAPI } = require('../../../services/gemini');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const JOBS_TABLE = process.env.JOBS_TABLE || 'Jobs';
const CV_BUCKET = process.env.CV_BUCKET_NAME || 'jobquest-cvs';

// Analyze CV against job description
const analyzeCv = async (req, res) => {
  try {
    const { jobId, cvS3Key } = req.body;

    // 1. Fetch job details from DynamoDB
    const jobParams = {
      TableName: JOBS_TABLE,
      FilterExpression: 'jobId = :jobId',
      ExpressionAttributeValues: {
        ':jobId': jobId
      }
    };

    const jobCommand = new ScanCommand(jobParams);
    const jobResult = await docClient.send(jobCommand);

    if (!jobResult.Items || jobResult.Items.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = jobResult.Items[0];

    // 2. Fetch CV from S3
    const cvParams = {
      Bucket: CV_BUCKET,
      Key: cvS3Key
    };

    const cvCommand = new GetObjectCommand(cvParams);
    const cvResult = await s3Client.send(cvCommand);
    
    // Convert stream to string (assuming PDF text extraction would happen here)
    // For demo purposes, we'll simulate CV text
    const cvText = "Sample CV text content would be extracted here from PDF";

    // 3. Call Gemini API for analysis
    const analysisPrompt = `
      Analyze the following CV against the job description and provide a structured response:

      JOB DESCRIPTION:
      Role: ${job.role}
      Company: ${job.companyName}
      Location: ${job.location}
      Description: ${job.jobDescription}
      Required Skills: ${job.tags ? job.tags.join(', ') : 'Not specified'}

      CV CONTENT:
      ${cvText}

      Please provide analysis in the following JSON format:
      {
        "compatibilityScore": <number between 0-100>,
        "strengths": ["strength1", "strength2", "strength3"],
        "weaknesses": ["weakness1", "weakness2", "weakness3"],
        "improvements": ["improvement1", "improvement2", "improvement3"],
        "matchingSkills": ["skill1", "skill2"],
        "missingSkills": ["skill1", "skill2"],
        "summary": "Brief summary of the analysis"
      }
    `;

    const analysis = await callGeminiAPI(analysisPrompt);

    // 4. Get suggested jobs based on CV analysis
    const suggestedJobs = await getSuggestedJobs(analysis.matchingSkills || []);

    res.json({
      analysis,
      suggestedJobs,
      jobDetails: {
        id: job.jobId,
        role: job.role,
        company: job.companyName
      }
    });

  } catch (error) {
    console.error('Error analyzing CV:', error);
    res.status(500).json({ 
      error: 'Failed to analyze CV',
      message: error.message 
    });
  }
};

// Get suggested jobs based on skills
const getSuggestedJobs = async (skills) => {
  try {
    if (!skills || skills.length === 0) {
      return [];
    }

    const params = {
      TableName: JOBS_TABLE,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'active'
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Filter jobs that match any of the skills
    const matchingJobs = result.Items.filter(job => {
      if (!job.tags) return false;
      return skills.some(skill => 
        job.tags.some(tag => 
          tag.toLowerCase().includes(skill.toLowerCase())
        )
      );
    });

    // Return top 5 matching jobs
    return matchingJobs
      .sort((a, b) => new Date(b.postedOn) - new Date(a.postedOn))
      .slice(0, 5)
      .map(job => ({
        id: job.jobId,
        role: job.role,
        company: job.companyName,
        location: job.location,
        tags: job.tags
      }));

  } catch (error) {
    console.error('Error getting suggested jobs:', error);
    return [];
  }
};

module.exports = {
  analyzeCv
};