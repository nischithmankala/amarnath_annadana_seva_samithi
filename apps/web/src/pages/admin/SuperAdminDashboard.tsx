import { useAuthStore } from '../../store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Settings, ShieldAlert, Database } from 'lucide-react'

export function SuperAdminDashboard() {
  const user = useAuthStore(state => state.user)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-primary-900">Super Admin Console</h2>
        <p className="text-sm text-primary-700">Welcome, {user?.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Database className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">All Systems Go</div>
            <p className="text-xs text-primary-700">API latency: 45ms</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <ShieldAlert className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-900">4</div>
            <p className="text-xs text-primary-700">Across 3 regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Config</CardTitle>
            <Settings className="h-4 w-4 text-saffron-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-900">v1.0.4</div>
            <p className="text-xs text-primary-700">Last updated today</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
