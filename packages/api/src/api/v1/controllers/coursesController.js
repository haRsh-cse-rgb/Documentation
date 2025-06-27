const { docClient } = require('../../../config/database');
const { ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const redis = require('../../../config/redis');

const COURSES_TABLE = process.env.COURSES_TABLE || 'Courses';
const CACHE_TTL = 300; // 5 minutes

// Get all courses with filtering and pagination
const getCourses = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 15, 
      category,
      provider,
      level,
      type,
      q 
    } = req.query;

    const cacheKey = `courses:${JSON.stringify(req.query)}`;
    
    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    let params = {
      TableName: COURSES_TABLE,
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

    if (type) {
      params.FilterExpression += ' AND courseType = :type';
      params.ExpressionAttributeValues[':type'] = type;
    }

    // Add search filter
    if (q) {
      params.FilterExpression += ' AND (contains(title, :searchTerm) OR contains(description, :searchTerm) OR contains(provider, :searchTerm))';
      params.ExpressionAttributeValues[':searchTerm'] = q;
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Sort by rating and enrollment count
    const sortedCourses = result.Items.sort((a, b) => {
      const scoreA = (a.rating || 0) * 0.7 + (a.enrollmentCount || 0) * 0.3;
      const scoreB = (b.rating || 0) * 0.7 + (b.enrollmentCount || 0) * 0.3;
      return scoreB - scoreA;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCourses = sortedCourses.slice(startIndex, endIndex);

    const response = {
      courses: paginatedCourses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sortedCourses.length / limit),
        totalCourses: sortedCourses.length,
        hasNext: endIndex < sortedCourses.length,
        hasPrev: startIndex > 0
      }
    };

    // Cache the response
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get single course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `course:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const params = {
      TableName: COURSES_TABLE,
      FilterExpression: 'courseId = :courseId',
      ExpressionAttributeValues: {
        ':courseId': id
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = result.Items[0];
    
    // Cache the course
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(course));

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

module.exports = {
  getCourses,
  getCourseById
};