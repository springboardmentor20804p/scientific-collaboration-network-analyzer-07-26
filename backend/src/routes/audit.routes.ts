import { Router } from 'express';
import { listAuditLogs } from '../controllers/audit.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, authorize('System Admin'));

router.get('/', listAuditLogs);

export default router;
