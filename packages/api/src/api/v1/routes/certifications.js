const express = require('express');
const { query, validationResult } = require('express-validator');
const { 
  getCertifications, 
  getCertificationById
} = require('../controllers/certificationsController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/v1/certifications - Get all certifications
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isString(),
  query('provider').optional().isString(),
  query('level').optional().isString(),
  query('q').optional().isString(),
], handleValidationErrors, getCertifications);

// GET /api/v1/certifications/:id - Get single certification
router.get('/:id', getCertificationById);

module.exports = router;