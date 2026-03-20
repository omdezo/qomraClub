import { Router } from 'express';
import { getPhotos, getPhoto, createPhoto, updatePhoto, deletePhoto, reorderPhotos, adminGetPhotos } from '../controllers/photoController';
import { protect } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getPhotos);
router.get('/:id', getPhoto);

// Admin
router.get('/admin/all', protect, adminGetPhotos);
router.post('/', protect, createPhoto);
router.put('/:id', protect, updatePhoto);
router.delete('/:id', protect, deletePhoto);
router.patch('/reorder', protect, reorderPhotos);

export default router;
