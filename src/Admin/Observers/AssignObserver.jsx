import React, { useState, useEffect } from 'react';
import '../AdminProfessional.css';

function AssignObserver() {
  const [observers, setObservers] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedObserver, setSelectedObserver] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const obs = JSON.parse(localStorage.getItem('observers') || '[]');
    const stat = JSON.parse(localStorage.getItem('pollingStations') || '[]');
    setObservers(obs);
    setStations(stat);
  };

  const handleAssign = (e) => {
    e.preventDefault();
    
    if (!selectedObserver || !selectedStation) {
      setMessage('❌ Please select both observer and station');
      return;
    }

    const updated = observers.map(obs => 
      obs.id === selectedObserver 
        ? { ...obs, assignedStation: selectedStation }
        : obs
    );
    
    localStorage.setItem('observers', JSON.stringify(updated));
    setObservers(updated);
    setMessage('✅ Observer assigned successfully!');
    setSelectedObserver('');
    setSelectedStation('');
    
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="admin-form-container">
      <h2>Assign Observer to Polling Station</h2>

      {message && (
        <div className={`admin-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleAssign} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Select Observer *</label>
            <select
              value={selectedObserver}
              onChange={(e) => setSelectedObserver(e.target.value)}
              required
            >
              <option value="">-- Choose Observer --</option>
              {observers.map(obs => (
                <option key={obs.id} value={obs.id}>
                  {obs.observerName} ({obs.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Polling Station *</label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              required
            >
              <option value="">-- Choose Station --</option>
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.stationName} - {station.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="admin-btn btn-primary">
          ✓ Assign Observer
        </button>
      </form>

      <div className="admin-info-box">
        <h3>Current Assignments</h3>
        {observers.filter(o => o.assignedStation).length === 0 ? (
          <p>No assignments yet</p>
        ) : (
          <ul>
            {observers.filter(o => o.assignedStation).map(obs => (
              <li key={obs.id}>
                <strong>{obs.observerName}</strong> → {obs.assignedStation}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AssignObserver;
