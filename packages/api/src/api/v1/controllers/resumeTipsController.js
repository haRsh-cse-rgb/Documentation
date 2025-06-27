const { docClient } = require('../../../config/database');
const { ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const redis = require('../../../config/redis');

const RESUME_TIPS_TABLE = process.env.RESUME_TIPS_TABLE || 'ResumeTips';
const CACHE_TTL = 300; // 5 minutes

// Get all resume tips with filtering and pagination
const getResumeTips = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 15, 
      category,
      level,
      q 
    } = req.query;

    const cacheKey = `resume-tips:${JSON.stringify(req.query)}`;
    
    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    let params = {
      TableName: RESUME_TIPS_TABLE,
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

    if (level) {
      params.FilterExpression += ' AND #level = :level';
      params.ExpressionAttributeNames['#level'] = 'level';
      params.ExpressionAttributeValues[':level'] = level;
    }

    // Add search filter
    if (q) {
      params.FilterExpression += ' AND (contains(title, :searchTerm) OR contains(content, :searchTerm) OR contains(tags, :searchTerm))';
      params.ExpressionAttributeValues[':searchTerm'] = q;
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Sort by priority and creation date
    const sortedTips = result.Items.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTips = sortedTips.slice(startIndex, endIndex);

    const response = {
      tips: paginatedTips,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sortedTips.length / limit),
        totalTips: sortedTips.length,
        hasNext: endIndex < sortedTips.length,
        hasPrev: startIndex > 0
      }
    };

    // Cache the response
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error('Error fetching resume tips:', error);
    res.status(500).json({ error: 'Failed to fetch resume tips' });
  }
};

// Get single resume tip by ID
const getResumeTipById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `resume-tip:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const params = {
      TableName: RESUME_TIPS_TABLE,
      FilterExpression: 'tipId = :tipId',
      ExpressionAttributeValues: {
        ':tipId': id
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: 'Resume tip not found' });
    }

    const tip = result.Items[0];
    
    // Cache the tip
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(tip));

    res.json(tip);
  } catch (error) {
    console.error('Error fetching resume tip:', error);
    res.status(500).json({ error: 'Failed to fetch resume tip' });
  }
};

// Get resume templates
const getResumeTemplates = async (req, res) => {
  try {
    const cacheKey = 'resume-templates';
    
    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const params = {
      TableName: RESUME_TIPS_TABLE,
      FilterExpression: 'category = :category AND #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':category': 'template',
        ':status': 'active'
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    const templates = result.Items.sort((a, b) => 
      (b.priority || 0) - (a.priority || 0)
    );

    // Cache the templates
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify({ templates }));

    res.json({ templates });
  } catch (error) {
    console.error('Error fetching resume templates:', error);
    res.status(500).json({ error: 'Failed to fetch resume templates' });
  }
};

module.exports = {
  getResumeTips,
  getResumeTipById,
  getResumeTemplates
};