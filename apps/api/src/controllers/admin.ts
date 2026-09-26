import { Request, Response } from 'express';
import { prisma } from '../config';
import { AuthRequest } from '../middlewares/auth';
import { ApiError } from '../utils/ApiError';
import { ErrorCodes } from '@samithi/contracts';

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users (Super Admin only)
 */
export const listUsers = async (req: AuthRequest, res: Response) => {
  const { page = '1', limit = '20', role } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const where: any = {};
  if (role) where.role = role;

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true, mobile: true, email: true, role: true, status: true,
        createdAt: true, member: { select: { memberId: true, name: true, status: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    })
  ]);

  res.json({ success: true, data: { users, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } } });
};

/**
 * @openapi
 * /admin/users:
 *   post:
 *     tags: [Admin]
 *     summary: Create admin account (Super Admin only)
 */
export const createAdminUser = async (req: AuthRequest, res: Response) => {
  const { mobile, email, role = 'ADMIN', canApproveMembers = true, canManageMedia = false, eventIds = [] } = req.body;

  if (!mobile && !email) throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Mobile or email is required');
  if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Role must be ADMIN or SUPER_ADMIN');

  const user = await prisma.user.create({
    data: {
      mobile: mobile || null,
      email: email || null,
      role,
      adminScope: {
        create: { canApproveMembers, canManageMedia, eventIds }
      }
    },
    include: { adminScope: true }
  });

  await prisma.auditLog.create({
    data: {
      actorId: req.user?.id,
      action: 'ADMIN_USER_CREATED',
      entityType: 'User',
      entityId: user.id,
      afterState: { role, mobile, email },
    }
  });

  res.status(201).json({ success: true, data: { id: user.id, role: user.role, mobile: user.mobile, email: user.email } });
};

/**
 * @openapi
 * /admin/users/{id}/role:
 *   put:
 *     tags: [Admin]
 *     summary: Update user role (Super Admin only)
 */
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, ErrorCodes.NOT_FOUND, 'User not found');

  const before = { role: user.role };
  const updated = await prisma.user.update({ where: { id }, data: { role } });

  await prisma.auditLog.create({
    data: {
      actorId: req.user?.id,
      action: 'ROLE_CHANGED',
      entityType: 'User',
      entityId: id,
      beforeState: before,
      afterState: { role },
    }
  });

  res.json({ success: true, data: { id: updated.id, role: updated.role } });
};

/**
 * @openapi
 * /admin/users/{id}/status:
 *   put:
 *     tags: [Admin]
 *     summary: Activate or deactivate a user (Super Admin only)
 */
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' | 'deactivated'

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, ErrorCodes.NOT_FOUND, 'User not found');

  await prisma.user.update({ where: { id }, data: { status } });

  await prisma.auditLog.create({
    data: { actorId: req.user?.id, action: 'USER_STATUS_CHANGED', entityType: 'User', entityId: id, afterState: { status } }
  });

  res.json({ success: true, data: { message: `User ${status}` } });
};

/**
 * @openapi
 * /admin/settings:
 *   get:
 *     tags: [Admin]
 *     summary: Get system settings (Super Admin)
 */
export const getSettings = async (req: Request, res: Response) => {
  const settings = await prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;
  res.json({ success: true, data: map });
};

/**
 * @openapi
 * /admin/settings:
 *   put:
 *     tags: [Admin]
 *     summary: Update system settings (Super Admin only)
 */
export const updateSettings = async (req: AuthRequest, res: Response) => {
  const settings = req.body as Record<string, string>;

  for (const [key, value] of Object.entries(settings)) {
    await prisma.systemSetting.upsert({
      where: { key },
      update: { value, updatedBy: req.user?.id },
      create: { key, value, updatedBy: req.user?.id }
    });
  }

  await prisma.auditLog.create({
    data: { actorId: req.user?.id, action: 'SETTINGS_UPDATED', afterState: settings }
  });

  res.json({ success: true, data: { message: 'Settings updated' } });
};

/**
 * @openapi
 * /admin/audit-logs:
 *   get:
 *     tags: [Admin]
 *     summary: Get audit logs (Super Admin)
 */
export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  const { page = '1', limit = '50', action, entityType } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const where: any = {};
  if (action) where.action = { contains: action as string };
  if (entityType) where.entityType = entityType;

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      include: { actor: { select: { mobile: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    })
  ]);

  res.json({ success: true, data: { logs, pagination: { total, page: pageNum, limit: limitNum } } });
};

export const getReports = async (req: AuthRequest, res: Response) => {
  const { type, from, to } = req.query;

  const dateFilter: any = {};
  if (from) dateFilter.gte = new Date(from as string);
  if (to) dateFilter.lte = new Date(to as string);

  const where = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

  switch (type) {
    case 'donations': {
      const data = await prisma.payment.groupBy({
        by: ['status'],
        where: { purpose: 'DONATION', ...where },
        _sum: { amount: true },
        _count: true,
      });
      return res.json({ success: true, data });
    }
    case 'memberships': {
      const data = await prisma.member.groupBy({
        by: ['status'],
        _count: true,
      });
      return res.json({ success: true, data });
    }
    default:
      return res.json({ success: true, data: { message: 'Specify type: donations | memberships' } });
  }
};
