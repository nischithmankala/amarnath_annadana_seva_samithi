import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
  jwtExpiry: process.env.JWT_EXPIRY || '1d',
  otpValidityMinutes: parseInt(process.env.OTP_VALIDITY_MINUTES || '10', 10),
};

export const prisma = new PrismaClient();
