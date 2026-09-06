import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { listUsers } from '../controllers/user.controller';
import { getDashboardStats } from '../controllers/dashboard.controller';

const router = Router();

router.use(authenticate, authorize('System Admin', 'Institution Admin'));

router.get('/stats', getDashboardStats);
router.get('/users', listUsers);

export default router;
