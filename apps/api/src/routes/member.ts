import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth';
import {
  getMemberDashboard,
  getMemberProfile,
  getMemberPayments,
  getMemberPaymentSummary,
  getMemberTransactions,
  getReceipt,
  getFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  getVolunteerHistory,
  registerVolunteer,
  getEvents,
  getEventDetails
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
router.get('/receipts', getMemberPayments); // Alias for now
router.get('/receipts/:id', getReceipt);

// Family
router.get('/family', getFamilyMembers);
router.post('/family', addFamilyMember);
router.patch('/family/:id', updateFamilyMember);
router.delete('/family/:id', deleteFamilyMember);

// Membership Card
router.get('/card', (req, res) => res.json({ success: true, message: 'Card fetched' }));

// Events
router.get('/events', getEvents);
router.get('/events/:id', getEventDetails);

// Volunteer
router.get('/volunteer', getVolunteerHistory);
router.post('/volunteer', registerVolunteer);

// Privacy
router.get('/privacy', (req, res) => res.json({ success: true, message: 'Privacy fetched' }));
router.patch('/privacy', (req, res) => res.json({ success: true, message: 'Privacy updated' }));

// Mobile Change
router.post('/mobile-change', (req, res) => res.json({ success: true, message: 'Mobile change requested' }));
router.post('/mobile-change/verify', (req, res) => res.json({ success: true, message: 'Mobile change verified' }));
router.get('/mobile-change/requests', (req, res) => res.json({ success: true, message: 'Mobile change requests fetched' }));

export default router;
