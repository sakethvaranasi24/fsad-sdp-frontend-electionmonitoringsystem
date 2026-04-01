import React, { useState } from 'react';

function ElectionResults() {
  const [selectedState, setSelectedState] = useState('');

  const elections = [
    {
      id: 1,
      title: 'General Assembly Elections 2026',
      date: 'April 15, 2026',
      daysRemaining: 15,
      registrationDeadline: 'March 25, 2026',
      daysLeft: 5,
      state: 'Maharashtra',
      turnout: 72,
      badge: 'Upcoming'
    },
    {
      id: 2,
      title: 'Local Municipal Elections',
      date: 'May 10, 2026',
      daysRemaining: 40,
      registrationDeadline: 'April 20, 2026',
      daysLeft: 30,
      state: 'Karnataka',
      turnout: 68,
      badge: 'Scheduled'
    },
    {
      id: 3,
      title: 'State Assembly Elections',
      date: 'June 5, 2026',
      daysRemaining: 66,
      registrationDeadline: 'May 10, 2026',
      daysLeft: 56,
      state: 'Tamil Nadu',
      turnout: 75,
      badge: 'Scheduled'
    }
  ];

  const states = ['All States', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi'];

  const filteredElections = selectedState && selectedState !== 'All States'
    ? elections.filter(e => e.state === selectedState)
    : elections;

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2>Available Elections</h2>
          <p>Track upcoming elections and participation data</p>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="stateFilter" style={{ marginRight: '12px', fontWeight: '600' }}>Filter by State:</label>
        <select
          id="stateFilter"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            border: '2px solid #e2e8f0',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {filteredElections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#5a6c7d' }}>
          <p>🗳️ No elections found for selected state</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredElections.map(election => (
            <div
              key={election.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
                borderLeft: '4px solid #667eea'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>{election.title}</h3>
                  <span className="status-badge" style={{ background: '#dcfce7', color: '#166534', fontSize: '0.85rem' }}>
                    {election.badge}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.9rem', color: '#5a6c7d' }}>State: {election.state}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#5a6c7d' }}>Election Date</p>
                  <p style={{ margin: '0', fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>{election.date}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#dc2626' }}>
                    {election.daysRemaining} days remaining
                  </p>
                </div>

                <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#5a6c7d' }}>Registration Deadline</p>
                  <p style={{ margin: '0', fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>{election.registrationDeadline}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#dc2626' }}>
                    {election.daysLeft} days left
                  </p>
                </div>

                <div style={{ padding: '12px', background: '#f3e8ff', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#5a6c7d' }}>Current Turnout</p>
                  <p style={{ margin: '0', fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>{election.turnout}%</p>
                  <div style={{ marginTop: '8px', width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${election.turnout}%`, height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)' }} />
                  </div>
                </div>
              </div>

              <button className="citizen-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
                Learn More
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ElectionResults;
