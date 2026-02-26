import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('userManagement');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminProfileModalOpen, setIsAdminProfileModalOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [resolutionAction, setResolutionAction] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionDate, setResolutionDate] = useState('');
  const [resolutionAdminName, setResolutionAdminName] = useState('');
  const [resolutionError, setResolutionError] = useState('');
  const [isElectionManagementOpen, setIsElectionManagementOpen] = useState(false);
  const [isElectionLoading, setIsElectionLoading] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [managedElection, setManagedElection] = useState(null);
  const [managedCandidates, setManagedCandidates] = useState([]);
  const [managedObservers, setManagedObservers] = useState([]);
  const [managedAnalysts, setManagedAnalysts] = useState([]);
  const [managedSecurityAlerts, setManagedSecurityAlerts] = useState([]);
  const [electionAuditLogs, setElectionAuditLogs] = useState([]);
  const [electionSaveError, setElectionSaveError] = useState('');
  const [electionSaveSuccessMessage, setElectionSaveSuccessMessage] = useState('');
  const [highlightedElectionId, setHighlightedElectionId] = useState('');
  const [candidateNameInput, setCandidateNameInput] = useState('');
  const [candidatePartyInput, setCandidatePartyInput] = useState('');
  const [editingCandidateId, setEditingCandidateId] = useState('');
  const [newObserverInput, setNewObserverInput] = useState('');
  const [newAnalystInput, setNewAnalystInput] = useState('');
  const profileDropdownRef = useRef(null);

  const adminProfile = {
    name: 'Admin User',
    email: 'admin@system.com',
    phone: '+94 77 123 4567',
    role: 'System Administrator',
    adminId: 'ADM-0001',
    accountStatus: 'Active',
    accessLevel: 'Full Access',
    lastLogin: '24/02/2026 - 10:15 AM',
    twoFactor: 'Enabled'
  };

  const adminInitials = adminProfile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSwitchRole = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/');
    }
  };

  const handleViewProfile = () => {
    setIsAdminProfileModalOpen(true);
    setIsProfileOpen(false);
  };

  const handleCloseAdminProfileModal = () => {
    setIsAdminProfileModalOpen(false);
  };

  const handleChangePassword = () => {
    window.alert('Change password action triggered');
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

  const [users, setUsers] = useState([
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'observer',
      status: 'active',
      joinedDate: '12/15/2025',
      lastLogin: '2/25/2026, 9:45 AM',
      userId: 'USR-0001',
      pending: false
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      role: 'analyst',
      status: 'active',
      joinedDate: '11/20/2025',
      lastLogin: '2/25/2026, 8:20 AM',
      userId: 'USR-0002',
      pending: false
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      role: 'observer',
      status: 'pending',
      joinedDate: '2/18/2026',
      lastLogin: 'Not available',
      userId: 'USR-0003',
      pending: true
    },
    {
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      role: 'citizen',
      status: 'active',
      joinedDate: '1/10/2026',
      lastLogin: '2/24/2026, 7:10 PM',
      userId: 'USR-0004',
      pending: false
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      role: 'analyst',
      status: 'pending',
      joinedDate: '2/22/2026',
      lastLogin: 'Not available',
      userId: 'USR-0005',
      pending: true
    }
  ]);

  const handleOpenUserDetails = (user) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleCloseUserDetails = () => {
    setIsUserDetailsOpen(false);
    setSelectedUser(null);
  };

  const handleApproveUser = (email) => {
    const userToApprove = users.find((user) => user.email === email);

    if (!userToApprove) {
      return;
    }

    const approvedUser = {
      ...userToApprove,
      status: 'active',
      pending: false
    };

    setUsers((previousUsers) =>
      previousUsers.map((user) => (user.email === email ? approvedUser : user))
    );

    if (selectedUser?.email === email) {
      setSelectedUser(approvedUser);
    }

    window.alert('User approved successfully');
  };

  const handleRejectUser = (email) => {
    const userToReject = users.find((user) => user.email === email);

    if (!userToReject) {
      return;
    }

    const rejectedUser = {
      ...userToReject,
      status: 'rejected',
      pending: false
    };

    setUsers((previousUsers) =>
      previousUsers.map((user) => (user.email === email ? rejectedUser : user))
    );

    if (selectedUser?.email === email) {
      setSelectedUser(rejectedUser);
    }
  };

  const [securityIncidents, setSecurityIncidents] = useState([
    {
      id: 'INC-1001',
      level: 'MEDIUM',
      title: 'Failed Login Attempts',
      time: '2/24/2026, 1:45:00 PM',
      description: 'Multiple failed login attempts detected from IP 192.168.1.45',
      affectedUser: 'admin@system.com',
      action: 'Resolve',
      resolved: false
    },
    {
      id: 'INC-1002',
      level: 'HIGH',
      title: 'Unauthorized Access Attempt',
      time: '2/24/2026, 12:00:00 PM',
      description: 'Attempt to access admin panel without proper credentials',
      affectedUser: null,
      action: 'Resolved',
      resolved: true
    },
    {
      id: 'INC-1003',
      level: 'CRITICAL',
      title: 'Suspicious Data Export',
      time: '2/24/2026, 4:15:00 AM',
      description: 'Large data export request detected from unusual location',
      affectedUser: 'observer_5423',
      action: 'Investigate',
      resolved: false
    },
    {
      id: 'INC-1004',
      level: 'LOW',
      title: 'Session Anomaly',
      time: '2/24/2026, 12:30:00 PM',
      description: 'Multiple concurrent sessions from same user account',
      affectedUser: null,
      action: 'Resolved',
      resolved: true
    }
  ]);

  const handleOpenResolveModal = (incident) => {
    if (incident.resolved) {
      return;
    }

    setSelectedIncident(incident);
    setResolutionAction('Containment Completed');
    setResolutionNotes('');
    setResolutionDate(new Date().toLocaleString());
    setResolutionAdminName(adminProfile.name);
    setResolutionError('');
    setIsResolveModalOpen(true);
  };

  const handleCloseResolveModal = () => {
    setIsResolveModalOpen(false);
    setSelectedIncident(null);
    setResolutionAction('');
    setResolutionNotes('');
    setResolutionDate('');
    setResolutionAdminName('');
    setResolutionError('');
  };

  const handleSubmitIncidentResolution = () => {
    if (!resolutionAction) {
      setResolutionError('Please select a resolution action.');
      return;
    }

    if (!resolutionNotes.trim()) {
      setResolutionError('Admin notes are required.');
      return;
    }

    const resolvedIncident = {
      ...selectedIncident,
      resolved: true,
      action: 'Resolved',
      resolutionAction,
      resolutionNotes: resolutionNotes.trim(),
      resolvedDate: resolutionDate,
      resolvedBy: resolutionAdminName
    };

    setSecurityIncidents((previousIncidents) =>
      previousIncidents.map((incident) =>
        incident.id === selectedIncident.id ? resolvedIncident : incident
      )
    );

    handleCloseResolveModal();
    window.alert('Incident resolved successfully');
  };

  const [elections, setElections] = useState([
    {
      id: 'ELEC-2026-PRES',
      title: '2026 Presidential Election',
      status: 'upcoming',
      electionDate: '11/1/2026',
      registrationDeadline: '10/15/2026',
      type: 'Presidential',
      turnout: null,
      turnoutPercent: 0
    },
    {
      id: 'ELEC-2026-CA-GOV',
      title: 'State Governor Election - California',
      status: 'ongoing',
      electionDate: '6/15/2026',
      registrationDeadline: '5/30/2026',
      type: 'State',
      turnout: '487,500 / 1,250,000 (39.0%)',
      turnoutPercent: 39
    },
    {
      id: 'ELEC-2026-D5-CC',
      title: 'City Council Election - District 5',
      status: 'completed',
      electionDate: '3/20/2026',
      registrationDeadline: '3/5/2026',
      type: 'Local',
      turnout: '32,400 / 45,000 (72.0%)',
      turnoutPercent: 72
    }
  ]);

  const electionDetailsById = {
    'ELEC-2026-PRES': {
      candidates: [
        { id: 'CAND-1', name: 'Alice Bennett', party: 'Unity Party' },
        { id: 'CAND-2', name: 'Derek Cole', party: 'National Front' }
      ],
      observers: ['observer_5423', 'observer_8764'],
      analysts: ['analyst_115', 'analyst_808'],
      alerts: [
        { id: 'ALT-1', level: 'LOW', message: 'Routine system integrity check passed' }
      ]
    },
    'ELEC-2026-CA-GOV': {
      candidates: [
        { id: 'CAND-3', name: 'Michael Hart', party: 'Progressive Alliance' },
        { id: 'CAND-4', name: 'Sandra Lopez', party: 'Civic Reform' }
      ],
      observers: ['observer_2201', 'observer_2209', 'observer_2302'],
      analysts: ['analyst_501', 'analyst_502'],
      alerts: [
        { id: 'ALT-2', level: 'MEDIUM', message: 'Turnout spike detected in District 7' },
        { id: 'ALT-3', level: 'HIGH', message: 'Delayed polling station sync in Zone B' }
      ]
    },
    'ELEC-2026-D5-CC': {
      candidates: [
        { id: 'CAND-5', name: 'Ravi Patel', party: 'Community First' },
        { id: 'CAND-6', name: 'Hannah James', party: 'Local Action' }
      ],
      observers: ['observer_9011'],
      analysts: ['analyst_711'],
      alerts: [
        { id: 'ALT-4', level: 'LOW', message: 'Post-election audit completed successfully' }
      ]
    }
  };

  const isAdminUser = adminProfile.role.toLowerCase() === 'admin';

  const appendElectionAuditLog = (action) => {
    const timestamp = new Date().toLocaleString();
    setElectionAuditLogs((previousLogs) => [
      { time: timestamp, action, admin: adminProfile.name },
      ...previousLogs
    ]);
  };

  const fetchElectionDetailsById = async (electionId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const baseElection = elections.find((election) => election.id === electionId);
        const detail = electionDetailsById[electionId];

        if (!baseElection || !detail) {
          resolve(null);
          return;
        }

        resolve({
          ...baseElection,
          candidates: detail.candidates,
          observers: detail.observers,
          analysts: detail.analysts,
          alerts: detail.alerts
        });
      }, 250);
    });
  };

  const handleOpenElectionManagement = async (electionId) => {
    setIsElectionManagementOpen(true);
    setIsElectionLoading(true);
    setSelectedElectionId(electionId);

    const details = await fetchElectionDetailsById(electionId);

    if (!details) {
      setIsElectionLoading(false);
      return;
    }

    setManagedElection(details);
    setManagedCandidates(details.candidates);
    setManagedObservers(details.observers);
    setManagedAnalysts(details.analysts);
    setManagedSecurityAlerts(details.alerts);
    setCandidateNameInput('');
    setCandidatePartyInput('');
    setElectionSaveError('');
    setEditingCandidateId('');
    setNewObserverInput('');
    setNewAnalystInput('');
    setElectionAuditLogs([]);
    setIsElectionLoading(false);
    appendElectionAuditLog(`Opened management for ${details.title}`);
  };

  const handleCloseElectionManagement = () => {
    setIsElectionManagementOpen(false);
    setIsElectionLoading(false);
    setSelectedElectionId('');
    setManagedElection(null);
    setManagedCandidates([]);
    setManagedObservers([]);
    setManagedAnalysts([]);
    setManagedSecurityAlerts([]);
    setElectionSaveError('');
    setCandidateNameInput('');
    setCandidatePartyInput('');
    setEditingCandidateId('');
    setNewObserverInput('');
    setNewAnalystInput('');
    setElectionAuditLogs([]);
  };

  const syncManagedElectionToList = (updatedElection) => {
    setManagedElection(updatedElection);
    setElections((previousElections) =>
      previousElections.map((election) =>
        election.id === updatedElection.id ? { ...election, ...updatedElection } : election
      )
    );
  };

  const handleAddOrUpdateCandidate = () => {
    if (!candidateNameInput.trim() || !candidatePartyInput.trim()) {
      return;
    }

    if (editingCandidateId) {
      setManagedCandidates((previousCandidates) =>
        previousCandidates.map((candidate) =>
          candidate.id === editingCandidateId
            ? { ...candidate, name: candidateNameInput.trim(), party: candidatePartyInput.trim() }
            : candidate
        )
      );
      appendElectionAuditLog(`Updated candidate ${candidateNameInput.trim()}`);
      setEditingCandidateId('');
    } else {
      const newCandidate = {
        id: `CAND-${Date.now()}`,
        name: candidateNameInput.trim(),
        party: candidatePartyInput.trim()
      };
      setManagedCandidates((previousCandidates) => [...previousCandidates, newCandidate]);
      appendElectionAuditLog(`Added candidate ${newCandidate.name}`);
    }

    setCandidateNameInput('');
    setCandidatePartyInput('');
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidateId(candidate.id);
    setCandidateNameInput(candidate.name);
    setCandidatePartyInput(candidate.party);
  };

  const handleRemoveCandidate = (candidateId) => {
    const candidate = managedCandidates.find((item) => item.id === candidateId);

    if (!candidate) {
      return;
    }

    if (!window.confirm(`Remove candidate ${candidate.name}?`)) {
      return;
    }

    setManagedCandidates((previousCandidates) =>
      previousCandidates.filter((item) => item.id !== candidateId)
    );
    appendElectionAuditLog(`Removed candidate ${candidate.name}`);
  };

  const handleAddObserver = () => {
    const trimmedObserver = newObserverInput.trim();
    if (!trimmedObserver) {
      return;
    }

    setManagedObservers((previousObservers) => [...previousObservers, trimmedObserver]);
    appendElectionAuditLog(`Assigned observer ${trimmedObserver}`);
    setNewObserverInput('');
  };

  const handleRemoveObserver = (observer) => {
    setManagedObservers((previousObservers) => previousObservers.filter((item) => item !== observer));
    appendElectionAuditLog(`Removed observer ${observer}`);
  };

  const handleAddAnalyst = () => {
    const trimmedAnalyst = newAnalystInput.trim();
    if (!trimmedAnalyst) {
      return;
    }

    setManagedAnalysts((previousAnalysts) => [...previousAnalysts, trimmedAnalyst]);
    appendElectionAuditLog(`Assigned analyst ${trimmedAnalyst}`);
    setNewAnalystInput('');
  };

  const handleRemoveAnalyst = (analyst) => {
    setManagedAnalysts((previousAnalysts) => previousAnalysts.filter((item) => item !== analyst));
    appendElectionAuditLog(`Removed analyst ${analyst}`);
  };

  const handleElectionControlAction = (actionType) => {
    if (!managedElection) {
      return;
    }

    if (actionType === 'start') {
      if (!window.confirm('Start this election now?')) {
        return;
      }
      syncManagedElectionToList({
        ...managedElection,
        status: 'ongoing'
      });
      appendElectionAuditLog('Started election');
      return;
    }

    if (actionType === 'end') {
      if (!window.confirm('End this election and mark it as completed?')) {
        return;
      }
      syncManagedElectionToList({
        ...managedElection,
        status: 'completed'
      });
      appendElectionAuditLog('Completed election');
      return;
    }

    if (actionType === 'cancel') {
      if (!window.confirm('Cancel this election? This is a destructive action.')) {
        return;
      }
      syncManagedElectionToList({
        ...managedElection,
        status: 'cancelled'
      });
      appendElectionAuditLog('Cancelled election');
    }
  };

  const validateElectionData = (electionData) => {
    if (!electionData.title?.trim()) {
      return 'Election name is required.';
    }

    if (!electionData.type?.trim()) {
      return 'Election type is required.';
    }

    if (!electionData.status?.trim()) {
      return 'Election status is required.';
    }

    if (!electionData.electionDate?.trim()) {
      return 'Election date is required.';
    }

    if (!electionData.registrationDeadline?.trim()) {
      return 'Registration deadline is required.';
    }

    return '';
  };

  const handleSaveElectionManagement = () => {
    if (!managedElection) {
      return;
    }

    const validationError = validateElectionData(managedElection);
    if (validationError) {
      setElectionSaveError(validationError);
      return;
    }

    setElectionSaveError('');

    setElections((previousElections) => {
      const existingElectionIndex = previousElections.findIndex((election) => election.id === managedElection.id);

      if (existingElectionIndex >= 0) {
        return previousElections.map((election) =>
          election.id === managedElection.id ? { ...election, ...managedElection } : election
        );
      }

      return [...previousElections, managedElection];
    });

    appendElectionAuditLog('Saved election management changes');
    setElectionSaveSuccessMessage('Election saved successfully');
    setHighlightedElectionId(managedElection.id);
    setTimeout(() => {
      setHighlightedElectionId('');
      setElectionSaveSuccessMessage('');
    }, 3000);
    window.alert('Election saved successfully');
    setActiveTab('elections');
    handleCloseElectionManagement();
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
        
        <div className="header-right" ref={profileDropdownRef}>
          <button
            type="button"
            className="role-badge profile-trigger"
            onClick={() => setIsProfileOpen((prev) => !prev)}
          >
            <span className="admin-avatar">{adminInitials}</span>
            {adminProfile.name}
          </button>
          <button className="switch-role-btn" onClick={handleSwitchRole}>
            Sign Out
          </button>

          {isProfileOpen && (
            <div className="admin-profile-popout">
              <h3 className="admin-popout-title">Admin Profile</h3>
              <div className="admin-popout-divider" />

              <div className="admin-basic-info">
                <p><strong>Admin Name:</strong> {adminProfile.name}</p>
                <p><strong>Admin Email:</strong> {adminProfile.email}</p>
                <p><strong>Role:</strong> {adminProfile.role}</p>
                <p><strong>Admin ID:</strong> {adminProfile.adminId}</p>
                <p><strong>Last Login:</strong> {adminProfile.lastLogin}</p>
                <p>
                  <strong>Account Status:</strong>{' '}
                  <span className="chip status active">{adminProfile.accountStatus}</span>
                </p>
              </div>

              <div className="admin-profile-actions">
                <button type="button" className="admin-action-btn" onClick={handleViewProfile}>View Profile</button>
                <button type="button" className="admin-action-btn" onClick={handleChangePassword}>Change Password</button>
                <button type="button" className="admin-action-btn danger" onClick={handleSwitchRole}>Logout</button>
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
                                <button className="small-btn dark" onClick={() => handleApproveUser(user.email)}>Approve</button>
                                <button className="small-btn danger" onClick={() => handleRejectUser(user.email)}>Reject</button>
                                <button className="small-btn light" onClick={() => handleOpenUserDetails(user)}>View Details</button>
                              </div>
                            ) : (
                              <button className="small-btn light" onClick={() => handleOpenUserDetails(user)}>View Details</button>
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
                    <div key={`${incident.title}-${index}`} className={`incident-card ${incident.resolved ? 'resolved' : ''}`}>
                      <div className="incident-top-row">
                        <div className="incident-meta">
                          <span className={`level-badge ${incident.level.toLowerCase()}`}>{incident.level}</span>
                          {incident.resolved && <span className="incident-status-badge resolved">Resolved</span>}
                          <span className="incident-title">{incident.title}</span>
                          <span className="incident-time">{incident.time}</span>
                        </div>
                        {incident.resolved ? (
                          <button className="small-btn dark resolved-btn" disabled>Resolved</button>
                        ) : (
                          <button className="small-btn dark" onClick={() => handleOpenResolveModal(incident)}>Resolve</button>
                        )}
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

                {electionSaveSuccessMessage && (
                  <p className="election-success-message">{electionSaveSuccessMessage}</p>
                )}

                <div className="election-list">
                  {elections.map((election) => (
                    <div key={election.id} className={`election-card ${highlightedElectionId === election.id ? 'highlighted' : ''}`}>
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
                      <button className="small-btn light" onClick={() => handleOpenElectionManagement(election.id)}>Manage</button>
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

      {isUserDetailsOpen && selectedUser && (
        <div className="user-details-modal-overlay" onClick={handleCloseUserDetails}>
          <div className="user-details-modal" onClick={(event) => event.stopPropagation()}>
            <div className="user-details-modal-header">
              <h3>User Details</h3>
              <button type="button" className="small-btn light" onClick={handleCloseUserDetails}>Close</button>
            </div>

            <div className="user-profile-summary">
              <h4 className="section-title">A. User Profile Summary</h4>
              <div className="user-summary-grid">
                <div className="user-summary-item">
                  <p className="user-summary-label">Full Name</p>
                  <p className="user-summary-value strong-cell">{selectedUser.name}</p>
                </div>
                <div className="user-summary-item">
                  <p className="user-summary-label">Email Address</p>
                  <p className="user-summary-value">{selectedUser.email}</p>
                </div>
                <div className="user-summary-item">
                  <p className="user-summary-label">Role</p>
                  <p className="user-summary-value">{selectedUser.role}</p>
                </div>
                <div className="user-summary-item">
                  <p className="user-summary-label">Account Status</p>
                  <p className="user-summary-value">
                    <span className={`chip status ${selectedUser.status}`}>{selectedUser.status}</span>
                  </p>
                </div>
                <div className="user-summary-item">
                  <p className="user-summary-label">Joined Date</p>
                  <p className="user-summary-value">{selectedUser.joinedDate}</p>
                </div>
                <div className="user-summary-item">
                  <p className="user-summary-label">Last Login Date &amp; Time</p>
                  <p className="user-summary-value">{selectedUser.lastLogin}</p>
                </div>
                <div className="user-summary-item">
                  <p className="user-summary-label">Account ID / User ID</p>
                  <p className="user-summary-value">{selectedUser.userId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAdminProfileModalOpen && (
        <div className="admin-profile-modal-overlay" onClick={handleCloseAdminProfileModal}>
          <div className="admin-profile-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-profile-modal-header">
              <h3>Admin Profile</h3>
              <button type="button" className="small-btn light" onClick={handleCloseAdminProfileModal}>Close</button>
            </div>

            <div className="admin-profile-modal-content">
              <p><strong>Admin Name:</strong> {adminProfile.name}</p>
              <p><strong>Admin Email:</strong> {adminProfile.email}</p>
              <p><strong>Role:</strong> {adminProfile.role}</p>
              <p><strong>Last Login Date &amp; Time:</strong> {adminProfile.lastLogin}</p>
            </div>

            <div className="admin-profile-modal-actions">
              <button type="button" className="small-btn dark" onClick={handleCloseAdminProfileModal}>Done</button>
            </div>
          </div>
        </div>
      )}

      {isElectionManagementOpen && (
        <div className="election-management-modal-overlay" onClick={handleCloseElectionManagement}>
          <div className="election-management-modal" onClick={(event) => event.stopPropagation()}>
            <div className="election-management-header">
              <h3>Election Management</h3>
              <button type="button" className="small-btn light" onClick={handleCloseElectionManagement}>Close</button>
            </div>

            {isElectionLoading ? (
              <div className="election-management-card">
                <p className="meta-value">Loading election details...</p>
              </div>
            ) : !isAdminUser ? (
              <div className="election-management-card">
                <h4>Access Restricted</h4>
                <p className="meta-value">Only admins can access Election Management controls.</p>
              </div>
            ) : managedElection ? (
              <>
                <div className="election-management-card">
                  <h4>1. Election Overview</h4>
                  <div className="election-management-grid">
                    <label className="election-field-label">
                      Name
                      <input
                        type="text"
                        value={managedElection.title}
                        onChange={(event) =>
                          setManagedElection((previousElection) => ({
                            ...previousElection,
                            title: event.target.value
                          }))
                        }
                      />
                    </label>
                    <label className="election-field-label">
                      Type
                      <input
                        type="text"
                        value={managedElection.type}
                        onChange={(event) =>
                          setManagedElection((previousElection) => ({
                            ...previousElection,
                            type: event.target.value
                          }))
                        }
                      />
                    </label>
                    <label className="election-field-label">
                      Status
                      <select
                        value={managedElection.status}
                        onChange={(event) =>
                          setManagedElection((previousElection) => ({
                            ...previousElection,
                            status: event.target.value
                          }))
                        }
                      >
                        <option value="upcoming">upcoming</option>
                        <option value="ongoing">ongoing</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </label>
                    <label className="election-field-label">
                      Election Date
                      <input
                        type="text"
                        value={managedElection.electionDate}
                        onChange={(event) =>
                          setManagedElection((previousElection) => ({
                            ...previousElection,
                            electionDate: event.target.value
                          }))
                        }
                      />
                    </label>
                    <label className="election-field-label">
                      Registration Deadline
                      <input
                        type="text"
                        value={managedElection.registrationDeadline}
                        onChange={(event) =>
                          setManagedElection((previousElection) => ({
                            ...previousElection,
                            registrationDeadline: event.target.value
                          }))
                        }
                      />
                    </label>
                    <label className="election-field-label">
                      Turnout
                      <input
                        type="text"
                        value={managedElection.turnout || ''}
                        placeholder="e.g. 487,500 / 1,250,000 (39.0%)"
                        onChange={(event) =>
                          setManagedElection((previousElection) => ({
                            ...previousElection,
                            turnout: event.target.value
                          }))
                        }
                      />
                    </label>
                  </div>
                  {electionSaveError && <p className="election-save-error">{electionSaveError}</p>}
                </div>

                <div className="election-management-card">
                  <h4>2. Candidate Management</h4>
                  <div className="election-inline-form">
                    <input
                      type="text"
                      value={candidateNameInput}
                      placeholder="Candidate name"
                      onChange={(event) => setCandidateNameInput(event.target.value)}
                    />
                    <input
                      type="text"
                      value={candidatePartyInput}
                      placeholder="Party"
                      onChange={(event) => setCandidatePartyInput(event.target.value)}
                    />
                    <button type="button" className="small-btn dark" onClick={handleAddOrUpdateCandidate}>
                      {editingCandidateId ? 'Update' : 'Add'}
                    </button>
                  </div>
                  <div className="election-item-list">
                    {managedCandidates.map((candidate) => (
                      <div key={candidate.id} className="election-item-row">
                        <div>
                          <p className="meta-value strong">{candidate.name}</p>
                          <p className="meta-label">{candidate.party}</p>
                        </div>
                        <div className="inline-actions">
                          <button type="button" className="small-btn light" onClick={() => handleEditCandidate(candidate)}>Edit</button>
                          <button type="button" className="small-btn danger" onClick={() => handleRemoveCandidate(candidate.id)}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="election-management-card">
                  <h4>3. Observer &amp; Analyst Assignment</h4>
                  <div className="assignment-columns">
                    <div>
                      <p className="meta-label">Observers</p>
                      <div className="election-inline-form">
                        <input
                          type="text"
                          value={newObserverInput}
                          placeholder="Add observer"
                          onChange={(event) => setNewObserverInput(event.target.value)}
                        />
                        <button type="button" className="small-btn dark" onClick={handleAddObserver}>Assign</button>
                      </div>
                      <div className="tag-list">
                        {managedObservers.map((observer) => (
                          <button
                            key={observer}
                            type="button"
                            className="assignment-tag"
                            onClick={() => handleRemoveObserver(observer)}
                            title="Remove observer"
                          >
                            {observer} ×
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="meta-label">Analysts</p>
                      <div className="election-inline-form">
                        <input
                          type="text"
                          value={newAnalystInput}
                          placeholder="Add analyst"
                          onChange={(event) => setNewAnalystInput(event.target.value)}
                        />
                        <button type="button" className="small-btn dark" onClick={handleAddAnalyst}>Assign</button>
                      </div>
                      <div className="tag-list">
                        {managedAnalysts.map((analyst) => (
                          <button
                            key={analyst}
                            type="button"
                            className="assignment-tag"
                            onClick={() => handleRemoveAnalyst(analyst)}
                            title="Remove analyst"
                          >
                            {analyst} ×
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {managedElection.status === 'ongoing' && (
                  <div className="election-management-card">
                    <h4>4. Live Voting Progress</h4>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${managedElection.turnoutPercent || 0}%` }} />
                    </div>
                    <p className="meta-value">{managedElection.turnout || 'Turnout data unavailable'}</p>
                  </div>
                )}

                <div className="election-management-card">
                  <h4>5. Security &amp; Integrity Alerts</h4>
                  <div className="election-item-list">
                    {managedSecurityAlerts.map((alert) => (
                      <div key={alert.id} className="election-item-row">
                        <div className="incident-meta">
                          <span className={`level-badge ${alert.level.toLowerCase()}`}>{alert.level}</span>
                          <p className="meta-value">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="election-management-card">
                  <h4>6. Election Control Actions</h4>
                  <div className="inline-actions">
                    {managedElection.status === 'upcoming' && (
                      <>
                        <button type="button" className="small-btn dark" onClick={() => handleElectionControlAction('start')}>Start Election</button>
                        <button type="button" className="small-btn danger" onClick={() => handleElectionControlAction('cancel')}>Cancel Election</button>
                      </>
                    )}
                    {managedElection.status === 'ongoing' && (
                      <button type="button" className="small-btn dark" onClick={() => handleElectionControlAction('end')}>End Election</button>
                    )}
                    {(managedElection.status === 'completed' || managedElection.status === 'cancelled') && (
                      <button type="button" className="small-btn dark" disabled>No actions available</button>
                    )}
                  </div>
                </div>

                <div className="election-management-card">
                  <h4>7. Audit Logs of Admin Actions</h4>
                  <div className="audit-log-list">
                    {electionAuditLogs.length === 0 ? (
                      <p className="meta-value">No actions recorded yet.</p>
                    ) : (
                      electionAuditLogs.map((log, index) => (
                        <div key={`${log.time}-${index}`} className="audit-log-entry">
                          <span>{log.time}</span>
                          <span>{log.admin}</span>
                          <span>{log.action}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="election-management-card">
                <p className="meta-value">Unable to load election details for {selectedElectionId}.</p>
              </div>
            )}

            <div className="election-management-footer">
              <button type="button" className="small-btn light" onClick={handleCloseElectionManagement}>Close</button>
              <button
                type="button"
                className="small-btn dark"
                onClick={handleSaveElectionManagement}
                disabled={isElectionLoading || !managedElection || !isAdminUser}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isResolveModalOpen && selectedIncident && (
        <div className="resolve-incident-modal-overlay" onClick={handleCloseResolveModal}>
          <div className="resolve-incident-modal" onClick={(event) => event.stopPropagation()}>
            <div className="resolve-incident-modal-header">
              <h3>Resolve Incident</h3>
              <button type="button" className="small-btn light" onClick={handleCloseResolveModal}>Close</button>
            </div>

            <div className="resolve-incident-section">
              <h4>Incident Details</h4>
              <div className="resolve-incident-grid">
                <p><strong>Incident ID:</strong> {selectedIncident.id}</p>
                <p><strong>Severity:</strong> {selectedIncident.level}</p>
                <p><strong>Title:</strong> {selectedIncident.title}</p>
                <p><strong>Detected At:</strong> {selectedIncident.time}</p>
                <p><strong>Affected User:</strong> {selectedIncident.affectedUser || 'N/A'}</p>
                <p className="resolve-incident-full"><strong>Description:</strong> {selectedIncident.description}</p>
              </div>
            </div>

            <div className="resolve-incident-section">
              <h4>Resolution Form</h4>
              <div className="resolve-form-grid">
                <div className="resolve-field">
                  <label htmlFor="resolutionAction">Resolution Action</label>
                  <select
                    id="resolutionAction"
                    value={resolutionAction}
                    onChange={(event) => setResolutionAction(event.target.value)}
                  >
                    <option value="">Select action</option>
                    <option value="Containment Completed">Containment Completed</option>
                    <option value="Access Revoked">Access Revoked</option>
                    <option value="Policy Updated">Policy Updated</option>
                    <option value="Escalated to Security Team">Escalated to Security Team</option>
                    <option value="False Positive Closed">False Positive Closed</option>
                  </select>
                </div>

                <div className="resolve-field">
                  <label htmlFor="resolvedBy">Resolved By</label>
                  <input id="resolvedBy" type="text" value={resolutionAdminName} readOnly />
                </div>

                <div className="resolve-field">
                  <label htmlFor="resolvedDate">Resolved Date</label>
                  <input id="resolvedDate" type="text" value={resolutionDate} readOnly />
                </div>

                <div className="resolve-field resolve-notes-field">
                  <label htmlFor="resolutionNotes">Admin Notes</label>
                  <textarea
                    id="resolutionNotes"
                    value={resolutionNotes}
                    onChange={(event) => setResolutionNotes(event.target.value)}
                    placeholder="Enter resolution notes..."
                    rows={4}
                  />
                </div>
              </div>

              {resolutionError && <p className="resolve-error-message">{resolutionError}</p>}
            </div>

            <div className="resolve-incident-actions">
              <button type="button" className="small-btn light" onClick={handleCloseResolveModal}>Cancel</button>
              <button type="button" className="small-btn dark" onClick={handleSubmitIncidentResolution}>Submit Resolution</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
