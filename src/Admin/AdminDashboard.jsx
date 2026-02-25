import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('userManagement');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const adminProfile = {
    name: 'Admin User',
    email: 'admin@system.com',
    phone: '+94 77 123 4567',
    role: 'Super Admin',
    accessLevel: 'Full Access',
    lastLogin: '24/02/2026 - 10:15 AM',
    twoFactor: 'Enabled'
  };

  const handleSwitchRole = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/');
    }
  };

  const users = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'observer',
      status: 'active',
      joinedDate: '12/15/2025',
      pending: false
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      role: 'analyst',
      status: 'active',
      joinedDate: '11/20/2025',
      pending: false
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      role: 'observer',
      status: 'pending',
      joinedDate: '2/18/2026',
      pending: true
    },
    {
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      role: 'citizen',
      status: 'active',
      joinedDate: '1/10/2026',
      pending: false
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      role: 'analyst',
      status: 'pending',
      joinedDate: '2/22/2026',
      pending: true
    }
  ];

  const securityIncidents = [
    {
      level: 'MEDIUM',
      title: 'Failed Login Attempts',
      time: '2/24/2026, 1:45:00 PM',
      description: 'Multiple failed login attempts detected from IP 192.168.1.45',
      affectedUser: 'admin@system.com',
      action: 'Resolve',
      resolved: false
    },
    {
      level: 'HIGH',
      title: 'Unauthorized Access Attempt',
      time: '2/24/2026, 12:00:00 PM',
      description: 'Attempt to access admin panel without proper credentials',
      affectedUser: null,
      action: 'Resolved',
      resolved: true
    },
    {
      level: 'CRITICAL',
      title: 'Suspicious Data Export',
      time: '2/24/2026, 4:15:00 AM',
      description: 'Large data export request detected from unusual location',
      affectedUser: 'observer_5423',
      action: 'Investigate',
      resolved: false
    },
    {
      level: 'LOW',
      title: 'Session Anomaly',
      time: '2/24/2026, 12:30:00 PM',
      description: 'Multiple concurrent sessions from same user account',
      affectedUser: null,
      action: 'Resolved',
      resolved: true
    }
  ];

  const elections = [
    {
      title: '2026 Presidential Election',
      status: 'upcoming',
      electionDate: '11/1/2026',
      registrationDeadline: '10/15/2026',
      type: 'Presidential',
      turnout: null
    },
    {
      title: 'State Governor Election - California',
      status: 'ongoing',
      electionDate: '6/15/2026',
      registrationDeadline: '5/30/2026',
      type: 'State',
      turnout: '487,500 / 1,250,000 (39.0%)'
    },
    {
      title: 'City Council Election - District 5',
      status: 'completed',
      electionDate: '3/20/2026',
      registrationDeadline: '3/5/2026',
      type: 'Local',
      turnout: '32,400 / 45,000 (72.0%)'
    }
  ];

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
            🗳 Elections
          </button>
          <button 
            className={`nav-item ${activeTab === 'systemLogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('systemLogs')}
            title="View system activity logs"
          >
            📋 System Logs
          </button>
        </nav>
        
        <div className="header-right">
          <button
            type="button"
            className="role-badge profile-trigger"
            onClick={() => setIsProfileOpen((prev) => !prev)}
          >
            👤 Profile
          </button>
          <button className="switch-role-btn" onClick={handleSwitchRole}>
            Sign Out
          </button>

          {isProfileOpen && (
            <div className="admin-profile-popout">
              <h3 className="admin-popout-title">Admin Profile</h3>
              <div className="admin-popout-divider" />

              <div className="admin-image-placeholder">Profile Image</div>

              <div className="admin-basic-info">
                <p>{adminProfile.name}</p>
                <p>{adminProfile.email}</p>
                <p>{adminProfile.phone}</p>
              </div>

              <div className="admin-meta-info">
                <p><strong>Role:</strong> {adminProfile.role}</p>
                <p><strong>Access Level:</strong> {adminProfile.accessLevel}</p>
              </div>
              <div className="admin-meta-info">
                <p><strong>Last Login:</strong> {adminProfile.lastLogin}</p>
                <p><strong>2FA:</strong> {adminProfile.twoFactor}</p>
              </div>

              <div className="admin-profile-actions">
                <button type="button" className="admin-action-btn">Edit Profile</button>
                <button type="button" className="admin-action-btn">Change Password</button>
                <button type="button" className="admin-action-btn">View Login History</button>
              </div>
            </div>
          )}
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

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'userManagement' && (
              <div className="user-management-section">
                <div className="section-header compact">
                  <div>
                    <h3 className="section-title">User Management</h3>
                    <p className="section-subtitle">Approve, monitor, and manage user accounts</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.email}>
                          <td className="strong-cell">{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className="chip neutral">{user.role}</span>
                          </td>
                          <td>
                            <span className={`chip status ${user.status}`}>{user.status}</span>
                          </td>
                          <td>{user.joinedDate}</td>
                          <td>
                            {user.pending ? (
                              <div className="inline-actions">
                                <button className="small-btn dark">Approve</button>
                                <button className="small-btn danger">Reject</button>
                              </div>
                            ) : (
                              <button className="small-btn light">View Details</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="security-section">
                <div className="section-header compact">
                  <div>
                    <h3 className="section-title">Security Incidents</h3>
                    <p className="section-subtitle">Monitor and respond to security alerts</p>
                  </div>
                </div>
                <div className="incident-list">
                  {securityIncidents.map((incident, index) => (
                    <div key={`${incident.title}-${index}`} className="incident-card">
                      <div className="incident-top-row">
                        <div className="incident-meta">
                          <span className={`level-badge ${incident.level.toLowerCase()}`}>{incident.level}</span>
                          <span className="incident-title">{incident.title}</span>
                          <span className="incident-time">{incident.time}</span>
                        </div>
                        <button className={`small-btn ${incident.resolved ? 'dark' : 'dark'}`}>{incident.action}</button>
                      </div>
                      <p className="incident-description">{incident.description}</p>
                      {incident.affectedUser && (
                        <p className="incident-user">Affected User: {incident.affectedUser}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'elections' && (
              <div className="elections-section">
                <div className="section-header compact">
                  <div>
                    <h3 className="section-title">Election Management</h3>
                    <p className="section-subtitle">Configure and monitor elections</p>
                  </div>
                </div>

                <div className="election-list">
                  {elections.map((election) => (
                    <div key={election.title} className="election-card">
                      <div className="election-main">
                        <div className="election-title-row">
                          <h4>{election.title}</h4>
                          <span className={`chip status ${election.status}`}>{election.status}</span>
                        </div>
                        <div className="election-grid">
                          <div>
                            <p className="meta-label">Election Date</p>
                            <p className="meta-value">{election.electionDate}</p>
                            <p className="meta-label spaced">Registration Deadline</p>
                            <p className="meta-value">{election.registrationDeadline}</p>
                          </div>
                          <div>
                            <p className="meta-label">Type</p>
                            <p className="meta-value strong">{election.type}</p>
                            {election.turnout && (
                              <>
                                <p className="meta-label spaced">Current Turnout</p>
                                <p className="meta-value">{election.turnout}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="small-btn light">Manage</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
