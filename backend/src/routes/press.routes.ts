import { Router } from 'express';
import { getPress, getPressById, createPress, updatePress, deletePress } from '../controllers/press.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

router.get('/', getPress);
router.get('/:id', getPressById);
router.post('/', verifyAdmin, createPress);
router.put('/:id', verifyAdmin, updatePress);
router.delete('/:id', verifyAdmin, deletePress);

export default router;
