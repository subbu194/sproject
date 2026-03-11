import { Router } from 'express';
import { getSocialLinks, updateSocialLinks } from '../controllers/connect.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

router.get('/', getSocialLinks);
router.put('/', verifyAdmin, updateSocialLinks);

export default router;
