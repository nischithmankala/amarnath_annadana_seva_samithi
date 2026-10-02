import { api } from '../../lib/api'
import type { User } from '../../store/authStore'

export interface LoginResponse {
  user: User
  token: string
}


export const authApi = {
  requestOtp: async (phone: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/auth/request-otp', { identity: phone })
    return res.data
  },

  verifyOtp: async (phone: string, otp: string): Promise<LoginResponse> => {
    try {
      const res = await api.post('/auth/verify-otp', { identity: phone, otp })
      if (res.data.success) {
        // Map backend user to frontend expected shape
        const backendUser = res.data.data.user
        const mappedUser: User = {
          id: backendUser.id,
          name: backendUser.name || 'User', // Backend might not return name directly in verifyOtp
          phone: phone,
          role: backendUser.role.toLowerCase() as any, // Map 'MEMBER' to 'member'
          memberId: backendUser.memberId
        }
        return {
          user: mappedUser,
          token: res.data.data.token
        }
      }
      throw new Error('Invalid OTP')
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Invalid OTP')
    }
  }
}
