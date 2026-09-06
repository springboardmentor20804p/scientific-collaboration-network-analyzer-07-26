import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User.model';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { success, failure } from '../utils/response';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { logger } from '../config/logger';

// POST /api/v1/auth/register
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(failure('Validation failed', errors.array().map(e => e.msg)));
    }

    const { name, email, password, role, institutionId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw new ConflictError('Email already registered');

    const user = await User.create({ name, email, password, role, institutionId });

    const accessToken  = signAccessToken(String(user._id), user.role, institutionId);
    const refreshToken = signRefreshToken(String(user._id));

    logger.info(`New user registered: ${email} [${role}]`);
    res.status(201).json(success('Registration successful', { user, accessToken, refreshToken }));
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(failure('Validation failed', errors.array().map(e => e.msg)));
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError('Invalid email or password');
    }
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken  = signAccessToken(String(user._id), user.role, String(user.institutionId));
    const refreshToken = signRefreshToken(String(user._id));

    logger.info(`Login: ${email} [${user.role}]`);
    res.json(success('Login successful', { user, accessToken, refreshToken }));
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/refresh
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken: token } = req.body;
    if (!token) throw new UnauthorizedError('Refresh token required');

    const { userId } = verifyRefreshToken(token);
    const user = await User.findById(userId);
    if (!user || !user.isActive) throw new UnauthorizedError('User not found or inactive');

    const accessToken = signAccessToken(String(user._id), user.role, String(user.institutionId));
    res.json(success('Token refreshed', { accessToken }));
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/logout  (client simply discards tokens; endpoint for future blocklist)
export async function logout(_req: Request, res: Response) {
  res.json(success('Logged out successfully'));
}

// GET /api/v1/auth/me
export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) throw new UnauthorizedError('User not found');
    res.json(success('Current user', { user }));
  } catch (err) {
    next(err);
  }
}
