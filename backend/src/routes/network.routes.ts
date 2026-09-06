import { Router } from 'express';
import { getNetworkGraph, getNetworkStats, getTopResearchers } from '../controllers/network.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/stats',           getNetworkStats);     // public
router.get('/top-researchers', getTopResearchers);   // public
router.get('/graph',           authenticate, getNetworkGraph); // auth (may contain private nodes)

export default router;
