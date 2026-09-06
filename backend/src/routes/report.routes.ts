import { Router } from 'express';
import { exportCSV } from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { recordAuditLog } from '../middleware/audit.middleware';

const router = Router();

router.use(authenticate);
router.get('/export/csv', authorize('System Admin', 'Institution Admin'), recordAuditLog('EXPORT_CSV_REPORT', 'Report'), exportCSV);

export default router;
