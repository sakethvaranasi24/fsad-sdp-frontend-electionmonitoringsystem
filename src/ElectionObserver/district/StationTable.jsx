import React from 'react';

function StationTable({ stations, selectedStationId }) {
  const getStatus = (station) => {
    const turnout = station.registeredVoters
      ? (station.votesCast / station.registeredVoters) * 100
      : 0;

    if (turnout >= 70) return 'high';
    if (turnout >= 40) return 'medium';
    return 'low';
  };

  return (
    <div className="station-table">
      <div className="section-header">
        <h3>Polling Station Breakdown</h3>
        <p>Live turnout and booth performance summary.</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Station Name</th>
              <th>Booth No.</th>
              <th>Total Voters</th>
              <th>Votes Cast</th>
              <th>Turnout %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stations.map(station => {
              const turnout = station.registeredVoters
                ? Math.round((station.votesCast / station.registeredVoters) * 100)
                : 0;
              const status = getStatus(station);

              return (
                <tr key={station.id} className={station.id === selectedStationId ? 'highlight' : ''}>
                  <td>{station.name}</td>
                  <td>{station.boothNo}</td>
                  <td>{station.registeredVoters.toLocaleString('en-IN')}</td>
                  <td>{station.votesCast.toLocaleString('en-IN')}</td>
                  <td>{turnout}%</td>
                  <td>
                    <span className={`status-indicator ${status}`}></span>
                    {status === 'high' ? 'Normal' : status === 'medium' ? 'Moderate' : 'Alert'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StationTable;
