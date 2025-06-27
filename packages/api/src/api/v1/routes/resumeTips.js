const express = require('express');
const { query, validationResult } = require('express-validator');
const { 
  getResumeTips, 
  getResumeTipById,
  getResumeTemplates
} = require('../controllers/resumeTipsController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/v1/resume-tips - Get all resume tips
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isString(),
  query('level').optional().isString(),
  query('q').optional().isString(),
], handleValidationErrors, getResumeTips);

// GET /api/v1/resume-tips/templates - Get resume templates
router.get('/templates', getResumeTemplates);

// GET /api/v1/resume-tips/:id - Get single resume tip
router.get('/:id', getResumeTipById);

module.exports = router;