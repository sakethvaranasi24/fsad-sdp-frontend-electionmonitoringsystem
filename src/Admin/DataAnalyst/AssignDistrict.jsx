import React, { useState, useEffect } from 'react';
import '../AdminProfessional.css';

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

  const loadAnalysts = () => {
    const analysts = JSON.parse(localStorage.getItem('dataAnalysts') || '[]');
    setAnalysts(analysts);
  };

  const handleAssign = (e) => {
    e.preventDefault();
    
    if (!selectedAnalyst || !selectedDistrict) {
      setMessage('❌ Please select both analyst and district');
      return;
    }

    const updated = analysts.map(analyst => 
      analyst.id === selectedAnalyst 
        ? { ...analyst, assignedDistrict: selectedDistrict }
        : analyst
    );
    
    localStorage.setItem('dataAnalysts', JSON.stringify(updated));
    setAnalysts(updated);
    setMessage('✅ District assigned successfully!');
    setSelectedAnalyst('');
    setSelectedDistrict('');
    
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
                <option key={analyst.id} value={analyst.id}>
                  {analyst.analystName} ({analyst.email})
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
        {analysts.filter(a => a.assignedDistrict).length === 0 ? (
          <p>No assignments yet</p>
        ) : (
          <ul>
            {analysts.filter(a => a.assignedDistrict).map(analyst => (
              <li key={analyst.id}>
                <strong>{analyst.analystName}</strong> → {analyst.assignedDistrict}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AssignDistrict;
