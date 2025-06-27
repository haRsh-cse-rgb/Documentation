const { docClient } = require('../../../config/database');
const { ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const redis = require('../../../config/redis');

const HACKATHONS_TABLE = process.env.HACKATHONS_TABLE || 'Hackathons';
const CACHE_TTL = 300; // 5 minutes

// Get all hackathons with filtering and pagination
const getHackathons = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 15, 
      category,
      status,
      q 
    } = req.query;

    const cacheKey = `hackathons:${JSON.stringify(req.query)}`;
    
    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    let params = {
      TableName: HACKATHONS_TABLE,
      FilterExpression: '#status = :activeStatus',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':activeStatus': status || 'active'
      }
    };

    // Add category filter
    if (category) {
      params.FilterExpression += ' AND category = :category';
      params.ExpressionAttributeValues[':category'] = category;
    }

    // Add search filter
    if (q) {
      params.FilterExpression += ' AND (contains(title, :searchTerm) OR contains(description, :searchTerm) OR contains(organizer, :searchTerm))';
      params.ExpressionAttributeValues[':searchTerm'] = q;
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Sort by registration deadline (nearest first)
    const sortedHackathons = result.Items.sort((a, b) => 
      new Date(a.registrationDeadline) - new Date(b.registrationDeadline)
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedHackathons = sortedHackathons.slice(startIndex, endIndex);

    const response = {
      hackathons: paginatedHackathons,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sortedHackathons.length / limit),
        totalHackathons: sortedHackathons.length,
        hasNext: endIndex < sortedHackathons.length,
        hasPrev: startIndex > 0
      }
    };

    // Cache the response
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).json({ error: 'Failed to fetch hackathons' });
  }
};

// Get single hackathon by ID
const getHackathonById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `hackathon:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const params = {
      TableName: HACKATHONS_TABLE,
      FilterExpression: 'hackathonId = :hackathonId',
      ExpressionAttributeValues: {
        ':hackathonId': id
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    const hackathon = result.Items[0];
    
    // Cache the hackathon
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(hackathon));

    res.json(hackathon);
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    res.status(500).json({ error: 'Failed to fetch hackathon' });
  }
};

module.exports = {
  getHackathons,
  getHackathonById
};