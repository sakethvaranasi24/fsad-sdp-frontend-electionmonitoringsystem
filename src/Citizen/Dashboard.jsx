import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './CitizenProfessional.css';
import CitizenSidebar from './CitizenSidebar';

// Components
import Register from './Register';
import ReportIssue from './ReportIssue';
import ViewReports from './ViewReports';
import PollingStations from './PollingStations';
import ElectionResults from './ElectionResults';

const CITIZEN_PROFILE_KEY = 'emsCitizenProfile';
const CURRENT_USER_KEY = 'user';

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

function getCitizenProfile() {
  const currentUserProfile = getCurrentUserProfile();
  const defaultProfile = {
    name: 'John Citizen',
    email: 'john.citizen@email.com',
    phone: '+91 98765 43210',
    voterId: `VID-${Date.now()}`,
    status: 'Registered',
    registrationDate: new Date().toLocaleDateString(),
    district: '',
    state: ''
  };

  const mapEmail = (profile) => {
    if (!profile || typeof profile !== 'object') return '';
    return profile.email
      || profile.mail
      || profile.mailId
      || profile.userEmail
      || profile.emailId
      || (profile.username && profile.username.includes('@') ? profile.username : '')
      || (profile.userName && profile.userName.includes('@') ? profile.userName : '')
      || '';
  };

  if (currentUserProfile) {
    return {
      ...defaultProfile,
      ...currentUserProfile,
      name: currentUserProfile?.citizenName || currentUserProfile?.name || currentUserProfile?.userName || currentUserProfile?.username || defaultProfile.name,
      email: mapEmail(currentUserProfile) || defaultProfile.email,
      phone: currentUserProfile?.phone || currentUserProfile?.mobile || currentUserProfile?.phoneNumber || defaultProfile.phone
    };
  }

  const storedProfile = localStorage.getItem(CITIZEN_PROFILE_KEY);
  if (!storedProfile) {
    return defaultProfile;
  }

  try {
    const parsedProfile = JSON.parse(storedProfile);
    return {
      ...defaultProfile,
      ...parsedProfile,
      name: parsedProfile?.citizenName || parsedProfile?.name || parsedProfile?.userName || parsedProfile?.username || defaultProfile.name,
      email: mapEmail(parsedProfile) || defaultProfile.email,
      phone: parsedProfile?.phone || parsedProfile?.mobile || parsedProfile?.phoneNumber || defaultProfile.phone
    };
  } catch {
    return defaultProfile;
  }
}

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [citizenProfile, setCitizenProfile] = useState(() => getCitizenProfile());
  const [locationForm, setLocationForm] = useState({ state: '', district: '', email: '' });

  const citizenInitials = citizenProfile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      toast.success('Citizen logged out successfully.');
      onLogout();
      navigate('/');
    }
  };

  const handleProfileSave = () => {
    const updatedProfile = {
      ...citizenProfile,
      email: locationForm.email.trim(),
      state: locationForm.state.trim(),
      district: locationForm.district.trim()
    };

    setCitizenProfile(updatedProfile);
    localStorage.setItem(CITIZEN_PROFILE_KEY, JSON.stringify(updatedProfile));
    toast.success('Profile details updated successfully.');
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

  useEffect(() => {
    setLocationForm({
      email: citizenProfile.email || '',
      state: citizenProfile.state || '',
      district: citizenProfile.district || ''
    });
  }, [citizenProfile]);

  const renderContent = () => {
    switch(activeTab) {
      case 'elections':
        return (
          <ElectionResults
            citizenProfile={citizenProfile}
            onRegisterNow={() => setActiveTab('register')}
          />
        );
      case 'register':
        return <Register citizenProfile={citizenProfile} />;
      case 'reportIssue':
        return <ReportIssue />;
      case 'viewReports':
        return <ViewReports />;
      case 'pollingStations':
        return (
          <PollingStations
            preferredState={citizenProfile.state}
            preferredDistrict={citizenProfile.district}
          />
        );
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
                  <p><strong>Email:</strong> {citizenProfile.email || 'Not Available'}</p>
                  <p><strong>Phone:</strong> {citizenProfile.phone}</p>
                  <p><strong>Voter ID:</strong> {citizenProfile.voterId}</p>
                  <p><strong>Status:</strong> <span className="status-active">{citizenProfile.status}</span></p>
                  <p><strong>State:</strong> {citizenProfile.state || 'Not Set'}</p>
                  <p><strong>District:</strong> {citizenProfile.district || 'Not Set'}</p>
                  <p><strong>Registered:</strong> {citizenProfile.registrationDate}</p>
                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label htmlFor="citizen-email">Email</label>
                    <input
                      id="citizen-email"
                      type="email"
                      placeholder="Enter your email"
                      value={locationForm.email}
                      onChange={(e) => setLocationForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label htmlFor="citizen-state">State</label>
                    <input
                      id="citizen-state"
                      type="text"
                      placeholder="Enter your state"
                      value={locationForm.state}
                      onChange={(e) => setLocationForm((prev) => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="citizen-district">District</label>
                    <input
                      id="citizen-district"
                      type="text"
                      placeholder="Enter your district"
                      value={locationForm.district}
                      onChange={(e) => setLocationForm((prev) => ({ ...prev, district: e.target.value }))}
                    />
                  </div>
                  <button
                    type="button"
                    className="card-btn"
                    style={{ width: '100%', marginTop: '8px' }}
                    onClick={handleProfileSave}
                  >
                    Save Details
                  </button>
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
