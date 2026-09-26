import { Router } from 'express';
import {
  createDonationIntent,
  verifyDonationPayment,
  lookupReceipt,
  listDonations,
  downloadReceipt
} from '../controllers/donations';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/intent', createDonationIntent);
router.post('/verify', verifyDonationPayment);
router.get('/receipt/:receiptNumber', lookupReceipt);
router.get('/receipt/:receiptNumber/download', downloadReceipt);

// Admin/Super Admin routes
router.get('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), listDonations);

export default router;
