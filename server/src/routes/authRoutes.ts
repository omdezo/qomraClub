import { Router } from 'express';
import { login, getMe, changePassword } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

export default router;
