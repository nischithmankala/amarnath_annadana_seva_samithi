import React from 'react'
import { useAuthStore } from '../../store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { User as UserIcon, CreditCard, Calendar } from 'lucide-react'

export function MemberDashboard() {
  const user = useAuthStore(state => state.user)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-primary-900">Welcome, {user?.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Status</CardTitle>
            <UserIcon className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-900">Active</div>
            <p className="text-xs text-primary-700">ID: {user?.memberId}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Donations</CardTitle>
            <CreditCard className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-900">₹11,000</div>
            <p className="text-xs text-primary-700">Last donated on 15 Aug 2023</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Seva</CardTitle>
            <Calendar className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-primary-900">Yatra Camp '24</div>
            <p className="text-xs text-primary-700">Volunteer status: Pending</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Digital ID Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-sm h-48 bg-gradient-to-br from-primary-900 to-primary-700 rounded-xl p-6 text-sand-50 relative overflow-hidden shadow-lg border border-primary-600">
            <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h4 className="font-serif font-bold text-saffron-400">AMARNATH SEVA SAMITHI</h4>
                <p className="text-xs text-sand-100/80">Life Member</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold">
                {user?.name.charAt(0)}
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <p className="font-bold text-xl">{user?.name}</p>
              <p className="text-sm font-mono text-sand-100/80">{user?.memberId}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
