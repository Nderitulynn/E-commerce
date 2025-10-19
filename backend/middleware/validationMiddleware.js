import { body, validationResult } from 'express-validator';

// Helper to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Validate registration data
export const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  checkValidation
];

// Validate login data
export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  checkValidation
];

// Validate product data
export const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be at least 0'),
  checkValidation
];

// Validate order data
export const validateOrder = [
  body('user_id').notEmpty().withMessage('User ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  checkValidation
];
