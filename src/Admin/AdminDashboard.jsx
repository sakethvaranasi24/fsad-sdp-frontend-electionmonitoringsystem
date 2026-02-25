import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('systemLogs');
  const [profileData, setProfileData] = useState({
    adminId: 'ADM-2024-001',
    name: 'Rajesh Kumar Singh',
    department: 'Election Commission',
    designation: 'Senior Election Administrator',
    email: 'admin@election.gov',
    phone: '9876543210',
    newPhone: '',
    lastLogin: '2026-02-24 14:30:22',
    accessLevel: 'Full Access',
    assignedDistricts: ['Mumbai', 'Pune', 'Nagpur'],
    newPassword: '',
    confirmPassword: ''
  });
  const [profileErrors, setProfileErrors] = useState({ phone: '', password: '' });
  const [profileMessages, setProfileMessages] = useState({ phone: '', password: '' });

  const handleSwitchRole = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/');
    }
  };

  const maskAadhaar = (value) => {
    const digits = value.replace(/\D/g, '');
    const lastFour = digits.slice(-4).padStart(4, '0');
    return `XXXX-XXXX-${lastFour}`;
  };

  const handleProfilePhoneUpdate = () => {
    const nextPhone = profileData.newPhone.replace(/\D/g, '');
    setProfileMessages((prev) => ({ ...prev, phone: '' }));

    if (!/^\d{10}$/.test(nextPhone)) {
      setProfileErrors((prev) => ({ ...prev, phone: 'Phone must be 10 digits.' }));
      return;
    }

    setProfileData((prev) => ({
      ...prev,
      phone: nextPhone,
      newPhone: ''
    }));
    setProfileErrors((prev) => ({ ...prev, phone: '' }));
    setProfileMessages((prev) => ({ ...prev, phone: 'Phone number updated.' }));
  };

  const handleProfilePasswordChange = () => {
    setProfileMessages((prev) => ({ ...prev, password: '' }));

    if (!profileData.newPassword || !profileData.confirmPassword) {
      setProfileErrors((prev) => ({ ...prev, password: 'Enter and confirm your new password.' }));
      return;
    }

    if (profileData.newPassword.length < 6) {
      setProfileErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters.' }));
      return;
    }

    if (profileData.newPassword !== profileData.confirmPassword) {
      setProfileErrors((prev) => ({ ...prev, password: 'Passwords do not match.' }));
      return;
    }

    setProfileErrors((prev) => ({ ...prev, password: '' }));
    setProfileMessages((prev) => ({ ...prev, password: 'Password updated.' }));
    setProfileData((prev) => ({
      ...prev,
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const systemLogs = [
    { time: '2026-02-24 10:15:32', type: 'INFO', message: 'User login successful: observer_5423' },
    { time: '2026-02-24 10:16:18', type: 'SYSTEM', message: 'Database backup completed successfully' },
    { time: '2026-02-24 10:12:45', type: 'WARNING', message: 'High CPU usage detected on polling station server PS-003' },
    { time: '2026-02-24 10:10:22', type: 'INFO', message: 'New user registration: Emily Rodriguez (Observer)' },
    { time: '2026-02-24 10:05:55', type: 'ERROR', message: 'Failed login attempt from IP 192.168.1.45' },
    { time: '2026-02-24 10:05:33', type: 'INFO', message: 'Polling station PS-012 status updated: Operational' }
  ];

  return (
    <div className="admin-dashboard">
        {/* Header */}
        <header className="portal-header">
        <div className="header-left">
          <div className="header-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="8" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M 9 12 L 11 14 L 15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="header-info">
            <h1 className="header-title">Election Monitoring System</h1>
            <p className="header-subtitle">Ensuring transparency and integrity</p>
          </div>
        </div>
        
        {/* Header Navigation */}
        <nav className="header-navigation">
          <button 
            className={`nav-item ${activeTab === 'userManagement' ? 'active' : ''}`}
            onClick={() => setActiveTab('userManagement')}
            title="Manage system users and their permissions"
          >
            👥 User Management
          </button>
          <button 
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
            title="Configure security policies"
          >
            🔒 Security
          </button>
          <button 
            className={`nav-item ${activeTab === 'elections' ? 'active' : ''}`}
            onClick={() => setActiveTab('elections')}
            title="Manage election data"
          >
            🗳️ Elections
          </button>
          <button 
            className={`nav-item ${activeTab === 'systemLogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('systemLogs')}
            title="View system activity logs"
          >
            📋 System Logs
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            title="Manage your profile"
          >
            👤 Profile
          </button>
        </nav>
        
        <div className="header-right">
          <span className="role-badge">Admin</span>
          <button className="switch-role-btn" onClick={handleSwitchRole}>
            <span className="icon">⇄</span> Switch Role
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="portal-main">
        <div className="portal-container">
          {/* Page Header */}
          <div className="page-header">
            <div className="page-title-section">
              <h2 className="page-title">Admin Dashboard</h2>
              <p className="page-description">System management and oversight</p>
            </div>
            <button className="status-btn online">
              System Status: Online
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-content">
                <h3 className="stat-label">System Uptime</h3>
                <p className="stat-value">99.8%</p>
              </div>
              <div className="stat-icon green">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M 3 12 h 18 M 12 3 v 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3 className="stat-label">Active Users</h3>
                <p className="stat-value">1247</p>
              </div>
              <div className="stat-icon blue">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M 3 21 v -2 a 4 4 0 0 1 4 -4 h 4 a 4 4 0 0 1 4 4 v 2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M 16 11 h 6 M 19 8 v 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3 className="stat-label">Active Elections</h3>
                <p className="stat-value">3</p>
              </div>
              <div className="stat-icon purple">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M 12 2 L 15.09 8.26 L 22 9.27 L 17 14.14 L 18.18 21.02 L 12 17.77 L 5.82 21.02 L 7 14.14 L 2 9.27 L 8.91 8.26 L 12 2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <h3 className="stat-label">Avg Response Time</h3>
                <p className="stat-value">1.2s</p>
              </div>
              <div className="stat-icon orange">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M 12 6 v 6 l 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="portal-tabs">
            <button 
              className={`tab-btn ${activeTab === 'userManagement' ? 'active' : ''}`}
              onClick={() => setActiveTab('userManagement')}
            >
              User Management
            </button>
            <button 
              className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            <button 
              className={`tab-btn ${activeTab === 'elections' ? 'active' : ''}`}
              onClick={() => setActiveTab('elections')}
            >
              Elections
            </button>
            <button 
              className={`tab-btn ${activeTab === 'systemLogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('systemLogs')}
            >
              System Logs
            </button>
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'systemLogs' && (
              <div className="system-logs-section">
                <div className="section-header">
                  <div className="section-icon">📋</div>
                  <div>
                    <h3 className="section-title">System Logs & Audit Trail</h3>
                    <p className="section-subtitle">System activity and performance monitoring</p>
                  </div>
                </div>

                <div className="logs-container">
                  {systemLogs.map((log, index) => (
                    <div key={index} className="log-entry">
                      <span className="log-time">[{log.time}]</span>
                      <span className={`log-type ${log.type.toLowerCase()}`}>[{log.type}]</span>
                      <span className="log-message">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'userManagement' && (
              <div className="content-placeholder">
                <h3>User Management</h3>
                <p>Manage system users and their permissions</p>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="content-placeholder">
                <h3>Security Settings</h3>
                <p>Configure security policies and monitor threats</p>
              </div>
            )}

            {activeTab === 'elections' && (
              <div className="content-placeholder">
                <h3>Elections Management</h3>
                <p>Create and manage elections</p>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="profile-section">
                <div className="section-header">
                  <div className="section-icon">👤</div>
                  <div>
                    <h3 className="section-title">Admin Profile</h3>
                    <p className="section-subtitle">Manage your admin account and settings</p>
                  </div>
                </div>

                <div className="profile-grid">
                  <div className="profile-card">
                    <h4 className="profile-card-title">Account Information</h4>
                    <div className="profile-row">
                      <span className="profile-label">Admin ID</span>
                      <span className="profile-value">{profileData.adminId}</span>
                    </div>
                    <div className="profile-row">
                      <span className="profile-label">Full Name</span>
                      <span className="profile-value">{profileData.name}</span>
                    </div>
                    <div className="profile-row">
                      <span className="profile-label">Email</span>
                      <span className="profile-value">{profileData.email}</span>
                    </div>
                    <div className="profile-row">
                      <span className="profile-label">Department</span>
                      <span className="profile-value">{profileData.department}</span>
                    </div>
                    <div className="profile-row">
                      <span className="profile-label">Designation</span>
                      <span className="profile-value">{profileData.designation}</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <h4 className="profile-card-title">Access & Permissions</h4>
                    <div className="profile-row">
                      <span className="profile-label">Access Level</span>
                      <span className="profile-value"><span className="access-badge">{profileData.accessLevel}</span></span>
                    </div>
                    <div className="profile-row">
                      <span className="profile-label">Assigned Districts</span>
                      <span className="profile-value">
                        <div className="districts-list">
                          {profileData.assignedDistricts.map((district, idx) => (
                            <span key={idx} className="district-badge">{district}</span>
                          ))}
                        </div>
                      </span>
                    </div>
                    <div className="profile-row">
                      <span className="profile-label">Last Login</span>
                      <span className="profile-value">{profileData.lastLogin}</span>
                    </div>
                  </div>

                  <div className="profile-card">
                    <h4 className="profile-card-title">Update Phone Number</h4>
                    <label className="profile-input-label" htmlFor="currentPhone">Current Phone</label>
                    <input
                      id="currentPhone"
                      className="profile-input" 
                      type="text"
                      value={profileData.phone}
                      disabled
                    />
                    <label className="profile-input-label" htmlFor="newPhone">New Phone Number</label>
                    <input
                      id="newPhone"
                      className="profile-input"
                      type="text"
                      value={profileData.newPhone}
                      onChange={(e) => {
                        setProfileData((prev) => ({ ...prev, newPhone: e.target.value }));
                        setProfileErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      placeholder="Enter 10-digit number"
                    />
                    {profileErrors.phone && <p className="profile-error">{profileErrors.phone}</p>}
                    {profileMessages.phone && <p className="profile-message">{profileMessages.phone}</p>}
                    <button className="profile-btn" onClick={handleProfilePhoneUpdate}>Update Phone</button>
                  </div>

                  <div className="profile-card">
                    <h4 className="profile-card-title">Change Password</h4>
                    <label className="profile-input-label" htmlFor="newPassword">Create Password</label>
                    <input
                      id="newPassword"
                      className="profile-input"
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => {
                        setProfileData((prev) => ({ ...prev, newPassword: e.target.value }));
                        setProfileErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      placeholder="Enter new password"
                    />
                    <label className="profile-input-label" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      className="profile-input"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => {
                        setProfileData((prev) => ({ ...prev, confirmPassword: e.target.value }));
                        setProfileErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      placeholder="Confirm new password"
                    />
                    {profileErrors.password && <p className="profile-error">{profileErrors.password}</p>}
                    {profileMessages.password && <p className="profile-message">{profileMessages.password}</p>}
                    <button className="profile-btn" onClick={handleProfilePasswordChange}>Change Password</button>
                  </div>
                </div>

                <div className="profile-actions">
                  <button className="profile-logout-btn" onClick={handleSwitchRole}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
