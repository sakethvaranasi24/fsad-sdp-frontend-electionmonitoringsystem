import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../AdminProfessional.css';

const API_URL = import.meta.env.VITE_API_URL;

function AddObserver({ onObserverAdded }) {
  const [formData, setFormData] = useState({
    observerName: '',
    email: '',
    password: '',
    phone: '',
    district: '',
    assignedStation: '',
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
      if (!formData.observerName || !formData.email || !formData.password || !formData.phone) {
        setMessage('❌ Please fill all required fields');
        toast.error('Please fill all required fields.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/adminapi/observer/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`❌ ${errorText || 'Error adding observer'}`);
        toast.error(errorText || 'Error adding observer');
        return;
      }

      setMessage('✅ Observer added successfully!');
      toast.success('Observer added successfully.');
      setFormData({
        observerName: '',
        email: '',
        password: '',
        phone: '',
        district: '',
        assignedStation: '',
        status: 'active'
      });

      if (onObserverAdded) onObserverAdded();

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding observer');
      toast.error('Error adding observer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Add New Observer</h2>

      {message && (
        <div className={`admin-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Observer Name *</label>
            <input
              type="text"
              name="observerName"
              placeholder="Enter observer name"
              value={formData.observerName}
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
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
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
            <label>District</label>
            <input
              type="text"
              name="district"
              placeholder="Enter district"
              value={formData.district}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Assigned Station</label>
            <input
              type="text"
              name="assignedStation"
              placeholder="Enter assigned polling station"
              value={formData.assignedStation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-duty">On Duty</option>
            </select>
          </div>
        </div>

        <button type="submit" className="admin-btn btn-primary" disabled={loading}>
          {loading ? '⏳ Adding...' : '➕ Add Observer'}
        </button>
      </form>
    </div>
  );
}

export default AddObserver;
