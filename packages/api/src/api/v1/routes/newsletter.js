const express = require('express');
const { body, validationResult } = require('express-validator');
const { subscribe } = require('../controllers/newsletterController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/v1/subscribe - Subscribe to newsletter
router.post('/subscribe', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('categories').isArray({ min: 1 }).withMessage('At least one category is required'),
], handleValidationErrors, subscribe);

module.exports = router;