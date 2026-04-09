import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './DataAnalystProfessional.css';
import AnalystSidebar from './AnalystSidebar';

const ANALYST_PROFILE_KEY = 'emsAnalystProfile';
const CURRENT_USER_KEY = 'user';
const API_URL = import.meta.env.VITE_API_URL;

function getAnalystProfile() {
  const defaultProfile = {
    name: 'Data Analyst',
    email: 'analyst@system.com',
    phone: '+91 98765 43210',
    analystId: `ANAL-${Date.now()}`,
    status: 'Active',
    department: 'Analytics',
    accessLevel: 'Data Analysis',
    assignedDistrict: 'Not Assigned'
  };

  const storedProfile = localStorage.getItem(ANALYST_PROFILE_KEY);
  if (!storedProfile) return defaultProfile;

  try {
    const parsedProfile = JSON.parse(storedProfile);
    return {
      ...defaultProfile,
      ...parsedProfile,
      name: parsedProfile?.analystName || parsedProfile?.name || defaultProfile.name,
      analystId: parsedProfile?.analystId || parsedProfile?.id || defaultProfile.analystId,
      assignedDistrict: parsedProfile?.assignedDistrict || defaultProfile.assignedDistrict
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
  const [analystProfile, setAnalystProfile] = useState(() => getAnalystProfile());

  // District Data state
  const [districtStations, setDistrictStations] = useState([]);
  const [isDistrictLoading, setIsDistrictLoading] = useState(false);
  const [districtError, setDistrictError] = useState('');

  // State Data state
  const [allStations, setAllStations] = useState([]);
  const [isAllLoading, setIsAllLoading] = useState(false);
  const [allError, setAllError] = useState('');

  const analystInitials = analystProfile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem(ANALYST_PROFILE_KEY);
      toast.success('Data Analyst logged out successfully.');
      onLogout();
      navigate('/');
    }
  };

  // Fetch latest profile from backend so admin-assigned district is always current
  useEffect(() => {
    const fetchLatestProfile = async () => {
      const email = analystProfile.email;
      if (!email || email === 'analyst@system.com') return;

      try {
        const response = await axios.get(`${API_URL}/analystapi/profile`, {
          params: { email }
        });
        const latestData = response.data;
        if (!latestData || typeof latestData !== 'object') return;

        const updatedProfile = {
          ...analystProfile,
          name: latestData.analystName || latestData.name || analystProfile.name,
          email: latestData.email || analystProfile.email,
          phone: latestData.phone || analystProfile.phone,
          assignedDistrict: latestData.assignedDistrict || 'Not Assigned',
          status: latestData.status || analystProfile.status,
          role: latestData.role || analystProfile.role
        };

        setAnalystProfile(updatedProfile);
        localStorage.setItem(ANALYST_PROFILE_KEY, JSON.stringify(latestData));
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(latestData));
      } catch {
        // Fall back to cached profile silently
      }
    };

    fetchLatestProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch district polling stations whenever assignedDistrict changes
  useEffect(() => {
    const fetchDistrictStations = async () => {
      if (!analystProfile.assignedDistrict || analystProfile.assignedDistrict === 'Not Assigned') {
        setDistrictStations([]);
        return;
      }

      setIsDistrictLoading(true);
      setDistrictError('');

      try {
        const response = await axios.get(`${API_URL}/analystapi/polling-stations/my-district`, {
          params: { district: analystProfile.assignedDistrict }
        });
        const data = response.data;
        setDistrictStations(Array.isArray(data) ? data : []);
      } catch (error) {
        const apiMessage =
          typeof error?.response?.data === 'string'
            ? error.response.data
            : error?.response?.data?.message;
        setDistrictError(apiMessage || 'Could not load district polling stations.');
        setDistrictStations([]);
      } finally {
        setIsDistrictLoading(false);
      }
    };

    fetchDistrictStations();
  }, [analystProfile.assignedDistrict]);

  // Fetch all polling stations for state-level analysis
  useEffect(() => {
    const fetchAllStations = async () => {
      setIsAllLoading(true);
      setAllError('');

      try {
        const response = await axios.get(`${API_URL}/analystapi/polling-stations/all`);
        const data = response.data;
        setAllStations(Array.isArray(data) ? data : []);
      } catch (error) {
        const apiMessage =
          typeof error?.response?.data === 'string'
            ? error.response.data
            : error?.response?.data?.message;
        setAllError(apiMessage || 'Could not load state polling data.');
        setAllStations([]);
      } finally {
        setIsAllLoading(false);
      }
    };

    fetchAllStations();
  }, []);

  // Group all stations by state for State Data tab
  const stationsByState = allStations.reduce((acc, station) => {
    const state = station.state || 'Unknown';
    if (!acc[state]) acc[state] = [];
    acc[state].push(station);
    return acc;
  }, {});

  // Analytics computed from real data
  const totalStations = allStations.length;
  const districtCount = new Set(allStations.map(s => s.district).filter(Boolean)).size;
  const stateCount = new Set(allStations.map(s => s.state).filter(Boolean)).size;
  const totalCapacity = allStations.reduce((sum, s) => sum + (s.capacity || 0), 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderContent = () => {
    switch (activeTab) {

      // ── DISTRICT DATA ─────────────────────────────────────────────────────
      case 'districtData':
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>District Data Analysis</h2>
                <p>Polling stations in your assigned district — {analystProfile.assignedDistrict}</p>
              </div>
            </div>

            {analystProfile.assignedDistrict === 'Not Assigned' && (
              <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '8px', color: '#92400e', border: '1px solid #fde68a' }}>
                ⚠️ No district has been assigned to you yet. Contact your administrator.
              </div>
            )}

            {districtError && (
              <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '8px', color: '#991b1b', marginTop: '12px' }}>
                {districtError}
              </div>
            )}

            {isDistrictLoading ? (
              <div style={{ marginTop: '16px', color: '#1d4ed8' }}>⏳ Loading polling stations...</div>
            ) : (
              <div style={{ display: 'grid', gap: '14px', marginTop: '16px' }}>
                {districtStations.length === 0 && analystProfile.assignedDistrict !== 'Not Assigned' && !districtError && (
                  <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', color: '#475569' }}>
                    No polling stations found for <strong>{analystProfile.assignedDistrict}</strong>.
                  </div>
                )}
                {districtStations.map((station, index) => (
                  <div
                    key={station.id || index}
                    style={{
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      padding: '18px 20px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }}
                  >
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#1e293b' }}>
                      {station.stationName || station.name}
                    </h3>
                    <p style={{ margin: '4px 0', color: '#475569' }}>
                      <strong>Location:</strong> {station.location || '-'}
                    </p>
                    <p style={{ margin: '4px 0', color: '#475569' }}>
                      <strong>District:</strong> {station.district || '-'}
                    </p>
                    <p style={{ margin: '4px 0', color: '#475569' }}>
                      <strong>State:</strong> {station.state || '-'}
                    </p>
                    {station.capacity && (
                      <p style={{ margin: '4px 0', color: '#475569' }}>
                        <strong>Capacity:</strong> {station.capacity.toLocaleString()}
                      </p>
                    )}
                    {station.address && (
                      <p style={{ margin: '4px 0', color: '#64748b', fontSize: '0.9rem' }}>
                        <strong>Address:</strong> {station.address}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p style={{ marginTop: '12px', color: '#64748b', fontSize: '0.9rem' }}>
              Total stations in {analystProfile.assignedDistrict}: <strong>{districtStations.length}</strong>
            </p>
          </div>
        );

      // ── STATE DATA ────────────────────────────────────────────────────────
      case 'stateData':
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>State Data Analysis</h2>
                <p>Polling stations grouped by state across all districts</p>
              </div>
            </div>

            {allError && (
              <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '8px', color: '#991b1b', marginBottom: '12px' }}>
                {allError}
              </div>
            )}

            {isAllLoading ? (
              <div style={{ marginTop: '16px', color: '#1d4ed8' }}>⏳ Loading state data...</div>
            ) : (
              <div style={{ display: 'grid', gap: '14px', marginTop: '16px' }}>
                {Object.keys(stationsByState).length === 0 && !allError && (
                  <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', color: '#475569' }}>
                    No polling stations found in the system.
                  </div>
                )}
                {Object.entries(stationsByState).map(([state, stations]) => {
                  const districts = new Set(stations.map(s => s.district).filter(Boolean));
                  const totalCap = stations.reduce((sum, s) => sum + (s.capacity || 0), 0);
                  return (
                    <div
                      key={state}
                      style={{
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        padding: '18px 20px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                      }}
                    >
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#1e293b' }}>
                        {state}
                      </h3>
                      <p style={{ margin: '4px 0', color: '#475569' }}>
                        <strong>Districts:</strong> {districts.size}
                      </p>
                      <p style={{ margin: '4px 0', color: '#475569' }}>
                        <strong>Active Stations:</strong> {stations.length}
                      </p>
                      {totalCap > 0 && (
                        <p style={{ margin: '4px 0', color: '#475569' }}>
                          <strong>Total Capacity:</strong> {totalCap.toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      // ── ANALYTICS ─────────────────────────────────────────────────────────
      case 'analytics':
        return (
          <div className="tab-content">
            <div className="section-header">
              <div>
                <h2>Advanced Analytics</h2>
                <p>In-depth election analysis and insights</p>
              </div>
            </div>

            {isAllLoading ? (
              <div style={{ marginTop: '16px', color: '#1d4ed8' }}>⏳ Loading analytics...</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.9rem' }}>Total Polling Stations</p>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>{totalStations}</p>
                  </div>
                  <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.9rem' }}>Total Districts</p>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>{districtCount}</p>
                  </div>
                  <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.9rem' }}>Total States</p>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>{stateCount}</p>
                  </div>
                  {totalCapacity > 0 && (
                    <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                      <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.9rem' }}>Total Capacity</p>
                      <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>{totalCapacity.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* District breakdown for assigned district */}
                {districtStations.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <h3 style={{ color: '#1e293b', marginBottom: '12px' }}>
                      Your District: {analystProfile.assignedDistrict}
                    </h3>
                    <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                      <p style={{ margin: '4px 0', color: '#475569' }}>
                        <strong>Active Stations:</strong> {districtStations.length}
                      </p>
                      {districtStations.some(s => s.capacity) && (
                        <p style={{ margin: '4px 0', color: '#475569' }}>
                          <strong>District Capacity:</strong> {districtStations.reduce((sum, s) => sum + (s.capacity || 0), 0).toLocaleString()}
                        </p>
                      )}
                      <p style={{ margin: '4px 0', color: '#475569' }}>
                        <strong>State:</strong> {districtStations[0]?.state || '-'}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );

      // ── DASHBOARD ─────────────────────────────────────────────────────────
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
                <p>
                  {analystProfile.assignedDistrict !== 'Not Assigned'
                    ? `${districtStations.length} station(s) in ${analystProfile.assignedDistrict}`
                    : 'No district assigned yet'}
                </p>
                <button className="card-btn" onClick={() => setActiveTab('districtData')}>
                  View District Data
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">🗺️</div>
                <h3>State Data</h3>
                <p>{Object.keys(stationsByState).length} state(s) · {allStations.length} total stations</p>
                <button className="card-btn" onClick={() => setActiveTab('stateData')}>
                  View State Data
                </button>
              </div>
              <div className="dashboard-card">
                <div className="card-icon">📈</div>
                <h3>Advanced Analytics</h3>
                <p>{districtCount} district(s) · {stateCount} state(s)</p>
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
                  <p><strong>Assigned District:</strong> {analystProfile.assignedDistrict}</p>
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
