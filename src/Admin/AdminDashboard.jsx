import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

const ADMIN_PROFILE_KEY = 'emsAdminProfile';
const CURRENT_USER_KEY = 'user';
const API_URL = import.meta.env.VITE_API_URL;

function getCurrentUserProfile() {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(currentUser);
    return parsedUser && typeof parsedUser === 'object' ? parsedUser : null;
  } catch {
    return null;
  }
}

function getAdminProfile() {
  const currentUserProfile = getCurrentUserProfile();
  const defaultProfile = {
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

  if (currentUserProfile) {
    return {
      ...defaultProfile,
      ...currentUserProfile,
      name: currentUserProfile?.adminName || currentUserProfile?.name || currentUserProfile?.userName || currentUserProfile?.username || defaultProfile.name,
      email: currentUserProfile?.email || defaultProfile.email,
      phone: currentUserProfile?.phone || currentUserProfile?.mobile || currentUserProfile?.phoneNumber || defaultProfile.phone,
      adminId: currentUserProfile?.adminId || currentUserProfile?.id || defaultProfile.adminId,
      accountStatus: currentUserProfile?.status || currentUserProfile?.accountStatus || defaultProfile.accountStatus,
      accessLevel: currentUserProfile?.accessLevel || defaultProfile.accessLevel,
      role: currentUserProfile?.role || defaultProfile.role,
      lastLogin: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }

  const storedProfile = localStorage.getItem(ADMIN_PROFILE_KEY);
  if (!storedProfile) {
    return defaultProfile;
  }

  try {
    const parsedProfile = JSON.parse(storedProfile);
    return {
      ...defaultProfile,
      ...parsedProfile,
      name: parsedProfile?.adminName || parsedProfile?.name || parsedProfile?.userName || parsedProfile?.username || defaultProfile.name,
      email: parsedProfile?.email || defaultProfile.email,
      phone: parsedProfile?.phone || parsedProfile?.mobile || parsedProfile?.phoneNumber || defaultProfile.phone,
      adminId: parsedProfile?.adminId || parsedProfile?.id || defaultProfile.adminId,
      accountStatus: parsedProfile?.status || parsedProfile?.accountStatus || defaultProfile.accountStatus,
      accessLevel: parsedProfile?.accessLevel || defaultProfile.accessLevel,
      role: parsedProfile?.role || defaultProfile.role,
      lastLogin: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  } catch {
    return defaultProfile;
  }
}

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('view');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [adminProfile, setAdminProfile] = useState(() => getAdminProfile());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    name: '',
    email: '',
    phone: '',
    accessLevel: ''
  });
  const [profileStatus, setProfileStatus] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const profileDropdownRef = useRef(null);

  const adminInitials = adminProfile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem(ADMIN_PROFILE_KEY);
      toast.success('Admin logged out successfully.');
      onLogout();
      navigate('/');
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchLatestAdminProfile = async () => {
      const email = adminProfile.email;
      if (!email || email === 'admin@system.com') {
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/adminapi/profile`, {
          params: { email }
        });
        const latestData = response.data;
        if (!latestData || typeof latestData !== 'object') {
          return;
        }

        const responseObject = latestData?.response && typeof latestData.response === 'object'
          ? latestData.response
          : latestData;

        const updatedProfile = {
          ...adminProfile,
          ...responseObject,
          name: responseObject?.adminName || responseObject?.name || responseObject?.userName || responseObject?.username || adminProfile.name,
          email: responseObject?.email || adminProfile.email,
          phone: responseObject?.phone || responseObject?.mobile || responseObject?.phoneNumber || adminProfile.phone,
          adminId: responseObject?.adminId || responseObject?.id || adminProfile.adminId,
          accessLevel: responseObject?.accessLevel || adminProfile.accessLevel,
          accountStatus: responseObject?.status || responseObject?.accountStatus || adminProfile.accountStatus,
          role: responseObject?.role || adminProfile.role,
          lastLogin: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        setAdminProfile(updatedProfile);
        localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(responseObject));
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(responseObject));
      } catch {
        // Silent fallback to cached profile
      }
    };

    fetchLatestAdminProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartEditProfile = () => {
    setProfileDraft({
      name: adminProfile.name || '',
      email: adminProfile.email || '',
      phone: adminProfile.phone || '',
      accessLevel: adminProfile.accessLevel || ''
    });
    setProfileStatus('');
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    setProfileStatus('');
  };

  const handleProfileFieldChange = (field, value) => {
    setProfileDraft((prev) => ({
      ...prev,
      [field]: value
    }));
    if (profileStatus) {
      setProfileStatus('');
    }
  };

  const handleSaveProfile = async () => {
    const trimmedName = profileDraft.name.trim();
    const trimmedEmail = profileDraft.email.trim().toLowerCase();
    const trimmedPhone = profileDraft.phone.trim();
    const trimmedAccessLevel = profileDraft.accessLevel.trim();

    if (!trimmedName || !trimmedEmail) {
      setProfileStatus('Name and email are required.');
      return;
    }

    const updatePayload = {
      id: adminProfile.adminId,
      adminId: adminProfile.adminId,
      name: trimmedName,
      adminName: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      accessLevel: trimmedAccessLevel || adminProfile.accessLevel,
      role: adminProfile.role || 'ADMIN',
      status: adminProfile.accountStatus || 'Active'
    };

    const candidateRequests = [
      { url: `${API_URL}/adminapi/profile/update`, method: 'PUT' },
      { url: `${API_URL}/adminapi/profile/update`, method: 'PATCH' },
      { url: `${API_URL}/adminapi/update-profile`, method: 'PUT' },
      { url: `${API_URL}/adminapi/update`, method: 'PUT' }
    ];

    setIsSavingProfile(true);
    setProfileStatus('Saving profile...');

    try {
      let savedResponse = null;

      for (const request of candidateRequests) {
        try {
          const response = await axios({
            url: request.url,
            method: request.method.toLowerCase(),
            data: updatePayload,
            validateStatus: () => true
          });

          if (response.status < 200 || response.status >= 300) {
            continue;
          }

          savedResponse = response.data;
          break;
        } catch {
          // Try next candidate endpoint
        }
      }

      if (!savedResponse) {
        setProfileStatus('Unable to update database profile. Check backend update endpoint configuration.');
        return;
      }

      const responseObject = savedResponse?.response && typeof savedResponse.response === 'object'
        ? savedResponse.response
        : savedResponse;

      const updatedProfile = {
        ...adminProfile,
        ...updatePayload,
        ...(responseObject && typeof responseObject === 'object' ? responseObject : {}),
        name: responseObject?.adminName || responseObject?.name || updatePayload.name,
        email: responseObject?.email || updatePayload.email,
        phone: responseObject?.phone || updatePayload.phone,
        accessLevel: responseObject?.accessLevel || updatePayload.accessLevel,
        adminId: responseObject?.adminId || responseObject?.id || updatePayload.adminId,
        accountStatus: responseObject?.status || responseObject?.accountStatus || adminProfile.accountStatus,
        role: responseObject?.role || adminProfile.role,
        lastLogin: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setAdminProfile(updatedProfile);
      localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(updatedProfile));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedProfile));
      setProfileStatus('Profile updated and saved to database.');
      toast.success('Profile updated successfully.');
      setIsEditingProfile(false);
    } catch {
      setProfileStatus('Failed to save profile. Please try again.');
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
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
                  {isEditingProfile ? (
                    <div className="profile-edit-form">
                      <label className="profile-edit-label" htmlFor="adminEditName">Name</label>
                      <input
                        id="adminEditName"
                        className="profile-edit-input"
                        type="text"
                        value={profileDraft.name}
                        onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                      />

                      <label className="profile-edit-label" htmlFor="adminEditEmail">Email</label>
                      <input
                        id="adminEditEmail"
                        className="profile-edit-input"
                        type="email"
                        value={profileDraft.email}
                        onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                      />

                      <label className="profile-edit-label" htmlFor="adminEditPhone">Phone</label>
                      <input
                        id="adminEditPhone"
                        className="profile-edit-input"
                        type="text"
                        value={profileDraft.phone}
                        onChange={(e) => handleProfileFieldChange('phone', e.target.value)}
                      />

                      <label className="profile-edit-label" htmlFor="adminEditAccess">Access Level</label>
                      <input
                        id="adminEditAccess"
                        className="profile-edit-input"
                        type="text"
                        value={profileDraft.accessLevel}
                        onChange={(e) => handleProfileFieldChange('accessLevel', e.target.value)}
                      />

                      {profileStatus && <p className="profile-status-text">{profileStatus}</p>}

                      <div className="profile-edit-actions">
                        <button
                          className="dropdown-btn"
                          type="button"
                          disabled={isSavingProfile}
                          onClick={handleSaveProfile}
                        >
                          {isSavingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          className="dropdown-btn"
                          type="button"
                          disabled={isSavingProfile}
                          onClick={handleCancelEditProfile}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p><strong>Name:</strong> {adminProfile.name}</p>
                      <p><strong>Email:</strong> {adminProfile.email}</p>
                      <p><strong>Phone:</strong> {adminProfile.phone}</p>
                      <p><strong>Admin ID:</strong> {adminProfile.adminId}</p>
                      <p><strong>Access Level:</strong> {adminProfile.accessLevel}</p>
                      <p><strong>Last Login:</strong> {adminProfile.lastLogin}</p>
                      <p><strong>Status:</strong> <span className="status-active">{adminProfile.accountStatus}</span></p>
                      {profileStatus && <p className="profile-status-text">{profileStatus}</p>}
                    </>
                  )}
                </div>
                {!isEditingProfile && (
                  <button className="dropdown-btn" onClick={handleStartEditProfile}>
                    Edit Profile
                  </button>
                )}
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
                Assign Station/District
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
