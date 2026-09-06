import { Router } from 'express';
import {
  listCollaborations, getCollaboration,
  createCollaboration, updateCollaboration, joinCollaboration,
} from '../controllers/collaboration.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createCollaborationValidator, updateCollaborationValidator } from '../validators/resource.validator';

const router = Router();

router.get('/',     listCollaborations);                                   // public
router.get('/:id',  getCollaboration);                                     // public
router.use(authenticate);
router.post('/',    authorize('Researcher', 'Institution Admin', 'System Admin'), createCollaborationValidator, createCollaboration);
router.patch('/:id', updateCollaborationValidator, updateCollaboration);
router.post('/:id/join', authorize('Researcher'), joinCollaboration);

export default router;
