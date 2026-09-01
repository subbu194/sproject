import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

router.get('/', getSettings);
router.put('/', verifyAdmin, updateSettings);

export default router;
