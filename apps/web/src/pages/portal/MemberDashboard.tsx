import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { User as UserIcon, CreditCard, Calendar, Activity, Download, List } from 'lucide-react'
import { api } from '../../lib/api'
import { Link } from 'react-router-dom'

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
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${member.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {member.status}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member ID</CardTitle>
            <UserIcon className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary-900">{member.memberId || 'Pending'}</div>
            <p className="text-xs text-primary-700 mt-1">{member.category || 'Member'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary-900">₹{paymentSummary.totalPaid.toLocaleString()}</div>
            <p className="text-xs text-primary-700 mt-1">{paymentSummary.successfulCount} successful transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Joining Date</CardTitle>
            <Calendar className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-primary-900">
              {member.joiningDate ? new Date(member.joiningDate).toLocaleDateString() : 'Pending'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Digital ID Card</CardTitle>
          </CardHeader>
          <CardContent>
            {member.status === 'APPROVED' ? (
              <div className="w-full max-w-sm h-48 bg-gradient-to-br from-primary-900 to-primary-700 rounded-xl p-6 text-sand-50 relative overflow-hidden shadow-lg border border-primary-600">
                <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h4 className="font-serif font-bold text-saffron-400">AMARNATH SEVA SAMITHI</h4>
                    <p className="text-xs text-sand-100/80">{member.category || 'Life Member'}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <div className="mt-8 relative z-10">
                  <p className="font-bold text-xl">{member.name}</p>
                  <p className="text-sm font-mono text-sand-100/80">{member.memberId}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">ID card will be available once membership is approved.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link to="/portal/transactions" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              <List className="h-4 w-4" /> View All
            </Link>
          </CardHeader>
          <CardContent>
            {recentTransactions && recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((tx: any) => (
                  <div key={tx.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{tx.purpose}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-700">₹{tx.amount}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${tx.status === 'SUCCESSFUL' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                No transactions found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
