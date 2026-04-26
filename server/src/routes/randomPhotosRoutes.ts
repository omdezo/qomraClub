import { Router } from 'express';
import { getRandomPhotos } from '../controllers/randomPhotosController';

const router = Router();
router.get('/', getRandomPhotos);
export default router;
