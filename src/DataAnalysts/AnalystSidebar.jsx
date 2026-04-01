import React, { useState } from 'react';

function AnalystSidebar({ activeTab, onTabChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'districtData', label: 'District Data', icon: '📍' },
    { id: 'stateData', label: 'State Data', icon: '🗺️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };

  return (
    <aside className={`analyst-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">📊</span>
          {!isCollapsed && <span className="logo-text">Analyst Panel</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

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

      <div className="sidebar-footer">
        {!isCollapsed && <span>v1.0</span>}
        {!isCollapsed && <span className="footer-status">Ready</span>}
      </div>
    </aside>
  );
}

export default AnalystSidebar;
