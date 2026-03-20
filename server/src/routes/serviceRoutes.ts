import { Router } from 'express';
import { getServices, getService, createService, updateService, deleteService, adminGetServices } from '../controllers/serviceController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getServices);
router.get('/:id', getService);

router.get('/admin/all', protect, adminGetServices);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

export default router;
