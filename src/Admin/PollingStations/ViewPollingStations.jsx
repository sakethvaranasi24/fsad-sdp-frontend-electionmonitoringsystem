import React, { useState, useEffect } from 'react';
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

function ViewPollingStations() {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const response = await fetch(`${API_URL}/adminapi/polling-station/all`);

      if (!response.ok) {
        setStations([]);
        return;
      }

      const responseData = await response.json().catch(() => []);
      setStations(extractList(responseData));
    } catch {
      setStations([]);
    }
  };

  const filteredStations = stations.filter(station => {
    const stationName = station.stationName || station.name || '';
    const location = station.location || '';
    const matchSearch = stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDistrict = !filterDistrict || station.district === filterDistrict;
    return matchSearch && matchDistrict;
  });

  const districts = [...new Set(stations.map(s => s.district))];

  const deleteStation = async (id) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        const response = await fetch(`${API_URL}/adminapi/polling-station/delete?id=${encodeURIComponent(id)}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          return;
        }

        setStations(prev => prev.filter(s => (s.id || s.stationId) !== id));
      } catch {
        // no-op
      }
    }
  };

  return (
    <div className="admin-view-container">
      <h2>All Polling Stations</h2>

      <div className="admin-filters">
        <input
          type="text"
          placeholder="🔍 Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search"
        />

        <select
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">All Districts</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {filteredStations.length === 0 ? (
        <div className="admin-empty-state">
          <p>📭 No polling stations found</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Station Name</th>
                <th>Location</th>
                <th>District</th>
                <th>State</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((station) => (
                <tr key={station.id || station.stationId}>
                  <td><strong>{station.stationName || station.name || '-'}</strong></td>
                  <td>{station.location}</td>
                  <td>{station.district}</td>
                  <td>{station.state || '-'}</td>
                  <td>{station.capacity || '-'}</td>
                  <td>
                    <button className="admin-btn btn-sm btn-edit">✏️ Edit</button>
                    <button
                      className="admin-btn btn-sm btn-delete"
                      onClick={() => deleteStation(station.id || station.stationId)}
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

      <p className="admin-count">Total: {filteredStations.length} stations</p>
    </div>
  );
}

export default ViewPollingStations;
