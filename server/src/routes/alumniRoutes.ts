import { Router } from 'express';
import { getAlumni, getAlumniById, adminGetAlumni, createAlumni, updateAlumni, deleteAlumni } from '../controllers/alumniController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getAlumni);
router.get('/admin/all', protect, adminGetAlumni);
router.get('/:id', getAlumniById);
router.post('/', protect, createAlumni);
router.put('/:id', protect, updateAlumni);
router.delete('/:id', protect, deleteAlumni);

export default router;
