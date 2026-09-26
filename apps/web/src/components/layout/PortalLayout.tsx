import React from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/Button"
import { LogOut, Home, User, Settings, CreditCard, Users, Shield } from "lucide-react"
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
          <Link to="/portal/payments" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <CreditCard className="w-4 h-4 mr-3 text-primary-600" />
            Payments & Receipts
          </Link>
          <Link to="/portal/directory" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 hover:bg-sand-50 hover:text-primary-900">
            <Users className="w-4 h-4 mr-3 text-primary-600" />
            Member Directory
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
