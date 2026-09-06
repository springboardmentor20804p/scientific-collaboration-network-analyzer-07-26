import { Router } from 'express';
import {
  listPublications, getPublication,
  createPublication, submitPublication, getPublicationReviews,
} from '../controllers/publication.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createPublicationValidator } from '../validators/resource.validator';

const router = Router();

router.get('/',          listPublications);    // public
router.get('/:id',       getPublication);      // public
router.use(authenticate);
router.post('/',         authorize('Researcher', 'System Admin'), createPublicationValidator, createPublication);
router.patch('/:id/submit', authorize('Researcher', 'System Admin'), submitPublication);
router.get('/:id/reviews',  authorize('Reviewer', 'Institution Admin', 'System Admin'), getPublicationReviews);

export default router;
