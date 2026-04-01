import React, { useState, useEffect } from 'react';
import '../AdminProfessional.css';

function ViewAllAnalysts() {
  const [analysts, setAnalysts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadAnalysts();
  }, []);

  const loadAnalysts = () => {
    const stored = localStorage.getItem('dataAnalysts');
    setAnalysts(stored ? JSON.parse(stored) : []);
  };

  const filteredAnalysts = analysts.filter(analyst => {
    const matchSearch = analyst.analystName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       analyst.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || analyst.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const deleteAnalyst = (id) => {
    if (window.confirm('Are you sure you want to delete this analyst?')) {
      const updated = analysts.filter(a => a.id !== id);
      localStorage.setItem('dataAnalysts', JSON.stringify(updated));
      setAnalysts(updated);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: '#28a745',
      inactive: '#6c757d',
      'on-leave': '#ffc107'
    };
    return (
      <span style={{ backgroundColor: colors[status] || '#6c757d' }} className="admin-status-badge">
        {status}
      </span>
    );
  };

  return (
    <div className="admin-view-container">
      <h2>All Data Analysts</h2>

      <div className="admin-filters">
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on-leave">On Leave</option>
        </select>
      </div>

      {filteredAnalysts.length === 0 ? (
        <div className="admin-empty-state">
          <p>📊 No data analysts found</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Analyst Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Expertise</th>
                <th>Assigned District</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalysts.map((analyst) => (
                <tr key={analyst.id}>
                  <td><strong>{analyst.analystName}</strong></td>
                  <td>{analyst.email}</td>
                  <td>{analyst.phone}</td>
                  <td>{analyst.expertise || '-'}</td>
                  <td>{analyst.assignedDistrict || 'Not Assigned'}</td>
                  <td>{getStatusBadge(analyst.status)}</td>
                  <td>
                    <button className="admin-btn btn-sm btn-edit">✏️ Edit</button>
                    <button
                      className="admin-btn btn-sm btn-delete"
                      onClick={() => deleteAnalyst(analyst.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="admin-count">Total: {filteredAnalysts.length} analysts</p>
    </div>
  );
}

export default ViewAllAnalysts;
