import { Router } from 'express';
import { getDashboardStats, getRecentActivity, getDashboardMetrics } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);
router.get('/metrics', getDashboardMetrics);

export default router;
