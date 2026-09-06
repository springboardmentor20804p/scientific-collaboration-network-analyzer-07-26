import { Router } from 'express';
import { register, login, refreshToken, logout, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter';
import { registerValidator, loginValidator, refreshTokenValidator } from '../validators/auth.validator';

const router = Router();

router.post('/register', authRateLimiter, registerValidator, register);
router.post('/login',    authRateLimiter, loginValidator,    login);
router.post('/refresh',  authRateLimiter, refreshTokenValidator, refreshToken);
router.post('/logout',   authenticate,   logout);
router.get('/me',        authenticate,   getMe);

export default router;
