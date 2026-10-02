import { Card, CardContent } from '../../components/ui/Card'
import { Bell, CheckCircle, ShieldCheck, Calendar, CreditCard, XCircle, FileText } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  date: string
  isRead: boolean
  type: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO'
  category: 'MEMBERSHIP' | 'PAYMENT' | 'EVENT' | 'SECURITY'
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOT-001',
    title: 'Profile Change Approved',
    message: 'Your request to update your residential address has been approved by the Samithi admin team.',
    date: '2026-10-02T09:30:00Z',
    isRead: false,
    type: 'SUCCESS',
    category: 'SECURITY'
  },
  {
    id: 'NOT-002',
    title: 'Payment Successful',
    message: 'We have received your donation of ₹5,000 for the Annadana Trust. Thank you for your support.',
    date: '2026-09-30T14:20:00Z',
    isRead: false,
    type: 'SUCCESS',
    category: 'PAYMENT'
  },
  {
    id: 'NOT-003',
    title: 'Receipt Generated',
    message: 'A receipt for your recent transaction (TXN-5928) has been generated and is ready for download.',
    date: '2026-09-30T14:25:00Z',
    isRead: true,
    type: 'INFO',
    category: 'PAYMENT'
  },
  {
    id: 'NOT-004',
    title: 'Event Reminder: Medical Camp',
    message: 'The monthly free medical camp is scheduled for next Sunday at the main ashram. Volunteers are requested to report by 8:00 AM.',
    date: '2026-09-25T10:00:00Z',
    isRead: true,
    type: 'INFO',
    category: 'EVENT'
  },
  {
    id: 'NOT-005',
    title: 'Mobile Change Rejected',
    message: 'Your recent request to change your registered mobile number was rejected. Reason: Number already exists in the system.',
    date: '2026-09-10T11:45:00Z',
    isRead: true,
    type: 'ERROR',
    category: 'SECURITY'
  },
  {
    id: 'NOT-006',
    title: 'Membership Approved',
    message: 'Welcome to Amarnath Annadana Seva Samithi! Your Life Membership has been approved.',
    date: '2025-01-15T09:00:00Z',
    isRead: true,
    type: 'SUCCESS',
    category: 'MEMBERSHIP'
  }
]

export function Notifications() {
  const getIcon = (category: string, type: string) => {
    switch (category) {
      case 'PAYMENT': return <CreditCard className="w-5 h-5" />
      case 'EVENT': return <Calendar className="w-5 h-5" />
      case 'SECURITY': return type === 'ERROR' ? <XCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />
      case 'MEMBERSHIP': return <CheckCircle className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getColorClasses = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-100 text-gray-500 border-gray-200'
    
    switch (type) {
      case 'SUCCESS': return 'bg-green-100 text-green-700 border-green-200'
      case 'WARNING': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'ERROR': return 'bg-red-100 text-red-700 border-red-200'
      case 'INFO':
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-sand-200 pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary-900 flex items-center">
            <Bell className="w-6 h-6 mr-3 text-saffron-600" /> Notifications
          </h2>
          <p className="text-sm text-gray-500 mt-1">Important alerts and updates regarding your account</p>
        </div>
        <button className="text-sm font-medium text-saffron-600 hover:text-saffron-700 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {DUMMY_NOTIFICATIONS.map(notification => (
          <Card key={notification.id} className={`overflow-hidden transition-all ${!notification.isRead ? 'shadow-md border-l-4 border-l-saffron-500' : 'shadow-sm opacity-80'}`}>
            <CardContent className="p-0">
              <div className="flex items-start p-5">
                <div className={`p-3 rounded-full mr-4 flex-shrink-0 border ${getColorClasses(notification.type, notification.isRead)}`}>
                  {getIcon(notification.category, notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-lg ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 ml-4 whitespace-nowrap">
                      {new Date(notification.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  
                  {notification.title === 'Receipt Generated' && (
                    <button className="mt-3 text-xs font-bold text-saffron-600 flex items-center hover:underline">
                      <FileText className="w-3 h-3 mr-1" /> View Receipt
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
