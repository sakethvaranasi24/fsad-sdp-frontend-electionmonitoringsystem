import React, { useState, useEffect } from 'react';

function ViewReports() {
  const [submittedComplaints, setSubmittedComplaints] = useState(() => {
    return JSON.parse(localStorage.getItem('citizenComplaints') || '[]');
  });
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('citizenComplaints') || '[]');
    setSubmittedComplaints(stored);
  }, []);

  const handleDeleteComplaint = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const updated = submittedComplaints.filter(c => c.id !== id);
      setSubmittedComplaints(updated);
      localStorage.setItem('citizenComplaints', JSON.stringify(updated));
    }
  };

  const filteredComplaints = filterStatus === 'all' 
    ? submittedComplaints 
    : submittedComplaints.filter(c => c.status === filterStatus);

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2>My Reports</h2>
          <p>View and track your submitted issue reports</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="statusFilter" style={{ marginRight: '10px' }}>Filter by Status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
        >
          <option value="all">All Reports</option>
          <option value="Under Review">Under Review</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {filteredComplaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#5a6c7d' }}>
          <p>📋 No reports found</p>
          <p>You haven't submitted any reports yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#2d3748' }}>
                    {complaint.type.charAt(0).toUpperCase() + complaint.type.slice(1)}
                  </h4>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#5a6c7d' }}>
                    Station: {complaint.station}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge ${complaint.status === 'Under Review' ? 'pending' : complaint.status === 'Resolved' ? 'active' : 'inactive'}`}>
                    {complaint.status}
                  </span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#5a6c7d' }}>
                    {complaint.submittedDate} {complaint.time}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                <p style={{ margin: '0', fontSize: '0.95rem', color: '#2d3748', lineHeight: '1.5' }}>
                  {complaint.description}
                </p>
              </div>

              {complaint.image && (
                <div style={{ marginTop: '12px' }}>
                  <img 
                    src={complaint.image} 
                    alt="Evidence" 
                    style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '6px' }} 
                  />
                </div>
              )}

              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <span className="status-badge" style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#3730a3' }}>
                  Severity: {complaint.severity.toUpperCase()}
                </span>
                <button
                  onClick={() => handleDeleteComplaint(complaint.id)}
                  className="citizen-btn danger"
                  style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewReports;
