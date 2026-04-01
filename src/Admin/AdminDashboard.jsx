import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProfessional.css';
import AdminSidebar from './AdminSidebar';

// Polling Stations
import AddPollingStation from './PollingStations/AddPollingStation';
import ViewPollingStations from './PollingStations/ViewPollingStations';

// Observers
import AddObserver from './Observers/AddObserver';
import AssignObserver from './Observers/AssignObserver';
import ViewAllObservers from './Observers/ViewAllObservers';

// Data Analysts
import AddDataAnalyst from './DataAnalyst/AddDataAnalyst';
import ViewAllAnalysts from './DataAnalyst/ViewAllAnalysts';
import AssignDistrict from './DataAnalyst/AssignDistrict';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('view');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const profileDropdownRef = useRef(null);


 

  const adminProfile = {
    name: 'System Administrator',
    email: 'admin@system.com',
    phone: '+94 77 123 4567',
    role: 'Admin',
    adminId: 'ADM-0001',
    accountStatus: 'Active',
    accessLevel: 'Full Access',
    lastLogin: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    twoFactor: 'Enabled'
  };

  const adminInitials = adminProfile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/');
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // All old data and handlers have been refactored into modular sub-components
  // This is now just a container/orchestrator for the new structure

  return (
    <div className="admin-dashboard-wrapper">
      {/* Header with Profile */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Election Management System</h1>
          <p className="admin-subtitle">Admin Dashboard</p>
        </div>
        <div className="admin-header-right">
          <div className="profile-section" ref={profileDropdownRef}>
            <button
              className="profile-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              title="View Profile"
            >
              <div className="profile-avatar">{adminInitials}</div>
              <span>{adminProfile.name}</span>
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info-card">
                  <h4>Profile Information</h4>
                  <p><strong>Name:</strong> {adminProfile.name}</p>
                  <p><strong>Email:</strong> {adminProfile.email}</p>
                  <p><strong>Phone:</strong> {adminProfile.phone}</p>
                  <p><strong>Admin ID:</strong> {adminProfile.adminId}</p>
                  <p><strong>Access Level:</strong> {adminProfile.accessLevel}</p>
                  <p><strong>Last Login:</strong> {adminProfile.lastLogin}</p>
                  <p><strong>Status:</strong> <span className="status-active">{adminProfile.accountStatus}</span></p>
                </div>
                <button className="dropdown-btn danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="admin-main-layout">
        {/* Sidebar Navigation */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <div className="admin-content-area">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Dashboard Overview</h2>
              <p>Welcome to the Admin Dashboard. Use the navigation tabs to manage polling stations, observers, and data analysts.</p>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-icon">📍</div>
                <h3>Polling Stations</h3>
                <p>Manage and monitor voting locations</p>
                <button className="card-btn" onClick={() => setActiveTab('pollingStations')}>
                  Go to Polling Stations
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">👁️</div>
                <h3>Observers</h3>
                <p>Assign and manage election observers</p>
                <button className="card-btn" onClick={() => setActiveTab('observers')}>
                  Go to Observers
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">📊</div>
                <h3>Data Analysts</h3>
                <p>Manage analytics and reporting staff</p>
                <button className="card-btn" onClick={() => setActiveTab('dataAnalysts')}>
                  Go to Data Analysts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Polling Stations Tab */}
        {activeTab === 'pollingStations' && (
          <div className="tab-content">
            <div className="tab-selector">
              <button
                className={`tab-btn ${activeSubTab === 'view' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('view')}
              >
                View Stations
              </button>
              <button
                className={`tab-btn ${activeSubTab === 'add' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('add')}
              >
                Add Station
              </button>
            </div>
            <div className="tab-content-area">
              {activeSubTab === 'view' && (
                <ViewPollingStations onStationAdded={handleRefresh} key={refreshTrigger} />
              )}
              {activeSubTab === 'add' && (
                <AddPollingStation onStationAdded={() => {
                  setActiveSubTab('view');
                  handleRefresh();
                }} />
              )}
            </div>
          </div>
        )}

        {/* Observers Tab */}
        {activeTab === 'observers' && (
          <div className="tab-content">
            <div className="tab-selector">
              <button
                className={`tab-btn ${activeSubTab === 'view' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('view')}
              >
                View All Observers
              </button>
              <button
                className={`tab-btn ${activeSubTab === 'add' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('add')}
              >
                Add Observer
              </button>
              <button
                className={`tab-btn ${activeSubTab === 'assign' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('assign')}
              >
                Assign to Station
              </button>
            </div>
            <div className="tab-content-area">
              {activeSubTab === 'view' && (
                <ViewAllObservers onObserverAdded={handleRefresh} key={refreshTrigger} />
              )}
              {activeSubTab === 'add' && (
                <AddObserver onObserverAdded={() => {
                  setActiveSubTab('view');
                  handleRefresh();
                }} />
              )}
              {activeSubTab === 'assign' && (
                <AssignObserver />
              )}
            </div>
          </div>
        )}

        {/* Data Analysts Tab */}
        {activeTab === 'dataAnalysts' && (
          <div className="tab-content">
            <div className="tab-selector">
              <button
                className={`tab-btn ${activeSubTab === 'view' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('view')}
              >
                View All Analysts
              </button>
              <button
                className={`tab-btn ${activeSubTab === 'add' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('add')}
              >
                Add Analyst
              </button>
              <button
                className={`tab-btn ${activeSubTab === 'assign' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('assign')}
              >
                Assign District
              </button>
            </div>
            <div className="tab-content-area">
              {activeSubTab === 'view' && (
                <ViewAllAnalysts onAnalystAdded={handleRefresh} key={refreshTrigger} />
              )}
              {activeSubTab === 'add' && (
                <AddDataAnalyst onAnalystAdded={() => {
                  setActiveSubTab('view');
                  handleRefresh();
                }} />
              )}
              {activeSubTab === 'assign' && (
                <AssignDistrict />
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
