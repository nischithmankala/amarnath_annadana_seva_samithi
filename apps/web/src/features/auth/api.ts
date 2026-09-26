import type { User } from '../../store/authStore'

export interface LoginResponse {
  user: User
  token: string
}

// Mock API functions for development
export const authApi = {
  requestOtp: async (phone: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'OTP sent successfully to ' + phone })
      }, 1000)
    })
  },

  verifyOtp: async (phone: string, otp: string): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === '123456') { // Mock valid OTP
          // Determine role based on phone number for mock purposes
          let role: 'member' | 'admin' | 'superadmin' = 'member'
          if (phone === '9999999999') role = 'superadmin'
          if (phone === '8888888888') role = 'admin'

          resolve({
            user: {
              id: 'u1',
              name: role === 'member' ? 'Ram Kumar' : role === 'admin' ? 'Admin Manager' : 'Super Admin',
              phone,
              role,
              memberId: role === 'member' ? 'AMS-2023-001' : undefined
            },
            token: 'mock-jwt-token-xyz'
          })
        } else {
          reject(new Error('Invalid OTP'))
        }
      }, 1000)
    })
  }
}
