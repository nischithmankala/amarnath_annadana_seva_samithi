import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma, config } from '../config';
import { MockNotificationService } from '../services/NotificationService';
import crypto from 'crypto';

const notificationService = new MockNotificationService();

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { identity } = req.body; 
    
    if (!identity) {
      return res.status(400).json({ success: false, error: { message: 'Mobile number is required' } });
    }

    let user = await prisma.user.findFirst({
      where: { mobile: identity }
    });

    if (!user) {
      // Create user if not exists (for public signup)
      user = await prisma.user.create({
        data: {
          mobile: identity,
          role: 'PUBLIC',
        }
      });
    }

    // Generate 6 digit OTP (hardcoded for testing to match UI)
    const otp = "123456";
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + config.otpValidityMinutes * 60000);

    await prisma.otpChallenge.create({
      data: {
        userId: user.id,
        otpHash: hashedOtp,
        expiresAt,
        attemptCount: 0
      }
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'OTP_REQUESTED',
      }
    });

    await notificationService.sendOTP(identity, otp);

    res.json({ success: true, data: { message: 'OTP sent successfully' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { identity, otp } = req.body;

    if (!identity || !otp) {
      return res.status(400).json({ success: false, error: { message: 'Mobile and OTP are required' } });
    }

    const user = await prisma.user.findFirst({
      where: { mobile: identity }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    const challenge = await prisma.otpChallenge.findFirst({
      where: {
        userId: user.id,
        verifiedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!challenge || challenge.expiresAt < new Date()) {
      return res.status(400).json({ success: false, error: { message: 'OTP expired or not requested' } });
    }

    if (challenge.attemptCount >= challenge.maxAttempts) {
      return res.status(429).json({ success: false, error: { message: 'Max OTP attempts reached' } });
    }

    const hashedInputOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hashedInputOtp !== challenge.otpHash) {
      await prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attemptCount: { increment: 1 } }
      });
      
      await prisma.auditLog.create({
        data: { actorId: user.id, action: 'OTP_FAILED' }
      });

      return res.status(400).json({ success: false, error: { message: 'Invalid OTP' } });
    }

    // Success - verify challenge
    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { verifiedAt: new Date() }
    });
    
    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'OTP_VERIFIED' }
    });

    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'LOGIN_SUCCESS' }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiry as any }
    );

    res.json({ success: true, data: { token, user: { id: user.id, role: user.role } } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};
