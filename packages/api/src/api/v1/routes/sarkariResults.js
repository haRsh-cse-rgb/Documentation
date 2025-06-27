const express = require('express');
const { query, validationResult } = require('express-validator');
const { 
  getSarkariResults, 
  getSarkariResultById
} = require('../controllers/sarkariResultsController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/v1/sarkari-results - Get all sarkari results
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('organization').optional().isString(),
  query('q').optional().isString(),
], handleValidationErrors, getSarkariResults);

// GET /api/v1/sarkari-results/:id - Get single sarkari result
router.get('/:id', getSarkariResultById);

module.exports = router;