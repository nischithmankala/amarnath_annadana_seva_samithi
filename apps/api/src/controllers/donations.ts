import { Request, Response } from 'express';
import { prisma } from '../config';
import { MockPaymentGateway } from '../services/PaymentGateway';
import { ApiError } from '../utils/ApiError';
import { ErrorCodes } from '@samithi/contracts';
import crypto from 'crypto';

const paymentGateway = new MockPaymentGateway();

export const createDonationIntent = async (req: Request, res: Response) => {
  const { amount, purpose, donorName, mobile, email, address, pan, isAnonymous } = req.body;

  if (!amount || amount <= 0) {
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Valid amount is required');
  }

  // 1. Create a Pending Payment Record
  const transactionRef = `TXN-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  
  const payment = await prisma.payment.create({
    data: {
      transactionRef,
      amount,
      purpose: purpose || 'General Fund',
      status: 'PENDING',
      paymentMethod: 'ONLINE',
    }
  });

  // 2. Create the Donation Record linked to Payment
  await prisma.donation.create({
    data: {
      donorName: isAnonymous ? 'Anonymous' : donorName,
      mobile,
      email,
      address,
      pan,
      amount,
      campaign: purpose || 'General Fund',
      paymentId: payment.id
    }
  });

  // 3. Generate Gateway Intent
  const gatewayOrder = await paymentGateway.createOrder(amount, transactionRef,purpose);

  res.status(201).json({
    success: true,
    data: {
      transactionRef,
      gatewayOrder,
    }
  });
};

export const verifyDonationPayment = async (req: Request, res: Response) => {
  const { transactionRef, gatewayPaymentId, gatewaySignature } = req.body;

  // In a real scenario, we'd verify the signature here.
  const isValid = await paymentGateway.verifySignature(transactionRef, gatewayPaymentId, gatewaySignature);

  if (!isValid) {
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Payment verification failed');
  }

  // 1. Update Payment Status
  const payment = await prisma.payment.update({
    where: { transactionRef },
    data: {
      status: 'SUCCESSFUL',
      gatewayRef: gatewayPaymentId,
    }
  });

  // 2. Generate Receipt
  const receiptNumber = `RCT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  
  const receipt = await prisma.receipt.create({
    data: {
      paymentId: payment.id,
      receiptNumber,
    }
  });

  // 3. Update Payment with receipt number
  await prisma.payment.update({
    where: { id: payment.id },
    data: { receiptNumber }
  });

  // TODO: Generate PDF and send via NotificationService (Email/SMS)

  res.json({
    success: true,
    data: {
      message: 'Payment verified and receipt generated',
      receiptNumber
    }
  });
};
