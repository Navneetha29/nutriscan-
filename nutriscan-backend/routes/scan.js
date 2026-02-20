const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Analyze food product
router.post('/analyze', scanController.analyzeFood);

// Get user's scan history
router.get('/history', scanController.getScanHistory);

// Get specific scan details
router.get('/:scanId', scanController.getScanDetails);

// Delete scan
router.delete('/:scanId', scanController.deleteScan);

module.exports = router;