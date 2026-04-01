import React, { useState } from 'react';
import '../AdminProfessional.css';

function AddDataAnalyst({ onAnalystAdded }) {
  const [formData, setFormData] = useState({
    analystName: '',
    email: '',
    phone: '',
    expertise: '',
    assignedDistrict: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!formData.analystName || !formData.email || !formData.phone) {
        setMessage('❌ Please fill all required fields');
        setLoading(false);
        return;
      }

      const analysts = JSON.parse(localStorage.getItem('dataAnalysts') || '[]');
      const newAnalyst = {
        id: `ANALYST-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString()
      };
      analysts.push(newAnalyst);
      localStorage.setItem('dataAnalysts', JSON.stringify(analysts));

      setMessage('✅ Data Analyst added successfully!');
      setFormData({
        analystName: '',
        email: '',
        phone: '',
        expertise: '',
        assignedDistrict: '',
        status: 'active'
      });

      if (onAnalystAdded) onAnalystAdded();

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding analyst');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Add New Data Analyst</h2>

      {message && (
        <div className={`admin-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Analyst Name *</label>
            <input
              type="text"
              name="analystName"
              placeholder="Enter analyst name"
              value={formData.analystName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Expertise</label>
            <input
              type="text"
              name="expertise"
              placeholder="e.g., Statistics, Data Science"
              value={formData.expertise}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Assigned District</label>
            <input
              type="text"
              name="assignedDistrict"
              placeholder="Enter assigned district"
              value={formData.assignedDistrict}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>

        <button type="submit" className="admin-btn btn-primary" disabled={loading}>
          {loading ? '⏳ Adding...' : '➕ Add Data Analyst'}
        </button>
      </form>
    </div>
  );
}

export default AddDataAnalyst;
