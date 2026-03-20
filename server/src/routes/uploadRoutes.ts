import { Router } from 'express';
import { uploadImage, uploadImages, deleteImage } from '../controllers/uploadController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/image', protect, upload.single('image'), uploadImage);
router.post('/images', protect, upload.array('images', 20), uploadImages);
router.delete('/image/:id', protect, deleteImage);

export default router;
