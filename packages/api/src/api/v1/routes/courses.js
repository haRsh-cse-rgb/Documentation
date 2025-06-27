const express = require('express');
const { query, validationResult } = require('express-validator');
const { 
  getCourses, 
  getCourseById
} = require('../controllers/coursesController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/v1/courses - Get all courses
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isString(),
  query('provider').optional().isString(),
  query('level').optional().isString(),
  query('type').optional().isString(),
  query('q').optional().isString(),
], handleValidationErrors, getCourses);

// GET /api/v1/courses/:id - Get single course
router.get('/:id', getCourseById);

module.exports = router;