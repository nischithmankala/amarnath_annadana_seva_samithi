import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { PortalLayout } from './components/layout/PortalLayout'
import { Home } from './pages/public/Home'
import { Donate } from './pages/public/Donate'
import { About } from './pages/public/About'
import { Events } from './pages/public/Events'
import { Gallery } from './pages/public/Gallery'
import { Login } from './features/auth/Login'
import { MemberDashboard } from './pages/portal/MemberDashboard'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard'
import { useAuthStore } from './store/authStore'
import { Navigate } from 'react-router-dom'

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If they have a role but it's not allowed for this route, bounce them to their respective default portal
    if (user.role === 'superadmin') return <Navigate to="/superadmin" replace />
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    return <Navigate to="/portal" replace />
  }

  return <>{children}</>
}

// Placeholder for other pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-[50vh]">
    <h2 className="text-2xl font-serif text-primary-900">{title}</h2>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Placeholder title="Contact Us" />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/join" element={<Placeholder title="Join as Member Flow" />} />
          <Route path="/volunteer" element={<Placeholder title="Volunteer Flow" />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Portal Routes (Member only usually, but admin/superadmin can access their own versions) */}
        <Route path="/portal" element={
          <ProtectedRoute allowedRoles={['member']}>
            <PortalLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MemberDashboard />} />
          <Route path="profile" element={<Placeholder title="My Profile" />} />
          <Route path="payments" element={<Placeholder title="My Payments" />} />
          <Route path="directory" element={<Placeholder title="Member Directory" />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PortalLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Super Admin Routes */}
        <Route path="/superadmin" element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <PortalLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SuperAdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
