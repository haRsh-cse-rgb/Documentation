const { docClient } = require('../../../config/database');
const { ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const redis = require('../../../config/redis');

const CERTIFICATIONS_TABLE = process.env.CERTIFICATIONS_TABLE || 'Certifications';
const CACHE_TTL = 300; // 5 minutes

// Get all certifications with filtering and pagination
const getCertifications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 15, 
      category,
      provider,
      level,
      q 
    } = req.query;

    const cacheKey = `certifications:${JSON.stringify(req.query)}`;
    
    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    let params = {
      TableName: CERTIFICATIONS_TABLE,
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

    if (provider) {
      params.FilterExpression += ' AND provider = :provider';
      params.ExpressionAttributeValues[':provider'] = provider;
    }

    if (level) {
      params.FilterExpression += ' AND #level = :level';
      params.ExpressionAttributeNames['#level'] = 'level';
      params.ExpressionAttributeValues[':level'] = level;
    }

    // Add search filter
    if (q) {
      params.FilterExpression += ' AND (contains(title, :searchTerm) OR contains(description, :searchTerm) OR contains(provider, :searchTerm))';
      params.ExpressionAttributeValues[':searchTerm'] = q;
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Sort by popularity/rating
    const sortedCertifications = result.Items.sort((a, b) => 
      (b.rating || 0) - (a.rating || 0)
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCertifications = sortedCertifications.slice(startIndex, endIndex);

    const response = {
      certifications: paginatedCertifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sortedCertifications.length / limit),
        totalCertifications: sortedCertifications.length,
        hasNext: endIndex < sortedCertifications.length,
        hasPrev: startIndex > 0
      }
    };

    // Cache the response
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
};

// Get single certification by ID
const getCertificationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `certification:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const params = {
      TableName: CERTIFICATIONS_TABLE,
      FilterExpression: 'certificationId = :certificationId',
      ExpressionAttributeValues: {
        ':certificationId': id
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    const certification = result.Items[0];
    
    // Cache the certification
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(certification));

    res.json(certification);
  } catch (error) {
    console.error('Error fetching certification:', error);
    res.status(500).json({ error: 'Failed to fetch certification' });
  }
};

module.exports = {
  getCertifications,
  getCertificationById
};