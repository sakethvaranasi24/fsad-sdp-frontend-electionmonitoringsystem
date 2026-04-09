import React, { useState } from 'react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

function getCitizenApiBaseUrl() {
  if (!API_URL) {
    return '';
  }
  return `${API_URL.replace(/\/$/, '')}/citizenapi`;
}

function ReportIssue() {
  const [issueType, setIssueType] = useState('');
  const [pollingStation, setPollingStation] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitIssue = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setMessage('');

    if (!issueType || !pollingStation || !severity || !description.trim()) {
      setSubmitError('Please fill all required fields.');
      toast.error('Please fill all required fields.');
      return;
    }

    const citizenApiBaseUrl = getCitizenApiBaseUrl();
    if (!citizenApiBaseUrl) {
      setSubmitError('API URL is not configured. Set VITE_API_URL in your environment.');
      toast.error('API URL is not configured.');
      return;
    }

    const payload = {
      issueType,
      pollingStation,
      severity,
      description,
      evidence: image?.name || ''
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(`${citizenApiBaseUrl}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        setSubmitError(errorText || 'Failed to submit issue report.');
        toast.error(errorText || 'Failed to submit issue report.');
        return;
      }

      setMessage('Issue reported successfully! Thank you for your contribution.');
      toast.success('Issue reported successfully.');
      setIssueType('');
      setPollingStation('');
      setSeverity('');
      setDescription('');
      setImage(null);
      setImagePreview(null);

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Issue submission error:', error);
      setSubmitError('Unable to connect to backend. Please try again.');
      toast.error('Unable to connect to backend. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2>Report an Issue</h2>
          <p>Help us maintain election integrity by reporting violations</p>
        </div>
      </div>

      {message && <div className="form-success"><p>{message}</p></div>}
      {submitError && <p className="form-error">{submitError}</p>}

      <form onSubmit={handleSubmitIssue} className="citizen-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="issueType">Issue Type *</label>
            <select
              id="issueType"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option value="">Select Issue Type</option>
              <option value="irregularity">Election Irregularity</option>
              <option value="malpractice">Malpractice</option>
              <option value="violation">Violation of Code</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="station">Polling Station *</label>
            <select
              id="station"
              value={pollingStation}
              onChange={(e) => setPollingStation(e.target.value)}
            >
              <option value="">Select Polling Station</option>
              <option value="station1">Station 1</option>
              <option value="station2">Station 2</option>
              <option value="station3">Station 3</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="severity">Severity Level *</label>
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="">Select Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Detailed Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            rows="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Attach Evidence (Optional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
            </div>
          )}
        </div>

        <button type="submit" className="citizen-btn primary" style={{ marginTop: '24px' }} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}

export default ReportIssue;
