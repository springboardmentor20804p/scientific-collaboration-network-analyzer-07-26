import { Request, Response, NextFunction } from 'express';
import { Publication } from '../models/Publication.model';
import { Review } from '../models/Review.model';
import { success, paginate, failure } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { validationResult } from 'express-validator';

// GET /api/v1/publications
export async function listPublications(req: Request, res: Response, next: NextFunction) {
  try {
    const page  = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip  = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (req.query.status)      filter.status = req.query.status;
    if (req.query.researchArea) filter.researchArea = req.query.researchArea;
    if (req.query.search)      filter.$text = { $search: req.query.search };

    const [items, total] = await Promise.all([
      Publication.find(filter)
        .populate('authors', 'name email')
        .populate('correspondingAuthor', 'name email')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      Publication.countDocuments(filter),
    ]);
    res.json(success('Publications fetched', paginate(items, total, page, limit)));
  } catch (err) { next(err); }
}

// GET /api/v1/publications/:id
export async function getPublication(req: Request, res: Response, next: NextFunction) {
  try {
    const pub = await Publication.findById(req.params.id)
      .populate('authors', 'name email role')
      .populate('correspondingAuthor', 'name email')
      .populate('institutionIds', 'name')
      .populate('reviewIds');
    if (!pub) throw new NotFoundError('Publication');
    res.json(success('Publication fetched', { publication: pub }));
  } catch (err) { next(err); }
}

// POST /api/v1/publications
export async function createPublication(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(failure('Validation failed', errors.array().map(e => e.msg)));

    const pub = await Publication.create({
      ...req.body,
      correspondingAuthor: req.user!.userId,
    });
    res.status(201).json(success('Publication created', { publication: pub }));
  } catch (err) { next(err); }
}

// PATCH /api/v1/publications/:id/submit — move to 'submitted'
export async function submitPublication(req: Request, res: Response, next: NextFunction) {
  try {
    const pub = await Publication.findById(req.params.id);
    if (!pub) throw new NotFoundError('Publication');
    if (String(pub.correspondingAuthor) !== req.user!.userId) {
      throw new ForbiddenError('Only the corresponding author can submit');
    }
    pub.status = 'submitted';
    pub.submittedAt = new Date();
    await pub.save();
    res.json(success('Publication submitted', { publication: pub }));
  } catch (err) { next(err); }
}

// GET /api/v1/publications/:id/reviews  — Reviewer / System Admin only
export async function getPublicationReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await Review.find({ publicationId: req.params.id })
      .populate('reviewerId', 'name');
    res.json(success('Reviews fetched', { reviews }));
  } catch (err) { next(err); }
}
