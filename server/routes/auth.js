import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { authMiddleware, generateTokens, hashToken } from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';
import { authLimiter, strictLoginLimiter } from '../middleware/rateLimiter.js';

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

      // Create new user (unverified)
      user = new User({
        firstName,
        surName,
        email,
        password,
        dateOfBirth,
        gender,
      });

      // create verification token and send email
      const verificationToken = user.createVerificationToken();
      await user.save();

      try {
        const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;
        await sendEmail({
          to: email,
          subject: 'Verify your account',
          html: `<p>Please verify your account by clicking <a href="${verifyUrl}">here</a>.</p>`,
        });
      } catch (e) {
        console.error('Email send failed', e.message);
      }

      // Do not auto-login; require email verification
      res.status(201).json({
        message: 'User registered successfully. Check email to verify your account.',
        user: {
          _id: user._id,
          firstName: user.firstName,
          surName: user.surName,
          email: user.email,
        },
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
  authLimiter,
  strictLoginLimiter,
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

      // Check account lock
      if (user.isLocked) {
        return res.status(423).json({ message: 'Account locked. Try again later.' });
      }

      // check verified
      if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email before logging in.' });
      }

      // Check password
      const isPasswordMatch = await user.matchPassword(password);
      if (!isPasswordMatch) {
        await user.incrementFailedLogin();
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // successful login -> reset failed login state
      await user.resetFailedLogin();

      // Generate tokens
      const { token, refreshToken } = await generateTokens(user._id);

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
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== 'refresh' || !decoded.tokenId) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const existingToken = await RefreshToken.findOne({
      user: decoded.userId,
      tokenId: decoded.tokenId,
      tokenHash: hashToken(refreshToken),
    });

    if (!existingToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    if (existingToken.revokedAt) {
      await RefreshToken.updateMany(
        { user: decoded.userId, revokedAt: null },
        {
          $set: {
            revokedAt: new Date(),
            revokedReason: 'reuse_detected',
          },
        }
      );

      return res.status(401).json({ message: 'Refresh token has been revoked' });
    }

    if (existingToken.expiresAt <= new Date()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    const {
      token,
      refreshToken: newRefreshToken,
      tokenId: newTokenId,
    } = await generateTokens(decoded.userId);

    existingToken.revokedAt = new Date();
    existingToken.revokedReason = 'rotated';
    existingToken.replacedByTokenId = newTokenId;
    await existingToken.save();

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
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
        ignoreExpiration: true,
      });

      if (decoded.type === 'refresh' && decoded.tokenId) {
        await RefreshToken.findOneAndUpdate(
          {
            user: decoded.userId,
            tokenId: decoded.tokenId,
            tokenHash: hashToken(refreshToken),
            revokedAt: null,
          },
          {
            $set: {
              revokedAt: new Date(),
              revokedReason: 'logout',
            },
          }
        );
      }
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify email
router.get('/verify', async (req, res) => {
  try {
    const { token, email } = req.query;
    if (!token || !email) return res.status(400).json({ message: 'Invalid verification link' });

    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = await User.findOne({ email, verificationTokenHash: tokenHash });
    if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' });

    if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
      return res.status(400).json({ message: 'Verification token expired' });
    }

    user.isVerified = true;
    user.verificationTokenHash = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If that email exists, a reset link was sent' });

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    try {
      await sendEmail({
        to: email,
        subject: 'Password reset',
        html: `<p>Reset your password by clicking <a href="${resetUrl}">here</a>. The link expires in 1 hour.</p>`,
      });
    } catch (e) {
      console.error('Failed to send reset email', e.message);
    }

    res.json({ message: 'If that email exists, a reset link was sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', authLimiter, async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword) return res.status(400).json({ message: 'Invalid request' });

    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = await User.findOne({ email, resetPasswordTokenHash: tokenHash }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'Reset token expired' });
    }

    user.password = newPassword;
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // optional: revoke all refresh tokens for this user
    await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { $set: { revokedAt: new Date(), revokedReason: 'password_reset' } });

    res.json({ message: 'Password has been reset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
