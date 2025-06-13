const { docClient } = require('../../../config/database');
const { ScanCommand, QueryCommand, GetItemCommand } = require('@aws-sdk/lib-dynamodb');
const redis = require('../../../config/redis');

const JOBS_TABLE = process.env.JOBS_TABLE || 'Jobs';
const CACHE_TTL = 300; // 5 minutes

// Get all jobs with filtering and pagination
const getJobs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 15, 
      category, 
      location, 
      batch, 
      tags, 
      q 
    } = req.query;

    const cacheKey = `jobs:${JSON.stringify(req.query)}`;
    
    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    let params = {
      TableName: JOBS_TABLE,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'active'
      }
    };

    // Add filters
    if (category) {
      params.FilterExpression += ' AND category = :category';
      params.ExpressionAttributeValues[':category'] = category;
    }

    if (location) {
      params.FilterExpression += ' AND #location = :location';
      params.ExpressionAttributeNames['#location'] = 'location';
      params.ExpressionAttributeValues[':location'] = location;
    }

    if (batch) {
      params.FilterExpression += ' AND contains(batch, :batch)';
      params.ExpressionAttributeValues[':batch'] = batch;
    }

    if (tags) {
      params.FilterExpression += ' AND contains(tags, :tags)';
      params.ExpressionAttributeValues[':tags'] = tags;
    }

    if (q) {
      params.FilterExpression += ' AND (contains(#role, :searchTerm) OR contains(companyName, :searchTerm))';
      params.ExpressionAttributeNames['#role'] = 'role';
      params.ExpressionAttributeValues[':searchTerm'] = q;
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Sort by postedOn (newest first)
    const sortedJobs = result.Items.sort((a, b) => 
      new Date(b.postedOn) - new Date(a.postedOn)
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
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `job:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Since we need to find by jobId (sort key), we'll scan with filter
    const params = {
      TableName: JOBS_TABLE,
      FilterExpression: 'jobId = :jobId',
      ExpressionAttributeValues: {
        ':jobId': id
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = result.Items[0];
    
    // Cache the job
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(job));

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

// Search jobs
const searchJobs = async (req, res) => {
  try {
    const { q, page = 1, limit = 15 } = req.query;
    
    const params = {
      TableName: JOBS_TABLE,
      FilterExpression: '#status = :status AND (contains(#role, :searchTerm) OR contains(companyName, :searchTerm) OR contains(jobDescription, :searchTerm))',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#role': 'role'
      },
      ExpressionAttributeValues: {
        ':status': 'active',
        ':searchTerm': q
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Sort by relevance and date
    const sortedJobs = result.Items.sort((a, b) => 
      new Date(b.postedOn) - new Date(a.postedOn)
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

    res.json({
      jobs: paginatedJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sortedJobs.length / limit),
        totalJobs: sortedJobs.length,
        hasNext: endIndex < sortedJobs.length,
        hasPrev: startIndex > 0
      },
      searchTerm: q
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ error: 'Failed to search jobs' });
  }
};

// Get jobs by category
const getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 15 } = req.query;

    const params = {
      TableName: JOBS_TABLE,
      KeyConditionExpression: 'category = :category',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':category': category,
        ':status': 'active'
      },
      ScanIndexForward: false // Sort by sort key descending
    };

    const command = new QueryCommand(params);
    const result = await docClient.send(command);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = result.Items.slice(startIndex, endIndex);

    res.json({
      jobs: paginatedJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.Items.length / limit),
        totalJobs: result.Items.length,
        hasNext: endIndex < result.Items.length,
        hasPrev: startIndex > 0
      },
      category
    });
  } catch (error) {
    console.error('Error fetching jobs by category:', error);
    res.status(500).json({ error: 'Failed to fetch jobs by category' });
  }
};

// Get jobs by location
const getJobsByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const { page = 1, limit = 15 } = req.query;

    const params = {
      TableName: JOBS_TABLE,
      IndexName: 'LocationIndex',
      KeyConditionExpression: '#location = :location',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#location': 'location',
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':location': location,
        ':status': 'active'
      },
      ScanIndexForward: false
    };

    const command = new QueryCommand(params);
    const result = await docClient.send(command);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = result.Items.slice(startIndex, endIndex);

    res.json({
      jobs: paginatedJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.Items.length / limit),
        totalJobs: result.Items.length,
        hasNext: endIndex < result.Items.length,
        hasPrev: startIndex > 0
      },
      location
    });
  } catch (error) {
    console.error('Error fetching jobs by location:', error);
    res.status(500).json({ error: 'Failed to fetch jobs by location' });
  }
};

// Get jobs by batch
const getJobsByBatch = async (req, res) => {
  try {
    const { batch } = req.params;
    const { page = 1, limit = 15 } = req.query;

    const params = {
      TableName: JOBS_TABLE,
      IndexName: 'BatchIndex',
      KeyConditionExpression: 'batch = :batch',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':batch': batch,
        ':status': 'active'
      },
      ScanIndexForward: false
    };

    const command = new QueryCommand(params);
    const result = await docClient.send(command);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = result.Items.slice(startIndex, endIndex);

    res.json({
      jobs: paginatedJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.Items.length / limit),
        totalJobs: result.Items.length,
        hasNext: endIndex < result.Items.length,
        hasPrev: startIndex > 0
      },
      batch
    });
  } catch (error) {
    console.error('Error fetching jobs by batch:', error);
    res.status(500).json({ error: 'Failed to fetch jobs by batch' });
  }
};

module.exports = {
  getJobs,
  getJobById,
  searchJobs,
  getJobsByCategory,
  getJobsByLocation,
  getJobsByBatch
};