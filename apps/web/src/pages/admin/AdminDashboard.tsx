import React from 'react'
import { useAuthStore } from '../../store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Users, FileText, CheckCircle } from 'lucide-react'

export function AdminDashboard() {
  const user = useAuthStore(state => state.user)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-primary-900">Admin Portal</h2>
        <p className="text-sm text-primary-700">Welcome, {user?.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Memberships</CardTitle>
            <Users className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-900">12</div>
            <p className="text-xs text-primary-700">Require review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteer Applications</CardTitle>
            <FileText className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-900">45</div>
            <p className="text-xs text-primary-700">For Yatra Camp '24</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Media</CardTitle>
            <CheckCircle className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-900">128</div>
            <p className="text-xs text-primary-700">Photos in gallery</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm border-b border-sand-200 pb-2">
              <span className="font-semibold text-primary-900">Suresh Reddy</span> submitted a membership application.
              <div className="text-xs text-primary-500">2 hours ago</div>
            </div>
            <div className="text-sm border-b border-sand-200 pb-2">
              <span className="font-semibold text-primary-900">Ram Kumar</span> updated profile information.
              <div className="text-xs text-primary-500">5 hours ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
