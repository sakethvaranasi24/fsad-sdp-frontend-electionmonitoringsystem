import React, { useState } from 'react';

function CitizenSidebar({ activeTab, onTabChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'elections', label: 'Elections', icon: '🗳️' },
    { id: 'reportIssue', label: 'Report Issue', icon: '🚨' },
    { id: 'viewReports', label: 'My Reports', icon: '📋' },
    { id: 'pollingStations', label: 'Polling Stations', icon: '📍' }
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };

  return (
    <aside className={`citizen-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🗳️</span>
          {!isCollapsed && <span className="logo-text">Citizen Portal</span>}
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

      {/* Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && <span>v1.0</span>}
        {!isCollapsed && <span className="footer-status">Ready</span>}
      </div>
    </aside>
  );
}

export default CitizenSidebar;
