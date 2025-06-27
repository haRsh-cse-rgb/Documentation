const { docClient } = require('../../../config/database');
const { ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const redis = require('../../../config/redis');

const SARKARI_JOBS_TABLE = process.env.SARKARI_JOBS_TABLE || 'SarkariJobs';
const CACHE_TTL = 300; // 5 minutes

// Get all sarkari results (jobs with status: result-out)
const getSarkariResults = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 15, 
      organization,
      q 
    } = req.query;

    const cacheKey = `sarkari-results:${JSON.stringify(req.query)}`;
    
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
        ':status': 'result-out'
      }
    };

    // Add organization filter
    if (organization) {
      params.FilterExpression += ' AND organization = :organization';
      params.ExpressionAttributeValues[':organization'] = organization;
    }

    // Add search filter
    if (q) {
      params.FilterExpression += ' AND (contains(postName, :searchTerm) OR contains(organization, :searchTerm))';
      params.ExpressionAttributeValues[':searchTerm'] = q;
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Sort by jobId (newest first)
    const sortedResults = result.Items.sort((a, b) => 
      b.jobId.localeCompare(a.jobId)
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedResults = sortedResults.slice(startIndex, endIndex);

    const response = {
      results: paginatedResults,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sortedResults.length / limit),
        totalResults: sortedResults.length,
        hasNext: endIndex < sortedResults.length,
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

// Get single sarkari result by ID
const getSarkariResultById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `sarkari-result:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const params = {
      TableName: SARKARI_JOBS_TABLE,
      FilterExpression: 'jobId = :jobId AND #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':jobId': id,
        ':status': 'result-out'
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: 'Sarkari result not found' });
    }

    const resultItem = result.Items[0];
    
    // Cache the result
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(resultItem));

    res.json(resultItem);
  } catch (error) {
    console.error('Error fetching sarkari result:', error);
    res.status(500).json({ error: 'Failed to fetch sarkari result' });
  }
};

module.exports = {
  getSarkariResults,
  getSarkariResultById
};