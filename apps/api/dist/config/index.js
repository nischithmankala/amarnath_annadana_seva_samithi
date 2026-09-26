"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.config = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET || 'supersecret',
    jwtExpiry: process.env.JWT_EXPIRY || '1d',
    otpValidityMinutes: parseInt(process.env.OTP_VALIDITY_MINUTES || '10', 10),
};
exports.prisma = new client_1.PrismaClient();
