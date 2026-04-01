import React from 'react';

function AdminNavbar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'pollingStations', label: '🏢 Polling Stations' },
    { id: 'observers', label: '👁️ Observers' },
    { id: 'dataAnalysts', label: '📈 Data Analysts' }
  ];

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        <span className="admin-brand-icon">⚙️</span>
        <span className="admin-brand-text">Admin Control Panel</span>
      </div>

      <div className="admin-navbar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-navbar-actions">
        {/* Logout is handled in the header profile dropdown */}
      </div>
    </nav>
  );
}

export default AdminNavbar;
