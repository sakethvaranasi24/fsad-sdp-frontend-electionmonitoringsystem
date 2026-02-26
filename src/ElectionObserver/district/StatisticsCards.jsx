import React from 'react';

function StatisticsCards({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span>Total Registered Voters</span>
        <strong>{stats.totalRegistered.toLocaleString('en-IN')}</strong>
      </div>
      <div className="stat-card">
        <span>Total Votes Cast</span>
        <strong>{stats.totalVotesCast.toLocaleString('en-IN')}</strong>
      </div>
      <div className="stat-card">
        <span>Total Not Voted</span>
        <strong>{stats.totalNotVoted.toLocaleString('en-IN')}</strong>
      </div>
      <div className="stat-card progress">
        <div className="progress-header">
          <span>Overall Voting Percentage</span>
          <strong>{stats.turnoutPercentage}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${stats.turnoutPercentage}%` }}></div>
        </div>
      </div>
      <div className="stat-card">
        <span>Male Voters</span>
        <strong>{stats.maleVoters.toLocaleString('en-IN')}</strong>
      </div>
      <div className="stat-card">
        <span>Female Voters</span>
        <strong>{stats.femaleVoters.toLocaleString('en-IN')}</strong>
      </div>
      <div className="stat-card">
        <span>Other Category</span>
        <strong>{stats.otherVoters.toLocaleString('en-IN')}</strong>
      </div>
    </div>
  );
}

export default StatisticsCards;
