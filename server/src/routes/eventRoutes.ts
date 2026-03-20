import { Router } from 'express';
import { getEvents, getUpcomingEvents, getEvent, createEvent, updateEvent, deleteEvent, adminGetEvents } from '../controllers/eventController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/:slug', getEvent);

router.get('/admin/all', protect, adminGetEvents);
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

export default router;
