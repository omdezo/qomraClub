import { Router } from 'express';
import { getStats } from '../controllers/statsController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getStats);

export default router;
