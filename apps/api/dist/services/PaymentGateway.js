"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPaymentGateway = void 0;
class MockPaymentGateway {
    async createOrder(amount, receipt, purpose) {
        console.log(`[MockPaymentGateway] Creating order for amount ${amount}, receipt ${receipt}, purpose ${purpose}`);
        return {
            id: `order_${Math.random().toString(36).substring(7)}`,
            amount,
            currency: "INR",
            receipt,
            status: "created"
        };
    }
    verifySignature(paymentData) {
        // In a real scenario, verify Razorpay/Stripe signature
        console.log(`[MockPaymentGateway] Verifying payment signature for`, paymentData);
        return true;
    }
}
exports.MockPaymentGateway = MockPaymentGateway;
