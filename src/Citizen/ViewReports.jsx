import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

function getCitizenApiBaseUrl() {
  if (!API_URL) {
    return '';
  }
  return `${API_URL.replace(/\/$/, '')}/citizenapi`;
}

function ViewReports() {
  const [submittedComplaints, setSubmittedComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchIssues = async () => {
      const citizenApiBaseUrl = getCitizenApiBaseUrl();
      if (!citizenApiBaseUrl) {
        setErrorMessage('API URL is not configured. Set VITE_API_URL in your environment.');
        toast.error('API URL is not configured.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await axios.get(`${citizenApiBaseUrl}/issues`);
        const data = response.data;
        setSubmittedComplaints(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        const apiMessage =
          typeof error?.response?.data === 'string'
            ? error.response.data
            : error?.response?.data?.message;
        setErrorMessage(apiMessage || 'Unable to connect to backend. Please try again.');
        toast.error(apiMessage || 'Unable to connect to backend. Please try again.');
        setSubmittedComplaints([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleDeleteComplaint = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const citizenApiBaseUrl = getCitizenApiBaseUrl();
      if (!citizenApiBaseUrl) {
        setErrorMessage('API URL is not configured. Set VITE_API_URL in your environment.');
        toast.error('API URL is not configured.');
        return;
      }

      try {
        await axios.delete(`${citizenApiBaseUrl}/delete/${id}`);

        setSubmittedComplaints((prev) => prev.filter((c) => c.id !== id));
        toast.success('Report deleted successfully.');
      } catch (error) {
        console.error('Failed to delete report:', error);
        const apiMessage =
          typeof error?.response?.data === 'string'
            ? error.response.data
            : error?.response?.data?.message;
        setErrorMessage(apiMessage || 'Unable to connect to backend. Please try again.');
        toast.error(apiMessage || 'Unable to connect to backend. Please try again.');
      }
    }
  };

  const filteredComplaints = filterStatus === 'all' 
    ? submittedComplaints 
    : submittedComplaints.filter(c => c.status === filterStatus);

  const formatDateTime = (createdAt) => {
    if (!createdAt) {
      return 'N/A';
    }

    const parsedDate = new Date(createdAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return createdAt;
    }

    return parsedDate.toLocaleString();
  };

  const toTitleCase = (value) => {
    if (!value) {
      return 'Unknown';
    }

    return value
      .toString()
      .replace(/[-_]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2>My Reports</h2>
          <p>View and track your submitted issue reports from backend</p>
        </div>
      </div>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="statusFilter" style={{ marginRight: '10px' }}>Filter by Status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
        >
          <option value="all">All Reports</option>
          <option value="Under Review">Under Review</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#5a6c7d' }}>
          <p>Loading reports...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#5a6c7d' }}>
          <p>📋 No reports found</p>
          <p>You haven't submitted any reports yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#2d3748' }}>
                    {toTitleCase(complaint.issueType)}
                  </h4>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#5a6c7d' }}>
                    Station: {complaint.pollingStation}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge ${complaint.status === 'Pending' ? 'pending' : complaint.status === 'Resolved' ? 'active' : 'inactive'}`}>
                    {complaint.status || 'Pending'}
                  </span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#5a6c7d' }}>
                    {formatDateTime(complaint.createdAt)}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
                <p style={{ margin: '0', fontSize: '0.95rem', color: '#2d3748', lineHeight: '1.5' }}>
                  {complaint.description}
                </p>
              </div>

              {complaint.evidence && (
                <div style={{ marginTop: '12px' }}>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#5a6c7d' }}>
                    Evidence: {complaint.evidence}
                  </p>
                </div>
              )}

              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <span className="status-badge" style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#3730a3' }}>
                  Severity: {toTitleCase(complaint.severity)}
                </span>
                <button
                  onClick={() => handleDeleteComplaint(complaint.id)}
                  className="citizen-btn danger"
                  style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewReports;
