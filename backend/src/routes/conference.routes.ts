import { Router } from 'express';
import { listConferences, getConference, createConference } from '../controllers/conference.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { recordAuditLog } from '../middleware/audit.middleware';

const router = Router();

router.get('/', listConferences);
router.get('/:id', getConference);

router.use(authenticate);
router.post('/', authorize('System Admin', 'Institution Admin'), recordAuditLog('CREATE_CONFERENCE', 'Conference'), createConference);

export default router;
