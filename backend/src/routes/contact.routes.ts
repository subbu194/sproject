import { Router } from 'express';
import { submitContact, getContacts, markAsRead, deleteContact } from '../controllers/contact.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';
import { contactLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', contactLimiter, submitContact);
router.get('/', verifyAdmin, getContacts);
router.patch('/:id/read', verifyAdmin, markAsRead);
router.delete('/:id', verifyAdmin, deleteContact);

export default router;
