const { docClient } = require('../../../config/database');
const { ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const redis = require('../../../config/redis');

const SARKARI_JOBS_TABLE = process.env.SARKARI_JOBS_TABLE || 'SarkariJobs';
const CACHE_TTL = 300; // 5 minutes

// Get all sarkari jobs with filtering and pagination
const getSarkariJobs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 15, 
      organization 
    } = req.query;

    const cacheKey = `sarkari-jobs:${JSON.stringify(req.query)}`;
    
    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    let params = {
      TableName: SARKARI_JOBS_TABLE,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'active'
      }
    };

    // Add organization filter
    if (organization) {
      params.FilterExpression += ' AND organization = :organization';
      params.ExpressionAttributeValues[':organization'] = organization;
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Sort by jobId (newest first)
    const sortedJobs = result.Items.sort((a, b) => 
      b.jobId.localeCompare(a.jobId)
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

    const response = {
      jobs: paginatedJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sortedJobs.length / limit),
        totalJobs: sortedJobs.length,
        hasNext: endIndex < sortedJobs.length,
        hasPrev: startIndex > 0
      }
    };

    // Cache the response
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error('Error fetching sarkari jobs:', error);
    res.status(500).json({ error: 'Failed to fetch sarkari jobs' });
  }
};

// Get single sarkari job by ID
const getSarkariJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `sarkari-job:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Since we need to find by jobId (sort key), we'll scan with filter
    const params = {
      TableName: SARKARI_JOBS_TABLE,
      FilterExpression: 'jobId = :jobId',
      ExpressionAttributeValues: {
        ':jobId': id
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: 'Sarkari job not found' });
    }

    const job = result.Items[0];
    
    // Cache the job
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(job));

    res.json(job);
  } catch (error) {
    console.error('Error fetching sarkari job:', error);
    res.status(500).json({ error: 'Failed to fetch sarkari job' });
  }
};

// Get sarkari results (jobs with status: result-out)
const getSarkariResults = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    
    const cacheKey = `sarkari-results:${page}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const params = {
      TableName: SARKARI_JOBS_TABLE,
      IndexName: 'StatusIndex',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'result-out'
      },
      ScanIndexForward: false
    };

    const command = new QueryCommand(params);
    const result = await docClient.send(command);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = result.Items.slice(startIndex, endIndex);

    const response = {
      results: paginatedJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.Items.length / limit),
        totalResults: result.Items.length,
        hasNext: endIndex < result.Items.length,
        hasPrev: startIndex > 0
      }
    };

    // Cache the response
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error('Error fetching sarkari results:', error);
    res.status(500).json({ error: 'Failed to fetch sarkari results' });
  }
};

module.exports = {
  getSarkariJobs,
  getSarkariJobById,
  getSarkariResults
};