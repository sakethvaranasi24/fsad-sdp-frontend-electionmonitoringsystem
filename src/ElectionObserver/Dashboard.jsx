import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ElectionObserverProfessional.css';
import ObserverSidebar from './ObserverSidebar';

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const observerProfile = {
    name: 'Observer User',
    email: 'observer@system.com',
    phone: '+91 98765 43210',
    observerId: 'OBS-' + Date.now(),
    status: 'Active',
    district: 'Central District',
    assignedStations: 5
  };

  const observerInitials = observerProfile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'assigned':
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>Assigned Stations</h2>
                <p>View your assigned polling stations</p>
              </div>
            </div>
            <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
              <p>You are assigned to 5 polling stations in Central District.</p>
            </div>
          </div>
        );
      case 'verify':
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>Verify Voters</h2>
                <p>Verify voter information and eligibility</p>
              </div>
            </div>
            <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
              <p>Verification system ready for election day.</p>
            </div>
          </div>
        );
      case 'submission':
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>Submit Report</h2>
                <p>Submit your observation report</p>
              </div>
            </div>
            <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
              <p>Report submission form available during election period.</p>
            </div>
          </div>
        );
      case 'monitoring':
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>Live Monitoring</h2>
                <p>Real-time election monitoring dashboard</p>
              </div>
            </div>
            <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
              <p>🔴 Live monitoring will be active during elections.</p>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>Dashboard Overview</h2>
                <p>Welcome to the Observer Panel. Monitor elections and submit reports.</p>
              </div>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-icon">📍</div>
                <h3>Assigned Stations</h3>
                <p>View your assigned polling stations</p>
                <button className="card-btn" onClick={() => setActiveTab('assigned')}>
                  View Stations
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">✓</div>
                <h3>Verify Voters</h3>
                <p>Verify voter information and eligibility</p>
                <button className="card-btn" onClick={() => setActiveTab('verify')}>
                  Verify
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">📝</div>
                <h3>Submit Report</h3>
                <p>Submit your observation report</p>
                <button className="card-btn" onClick={() => setActiveTab('submission')}>
                  Submit
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">🔴</div>
                <h3>Live Monitoring</h3>
                <p>Real-time election monitoring</p>
                <button className="card-btn" onClick={() => setActiveTab('monitoring')}>
                  Monitor
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="observer-dashboard-wrapper">
      <div className="observer-header">
        <div className="observer-header-left">
          <h1>Election Monitoring System</h1>
          <p style={{ marginTop: '4px', fontSize: '0.95rem', opacity: '0.9' }}>Observer Panel</p>
        </div>
        <div className="observer-header-right">
          <div ref={profileDropdownRef} style={{ position: 'relative' }}>
            <button
              className="profile-avatar"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              title="View Profile"
            >
              {observerInitials}
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info-card">
                  <h4>Profile Information</h4>
                  <p><strong>Name:</strong> {observerProfile.name}</p>
                  <p><strong>Email:</strong> {observerProfile.email}</p>
                  <p><strong>Phone:</strong> {observerProfile.phone}</p>
                  <p><strong>Observer ID:</strong> {observerProfile.observerId}</p>
                  <p><strong>Status:</strong> <span className="status-active">{observerProfile.status}</span></p>
                  <p><strong>District:</strong> {observerProfile.district}</p>
                  <p><strong>Assigned Stations:</strong> {observerProfile.assignedStations}</p>
                </div>
                <button className="dropdown-btn danger" onClick={handleLogoutClick}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="observer-main-layout">
        <ObserverSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="observer-content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
