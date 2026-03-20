import { Router } from 'express';
import { getGalleryItems, adminGetGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem, reorderGalleryItems } from '../controllers/galleryItemController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getGalleryItems);
router.get('/admin/all', protect, adminGetGalleryItems);
router.post('/', protect, createGalleryItem);
router.put('/:id', protect, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);
router.patch('/reorder', protect, reorderGalleryItems);

export default router;
