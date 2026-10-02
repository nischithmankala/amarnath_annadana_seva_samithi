import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Smartphone, CheckCircle, Clock, XCircle, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface MobileRequest {
  id: string
  newNumber: string
  date: string
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED'
  reason?: string
}

const DUMMY_REQUESTS: MobileRequest[] = [
  {
    id: 'REQ-918',
    newNumber: '+91 9876543210',
    date: '2026-09-28T14:30:00Z',
    status: 'REJECTED',
    reason: 'Number already associated with another active member profile.'
  },
  {
    id: 'REQ-922',
    newNumber: '+91 8888888888',
    date: '2026-10-01T10:15:00Z',
    status: 'VERIFIED'
  }
]

export function ChangeMobile() {
  const user = useAuthStore(state => state.user)
  const [activeTab, setActiveTab] = useState<'REQUEST' | 'HISTORY'>('REQUEST')
  const [step, setStep] = useState<1 | 2 | 3>(1) // 1: Input, 2: OTP, 3: Success
  const [newNumber, setNewNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (newNumber === user?.phone) {
      setError('New number cannot be the same as your current number.')
      return
    }
    if (newNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }
    
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(2) // Move to OTP verification
    }, 1200)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 6) {
      setError('Please enter the 6-digit OTP.')
      return
    }
    
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(3) // Move to Success
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> Approved</span>
      case 'VERIFIED':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800"><ShieldCheck className="w-3 h-3 mr-1"/> Verified (Pending Admin)</span>
      case 'REJECTED':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/> Rejected</span>
      case 'PENDING':
      default:
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1"/> Pending Verification</span>
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary-900">Change Mobile Number</h2>
          <p className="text-sm text-gray-500">Update your registered login mobile number securely.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-1 inline-flex shadow-sm border border-sand-200">
        <button 
          onClick={() => setActiveTab('REQUEST')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'REQUEST' ? 'bg-saffron-500 text-white shadow' : 'text-gray-600 hover:bg-sand-50'}`}
        >
          <Smartphone className="w-4 h-4 mr-2" /> Request Change
        </button>
        <button 
          onClick={() => setActiveTab('HISTORY')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'HISTORY' ? 'bg-saffron-500 text-white shadow' : 'text-gray-600 hover:bg-sand-50'}`}
        >
          <Clock className="w-4 h-4 mr-2" /> Request History
        </button>
      </div>

      {activeTab === 'REQUEST' ? (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Update Mobile Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="bg-sand-50 p-4 rounded-lg border border-sand-200">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Number</label>
                  <p className="text-lg font-mono font-medium text-gray-900">{user?.phone || '+91 9999999999'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">+91</span>
                    </div>
                    <input 
                      type="tel" 
                      required
                      value={newNumber}
                      onChange={e => setNewNumber(e.target.value.replace(/\D/g, ''))}
                      className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 text-lg py-3 border" 
                      placeholder="Enter 10 digit number"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    An OTP will be sent to the new number to verify ownership. After verification, admin approval is required before the change takes effect.
                  </p>
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

                <Button 
                  type="submit" 
                  disabled={loading || newNumber.length < 10}
                  className="w-full bg-primary-900 hover:bg-primary-800 text-white py-6"
                >
                  {loading ? 'Validating...' : 'Send OTP to New Number'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-saffron-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Verify New Number</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the 6-digit OTP sent to <span className="font-bold text-gray-900">+91 {newNumber}</span>
                  </p>
                </div>

                <div className="flex justify-center mb-6">
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-48 text-center text-3xl tracking-[0.5em] font-mono border-b-2 border-gray-300 focus:border-saffron-500 focus:ring-0 px-2 py-2 outline-none"
                    placeholder="------"
                    maxLength={6}
                  />
                </div>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                <Button 
                  type="submit" 
                  disabled={loading || otp.length < 6}
                  className="w-full bg-primary-900 hover:bg-primary-800 text-white py-6"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-saffron-600 font-medium mt-4 hover:underline"
                >
                  Change Mobile Number
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <ShieldCheck className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Number Verified Successfully</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Your new mobile number has been verified. A request has been sent to the Samithi administrators for final approval. Your login number will change only after approval.
                </p>
                <Button onClick={() => { setActiveTab('HISTORY'); setStep(1); setNewNumber(''); setOtp('') }} className="bg-primary-900 text-white">
                  View Request Status
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {DUMMY_REQUESTS.map(req => (
            <Card key={req.id}>
              <div className="flex flex-col sm:flex-row">
                <div className="bg-sand-50 p-6 flex flex-col justify-center border-r border-sand-100 sm:w-1/3">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Request Date</p>
                  <p className="font-bold text-primary-900">
                    {new Date(req.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{req.id}</p>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Requested Number</p>
                      <p className="text-lg font-bold text-gray-900 font-mono">{req.newNumber}</p>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                  
                  {req.status === 'REJECTED' && req.reason && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100 flex items-start">
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Rejection Reason:</strong> {req.reason}</span>
                    </div>
                  )}
                  {req.status === 'VERIFIED' && (
                    <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded border border-blue-100">
                      This request has passed OTP verification and is currently waiting in the admin queue for final security approval.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
