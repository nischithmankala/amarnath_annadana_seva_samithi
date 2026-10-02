import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { PortalLayout } from './components/layout/PortalLayout'
import { Home } from './pages/public/Home'
import { Donate } from './pages/public/Donate'
import { About } from './pages/public/About'
import { Gallery } from './pages/public/Gallery'
import { Login } from './features/auth/Login'
import { MemberDashboard } from './pages/portal/MemberDashboard'
import { MyProfile } from './pages/portal/MyProfile'
import { FamilyMembers } from './pages/portal/FamilyMembers'
import { MembershipCard } from './pages/portal/MembershipCard'
import { Events } from './pages/portal/Events'
import { Volunteer } from './pages/portal/Volunteer'
import { ChangeMobile } from './pages/portal/ChangeMobile'
import { Notifications } from './pages/portal/Notifications'
import { HelpContact } from './pages/portal/HelpContact'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard'
import { TransactionStatement } from './pages/portal/TransactionStatement'  
import { useAuthStore } from './store/authStore'
import { Navigate } from 'react-router-dom'

import { ReceiptViewer } from './pages/public/ReceiptViewer'

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
    if (user.role === 'member') return <Navigate to="/portal" replace />
    // If they are public/unauthorized for the role, send them back to home
    return <Navigate to="/" replace />
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
          <Route path="/sponsors" element={<Placeholder title="Sponsors" />} />
          <Route path="/member-login" element={<Login />} />
          <Route path="/admin-login" element={<Login />} />
          <Route path="/superadmin-login" element={<Login />} />
          {/* <Route path="/donate" element={<Donate />} /> */}
          <Route path="/receipt" element={<ReceiptViewer />} />
          <Route path="/receipt/:id" element={<ReceiptViewer />} />
          <Route path="/volunteer" element={<Placeholder title="Volunteer Flow" />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Portal Routes (Member only usually, but admin/superadmin can access their own versions) */}
        <Route path="/portal" element={
          <ProtectedRoute allowedRoles={['MEMBER', 'member']}>
            <PortalLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MemberDashboard />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="family" element={<FamilyMembers />} />
          <Route path="card" element={<MembershipCard />} />
          <Route path="payments" element={<Placeholder title="My Payments" />} />
          <Route path="transactions" element={<TransactionStatement />} />
          <Route path="events" element={<Events />} />
          <Route path="directory" element={<Placeholder title="Member Directory" />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="privacy" element={<Placeholder title="Privacy & Visibility" />} />
          <Route path="change-mobile" element={<ChangeMobile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="help" element={<HelpContact />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'admin']}>
            <PortalLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Super Admin Routes */}
        <Route path="/superadmin" element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'superadmin']}>
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
