import { Router } from 'express';
import { getHomepageSections, adminGetHomepageSections, updateHomepageSection } from '../controllers/homepageController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getHomepageSections);
router.get('/admin/all', protect, adminGetHomepageSections);
router.put('/:sectionType', protect, updateHomepageSection);

export default router;
