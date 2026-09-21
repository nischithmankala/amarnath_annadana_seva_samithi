import { Router } from 'express';
import { createMember, getMembers } from '../controllers/memberships';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.post('/', createMember);
router.get('/', authenticate, getMembers);

export default router;
