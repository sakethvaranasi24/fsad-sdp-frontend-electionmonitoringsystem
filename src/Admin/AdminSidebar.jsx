import React, { useState } from 'react';

function AdminSidebar({ activeTab, onTabChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'pollingStations', label: 'Polling Stations', icon: '🏢' },
    { id: 'observers', label: 'Observers', icon: '👁️' },
    { id: 'dataAnalysts', label: 'Data Analysts', icon: '📈' }
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">⚙️</span>
          {!isCollapsed && <span className="logo-text">Admin Panel</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {!isCollapsed && <p className="nav-label">Main Menu</p>}
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              title={tab.label}
            >
              <span className="nav-icon">{tab.icon}</span>
              {!isCollapsed && <span className="nav-text">{tab.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="sidebar-version">
            <p>v1.0</p>
            <small>Ready</small>
          </div>
        )}
      </div>
    </aside>
  );
}

export default AdminSidebar;
