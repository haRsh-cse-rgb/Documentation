const express = require('express');
const { body, validationResult } = require('express-validator');
const { analyzeCv } = require('../controllers/aiController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/v1/ai/analyze-cv - Analyze CV against job
router.post('/analyze-cv', [
  body('jobId').notEmpty().withMessage('Job ID is required'),
  body('cvS3Key').notEmpty().withMessage('CV S3 key is required'),
], handleValidationErrors, analyzeCv);

module.exports = router;