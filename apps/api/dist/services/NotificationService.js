"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockNotificationService = void 0;
class MockNotificationService {
    async sendOTP(to, otp) {
        console.log(`[MockNotificationService] Sending OTP ${otp} to ${to}`);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
}
exports.MockNotificationService = MockNotificationService;
