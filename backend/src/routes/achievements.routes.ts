import { Router } from 'express';
import {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getUploadUrl,
} from '../controllers/achievements.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

router.get('/', getAchievements);
router.get('/:id', getAchievementById);
router.get('/upload-url', verifyAdmin, getUploadUrl);
router.post('/', verifyAdmin, createAchievement);
router.put('/:id', verifyAdmin, updateAchievement);
router.delete('/:id', verifyAdmin, deleteAchievement);

export default router;
