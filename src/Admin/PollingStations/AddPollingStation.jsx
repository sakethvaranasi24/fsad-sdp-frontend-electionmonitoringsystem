import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../AdminProfessional.css';

const API_URL = import.meta.env.VITE_API_URL;

function AddPollingStation({ onStationAdded }) {
  const [formData, setFormData] = useState({
    stationName: '',
    location: '',
    district: '',
    state: '',
    capacity: '',
    address: ''
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
      // Validate required fields
      if (!formData.stationName || !formData.location || !formData.district) {
        setMessage('❌ Please fill all required fields');
        toast.error('Please fill all required fields.');
        setLoading(false);
        return;
      }

      await axios.post(`${API_URL}/adminapi/polling-station/add`, formData);

      setMessage('✅ Polling station added successfully!');
      toast.success('Polling station added successfully.');
      setFormData({
        stationName: '',
        location: '',
        district: '',
        state: '',
        capacity: '',
        address: ''
      });

      if (onStationAdded) onStationAdded();

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const apiMessage =
        typeof error?.response?.data === 'string'
          ? error.response.data
          : error?.response?.data?.message;
      setMessage(`❌ ${apiMessage || 'Error adding polling station'}`);
      toast.error(apiMessage || 'Error adding polling station');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Add New Polling Station</h2>

      {message && (
        <div className={`admin-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Station Name *</label>
            <input
              type="text"
              name="stationName"
              placeholder="Enter station name"
              value={formData.stationName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>District *</label>
            <input
              type="text"
              name="district"
              placeholder="Enter district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              placeholder="Enter booth capacity"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Full Address</label>
          <textarea
            name="address"
            placeholder="Enter complete address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button type="submit" className="admin-btn btn-primary" disabled={loading}>
          {loading ? '⏳ Adding...' : '➕ Add Polling Station'}
        </button>
      </form>
    </div>
  );
}

export default AddPollingStation;
