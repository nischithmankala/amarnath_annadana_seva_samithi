import { Outlet, Link, useNavigate } from "react-router-dom"
import { LogOut, Home, User, CreditCard, Users, Shield } from "lucide-react"
import { useAuthStore } from "../../store/authStore"

export function PortalLayout() {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const role = user?.role || 'member'
  
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user) {
    // Basic protection, the actual route guard handles redirection
    return null
  }

  return (
    <div className="min-h-screen flex bg-sand-50 font-sans text-primary-900">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-sand-200 hidden md:flex flex-col">
        <div className="p-4 h-20 flex items-center border-b border-sand-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center text-white font-bold font-serif text-sm">
              A
            </div>
            <span className="font-serif font-semibold text-primary-900">Samithi Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <Link to="/portal" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-sand-100 text-primary-900">
            <Home className="w-4 h-4 mr-3 text-primary-600" />
            Dashboard
          </Link>
          <Link to="/portal/profile" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <User className="w-4 h-4 mr-3 text-primary-600" />
            My Profile
          </Link>
          <Link to="/portal/family" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <Users className="w-4 h-4 mr-3 text-primary-600" />
            Family Members
          </Link>
          <Link to="/portal/card" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <Shield className="w-4 h-4 mr-3 text-primary-600" />
            Membership Card
          </Link>
          <Link to="/portal/payments" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <CreditCard className="w-4 h-4 mr-3 text-primary-600" />
            Payments & Receipts
          </Link>
          <Link to="/portal/events" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <svg className="w-4 h-4 mr-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Events
          </Link>
          <Link to="/portal/volunteer" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <svg className="w-4 h-4 mr-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Volunteer
          </Link>
          <Link to="/portal/privacy" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <svg className="w-4 h-4 mr-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Privacy & Visibility
          </Link>
          <Link to="/portal/change-mobile" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <svg className="w-4 h-4 mr-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            Change Mobile Number
          </Link>
          <Link to="/portal/notifications" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <svg className="w-4 h-4 mr-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            Notifications
          </Link>
          <Link to="/portal/help" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <svg className="w-4 h-4 mr-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Help / Contact
          </Link>

          {role === 'admin' && (
            <Link to="/admin" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-saffron-500 hover:bg-sand-50 mt-4 border border-sand-200">
              <Shield className="w-4 h-4 mr-3 text-saffron-500" />
              Admin Access
            </Link>
          )}
        </nav>
        
        <div className="p-4 border-t border-sand-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-sand-200 bg-surface flex items-center px-4 justify-end">
           {/* Mobile menu button would go here */}
           <div className="flex items-center space-x-4">
             <span className="text-sm font-medium text-primary-700">{user.memberId || 'Admin'}</span>
             <div className="w-8 h-8 rounded-full bg-saffron-500 text-white flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
             </div>
           </div>
        </header>
        <div className="p-6 flex-1 overflow-y-auto bg-sand-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
