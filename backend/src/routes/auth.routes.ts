import { Router } from 'express';
import { signup, login, getMe } from '../controllers/auth.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';
import { loginLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/signup', loginLimiter, signup);
router.post('/login', loginLimiter, login);
router.get('/me', verifyAdmin, getMe);

export default router;
