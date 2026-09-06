import { Request, Response, NextFunction } from 'express';
import { Collaboration } from '../models/Collaboration.model';
import { success, paginate } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { validationResult } from 'express-validator';
import { failure } from '../utils/response';

// GET /api/v1/collaborations
export async function listCollaborations(req: Request, res: Response, next: NextFunction) {
  try {
    const page  = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip  = (page - 1) * limit;
    const filter: Record<string, unknown> = { isPublic: true };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.tag)    filter.tags = req.query.tag;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [items, total] = await Promise.all([
      Collaboration.find(filter)
        .populate('initiatorId', 'name email')
        .populate('institutions', 'name')
        .skip(skip).limit(limit).sort({ createdAt: -1 }),
      Collaboration.countDocuments(filter),
    ]);
    res.json(success('Collaborations fetched', paginate(items, total, page, limit)));
  } catch (err) { next(err); }
}

// GET /api/v1/collaborations/:id
export async function getCollaboration(req: Request, res: Response, next: NextFunction) {
  try {
    const collab = await Collaboration.findById(req.params.id)
      .populate('initiatorId', 'name email role')
      .populate('members', 'name email role')
      .populate('institutions', 'name domain country');
    if (!collab) throw new NotFoundError('Collaboration');
    res.json(success('Collaboration fetched', { collaboration: collab }));
  } catch (err) { next(err); }
}

// POST /api/v1/collaborations
export async function createCollaboration(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(failure('Validation failed', errors.array().map(e => e.msg)));

    const collab = await Collaboration.create({
      ...req.body,
      initiatorId: req.user!.userId,
      members: [req.user!.userId],
      institutions: req.user!.institutionId ? [req.user!.institutionId] : [],
    });
    res.status(201).json(success('Collaboration created', { collaboration: collab }));
  } catch (err) { next(err); }
}

// PATCH /api/v1/collaborations/:id
export async function updateCollaboration(req: Request, res: Response, next: NextFunction) {
  try {
    const collab = await Collaboration.findById(req.params.id);
    if (!collab) throw new NotFoundError('Collaboration');
    if (String(collab.initiatorId) !== req.user!.userId && req.user!.role !== 'System Admin') {
      throw new ForbiddenError('Only the initiator can update this collaboration');
    }
    const updated = await Collaboration.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(success('Collaboration updated', { collaboration: updated }));
  } catch (err) { next(err); }
}

// POST /api/v1/collaborations/:id/join
export async function joinCollaboration(req: Request, res: Response, next: NextFunction) {
  try {
    const collab = await Collaboration.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: req.user!.userId } },
      { new: true }
    );
    if (!collab) throw new NotFoundError('Collaboration');
    res.json(success('Joined collaboration', { collaboration: collab }));
  } catch (err) { next(err); }
}
