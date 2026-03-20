import { Router } from 'express';
import {
  getEditions, getEdition, getEditionPhotos,
  createEdition, updateEdition, deleteEdition,
  createEditionPhoto, updateEditionPhoto, deleteEditionPhoto, reorderEditionPhotos,
  adminGetEditions,
} from '../controllers/qomraWeekController';
import { protect } from '../middleware/auth';

const router = Router();

// Public
router.get('/editions', getEditions);
router.get('/editions/:num', getEdition);
router.get('/editions/:num/photos', getEditionPhotos);

// Admin
router.get('/admin/editions', protect, adminGetEditions);
router.post('/editions', protect, createEdition);
router.put('/editions/:num', protect, updateEdition);
router.delete('/editions/:num', protect, deleteEdition);
router.post('/editions/:num/photos', protect, createEditionPhoto);
router.put('/editions/:num/photos/:photoId', protect, updateEditionPhoto);
router.delete('/editions/:num/photos/:photoId', protect, deleteEditionPhoto);
router.patch('/editions/:num/photos/reorder', protect, reorderEditionPhotos);

export default router;
