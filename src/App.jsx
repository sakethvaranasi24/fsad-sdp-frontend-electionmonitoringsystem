import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CitizenDashboard from './Citizen/Dashboard'
import AdminDashboard from './Admin/AdminDashboard'
import DataAnalystDashboard from './DataAnalysts/Dashboard'
import ElectionObserverDashboard from './ElectionObserver/Dashboard'
import RoleSelection from './pages/RoleSelection'
import AdminLogin from './pages/AdminLogin'
import CitizenLogin from './pages/CitizenLogin'
import DataAnalystLogin from './pages/DataAnalystLogin'
import ElectionObserverLogin from './pages/ElectionObserverLogin'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

const CURRENT_USER_KEY = 'user'

function normalizeRoleToAppRole(value) {
  if (!value || typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toUpperCase()

  if (normalized === 'ADMIN') return 'admin'
  if (normalized === 'CITIZEN') return 'citizen'
  if (normalized === 'DATA_ANALYST' || normalized === 'DATAANALYSTS' || normalized === 'DATA_ANALYSTS') return 'dataanalysts'
  if (normalized === 'ELECTION_OBSERVER' || normalized === 'ELECTIONOBSERVER' || normalized === 'OBSERVER') return 'electionobserver'

  const fallback = value.trim().toLowerCase()
  if (fallback === 'admin' || fallback === 'citizen' || fallback === 'dataanalysts' || fallback === 'electionobserver') {
    return fallback
  }

  return null
}

function getInitialRole() {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY)
  if (!currentUser) {
    return null
  }

  try {
    const parsedUser = JSON.parse(currentUser)
    return normalizeRoleToAppRole(parsedUser?.role)
  } catch {
    return null
  }
}

function App() {
  const [userRole, setUserRole] = useState(() => getInitialRole())

  const handleLogin = (role, profile) => {
    const normalizedRole = normalizeRoleToAppRole(role) || normalizeRoleToAppRole(profile?.role)
    setUserRole(normalizedRole)
  }

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY)
    setUserRole(null)
  }

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/home" element={<RoleSelection />} />
        <Route path="/about" element={<RoleSelection />} />
        <Route path="/elections" element={<RoleSelection />} />
        <Route path="/results" element={<RoleSelection />} />
        <Route path="/resources" element={<RoleSelection />} />
        <Route path="/contact" element={<RoleSelection />} />
        <Route path="/login/admin" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="/login/citizen" element={<CitizenLogin onLogin={handleLogin} />} />
        <Route path="/login/dataanalyst" element={<DataAnalystLogin onLogin={handleLogin} />} />
        <Route path="/login/electionobserver" element={<ElectionObserverLogin onLogin={handleLogin} />} />
        
        {/* Protected Routes - Require login */}
        <Route 
          path="/citizen" 
          element={
            userRole === 'citizen' ? (
              <CitizenDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={
            userRole === 'admin' ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/dataanalysts" 
          element={
            userRole === 'dataanalysts' ? (
              <DataAnalystDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route
          path="/electionobserver"
          element={
            userRole === 'electionobserver' ? (
              <ElectionObserverDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
