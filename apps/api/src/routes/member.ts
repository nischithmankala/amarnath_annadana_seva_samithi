import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth';
import {
  getMemberDashboard,
  getMemberProfile,
  getMemberPayments,
  getMemberPaymentSummary,
  getMemberTransactions,
  getReceipt
} from '../controllers/member';

const router = Router();

// All routes require authentication and MEMBER role
router.use(authenticate);
router.use(requireRole(['MEMBER']));

// Dashboard
router.get('/dashboard', getMemberDashboard);

// Profile
router.get('/profile', getMemberProfile);

// Payments & Receipts
router.get('/payments', getMemberPayments);
router.get('/payments/summary', getMemberPaymentSummary);
router.get('/transactions', getMemberTransactions);
router.get('/payments/:paymentId/receipt', getReceipt);

export default router;
