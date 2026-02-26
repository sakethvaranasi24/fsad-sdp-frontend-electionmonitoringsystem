import React from 'react';

function ChartsSection({ stats, stations, districtName }) {
  const totalVotes = stats.totalVotesCast + stats.totalNotVoted;
  const turnout = stats.turnoutPercentage;
  const circleDash = 2 * Math.PI * 38;
  const dashOffset = circleDash * (1 - turnout / 100);

  return (
    <div className="charts-section">
      <div className="section-header">
        <h3>District Analytics</h3>
        <p>Visual summary for {districtName}.</p>
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <h4>District Turnout</h4>
          <div className="circular-chart">
            <svg viewBox="0 0 100 100">
              <circle className="track" cx="50" cy="50" r="38" />
              <circle
                className="progress"
                cx="50"
                cy="50"
                r="38"
                style={{ strokeDasharray: circleDash, strokeDashoffset: dashOffset }}
              />
            </svg>
            <div className="chart-label">
              <strong>{turnout}%</strong>
              <span>Turnout</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h4>Voted vs Not Voted</h4>
          <div className="bar-split">
            <div className="bar voted" style={{ width: `${(stats.totalVotesCast / totalVotes) * 100}%` }}>
              Votes Cast
            </div>
            <div className="bar not-voted" style={{ width: `${(stats.totalNotVoted / totalVotes) * 100}%` }}>
              Not Voted
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h4>Station Turnout Comparison</h4>
          <div className="station-bars">
            {stations.map(station => {
              const turnoutPercent = station.registeredVoters
                ? Math.round((station.votesCast / station.registeredVoters) * 100)
                : 0;

              return (
                <div key={station.id} className="station-bar">
                  <span>{station.name.split(' ')[0]}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${turnoutPercent}%` }}></div>
                  </div>
                  <strong>{turnoutPercent}%</strong>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card">
          <h4>Gender Distribution</h4>
          <div className="gender-chart">
            <div className="gender-row">
              <span>Male</span>
              <div className="bar-track">
                <div
                  className="bar-fill male"
                  style={{ width: `${(stats.maleVoters / stats.totalRegistered) * 100}%` }}
                ></div>
              </div>
              <strong>{stats.maleVoters.toLocaleString('en-IN')}</strong>
            </div>
            <div className="gender-row">
              <span>Female</span>
              <div className="bar-track">
                <div
                  className="bar-fill female"
                  style={{ width: `${(stats.femaleVoters / stats.totalRegistered) * 100}%` }}
                ></div>
              </div>
              <strong>{stats.femaleVoters.toLocaleString('en-IN')}</strong>
            </div>
            <div className="gender-row">
              <span>Other</span>
              <div className="bar-track">
                <div
                  className="bar-fill other"
                  style={{ width: `${(stats.otherVoters / stats.totalRegistered) * 100}%` }}
                ></div>
              </div>
              <strong>{stats.otherVoters.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartsSection;
