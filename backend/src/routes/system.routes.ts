import { Router } from 'express';
import { getSystemConfigs, setSystemConfig, getSecuritySettings } from '../controllers/system.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { recordAuditLog } from '../middleware/audit.middleware';

const router = Router();

router.use(authenticate, authorize('System Admin'));

router.get('/config', getSystemConfigs);
router.post('/config', recordAuditLog('UPDATE_SYSTEM_CONFIG', 'SystemConfig'), setSystemConfig);
router.get('/security', getSecuritySettings);

export default router;
