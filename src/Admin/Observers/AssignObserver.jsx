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

function AssignObserver() {
  const [observers, setObservers] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedObserverForDistrict, setSelectedObserverForDistrict] = useState('');
  const [selectedObserverForStation, setSelectedObserverForStation] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [observersResponse, stationsResponse] = await Promise.all([
        fetch(`${API_URL}/adminapi/observer/all`),
        fetch(`${API_URL}/adminapi/polling-station/all`)
      ]);

      const observersData = observersResponse.ok
        ? await observersResponse.json().catch(() => [])
        : [];
      const stationsData = stationsResponse.ok
        ? await stationsResponse.json().catch(() => [])
        : [];

      setObservers(extractList(observersData));
      setStations(extractList(stationsData));
    } catch {
      setObservers([]);
      setStations([]);
    }
  };

  const handleAssignDistrict = async (e) => {
    e.preventDefault();
    
    if (!selectedObserverForDistrict || !selectedDistrict) {
      setMessage('❌ Please select both observer and district');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/adminapi/observer/assign-district`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: selectedObserverForDistrict,
          district: selectedDistrict
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`❌ ${errorText || 'Failed to assign district'}`);
        return;
      }

      const updated = observers.map(obs => 
        obs.email === selectedObserverForDistrict 
          ? { ...obs, district: selectedDistrict }
          : obs
      );

      setObservers(updated);
      await loadData();
      setMessage('✅ District assigned successfully!');
      setSelectedObserverForDistrict('');
      setSelectedDistrict('');
    } catch {
      setMessage('❌ Unable to assign district. Please try again.');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleAssignStation = async (e) => {
    e.preventDefault();

    if (!selectedObserverForStation || !selectedStation) {
      setMessage('❌ Please select both observer and station');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/adminapi/observer/assign-station`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: selectedObserverForStation,
          assignedStation: selectedStation
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`❌ ${errorText || 'Failed to assign station'}`);
        return;
      }

      const updated = observers.map(obs =>
        obs.email === selectedObserverForStation
          ? { ...obs, assignedStation: selectedStation }
          : obs
      );

      setObservers(updated);
      await loadData();
      setMessage('✅ Station assigned successfully!');
      setSelectedObserverForStation('');
      setSelectedStation('');
    } catch {
      setMessage('❌ Unable to assign station. Please try again.');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const availableDistricts = [...new Set([
    ...stations.map(station => station.district),
    ...observers.map(obs => obs.district)
  ].filter(Boolean))];

  const availableStations = [...new Set(
    stations.map((station) => station.stationName || station.name).filter(Boolean)
  )];

  return (
    <div className="admin-form-container">
      <h2>Assign Station and District to Observer</h2>

      {message && (
        <div className={`admin-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleAssignDistrict} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Select Observer for District *</label>
            <select
              value={selectedObserverForDistrict}
              onChange={(e) => setSelectedObserverForDistrict(e.target.value)}
              required
            >
              <option value="">-- Choose Observer --</option>
              {observers.map(obs => (
                <option key={obs.id || obs.observerId || obs.email} value={obs.email}>
                  {(obs.observerName || obs.name)} ({obs.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select District *</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              required
            >
              <option value="">-- Choose District --</option>
              {availableDistricts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="admin-btn btn-primary">
          ✓ Assign District
        </button>
      </form>

      <form onSubmit={handleAssignStation} className="admin-form" style={{ marginTop: '20px' }}>
        <div className="form-row">
          <div className="form-group">
            <label>Select Observer for Station *</label>
            <select
              value={selectedObserverForStation}
              onChange={(e) => setSelectedObserverForStation(e.target.value)}
              required
            >
              <option value="">-- Choose Observer --</option>
              {observers.map(obs => (
                <option key={obs.id || obs.observerId || obs.email} value={obs.email}>
                  {(obs.observerName || obs.name)} ({obs.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Station *</label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              required
            >
              <option value="">-- Choose Station --</option>
              {availableStations.map(stationName => (
                <option key={stationName} value={stationName}>
                  {stationName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="admin-btn btn-primary">
          ✓ Assign Station
        </button>
      </form>

      <div className="admin-info-box">
        <h3>Current Assignments</h3>
        {observers.filter(o => o.district || o.assignedStation).length === 0 ? (
          <p>No assignments yet</p>
        ) : (
          <ul>
            {observers.filter(o => o.district || o.assignedStation).map(obs => (
              <li key={obs.id || obs.observerId || obs.email}>
                <strong>{obs.observerName || obs.name}</strong>
                {' '}→ District: {obs.district || 'Not Assigned'}
                {' | '}Station: {obs.assignedStation || 'Not Assigned'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AssignObserver;
