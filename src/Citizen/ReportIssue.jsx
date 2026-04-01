import React, { useState } from 'react';

function ReportIssue() {
  const [issueType, setIssueType] = useState('');
  const [pollingStation, setPollingStation] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submittedComplaints, setSubmittedComplaints] = useState(() => {
    return JSON.parse(localStorage.getItem('citizenComplaints') || '[]');
  });
  const [message, setMessage] = useState('');

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

  const handleSubmitIssue = (e) => {
    e.preventDefault();

    if (!issueType || !pollingStation || !severity || !description.trim()) {
      alert('Please fill all required fields');
      return;
    }

    const newComplaint = {
      id: Date.now(),
      type: issueType,
      station: pollingStation,
      severity,
      description,
      image: imagePreview,
      submittedDate: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Under Review'
    };

    const updatedComplaints = [...submittedComplaints, newComplaint];
    setSubmittedComplaints(updatedComplaints);
    localStorage.setItem('citizenComplaints', JSON.stringify(updatedComplaints));

    setMessage('Issue reported successfully! Thank you for your contribution.');
    setIssueType('');
    setPollingStation('');
    setSeverity('');
    setDescription('');
    setImage(null);
    setImagePreview(null);

    setTimeout(() => setMessage(''), 3000);
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

        <button type="submit" className="citizen-btn primary" style={{ marginTop: '24px' }}>
          Submit Report
        </button>
      </form>
    </div>
  );
}

export default ReportIssue;
