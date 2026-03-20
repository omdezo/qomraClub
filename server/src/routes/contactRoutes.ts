import { Router } from 'express';
import { submitContact, getMessages, getMessage, markAsRead, archiveMessage, deleteMessage } from '../controllers/contactController';
import { protect } from '../middleware/auth';
import { contactLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', contactLimiter, submitContact);

router.get('/messages', protect, getMessages);
router.get('/messages/:id', protect, getMessage);
router.patch('/messages/:id/read', protect, markAsRead);
router.patch('/messages/:id/archive', protect, archiveMessage);
router.delete('/messages/:id', protect, deleteMessage);

export default router;
