import { Router } from 'express';
import { createMembershipIntent, verifyMembershipPayment, getMembers } from '../controllers/memberships';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.post('/intent', createMembershipIntent);
router.post('/verify', verifyMembershipPayment);
router.get('/', authenticate, getMembers);

export default router;
