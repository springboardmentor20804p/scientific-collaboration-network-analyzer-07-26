import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { User } from '../models/User.model';
import { success } from '../utils/response';

// Researcher profile routes — /api/v1/researchers
const router = Router();

// GET /api/v1/researchers  — public directory of researchers
router.get('/', async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const filter: Record<string, unknown> = { role: 'Researcher', isActive: true };
    if (req.query.institution) filter.institutionId = req.query.institution;

    const [items, total] = await Promise.all([
      User.find(filter).select('name email avatar institutionId createdAt')
        .populate('institutionId', 'name')
        .skip((page - 1) * limit).limit(limit),
      User.countDocuments(filter),
    ]);
    res.json(success('Researchers fetched', { items, total, page, limit }));
  } catch (err) { next(err); }
});

// GET /api/v1/researchers/:id
router.get('/:id', async (req, res, next) => {
  try {
    const researcher = await User.findOne({ _id: req.params.id, role: 'Researcher' })
      .populate('institutionId', 'name domain country');
    if (!researcher) return res.status(404).json({ success: false, message: 'Researcher not found' });
    res.json(success('Researcher fetched', { researcher }));
  } catch (err) { next(err); }
});

export default router;
