const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { 
  getJobs, 
  getJobById, 
  searchJobs,
  getJobsByCategory,
  getJobsByLocation,
  getJobsByBatch
} = require('../controllers/jobsController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/v1/jobs - Get all jobs with filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isString(),
  query('location').optional().isString(),
  query('batch').optional().isString(),
  query('tags').optional().isString(),
  query('q').optional().isString(),
], handleValidationErrors, getJobs);

// GET /api/v1/jobs/search - Search jobs
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
], handleValidationErrors, searchJobs);

// GET /api/v1/jobs/category/:category - Get jobs by category
router.get('/category/:category', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
], handleValidationErrors, getJobsByCategory);

// GET /api/v1/jobs/location/:location - Get jobs by location
router.get('/location/:location', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
], handleValidationErrors, getJobsByLocation);

// GET /api/v1/jobs/batch/:batch - Get jobs by batch
router.get('/batch/:batch', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
], handleValidationErrors, getJobsByBatch);

// GET /api/v1/jobs/:id - Get single job
router.get('/:id', getJobById);

module.exports = router;