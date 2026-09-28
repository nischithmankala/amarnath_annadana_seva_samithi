import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { authApi } from './api'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import { ShieldCheck } from 'lucide-react'

export function Login() {
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [regData, setRegData] = useState({ name: '', email: '', mobile: '', address: '', city: '' })
  const [familyMembers, setFamilyMembers] = useState<{name: string, relationship: string, dob: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!regData.name || !regData.mobile) {
      setError('Name and Mobile are required')
      return
    }

    setLoading(true)
    try {
      const intentRes = await api.post('/memberships/intent', {
        ...regData,
        familyMembers,
        category: 'Life Member'
      })
      
      const { transactionRef, gatewayOrder } = intentRes.data.data

      await api.post('/memberships/verify', {
        transactionRef,
        gatewayPaymentId: gatewayOrder?.id || 'mock_payment_id',
        gatewaySignature: 'dummy_signature'
      })

      setSuccess('Payment of ₹1,52,000 successful! Membership Approved. You can now login.')
      setStep('phone')
      setPhone(regData.mobile)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.')
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
              : step === 'register'
              ? 'Fill in your details and pay ₹1,52,000 to become a Life Member.'
              : `Enter the 6-digit OTP sent to +91 ${phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4 border border-green-200">
              {success}
            </div>
          )}
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
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep('register')}
                  className="text-sm text-primary-600 hover:text-saffron-500 transition-colors"
                >
                  Don't have an account? Join as a Member
                </button>
              </div>
            </form>
          ) : step === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-900">Full Name</label>
                <Input value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} placeholder="Full Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-900">Mobile Number</label>
                <Input value={regData.mobile} onChange={e => setRegData({...regData, mobile: e.target.value})} placeholder="+91" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-900">Email Address</label>
                <Input type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} placeholder="Email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-900">City</label>
                <Input value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})} placeholder="City" />
              </div>
              
              <div className="pt-2 border-t border-sand-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-primary-900">Family Members</label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setFamilyMembers([...familyMembers, {name: '', relationship: '', dob: ''}])}
                  >
                    + Add
                  </Button>
                </div>
                {familyMembers.map((member, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2 p-2 bg-sand-100 rounded">
                    <Input 
                      placeholder="Name" 
                      value={member.name} 
                      onChange={e => {
                        const newFm = [...familyMembers];
                        newFm[index].name = e.target.value;
                        setFamilyMembers(newFm);
                      }} 
                    />
                    <Input 
                      placeholder="Relation" 
                      value={member.relationship} 
                      onChange={e => {
                        const newFm = [...familyMembers];
                        newFm[index].relationship = e.target.value;
                        setFamilyMembers(newFm);
                      }} 
                    />
                    <div className="flex items-center gap-1">
                      <Input 
                        type="date" 
                        value={member.dob} 
                        onChange={e => {
                          const newFm = [...familyMembers];
                          newFm[index].dob = e.target.value;
                          setFamilyMembers(newFm);
                        }} 
                      />
                      <button 
                        type="button" 
                        className="text-red-500 font-bold px-2"
                        onClick={() => {
                          const newFm = [...familyMembers];
                          newFm.splice(index, 1);
                          setFamilyMembers(newFm);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full bg-saffron-500 hover:bg-saffron-400 text-white" disabled={loading}>
                {loading ? 'Processing...' : 'Pay ₹1,52,000 & Register'}
              </Button>
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep('phone')}
                  className="text-sm text-primary-600 hover:text-saffron-500 transition-colors"
                >
                  Already a member? Login
                </button>
              </div>
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
