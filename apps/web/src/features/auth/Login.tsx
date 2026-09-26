import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { authApi } from './api'
import { useAuthStore } from '../../store/authStore'
import { ShieldCheck } from 'lucide-react'

export function Login() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    
    setLoading(true)
    try {
      await authApi.requestOtp(phone)
      setStep('otp')
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (otp.length < 6) {
      setError('Please enter the 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const response = await authApi.verifyOtp(phone, otp)
      login(response.user, response.token)
      
      // Role-based redirect
      if (response.user.role === 'superadmin') {
        navigate('/superadmin')
      } else if (response.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/portal')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center mb-2">
            <ShieldCheck className="w-6 h-6 text-saffron-500" />
          </div>
          <CardTitle className="text-2xl text-primary-900">Secure Login</CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? 'Enter your mobile number to receive a One-Time Password.' 
              : `Enter the 6-digit OTP sent to +91 ${phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-200">
              {error}
            </div>
          )}
          
          {step === 'phone' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-900">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-sand-300 bg-sand-100 text-primary-700 sm:text-sm">
                    +91
                  </span>
                  <Input 
                    type="tel" 
                    placeholder="98765 43210" 
                    className="rounded-l-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-saffron-500 hover:bg-saffron-400 text-white" disabled={loading}>
                {loading ? 'Sending...' : 'Get OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-900">One-Time Password</label>
                <Input 
                  type="text" 
                  placeholder="123456" 
                  className="text-center tracking-[0.5em] font-mono text-lg"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
              <Button type="submit" className="w-full bg-saffron-500 hover:bg-saffron-400 text-white" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep('phone')}
                  className="text-sm text-primary-600 hover:text-saffron-500 transition-colors"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center border-t border-sand-100 pt-6">
          <p className="text-xs text-primary-500 text-center">
            For testing: Use any number for Member, 8888888888 for Admin, 9999999999 for Super Admin. OTP is 123456.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
