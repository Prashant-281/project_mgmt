import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser } from '../controllers/auth.controller';
import validateRequest from '../utils/validateRequest';

const authRouter = express.Router();

// @route   POST /api/v1/auth/register
authRouter.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  registerUser
);

// @route   POST /api/v1/auth/login
authRouter.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  loginUser
);


export default authRouter;
