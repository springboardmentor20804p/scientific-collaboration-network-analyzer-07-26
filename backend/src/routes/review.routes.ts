import { Router } from 'express';
import { assignReview, submitReview, getMyReviews, getReview } from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { submitReviewValidator } from '../validators/resource.validator';

const router = Router();

router.use(authenticate);

router.get('/mine',     authorize('Reviewer'),                                  getMyReviews);
router.get('/:id',      getReview);
router.post('/',        authorize('Institution Admin', 'System Admin'),         assignReview);
router.patch('/:id/submit', authorize('Reviewer'), submitReviewValidator,       submitReview);

export default router;
