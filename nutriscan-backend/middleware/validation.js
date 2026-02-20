const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Register validation rules
exports.validateRegister = [
  body('full_name')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  body('email')
    .if(body('phone').isEmpty())
    .notEmpty()
    .withMessage('Email or phone is required')
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('phone')
    .if(body('email').isEmpty())
    .notEmpty()
    .withMessage('Email or phone is required')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone must be between 10-15 characters'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),

  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other')
];

// Login validation rules
exports.validateLogin = [
  body('email')
    .if(body('phone').isEmpty())
    .notEmpty()
    .withMessage('Email or phone is required'),

  body('phone')
    .if(body('email').isEmpty())
    .notEmpty()
    .withMessage('Email or phone is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];