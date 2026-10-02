import { Request, Response } from 'express';
import { prisma } from '../config';
import { MockPaymentGateway } from '../services/PaymentGateway';
import crypto from 'crypto';

export const createMembershipIntent = async (req: Request, res: Response) => {
  try {
    const { name, mobile, email, address, city, category, familyMembers } = req.body;
    const fee = 152000;

    const user = await prisma.user.upsert({
      where: { mobile },
      update: {},
      create: {
        mobile,
        role: 'MEMBER'
      }
    });

    const existingMember = await prisma.member.findUnique({ where: { userId: user.id } });
    
    if (existingMember && existingMember.status === 'APPROVED') {
      res.status(400).json({ success: false, error: { message: 'A membership already exists for this mobile number.' } });
      return;
    }

    const familyMembersData = familyMembers && Array.isArray(familyMembers) 
      ? familyMembers
          .filter((fm: any) => fm.name && fm.relationship)
          .map((fm: any) => ({
            name: fm.name,
            relationship: fm.relationship,
            dob: fm.dob ? new Date(fm.dob) : null
          }))
      : [];

    const tempMemberId = `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const member = await prisma.member.upsert({
      where: { userId: user.id },
      update: {
        name,
        email,
        address,
        city,
        category,
        fee,
        familyMembers: {
          deleteMany: {},
          create: familyMembersData
        }
      },
      create: {
        memberId: tempMemberId,
        userId: user.id,
        name,
        email,
        address,
        city,
        category,
        fee,
        status: 'PENDING',
        familyMembers: {
          create: familyMembersData
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

    res.status(201).json({ success: true, data: { transactionRef, gatewayOrder } });
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

  let finalMemberId = null;

  if (payment.memberId) {
    const member = await prisma.member.findUnique({ where: { id: payment.memberId } });
    if (member && member.status === 'PENDING') {
      finalMemberId = `AASS-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
      
      await prisma.member.update({
        where: { id: payment.memberId },
        data: { 
          status: 'APPROVED',
          memberId: finalMemberId,
          joiningDate: new Date()
        }
      });
      
      await prisma.virtualMemberCard.create({
        data: {
          memberId: payment.memberId,
          status: 'ACTIVE'
        }
      });
    }
  }

  res.json({
    success: true,
    data: {
      message: 'Payment verified and membership approved',
      receiptNumber,
      memberId: finalMemberId
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
