import { Router } from 'express';
import {
  getPublishedLogs,
  getTags,
  getAllLogs,
  createLog,
  updateLog,
  togglePublish,
  deleteLog,
} from '../controllers/dailyLog.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

router.get('/', getPublishedLogs);
router.get('/tags', getTags);
router.get('/all', verifyAdmin, getAllLogs);
router.post('/', verifyAdmin, createLog);
router.put('/:id', verifyAdmin, updateLog);
router.patch('/:id/publish', verifyAdmin, togglePublish);
router.delete('/:id', verifyAdmin, deleteLog);

export default router;
