import { Router } from 'express';
import {
  getTimeline,
  createTimelineEntry,
  updateTimelineEntry,
  deleteTimelineEntry,
} from '../controllers/story.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

router.get('/timeline', getTimeline);
router.post('/timeline', verifyAdmin, createTimelineEntry);
router.put('/timeline/:id', verifyAdmin, updateTimelineEntry);
router.delete('/timeline/:id', verifyAdmin, deleteTimelineEntry);

export default router;
