"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.requestOtp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const NotificationService_1 = require("../services/NotificationService");
const crypto_1 = __importDefault(require("crypto"));
const notificationService = new NotificationService_1.MockNotificationService();
const requestOtp = async (req, res) => {
    try {
        const { identity, type } = req.body; // type can be 'mobile' or 'email'
        if (!identity) {
            return res.status(400).json({ success: false, error: { message: 'Identity (mobile or email) is required' } });
        }
        let user = await config_1.prisma.user.findFirst({
            where: type === 'mobile' ? { mobile: identity } : { email: identity }
        });
        if (!user) {
            // Create user if not exists
            user = await config_1.prisma.user.create({
                data: {
                    [type === 'mobile' ? 'mobile' : 'email']: identity,
                    role: 'PUBLIC',
                }
            });
        }
        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto_1.default.createHash('sha256').update(otp).digest('hex');
        const otpExpiry = new Date(Date.now() + config_1.config.otpValidityMinutes * 60000);
        await config_1.prisma.user.update({
            where: { id: user.id },
            data: {
                hashedOtp,
                otpExpiry,
                otpAttempt: 0
            }
        });
        await notificationService.sendOTP(identity, otp);
        res.json({ success: true, data: { message: 'OTP sent successfully' } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: { message: 'Internal server error' } });
    }
};
exports.requestOtp = requestOtp;
const verifyOtp = async (req, res) => {
    try {
        const { identity, type, otp } = req.body;
        if (!identity || !otp) {
            return res.status(400).json({ success: false, error: { message: 'Identity and OTP are required' } });
        }
        const user = await config_1.prisma.user.findFirst({
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
        const hashedInputOtp = crypto_1.default.createHash('sha256').update(otp).digest('hex');
        if (hashedInputOtp !== user.hashedOtp) {
            await config_1.prisma.user.update({
                where: { id: user.id },
                data: { otpAttempt: { increment: 1 } }
            });
            return res.status(400).json({ success: false, error: { message: 'Invalid OTP' } });
        }
        // Success - Generate JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiry });
        // Clear OTP fields
        await config_1.prisma.user.update({
            where: { id: user.id },
            data: {
                hashedOtp: null,
                otpExpiry: null,
                otpAttempt: 0
            }
        });
        res.json({ success: true, data: { token, user: { id: user.id, role: user.role } } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: { message: 'Internal server error' } });
    }
};
exports.verifyOtp = verifyOtp;
