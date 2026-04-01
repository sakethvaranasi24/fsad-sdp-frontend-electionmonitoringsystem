import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CitizenProfessional.css';
import CitizenSidebar from './CitizenSidebar';

// Components
import Register from './Register';
import ReportIssue from './ReportIssue';
import ViewReports from './ViewReports';
import PollingStations from './PollingStations';
import ElectionResults from './ElectionResults';

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const citizenProfile = {
    name: 'John Citizen',
    email: 'john.citizen@email.com',
    phone: '+91 98765 43210',
    voterId: 'VID-' + Date.now(),
    status: 'Registered',
    registrationDate: new Date().toLocaleDateString(),
    district: 'Central District'
  };

  const citizenInitials = citizenProfile.name
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

  // Profile dropdown click outside handler
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
      case 'elections':
        return <ElectionResults />;
      case 'register':
        return <Register />;
      case 'reportIssue':
        return <ReportIssue />;
      case 'viewReports':
        return <ViewReports />;
      case 'pollingStations':
        return <PollingStations />;
      case 'dashboard':
      default:
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>Dashboard Overview</h2>
                <p>Welcome to the Citizen Portal. Use the navigation menu to explore elections, register, and report issues.</p>
              </div>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-icon">🗳️</div>
                <h3>Available Elections</h3>
                <p>View upcoming elections and participate</p>
                <button className="card-btn" onClick={() => setActiveTab('elections')}>
                  View Elections
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">✍️</div>
                <h3>Voter Registration</h3>
                <p>Register to vote and get your voter ID</p>
                <button className="card-btn" onClick={() => setActiveTab('register')}>
                  Register Now
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">🚨</div>
                <h3>Report Issues</h3>
                <p>Report election violations and irregularities</p>
                <button className="card-btn" onClick={() => setActiveTab('reportIssue')}>
                  Report Issue
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">📍</div>
                <h3>Polling Stations</h3>
                <p>Find your nearest voting location</p>
                <button className="card-btn" onClick={() => setActiveTab('pollingStations')}>
                  Find Stations
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="citizen-dashboard-wrapper">
      {/* Header */}
      <div className="citizen-header">
        <div className="citizen-header-left">
          <h1>Election Monitoring System</h1>
          <p className="citizen-subtitle">Citizen Portal</p>
        </div>
        <div className="citizen-header-right">
          <div ref={profileDropdownRef} style={{ position: 'relative' }}>
            <button
              className="profile-avatar"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              title="View Profile"
            >
              {citizenInitials}
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info-card">
                  <h4>Profile Information</h4>
                  <p><strong>Name:</strong> {citizenProfile.name}</p>
                  <p><strong>Email:</strong> {citizenProfile.email}</p>
                  <p><strong>Phone:</strong> {citizenProfile.phone}</p>
                  <p><strong>Voter ID:</strong> {citizenProfile.voterId}</p>
                  <p><strong>Status:</strong> <span className="status-active">{citizenProfile.status}</span></p>
                  <p><strong>District:</strong> {citizenProfile.district}</p>
                  <p><strong>Registered:</strong> {citizenProfile.registrationDate}</p>
                </div>
                <button className="dropdown-btn danger" onClick={handleLogoutClick}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="citizen-main-layout">
        {/* Sidebar Navigation */}
        <CitizenSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <div className="citizen-content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
