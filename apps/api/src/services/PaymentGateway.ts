export interface IPaymentGateway {
  createOrder(amount: number, receipt: string, purpose: string): Promise<any>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}

export class MockPaymentGateway implements IPaymentGateway {
  async createOrder(amount: number, receipt: string, purpose: string): Promise<any> {
    console.log(`[MockPaymentGateway] Creating order for amount ${amount}, receipt ${receipt}, purpose ${purpose}`);
    return {
      id: `order_${Math.random().toString(36).substring(7)}`,
      amount,
      currency: "INR",
      receipt,
      status: "created"
    };
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    // In a real scenario, verify Razorpay/Stripe signature
    console.log(`[MockPaymentGateway] Verifying payment signature for ${orderId}, ${paymentId}, ${signature}`);
    return true;
  }
}
