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
import './App.css'

function App() {
  const [userRole, setUserRole] = useState(null)

  const handleLogin = (role) => {
    setUserRole(role)
  }

  const handleLogout = () => {
    setUserRole(null)
  }

  return (
    <Router>
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
