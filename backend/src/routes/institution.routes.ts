import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Institution } from '../models/Institution.model';
import { User } from '../models/User.model';
import { success, paginate, failure } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';

const router = Router();
router.use(authenticate);

// GET /api/v1/institutions
router.get('/', async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const [items, total] = await Promise.all([
      Institution.find().skip((page - 1) * limit).limit(limit).sort({ name: 1 }),
      Institution.countDocuments(),
    ]);
    res.json(success('Institutions fetched', paginate(items, total, page, limit)));
  } catch (err) { next(err); }
});

// GET /api/v1/institutions/:id
router.get('/:id', async (req, res, next) => {
  try {
    const inst = await Institution.findById(req.params.id).populate('adminId', 'name email');
    if (!inst) throw new NotFoundError('Institution');
    res.json(success('Institution fetched', { institution: inst }));
  } catch (err) { next(err); }
});

// POST /api/v1/institutions — Institution Admin or System Admin
router.post('/', authorize('Institution Admin', 'System Admin'), async (req, res, next) => {
  try {
    const inst = await Institution.create({ ...req.body, adminId: req.user!.userId });
    res.status(201).json(success('Institution created', { institution: inst }));
  } catch (err) { next(err); }
});

// GET /api/v1/institutions/:id/members
router.get('/:id/members', authorize('Institution Admin', 'System Admin'), async (req, res, next) => {
  try {
    const inst = await Institution.findById(req.params.id);
    if (!inst) throw new NotFoundError('Institution');
    if (req.user!.role === 'Institution Admin' && String(inst.adminId) !== req.user!.userId) {
      throw new ForbiddenError('Access denied');
    }
    const members = await User.find({ institutionId: req.params.id });
    res.json(success('Members fetched', { members }));
  } catch (err) { next(err); }
});

export default router;
