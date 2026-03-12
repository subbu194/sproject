import { Router } from 'express';
import { generateUploadUrl } from '../controllers/upload.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

router.post('/generate-url', verifyAdmin, generateUploadUrl);

export default router;
