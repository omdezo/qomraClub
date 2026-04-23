import { Router } from 'express';
import { getTestimonials, adminGetTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getTestimonials);
router.get('/admin/all', protect, adminGetTestimonials);
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

export default router;
