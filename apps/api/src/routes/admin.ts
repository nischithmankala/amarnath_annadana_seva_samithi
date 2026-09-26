import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth';
import {
  listUsers, createAdminUser, updateUserRole, updateUserStatus,
  getSettings, updateSettings, getAuditLogs, getReports
} from '../controllers/admin';

const router = Router();

router.use(authenticate);

// Super Admin only
router.get('/users', requireRole('SUPER_ADMIN'), listUsers);
router.post('/users', requireRole('SUPER_ADMIN'), createAdminUser);
router.put('/users/:id/role', requireRole('SUPER_ADMIN'), updateUserRole);
router.put('/users/:id/status', requireRole('SUPER_ADMIN'), updateUserStatus);
router.get('/settings', requireRole('SUPER_ADMIN'), getSettings);
router.put('/settings', requireRole('SUPER_ADMIN'), updateSettings);
router.get('/audit-logs', requireRole('SUPER_ADMIN'), getAuditLogs);

// Admin + Super Admin
router.get('/reports', requireRole('ADMIN', 'SUPER_ADMIN'), getReports);

export default router;
