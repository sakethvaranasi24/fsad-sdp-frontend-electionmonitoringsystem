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

function AssignDistrict() {
  const [analysts, setAnalysts] = useState([]);
  const [selectedAnalyst, setSelectedAnalyst] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [message, setMessage] = useState('');

  const districts = [
    'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  useEffect(() => {
    loadAnalysts();
  }, []);

  const loadAnalysts = async () => {
    try {
      const response = await fetch(`${API_URL}/adminapi/analyst/all`);
      if (!response.ok) {
        setAnalysts([]);
        return;
      }

      const responseData = await response.json().catch(() => []);
      setAnalysts(extractList(responseData));
    } catch {
      setAnalysts([]);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    
    if (!selectedAnalyst || !selectedDistrict) {
      setMessage('❌ Please select both analyst and district');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/adminapi/analyst/assign-district`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: selectedAnalyst,
          district: selectedDistrict
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`❌ ${errorText || 'Failed to assign district'}`);
        return;
      }

      setAnalysts((prev) => prev.map((analyst) =>
        analyst.email === selectedAnalyst
          ? { ...analyst, district: selectedDistrict, assignedDistrict: selectedDistrict }
          : analyst
      ));
      setMessage('✅ District assigned successfully!');
      setSelectedAnalyst('');
      setSelectedDistrict('');
    } catch {
      setMessage('❌ Unable to assign district. Please try again.');
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="admin-form-container">
      <h2>Assign District to Data Analyst</h2>

      {message && (
        <div className={`admin-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleAssign} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Select Data Analyst *</label>
            <select
              value={selectedAnalyst}
              onChange={(e) => setSelectedAnalyst(e.target.value)}
              required
            >
              <option value="">-- Choose Analyst --</option>
              {analysts.map(analyst => (
                <option key={analyst.id || analyst.analystId || analyst.email} value={analyst.email}>
                  {analyst.analystName || analyst.name} ({analyst.email})
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
              {districts.map(district => (
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

      <div className="admin-info-box">
        <h3>Current Assignments</h3>
        {analysts.filter(a => a.district || a.assignedDistrict).length === 0 ? (
          <p>No assignments yet</p>
        ) : (
          <ul>
            {analysts.filter(a => a.district || a.assignedDistrict).map(analyst => (
              <li key={analyst.id || analyst.analystId || analyst.email}>
                <strong>{analyst.analystName || analyst.name}</strong> → {analyst.district || analyst.assignedDistrict}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AssignDistrict;
