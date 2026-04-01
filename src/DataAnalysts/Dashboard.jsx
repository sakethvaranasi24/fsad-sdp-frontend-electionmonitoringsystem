import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DataAnalystProfessional.css';
import AnalystSidebar from './AnalystSidebar';

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const analystProfile = {
    name: 'Data Analyst',
    email: 'analyst@system.com',
    phone: '+91 98765 43210',
    analystId: 'ANAL-' + Date.now(),
    status: 'Active',
    department: 'Analytics',
    accessLevel: 'Data Analysis'
  };

  const analystInitials = analystProfile.name
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
      case 'districtData':
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>District Data Analysis</h2>
                <p>Analyze election data by district</p>
              </div>
            </div>
            <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
              <p>District-wise analytics and reports available here.</p>
            </div>
          </div>
        );
      case 'stateData':
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>State Data Analysis</h2>
                <p>Analyze election data by state</p>
              </div>
            </div>
            <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
              <p>State-wise analytics and reports available here.</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>Advanced Analytics</h2>
                <p>In-depth election analysis and insights</p>
              </div>
            </div>
            <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
              <p>Advanced analytics dashboard and tools available here.</p>
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
                <p>Welcome to the Data Analyst Panel. Analyze election data and generate insights.</p>
              </div>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-icon">📍</div>
                <h3>District Data</h3>
                <p>Analyze election data by district</p>
                <button className="card-btn" onClick={() => setActiveTab('districtData')}>
                  View District Data
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">🗺️</div>
                <h3>State Data</h3>
                <p>Analyze election data by state</p>
                <button className="card-btn" onClick={() => setActiveTab('stateData')}>
                  View State Data
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">📈</div>
                <h3>Advanced Analytics</h3>
                <p>In-depth election analysis</p>
                <button className="card-btn" onClick={() => setActiveTab('analytics')}>
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="analyst-dashboard-wrapper">
      <div className="analyst-header">
        <div className="analyst-header-left">
          <h1>Election Monitoring System</h1>
          <p style={{ marginTop: '4px', fontSize: '0.95rem', opacity: '0.9' }}>Data Analyst Panel</p>
        </div>
        <div className="analyst-header-right">
          <div ref={profileDropdownRef} style={{ position: 'relative' }}>
            <button
              className="profile-avatar"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              title="View Profile"
            >
              {analystInitials}
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info-card">
                  <h4>Profile Information</h4>
                  <p><strong>Name:</strong> {analystProfile.name}</p>
                  <p><strong>Email:</strong> {analystProfile.email}</p>
                  <p><strong>Phone:</strong> {analystProfile.phone}</p>
                  <p><strong>Analyst ID:</strong> {analystProfile.analystId}</p>
                  <p><strong>Status:</strong> <span className="status-active">{analystProfile.status}</span></p>
                  <p><strong>Department:</strong> {analystProfile.department}</p>
                  <p><strong>Access Level:</strong> {analystProfile.accessLevel}</p>
                </div>
                <button className="dropdown-btn danger" onClick={handleLogoutClick}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="analyst-main-layout">
        <AnalystSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="analyst-content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
