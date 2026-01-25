import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware, generateTokens } from '../middleware/auth.js';

const router = express.Router();

// Signup
router.post(
  '/signup',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('surName').trim().notEmpty().withMessage('Surname is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/(?=.*?[A-Z])/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/(?=.*?[a-z])/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/(?=.*?[0-9])/)
      .withMessage('Password must contain at least one digit')
      .matches(/(?=.*?[#?!@$%^&*-])/)
      .withMessage('Password must contain at least one special character'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, surName, email, password, dateOfBirth, gender } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      user = new User({
        firstName,
        surName,
        email,
        password,
        dateOfBirth,
        gender,
      });

      await user.save();

      // Generate tokens
      const { token, refreshToken } = generateTokens(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          _id: user._id,
          firstName: user.firstName,
          surName: user.surName,
          email: user.email,
        },
        token,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordMatch = await user.matchPassword(password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate tokens
      const { token, refreshToken } = generateTokens(user._id);

      res.json({
        message: 'Login successful',
        user: {
          _id: user._id,
          firstName: user.firstName,
          surName: user.surName,
          email: user.email,
        },
        token,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Refresh Token
router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { token, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.json({
      token,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('followers following');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        surName: user.surName,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', authMiddleware, (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
