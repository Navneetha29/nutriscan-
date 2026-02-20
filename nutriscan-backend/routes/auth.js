const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation');

// @desc    Register user (all three steps)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', 
  validateRegister,
  handleValidationErrors,
  authController.register
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, authController.getProfile);

// @desc    Test route
// @route   GET /api/auth/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working!'
  });
});

module.exports = router;