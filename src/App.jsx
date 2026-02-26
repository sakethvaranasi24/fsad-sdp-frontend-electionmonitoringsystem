import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import CitizenPortal from './Citizen/CitizenPortal'
import AdminDashboard from './Admin/AdminDashboard'
import DataAnalystsDashboard from './DataAnalysts/DataAnalystsDashboard'
import DistrictObserverDashboard from './ElectionObserver/DistrictObserverDashboard'
import ProtectedRoute from './ProtectedRoute'
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
        <Route path="/" element={<Dashboard onLogin={handleLogin} />} />
        <Route path="/home" element={<Dashboard onLogin={handleLogin} />} />
        <Route path="/about" element={<Dashboard onLogin={handleLogin} />} />
        <Route path="/elections" element={<Dashboard onLogin={handleLogin} />} />
        <Route path="/results" element={<Dashboard onLogin={handleLogin} />} />
        <Route path="/resources" element={<Dashboard onLogin={handleLogin} />} />
        <Route path="/contact" element={<Dashboard onLogin={handleLogin} />} />
        
        {/* Protected Routes - Require login */}
        <Route 
          path="/citizen" 
          element={
            userRole === 'citizen' ? (
              <CitizenPortal onLogout={handleLogout} />
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
              <DataAnalystsDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route
          path="/electionobserver"
          element={
            <ProtectedRoute allowedRoles={['electionobserver']} userRole={userRole}>
              <DistrictObserverDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
