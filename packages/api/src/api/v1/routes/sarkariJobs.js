const express = require('express');
const { query, validationResult } = require('express-validator');
const { 
  getSarkariJobs, 
  getSarkariJobById,
  getSarkariResults
} = require('../controllers/sarkariJobsController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/v1/sarkari-jobs - Get all sarkari jobs
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('organization').optional().isString(),
], handleValidationErrors, getSarkariJobs);

// GET /api/v1/sarkari-jobs/:id - Get single sarkari job
router.get('/:id', getSarkariJobById);

module.exports = router;