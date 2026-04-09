import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../AdminProfessional.css';

const API_URL = import.meta.env.VITE_API_URL;

function extractList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.response)) {
    return payload.response;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  return [];
}

function ViewAllObservers() {
  const [observers, setObservers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadObservers();
  }, []);

  const loadObservers = async () => {
    try {
      const response = await axios.get(`${API_URL}/adminapi/observer/all`);
      setObservers(extractList(response.data));
    } catch {
      setObservers([]);
    }
  };

  const filteredObservers = observers.filter(obs => {
    const observerName = obs.observerName || obs.name || '';
    const email = obs.email || '';
    const matchSearch = observerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || obs.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const deleteObserver = async (email) => {
    if (window.confirm('Are you sure you want to delete this observer?')) {
      try {
        await axios.delete(`${API_URL}/adminapi/observer/delete`, {
          params: { email }
        });

        setObservers(prev => prev.filter(o => o.email !== email));
        toast.success('Observer deleted successfully.');
      } catch (error) {
        const apiMessage =
          typeof error?.response?.data === 'string'
            ? error.response.data
            : error?.response?.data?.message;
        toast.error(apiMessage || 'Unable to delete observer.');
      }
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
                <tr key={obs.email}>
                  <td><strong>{obs.observerName || obs.name || '-'}</strong></td>
                  <td>{obs.email}</td>
                  <td>{obs.phone}</td>
                  <td>{obs.district || '-'}</td>
                  <td>{obs.assignedStation || 'Not Assigned'}</td>
                  <td>{getStatusBadge(obs.status)}</td>
                  <td>
                    <button className="admin-btn btn-sm btn-edit">✏️ Edit</button>
                    <button
                      className="admin-btn btn-sm btn-delete"
                      onClick={() => deleteObserver(obs.email)}
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
