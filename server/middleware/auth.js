import jwt from 'jsonwebtoken';
import { createHash, randomUUID } from 'crypto';
import RefreshToken from '../models/RefreshToken.js';

const REFRESH_TOKEN_TYPE = 'refresh';

export const hashToken = (token) => {
  return createHash('sha256').update(token).digest('hex');
};

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const generateTokens = async (userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  const tokenId = randomUUID();
  const refreshToken = jwt.sign(
    { userId, tokenId, type: REFRESH_TOKEN_TYPE },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );

  const decodedRefreshToken = jwt.decode(refreshToken);
  await RefreshToken.create({
    user: userId,
    tokenId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(decodedRefreshToken.exp * 1000),
  });

  return { token, refreshToken, tokenId };
};
