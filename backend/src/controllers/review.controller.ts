import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review.model';
import { Publication } from '../models/Publication.model';
import { success, failure } from '../utils/response';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors';
import { validationResult } from 'express-validator';

// POST /api/v1/reviews  — assign a reviewer to a publication
export async function assignReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { publicationId, reviewerId, dueDate, isAnonymous } = req.body;
    const pub = await Publication.findById(publicationId);
    if (!pub) throw new NotFoundError('Publication');

    const existing = await Review.findOne({ publicationId, reviewerId });
    if (existing) throw new ConflictError('Reviewer already assigned to this publication');

    const review = await Review.create({ publicationId, reviewerId, dueDate, isAnonymous });
    await Publication.findByIdAndUpdate(publicationId, {
      $addToSet: { reviewIds: review._id },
      status: 'under_review',
    });
    res.status(201).json(success('Review assigned', { review }));
  } catch (err) { next(err); }
}

// PATCH /api/v1/reviews/:id/submit  — Reviewer submits their verdict
export async function submitReview(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(failure('Validation failed', errors.array().map(e => e.msg)));

    const review = await Review.findById(req.params.id);
    if (!review) throw new NotFoundError('Review');
    if (String(review.reviewerId) !== req.user!.userId) {
      throw new ForbiddenError('Only the assigned reviewer can submit this review');
    }

    const { decision, summary, comments, score } = req.body;
    review.decision   = decision;
    review.summary    = summary;
    review.comments   = comments || [];
    review.score      = score;
    review.submittedAt = new Date();
    await review.save();

    res.json(success('Review submitted', { review }));
  } catch (err) { next(err); }
}

// GET /api/v1/reviews/mine  — reviewer's own assigned reviews
export async function getMyReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await Review.find({ reviewerId: req.user!.userId })
      .populate('publicationId', 'title status submittedAt');
    res.json(success('Reviews fetched', { reviews }));
  } catch (err) { next(err); }
}

// GET /api/v1/reviews/:id
export async function getReview(req: Request, res: Response, next: NextFunction) {
  try {
    const review = await Review.findById(req.params.id)
      .populate('publicationId', 'title')
      .populate('reviewerId', 'name');
    if (!review) throw new NotFoundError('Review');
    // Non-admin can only see their own review
    if (req.user!.role !== 'System Admin' && String(review.reviewerId) !== req.user!.userId) {
      throw new ForbiddenError('Access denied');
    }
    res.json(success('Review fetched', { review }));
  } catch (err) { next(err); }
}
