import React from 'react';

function DistrictOverview({ district, lastUpdated }) {
  const statusLabel = district.status === 'active' ? 'Active Polling' : 'Closed';
  const statusClass = district.status === 'active' ? 'status-active' : 'status-closed';

  return (
    <div className="district-overview">
      <div className="overview-header">
        <div>
          <h3>{district.name}</h3>
          <p>Election Phase: {district.phase}</p>
        </div>
        <span className={`district-status ${statusClass}`}>{statusLabel}</span>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <span>Total Polling Stations</span>
          <strong>{district.pollingStations.length}</strong>
        </div>
        <div className="overview-card">
          <span>Total Registered Voters</span>
          <strong>{district.registeredVoters.toLocaleString('en-IN')}</strong>
        </div>
        <div className="overview-card">
          <span>Observer Assigned</span>
          <strong>{district.observer}</strong>
        </div>
        <div className="overview-card">
          <span>Last Updated</span>
          <strong>{lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</strong>
        </div>
      </div>
    </div>
  );
}

export default DistrictOverview;
