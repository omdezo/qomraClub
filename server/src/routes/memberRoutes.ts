import { Router } from 'express';
import { getMembers, getBoardMembers, getMember, createMember, updateMember, deleteMember, adminGetMembers } from '../controllers/memberController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getMembers);
router.get('/board', getBoardMembers);
router.get('/:id', getMember);

router.get('/admin/all', protect, adminGetMembers);
router.post('/', protect, createMember);
router.put('/:id', protect, updateMember);
router.delete('/:id', protect, deleteMember);

export default router;
