import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { User as UserIcon, CreditCard, Calendar, Activity, Download, List, Users } from 'lucide-react'
import { api } from '../../lib/api'
import { Link } from 'react-router-dom'
import { DigitalMemberCard } from '../../components/portal/DigitalMemberCard'

export function MemberDashboard() {
  const user = useAuthStore(state => state.user)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/member/dashboard')
        if (response.data.success) {
          setData(response.data.data)
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-primary-600">Loading dashboard...</div>
  }

  if (!data?.member) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Member profile not found.</h2>
        <p className="text-gray-600">Please contact support or wait for your membership approval.</p>
      </div>
    )
  }

  const { member, paymentSummary, recentTransactions } = data

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-primary-900">Welcome, {member.name}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Membership Status Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">Membership Status</CardTitle>
            <UserIcon className="h-5 w-5 text-saffron-500" />
          </CardHeader>
          <CardContent className="space-y-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Member ID:</span>
              <span className="font-bold text-primary-900">{member.memberId || 'Pending'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${member.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {member.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Joining Date:</span>
              <span className="font-medium text-primary-900">{member.joiningDate ? new Date(member.joiningDate).toLocaleDateString() : 'Pending'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Category:</span>
              <span className="font-medium text-primary-900">{member.category || 'Life Member'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Validity:</span>
              <span className="font-medium text-primary-900">Lifetime</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">Payment Summary</CardTitle>
            <CreditCard className="h-5 w-5 text-saffron-500" />
          </CardHeader>
          <CardContent className="space-y-3 mt-2">
            <div className="flex justify-between text-sm border-b pb-2">
              <span className="text-gray-500">Total Paid:</span>
              <span className="font-bold text-primary-900">₹{paymentSummary.totalPaid?.toLocaleString() || '0'}</span>
            </div>
            {recentTransactions && recentTransactions[0] ? (
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase font-bold">Latest Payment</div>
                <div className="flex justify-between text-sm">
                  <span>₹{recentTransactions[0].amount}</span>
                  <span className="text-green-600 font-medium">{recentTransactions[0].status}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{recentTransactions[0].receiptNumber || 'No Receipt'}</span>
                  <span>{new Date(recentTransactions[0].createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No recent payments</div>
            )}
            <Link to="/portal/payments" className="block text-center text-sm text-saffron-600 hover:text-saffron-700 font-medium mt-2">
              View All Receipts →
            </Link>
          </CardContent>
        </Card>
        
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">My Profile</CardTitle>
            <UserIcon className="h-5 w-5 text-saffron-500" />
          </CardHeader>
          <CardContent className="space-y-3 mt-2 flex flex-col h-[calc(100%-3rem)]">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-saffron-100 text-saffron-600 rounded-full flex items-center justify-center font-bold text-lg">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-primary-900">{member.name}</p>
                <p className="text-xs text-gray-500">{user?.phone}</p>
              </div>
            </div>
            <div className="mt-auto space-y-2 pt-4">
              <Link to="/portal/profile" className="block w-full text-center py-2 bg-sand-100 hover:bg-sand-200 text-primary-800 rounded-md text-sm font-medium transition-colors">
                View Full Profile
              </Link>
              <Link to="/portal/profile?edit=true" className="block w-full text-center py-2 bg-white border border-sand-300 hover:bg-sand-50 text-primary-700 rounded-md text-sm font-medium transition-colors">
                Request Profile Update
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Virtual Membership Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-md font-bold">Virtual Membership Card</CardTitle>
            <Link to="/portal/card" className="text-sm text-saffron-600 hover:text-saffron-700 font-medium">
              View Full Card →
            </Link>
          </CardHeader>
          <CardContent className="flex justify-center bg-sand-50 py-4 rounded-b-lg border-t border-sand-100">
            {member.status === 'APPROVED' ? (
              <DigitalMemberCard profile={member} className="max-w-md transform scale-90 sm:scale-100 origin-top" />
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 w-full max-w-md">
                <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">ID card will be available once membership is approved.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Family Members Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">Family Members</CardTitle>
              <Users className="h-5 w-5 text-saffron-500" />
            </CardHeader>
            <CardContent className="mt-2 text-center py-4">
              <div className="text-3xl font-bold text-primary-900 mb-1">{data?.familyMembersCount || 0}</div>
              <p className="text-sm text-gray-500 mb-4">Registered Members</p>
              <Link to="/portal/family" className="inline-block w-full text-center py-2 bg-sand-100 hover:bg-sand-200 text-primary-800 rounded-md text-sm font-medium transition-colors">
                View Family →
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Events Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-bold">Upcoming Events</CardTitle>
              <Calendar className="h-5 w-5 text-saffron-500" />
            </CardHeader>
            <CardContent className="mt-2 text-center py-4">
              <div className="text-3xl font-bold text-primary-900 mb-1">{data?.upcomingEventsCount || 0}</div>
              <p className="text-sm text-gray-500 mb-4">Events Scheduled</p>
              <Link to="/portal/events" className="inline-block w-full text-center py-2 bg-sand-100 hover:bg-sand-200 text-primary-800 rounded-md text-sm font-medium transition-colors">
                View Events →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
