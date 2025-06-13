const express = require('express');
const { getPreSignedUrl } = require('../controllers/s3Controller');

const router = express.Router();

// GET /api/v1/s3/pre-signed-url - Get pre-signed URL for CV upload
router.get('/pre-signed-url', getPreSignedUrl);

module.exports = router;