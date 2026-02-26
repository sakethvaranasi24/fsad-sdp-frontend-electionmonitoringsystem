import React from 'react';

function TransparencyPanel({ complaints, incidents, notes, alerts }) {
  return (
    <div className="transparency-panel">
      <div className="section-header">
        <h3>Transparency & Monitoring</h3>
        <p>District-level complaints, incidents, and alerts.</p>
      </div>

      <div className="panel-card">
        <h4>Complaints</h4>
        <ul>
          {complaints.map((item, index) => (
            <li key={`complaint-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="panel-card">
        <h4>Incident Reports</h4>
        <ul>
          {incidents.map((item, index) => (
            <li key={`incident-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="panel-card">
        <h4>Observer Notes</h4>
        <ul>
          {notes.map((item, index) => (
            <li key={`note-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="panel-card alert">
        <h4>Alerts</h4>
        {alerts.length === 0 ? (
          <p className="panel-muted">No unusual voting patterns detected.</p>
        ) : (
          <ul>
            {alerts.map((item, index) => (
              <li key={`alert-${index}`}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TransparencyPanel;
