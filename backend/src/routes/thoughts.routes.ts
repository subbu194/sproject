import { Router } from 'express';
import {
  getPublishedThoughts,
  getAllThoughts,
  createThought,
  updateThought,
  togglePublishThought,
  deleteThought,
} from '../controllers/thoughts.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

router.get('/', getPublishedThoughts);
router.get('/all', verifyAdmin, getAllThoughts);
router.post('/', verifyAdmin, createThought);
router.put('/:id', verifyAdmin, updateThought);
router.patch('/:id/publish', verifyAdmin, togglePublishThought);
router.delete('/:id', verifyAdmin, deleteThought);

export default router;
