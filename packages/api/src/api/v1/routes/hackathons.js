const express = require('express');
const { query, validationResult } = require('express-validator');
const { 
  getHackathons, 
  getHackathonById
} = require('../controllers/hackathonsController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/v1/hackathons - Get all hackathons
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isString(),
  query('status').optional().isString(),
  query('q').optional().isString(),
], handleValidationErrors, getHackathons);

// GET /api/v1/hackathons/:id - Get single hackathon
router.get('/:id', getHackathonById);

module.exports = router;