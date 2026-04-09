import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ElectionObserverProfessional.css';
import ObserverSidebar from './ObserverSidebar';

const OBSERVER_PROFILE_KEY = 'emsObserverProfile';
const CURRENT_USER_KEY = 'user';
const OBSERVER_REPORTS_KEY = 'emsObserverSubmittedReports';
const API_URL = import.meta.env.VITE_API_URL;

function isObserverRole(role) {
  if (!role || typeof role !== 'string') {
    return false;
  }

  const normalized = role.trim().toUpperCase();
  return normalized === 'ELECTION_OBSERVER' || normalized === 'ELECTIONOBSERVER' || normalized === 'OBSERVER';
}

function normalizeStations(payload) {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.response)
      ? payload.response
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return items.map((station, index) => ({
    id: station.id || station.stationId || `observer-station-${index}`,
    name: station.stationName || station.name || 'Polling Station',
    location: station.location || station.address || '-',
    district: station.district || '-',
    state: station.state || '-'
  }));
}

function getObserverProfile() {
  const defaultProfile = {
    name: 'Observer User',
    email: 'observer@system.com',
    phone: '+91 98765 43210',
    observerId: `OBS-${Date.now()}`,
    status: 'Active',
    district: 'Not Assigned',
    assignedStation: '',
    assignedStations: 0
  };

  const storedProfile = localStorage.getItem(OBSERVER_PROFILE_KEY);
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);

  let parsedStoredProfile = null;
  let parsedCurrentUser = null;

  try {
    parsedStoredProfile = storedProfile ? JSON.parse(storedProfile) : null;
  } catch {
    parsedStoredProfile = null;
  }

  try {
    parsedCurrentUser = currentUser ? JSON.parse(currentUser) : null;
  } catch {
    parsedCurrentUser = null;
  }

  const profileSource = isObserverRole(parsedCurrentUser?.role)
    ? { ...parsedStoredProfile, ...parsedCurrentUser }
    : parsedStoredProfile;

  if (!profileSource) {
    return defaultProfile;
  }

  try {
    return {
      ...defaultProfile,
      ...profileSource,
      name: profileSource?.observerName || profileSource?.name || defaultProfile.name,
      observerId: profileSource?.observerId || profileSource?.id || defaultProfile.observerId,
      district: profileSource?.district || defaultProfile.district,
      assignedStation: profileSource?.assignedStation || profileSource?.stationName || defaultProfile.assignedStation,
      assignedStations: profileSource?.assignedStations || profileSource?.assignedStationCount || defaultProfile.assignedStations
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
  const [observerProfile, setObserverProfile] = useState(() => getObserverProfile());
  const [assignedStations, setAssignedStations] = useState([]);
  const [isStationsLoading, setIsStationsLoading] = useState(false);
  const [stationsError, setStationsError] = useState('');
  const [reportForm, setReportForm] = useState({
    pollingStation: '',
    issueType: 'Queue Delay',
    severity: 'Medium',
    description: ''
  });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportStatus, setReportStatus] = useState('');

  const observerInitials = observerProfile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem(OBSERVER_PROFILE_KEY);
      toast.success('Election Observer logged out successfully.');
      onLogout();
      navigate('/');
    }
  };

  // Fetch the latest profile from backend so admin-assigned station & district are always current
  useEffect(() => {
    const fetchLatestProfile = async () => {
      const email = observerProfile.email;
      if (!email || email === 'observer@system.com') return;

      try {
        const response = await axios.get(`${API_URL}/observerapi/profile`, {
          params: { email }
        });
        const latestData = response.data;
        if (!latestData || typeof latestData !== 'object') return;

        // Merge backend data into profile and update localStorage
        const updatedProfile = {
          ...observerProfile,
          name: latestData.observerName || latestData.name || observerProfile.name,
          email: latestData.email || observerProfile.email,
          phone: latestData.phone || observerProfile.phone,
          district: latestData.district || 'Not Assigned',
          assignedStation: latestData.assignedStation || '',
          status: latestData.status || observerProfile.status,
          role: latestData.role || observerProfile.role
        };

        setObserverProfile(updatedProfile);
        localStorage.setItem(OBSERVER_PROFILE_KEY, JSON.stringify(latestData));
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(latestData));
      } catch {
        // Silently fall back to cached profile
      }
    };

    fetchLatestProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    const fetchAssignedStations = async () => {
      if (!observerProfile.district || observerProfile.district === 'Not Assigned') {
        setAssignedStations([]);
        setStationsError('No primary district found for this observer.');
        return;
      }

      setIsStationsLoading(true);
      setStationsError('');

      try {
        const response = await axios.get(`${API_URL}/observerapi/my-district-stations`, {
          params: { district: observerProfile.district }
        });
        const responseData = response.data;
        setAssignedStations(normalizeStations(responseData));
      } catch (error) {
        const apiMessage =
          typeof error?.response?.data === 'string'
            ? error.response.data
            : error?.response?.data?.message;
        setStationsError(apiMessage || 'Unable to load assigned stations.');
        setAssignedStations([]);
      } finally {
        setIsStationsLoading(false);
      }
    };

    fetchAssignedStations();
  }, [observerProfile.district]);

  useEffect(() => {
    if (reportForm.pollingStation) {
      return;
    }

    if (assignedStations.length > 0) {
      setReportForm((prev) => ({ ...prev, pollingStation: assignedStations[0].name }));
      return;
    }

    if (observerProfile.assignedStation) {
      setReportForm((prev) => ({ ...prev, pollingStation: observerProfile.assignedStation }));
    }
  }, [assignedStations, observerProfile.assignedStation, reportForm.pollingStation]);

  const handleReportFieldChange = (field, value) => {
    setReportStatus('');
    setReportForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();

    const description = reportForm.description.trim();
    if (!reportForm.pollingStation || !description) {
      setReportStatus('Please select a polling station and enter a detailed description.');
      return;
    }

    const payload = {
      observerId: observerProfile.observerId,
      email: observerProfile.email,
      district: observerProfile.district,
      assignedStation: reportForm.pollingStation,
      issueType: reportForm.issueType,
      severity: reportForm.severity,
      description,
      reportedAt: new Date().toISOString()
    };

    setIsSubmittingReport(true);
    setReportStatus('');

    try {
      try {
        await axios.post(`${API_URL}/observerapi/report/submit`, payload);
        setReportStatus('Submitted report successfully.');
      } catch {
        const savedReports = JSON.parse(localStorage.getItem(OBSERVER_REPORTS_KEY) || '[]');
        savedReports.unshift({ ...payload, status: 'queued-locally' });
        localStorage.setItem(OBSERVER_REPORTS_KEY, JSON.stringify(savedReports));
        setReportStatus('Submitted report successfully. Saved locally and will sync when backend is available.');
      }

      setReportForm((prev) => ({
        ...prev,
        issueType: 'Queue Delay',
        severity: 'Medium',
        description: ''
      }));
    } catch {
      const savedReports = JSON.parse(localStorage.getItem(OBSERVER_REPORTS_KEY) || '[]');
      savedReports.unshift({ ...payload, status: 'queued-locally' });
      localStorage.setItem(OBSERVER_REPORTS_KEY, JSON.stringify(savedReports));
      setReportStatus('Submitted report successfully.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'assigned':
        return (
          <div className="tab-content">
            {stationsError && (
              <div style={{ marginTop: '12px', color: '#dc2626' }}>{stationsError}</div>
            )}
            
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '24px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>Assigned Stations</h2>
              <p style={{ color: '#64748b', margin: '0 0 20px 0' }}>View your assigned polling stations</p>

              <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', marginBottom: '24px' }}>
                <p style={{ margin: 0, color: '#0f172a' }}>
                  You are assigned to {assignedStations.length} polling stations in {observerProfile.district}.
                </p>
              </div>

              {isStationsLoading ? (
                <div style={{ color: '#1d4ed8' }}>Loading assigned stations...</div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '16px' 
                }}>
                  {assignedStations.map((station) => (
                    <div
                      key={station.id}
                      style={{
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        padding: '20px',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{station.name}</h4>
                        <span style={{ 
                          background: '#dcfce7', 
                          color: '#166534', 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          Active
                        </span>
                      </div>
                      <p style={{ margin: '8px 0 4px', color: '#334155', fontSize: '0.9rem' }}>
                        <strong style={{ color: '#0f172a' }}>Location:</strong> {station.location}
                      </p>
                      <p style={{ margin: '4px 0 0', color: '#334155', fontSize: '0.9rem' }}>
                        <strong style={{ color: '#0f172a' }}>District:</strong> {station.district}
                      </p>
                    </div>
                  ))}
                  {assignedStations.length === 0 && (
                    <p style={{ marginTop: '8px', color: '#475569', gridColumn: '1 / -1' }}>No stations returned for this assignment.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'verify':
        return (
          <div className="tab-content">
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '24px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>Verify Voters</h2>
              <p style={{ color: '#64748b', margin: '0 0 24px 0' }}>Verify voter information and eligibility before allowing a vote.</p>
              
              <div style={{ 
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="voterId" style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: '#334155', 
                    marginBottom: '8px' 
                  }}>
                    Enter Voter ID
                  </label>
                  <input 
                    type="text" 
                    id="voterId"
                    placeholder="e.g. VID-1001" 
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <button style={{
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginTop: '25px',
                  whiteSpace: 'nowrap'
                }}>
                  Verify
                </button>
              </div>
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
                <p>Welcome to the Observer Panel. Monitor elections and verify voter details.</p>
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
                  <p><strong>Assigned Station:</strong> {observerProfile.assignedStation || 'Not Assigned'}</p>
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
