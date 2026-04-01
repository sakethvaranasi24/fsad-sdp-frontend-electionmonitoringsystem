import React, { useState, useEffect } from 'react';
import '../AdminProfessional.css';

function ViewAllObservers() {
  const [observers, setObservers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadObservers();
  }, []);

  const loadObservers = () => {
    const stored = localStorage.getItem('observers');
    setObservers(stored ? JSON.parse(stored) : []);
  };

  const filteredObservers = observers.filter(obs => {
    const matchSearch = obs.observerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       obs.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || obs.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const deleteObserver = (id) => {
    if (window.confirm('Are you sure you want to delete this observer?')) {
      const updated = observers.filter(o => o.id !== id);
      localStorage.setItem('observers', JSON.stringify(updated));
      setObservers(updated);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: '#28a745',
      inactive: '#6c757d',
      'on-duty': '#007bff'
    };
    return (
      <span style={{ backgroundColor: colors[status] || '#6c757d' }} className="admin-status-badge">
        {status}
      </span>
    );
  };

  return (
    <div className="admin-view-container">
      <h2>All Observers</h2>

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
          <option value="on-duty">On Duty</option>
        </select>
      </div>

      {filteredObservers.length === 0 ? (
        <div className="admin-empty-state">
          <p>👤 No observers found</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Observer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>District</th>
                <th>Assigned Station</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredObservers.map((obs) => (
                <tr key={obs.id}>
                  <td><strong>{obs.observerName}</strong></td>
                  <td>{obs.email}</td>
                  <td>{obs.phone}</td>
                  <td>{obs.district || '-'}</td>
                  <td>{obs.assignedStation || 'Not Assigned'}</td>
                  <td>{getStatusBadge(obs.status)}</td>
                  <td>
                    <button className="admin-btn btn-sm btn-edit">✏️ Edit</button>
                    <button
                      className="admin-btn btn-sm btn-delete"
                      onClick={() => deleteObserver(obs.id)}
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

      <p className="admin-count">Total: {filteredObservers.length} observers</p>
    </div>
  );
}

export default ViewAllObservers;
