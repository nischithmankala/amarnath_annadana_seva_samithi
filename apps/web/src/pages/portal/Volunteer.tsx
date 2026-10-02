import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Calendar, User, Phone, CheckCircle, Clock, XCircle, ChevronRight, HandHeart } from 'lucide-react'

interface VolunteerRegistration {
  id: string
  event: string
  date: string
  status: 'submitted' | 'approved' | 'rejected' | 'assigned'
  skills: string
}

const DUMMY_HISTORY: VolunteerRegistration[] = [
  {
    id: 'VOL-2025-01',
    event: 'Amarnath Yatra Seva 2025',
    date: '2025-05-10T10:00:00Z',
    status: 'assigned',
    skills: 'Cooking, Crowd Control'
  },
  {
    id: 'VOL-2026-02',
    event: 'Maha Shivaratri Annadana Camp',
    date: '2026-01-15T09:00:00Z',
    status: 'submitted',
    skills: 'Food Serving, Cleaning'
  }
]

export function Volunteer() {
  const [activeTab, setActiveTab] = useState<'REGISTER' | 'HISTORY'>('REGISTER')
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    skills: '',
    event: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      setFormData({ name: '', contact: '', skills: '', event: '' })
      setTimeout(() => setShowSuccess(false), 5000)
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> Assigned</span>
      case 'approved':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1"/> Approved</span>
      case 'rejected':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/> Rejected</span>
      case 'submitted':
      default:
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1"/> Submitted</span>
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary-900">Volunteer Seva</h2>
          <p className="text-sm text-gray-500">Offer your services for Samithi events</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-1 inline-flex shadow-sm border border-sand-200">
        <button 
          onClick={() => setActiveTab('REGISTER')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'REGISTER' ? 'bg-saffron-500 text-white shadow' : 'text-gray-600 hover:bg-sand-50'}`}
        >
          <HandHeart className="w-4 h-4 mr-2" /> Register as Volunteer
        </button>
        <button 
          onClick={() => setActiveTab('HISTORY')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'HISTORY' ? 'bg-saffron-500 text-white shadow' : 'text-gray-600 hover:bg-sand-50'}`}
        >
          My Applications
        </button>
      </div>

      {activeTab === 'REGISTER' ? (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Volunteer Registration</CardTitle>
          </CardHeader>
          <CardContent>
            {showSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-12 h-12 mb-4 text-green-500" />
                <h4 className="font-bold text-lg mb-2">Application Submitted!</h4>
                <p className="text-sm">Your volunteer application has been submitted successfully. The Samithi administration will review it and assign duties accordingly.</p>
                <Button onClick={() => setActiveTab('HISTORY')} className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                  View My Applications
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm border py-2" 
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="tel" 
                        required
                        value={formData.contact}
                        onChange={e => setFormData({...formData, contact: e.target.value})}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm border py-2" 
                        placeholder="Your mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
                    <select 
                      required
                      value={formData.event}
                      onChange={e => setFormData({...formData, event: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm border py-2 px-3 bg-white"
                    >
                      <option value="">-- Choose an upcoming event --</option>
                      <option value="Maha Shivaratri Annadana Camp">Maha Shivaratri Annadana Camp</option>
                      <option value="Monthly Medical Camp">Monthly Medical Camp</option>
                      <option value="Amarnath Yatra Seva 2026">Amarnath Yatra Seva 2026</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Skills / Preferred Seva</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.skills}
                      onChange={e => setFormData({...formData, skills: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm border py-2 px-3" 
                      placeholder="E.g., Cooking, Food serving, Crowd management, Medical background..."
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">Mention any relevant skills that can help us assign the right duties to you.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary-900 hover:bg-primary-800 text-white px-8"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {DUMMY_HISTORY.map(app => (
            <Card key={app.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                <div className="bg-sand-50 p-6 flex flex-col justify-center border-r border-sand-100 sm:w-1/4">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Registration Date</p>
                  <p className="font-bold text-primary-900">
                    {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{app.id}</p>
                </div>
                <div className="p-6 flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="space-y-2 mb-4 sm:mb-0">
                    <div>
                      <h4 className="text-lg font-bold text-primary-900">{app.event}</h4>
                    </div>
                    <div className="text-sm text-gray-600 flex items-start">
                      <span className="font-medium mr-2">Skills:</span> {app.skills}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(app.status)}
                    {app.status === 'assigned' && (
                      <button className="text-xs text-saffron-600 hover:text-saffron-700 font-medium flex items-center mt-2">
                        View Assignment Details <ChevronRight className="w-3 h-3 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
