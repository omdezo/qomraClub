import { Router } from 'express';
import { getTitles, adminGetTitles, createTitle, updateTitle, deleteTitle } from '../controllers/titleController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getTitles);
router.get('/admin/all', protect, adminGetTitles);
router.post('/', protect, createTitle);
router.put('/:id', protect, updateTitle);
router.delete('/:id', protect, deleteTitle);

export default router;
