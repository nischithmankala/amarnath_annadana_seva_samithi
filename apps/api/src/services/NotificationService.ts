export interface INotificationService {
  sendOTP(to: string, otp: string): Promise<boolean>;
}

export class MockNotificationService implements INotificationService {
  async sendOTP(to: string, otp: string): Promise<boolean> {
    console.log(`[MockNotificationService] Sending OTP ${otp} to ${to}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
}
