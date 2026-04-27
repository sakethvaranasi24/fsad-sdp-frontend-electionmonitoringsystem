function ChartsSection({ stats, stations }) {
  const totalNotVoted = stats.totalRegistered - stats.totalVotesCast;
  
  return (
    <div className="charts-section">
      <h3>Analytics & Insights</h3>
      <div className="charts-grid">
        <div className="chart-card">
          <h4>Turnout Progress</h4>
          <svg viewBox="0 0 100 100" className="circular-chart">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={stats.turnoutPercentage >= 70 ? '#22c55e' : stats.turnoutPercentage >= 40 ? '#f59e0b' : '#ef4444'}
              strokeWidth="8"
              strokeDasharray={`${(stats.turnoutPercentage / 100) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="50" textAnchor="middle" dy="0.3em" fontSize="20" fontWeight="bold">{stats.turnoutPercentage}%</text>
          </svg>
        </div>

        <div className="chart-card">
          <h4>Voted vs Not Voted</h4>
          <div className="bar-split">
            <div className="bar-row">
              <div className="bar-track">
                <div className="bar-fill voted" style={{width: `${(stats.totalVotesCast / stats.totalRegistered) * 100}%`}}></div>
              </div>
              <span className="bar-label">{stats.totalVotesCast}</span>
            </div>
            <div className="bar-row">
              <div className="bar-track">
                <div className="bar-fill not-voted" style={{width: `${(totalNotVoted / stats.totalRegistered) * 100}%`}}></div>
              </div>
              <span className="bar-label">{totalNotVoted}</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h4>Stations Comparison</h4>
          <div className="station-bars">
            {stations.slice(0, 5).map(station => {
              const turnout = station.registeredVoters > 0 ? Math.round((station.votesCast / station.registeredVoters) * 100) : 0;
              return (
                <div key={station.id} className="station-bar">
                  <span className="station-label">{station.boothNo}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{width: `${turnout}%`}}></div>
                  </div>
                  <span className="bar-value">{turnout}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card">
          <h4>Gender Distribution</h4>
          <div className="gender-chart">
            <div className="gender-row">
              <span className="gender-label">Male</span>
              <div className="bar-track"><div className="bar-fill" style={{width: `${(stats.maleVoters / stats.totalRegistered) * 100}%`}}></div></div>
              <span className="gender-count">{stats.maleVoters}</span>
            </div>
            <div className="gender-row">
              <span className="gender-label">Female</span>
              <div className="bar-track"><div className="bar-fill female" style={{width: `${(stats.femaleVoters / stats.totalRegistered) * 100}%`}}></div></div>
              <span className="gender-count">{stats.femaleVoters}</span>
            </div>
            <div className="gender-row">
              <span className="gender-label">Other</span>
              <div className="bar-track"><div className="bar-fill other" style={{width: `${(stats.otherVoters / stats.totalRegistered) * 100}%`}}></div></div>
              <span className="gender-count">{stats.otherVoters}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartsSection;
