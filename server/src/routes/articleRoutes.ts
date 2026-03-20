import { Router } from 'express';
import { getArticles, getArticle, createArticle, updateArticle, deleteArticle, adminGetArticles } from '../controllers/articleController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getArticles);
router.get('/:slug', getArticle);

router.get('/admin/all', protect, adminGetArticles);
router.post('/', protect, createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);

export default router;
