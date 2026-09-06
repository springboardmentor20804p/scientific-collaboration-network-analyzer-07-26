import { Router } from 'express';
import { addCitation, getPublicationCitations } from '../controllers/citation.controller';
import { authenticate } from '../middleware/auth.middleware';
import { recordAuditLog } from '../middleware/audit.middleware';

const router = Router();

router.get('/publication/:id', getPublicationCitations);

router.use(authenticate);
router.post('/', recordAuditLog('ADD_CITATION', 'Citation'), addCitation);

export default router;
