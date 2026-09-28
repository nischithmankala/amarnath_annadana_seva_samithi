import { Request, Response } from 'express';
import { prisma } from '../config';
import { MockPaymentGateway } from '../services/PaymentGateway';
import crypto from 'crypto';

export const createMembershipIntent = async (req: Request, res: Response) => {
  try {
    const { name, mobile, email, address, city, category, familyMembers } = req.body;
    const fee = 152000;

    const user = await prisma.user.upsert({
      where: { mobile: mobile || email },
      update: {},
      create: {
        mobile,
        email,
        role: 'MEMBER'
      }
    });

    const memberId = `MEM-${Math.floor(1000 + Math.random() * 9000)}`;

    const member = await prisma.member.create({
      data: {
        memberId,
        userId: user.id,
        name,
        mobile,
        email,
        address,
        city,
        category,
        fee,
        status: 'PENDING',
        familyMembers: {
          create: familyMembers && Array.isArray(familyMembers) 
            ? familyMembers
                .filter((fm: any) => fm.name && fm.relationship)
                .map((fm: any) => ({
                  name: fm.name,
                  relationship: fm.relationship,
                  dob: fm.dob ? new Date(fm.dob) : null
                }))
            : []
        }
      }
    });

    const paymentGateway = new MockPaymentGateway();
    const transactionRef = `TXN-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        transactionRef,
        amount: fee,
        purpose: 'Membership Fee',
        status: 'PENDING',
        paymentMethod: 'ONLINE',
        memberId: member.id
      }
    });

    const gatewayOrder = await paymentGateway.createOrder(fee, transactionRef, 'Membership Fee');

    res.status(201).json({ success: true, data: { transactionRef, gatewayOrder, memberId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const verifyMembershipPayment = async (req: Request, res: Response) => {
  const { transactionRef, gatewayPaymentId, gatewaySignature } = req.body;

  const paymentGateway = new MockPaymentGateway();
  const isValid = await paymentGateway.verifySignature(transactionRef, gatewayPaymentId, gatewaySignature);

  if (!isValid) {
    res.status(400).json({ success: false, error: { message: 'Payment verification failed' } });
    return;
  }

  const payment = await prisma.payment.update({
    where: { transactionRef },
    data: {
      status: 'SUCCESSFUL',
      gatewayRef: gatewayPaymentId,
    }
  });

  const receiptNumber = `RCT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  
  await prisma.receipt.create({
    data: {
      paymentId: payment.id,
      receiptNumber,
    }
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { receiptNumber }
  });

  if (payment.memberId) {
    await prisma.member.update({
      where: { id: payment.memberId },
      data: { status: 'APPROVED' }
    });
  }

  res.json({
    success: true,
    data: {
      message: 'Payment verified and membership approved',
      receiptNumber
    }
  });
};


export const getMembers = async (req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        memberId: true,
        name: true,
        photoUrl: true,
        city: true,
      }
    });
    res.json({ success: true, data: members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};
