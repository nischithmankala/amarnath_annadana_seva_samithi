import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma, config } from '../config';
import { MockNotificationService } from '../services/NotificationService';
import crypto from 'crypto';

const notificationService = new MockNotificationService();

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { identity, type } = req.body; // type can be 'mobile' or 'email'
    
    if (!identity) {
      return res.status(400).json({ success: false, error: { message: 'Identity (mobile or email) is required' } });
    }

    let user = await prisma.user.findFirst({
      where: type === 'mobile' ? { mobile: identity } : { email: identity }
    });

    if (!user) {
      // Create user if not exists
      user = await prisma.user.create({
        data: {
          [type === 'mobile' ? 'mobile' : 'email']: identity,
          role: 'PUBLIC',
        }
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpiry = new Date(Date.now() + config.otpValidityMinutes * 60000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedOtp,
        otpExpiry,
        otpAttempt: 0
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
    const { identity, type, otp } = req.body;

    if (!identity || !otp) {
      return res.status(400).json({ success: false, error: { message: 'Identity and OTP are required' } });
    }

    const user = await prisma.user.findFirst({
      where: type === 'mobile' ? { mobile: identity } : { email: identity }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    if (!user.hashedOtp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, error: { message: 'OTP expired or not requested' } });
    }

    if (user.otpAttempt >= 5) {
      return res.status(429).json({ success: false, error: { message: 'Max OTP attempts reached' } });
    }

    const hashedInputOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hashedInputOtp !== user.hashedOtp) {
      await prisma.user.update({
        where: { id: user.id },
        data: { otpAttempt: { increment: 1 } }
      });
      return res.status(400).json({ success: false, error: { message: 'Invalid OTP' } });
    }

    // Success - Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiry as any }
    );

    // Clear OTP fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedOtp: null,
        otpExpiry: null,
        otpAttempt: 0
      }
    });

    res.json({ success: true, data: { token, user: { id: user.id, role: user.role } } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};
