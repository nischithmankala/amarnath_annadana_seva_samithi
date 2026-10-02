import { Response } from 'express';
import { prisma } from '../config';
import { AuthRequest } from '../middlewares/auth';
import { ApiError } from '../utils/ApiError';
import { ErrorCodes } from '@samithi/contracts';

// ==========================================
// MEMBER DASHBOARD
// ==========================================
export const getMemberDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, ErrorCodes.UNAUTHORIZED, 'Unauthorized');

    const member = await prisma.member.findUnique({
      where: { userId },
      include: {
        familyMembers: true,
      }
    });

    if (!member) {
      return res.status(404).json({ success: false, error: { message: 'Member profile not found for this account.' } });
    }

    const payments = await prisma.payment.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: 'desc' },
      include: { receipts: true }
    });

    const successfulPayments = payments.filter(p => p.status === 'SUCCESSFUL');
    const pendingPayments = payments.filter(p => p.status === 'PENDING');
    const failedPayments = payments.filter(p => p.status === 'FAILED');
    const refundedPayments = payments.filter(p => p.status === 'REFUNDED');

    const totalPaid = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    const refundedAmount = refundedPayments.reduce((sum, p) => sum + p.amount, 0);

    const paymentSummary = {
      totalPaid,
      successfulCount: successfulPayments.length,
      pendingCount: pendingPayments.length,
      failedCount: failedPayments.length,
      refundedAmount
    };

    const recentTransactions = payments.slice(0, 3);

    res.json({
      success: true,
      data: {
        member,
        paymentSummary,
        recentTransactions
      }
    });
  } catch (error) {
    console.error('Error fetching member dashboard:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

// ==========================================
// MEMBER PROFILE
// ==========================================
export const getMemberProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, ErrorCodes.UNAUTHORIZED, 'Unauthorized');

    const member = await prisma.member.findUnique({
      where: { userId },
      include: {
        familyMembers: true,
        virtualCard: true
      }
    });

    if (!member) {
      return res.status(404).json({ success: false, error: { message: 'Member profile not found for this account.' } });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error fetching member profile:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

// ==========================================
// PAYMENTS & RECEIPTS
// ==========================================
export const getMemberPayments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, ErrorCodes.UNAUTHORIZED, 'Unauthorized');

    const member = await prisma.member.findUnique({ where: { userId } });
    if (!member) return res.status(404).json({ success: false, error: { message: 'Member not found.' } });

    const payments = await prisma.payment.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: 'desc' },
      include: { receipts: true }
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching member payments:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const getMemberPaymentSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, ErrorCodes.UNAUTHORIZED, 'Unauthorized');

    const member = await prisma.member.findUnique({ where: { userId } });
    if (!member) return res.status(404).json({ success: false, error: { message: 'Member not found.' } });

    const payments = await prisma.payment.findMany({
      where: { memberId: member.id },
    });

    const successfulPayments = payments.filter(p => p.status === 'SUCCESSFUL');
    const pendingPayments = payments.filter(p => p.status === 'PENDING');
    const failedPayments = payments.filter(p => p.status === 'FAILED');
    const refundedPayments = payments.filter(p => p.status === 'REFUNDED');

    const totalPaid = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    const refundedAmount = refundedPayments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      data: {
        totalPaid,
        successfulCount: successfulPayments.length,
        pendingCount: pendingPayments.length,
        failedCount: failedPayments.length,
        refundedAmount
      }
    });
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const getMemberTransactions = async (req: AuthRequest, res: Response) => {
  // Essentially the same as getMemberPayments but can be used for statement/filtering
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    
    const { status, type, fromDate, toDate } = req.query;

    const member = await prisma.member.findUnique({ where: { userId } });
    if (!member) return res.status(404).json({ success: false, error: { message: 'Member not found.' } });

    const whereClause: any = { memberId: member.id };
    
    if (status) whereClause.status = status;
    if (type) whereClause.purpose = type;
    
    if (fromDate || toDate) {
      whereClause.createdAt = {};
      if (fromDate) whereClause.createdAt.gte = new Date(fromDate as string);
      if (toDate) whereClause.createdAt.lte = new Date(toDate as string);
    }

    const transactions = await prisma.payment.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { receipts: true }
    });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const getReceipt = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { paymentId } = req.params;
    if (!userId) throw new ApiError(401, ErrorCodes.UNAUTHORIZED, 'Unauthorized');

    const member = await prisma.member.findUnique({ where: { userId } });
    if (!member) return res.status(404).json({ success: false, error: { message: 'Member not found.' } });

    const payment = await prisma.payment.findFirst({
      where: { 
        id: paymentId,
        memberId: member.id 
      },
      include: { receipts: true }
    });

    if (!payment) return res.status(404).json({ success: false, error: { message: 'Payment not found.' } });
    
    if (payment.status !== 'SUCCESSFUL' || !payment.receipts || payment.receipts.length === 0) {
      return res.status(404).json({ success: false, error: { message: 'No receipt available for this payment.' } });
    }

    res.json({
      success: true,
      data: payment.receipts[0]
    });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};
