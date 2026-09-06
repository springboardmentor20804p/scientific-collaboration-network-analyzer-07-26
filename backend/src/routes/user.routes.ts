import { Router } from 'express';
import { listUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/',     authorize('System Admin', 'Institution Admin'), listUsers);
router.get('/:id',  getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', authorize('System Admin'), deleteUser);

export default router;
