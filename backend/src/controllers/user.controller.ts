import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { success, failure, paginate } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';

// GET /api/v1/users?page=1&limit=20&role=Researcher
export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page  = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip  = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (req.query.role)   filter.role = req.query.role;
    if (req.query.active) filter.isActive = req.query.active === 'true';

    const [items, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    res.json(success('Users fetched', paginate(items, total, page, limit)));
  } catch (err) { next(err); }
}

// GET /api/v1/users/:id
export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User');
    res.json(success('User fetched', { user }));
  } catch (err) { next(err); }
}

// PATCH /api/v1/users/:id
export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    // Users can only update themselves unless System Admin
    if (req.user!.userId !== req.params.id && req.user!.role !== 'System Admin') {
      throw new ForbiddenError('Cannot update another user');
    }
    const allowed = ['name', 'avatar'];
    if (req.user!.role === 'System Admin') allowed.push('role', 'isActive', 'institutionId');

    const updates: Record<string, unknown> = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) throw new NotFoundError('User');
    res.json(success('User updated', { user }));
  } catch (err) { next(err); }
}

// DELETE /api/v1/users/:id  — System Admin only
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) throw new NotFoundError('User');
    res.json(success('User deactivated'));
  } catch (err) { next(err); }
}
