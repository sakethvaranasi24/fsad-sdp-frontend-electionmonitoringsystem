import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    parentName: '',
    dob: '',
    gender: '',
    aadhaar: '',
    mobile: '',
    email: '',
    houseNumber: '',
    street: '',
    city: '',
    district: '',
    state: '',
    pin: '',
    constituency: '',
    declaration: false
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [voterId, setVoterId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.parentName.trim()) newErrors.parentName = 'Parent/Guardian name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.aadhaar.trim()) newErrors.aadhaar = 'Aadhaar number is required';
    if (!/^\d{12}$/.test(formData.aadhaar)) newErrors.aadhaar = 'Aadhaar must be 12 digits';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile must be 10 digits';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.houseNumber.trim()) newErrors.houseNumber = 'House number is required';
    if (!formData.street.trim()) newErrors.street = 'Street is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!/^\d{6}$/.test(formData.pin)) newErrors.pin = 'PIN must be 6 digits';
    if (!formData.constituency) newErrors.constituency = 'Constituency is required';
    if (!formData.declaration) newErrors.declaration = 'You must accept the declaration';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      const newVoterId = `VID-${Date.now()}`;
      setVoterId(newVoterId);
      setMessage(`Registration successful! Your Voter ID: ${newVoterId}`);
      setIsSubmitted(true);

      // Store in localStorage
      const registrations = JSON.parse(localStorage.getItem('emsRegisteredUsers') || '[]');
      registrations.push({
        ...formData,
        voterId: newVoterId,
        registeredDate: new Date().toLocaleDateString()
      });
      localStorage.setItem('emsRegisteredUsers', JSON.stringify(registrations));

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          fullName: '',
          parentName: '',
          dob: '',
          gender: '',
          aadhaar: '',
          mobile: '',
          email: '',
          houseNumber: '',
          street: '',
          city: '',
          district: '',
          state: '',
          pin: '',
          constituency: '',
          declaration: false
        });
        setIsSubmitted(false);
        setMessage('');
      }, 3000);
    } else {
      setErrors(newErrors);
    }
  };

  if (isSubmitted) {
    return (
      <div className="tab-content">
        <div className="form-success">
          <p>{message}</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Your registration has been recorded. Please keep your Voter ID safe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2>Voter Registration</h2>
          <p>Register to vote and receive your Voter ID</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="citizen-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="form-error">{errors.fullName}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="parentName">Parent/Guardian Name *</label>
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Enter parent/guardian name"
            />
            {errors.parentName && <p className="form-error">{errors.parentName}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dob">Date of Birth *</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
            {errors.dob && <p className="form-error">{errors.dob}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="form-error">{errors.gender}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="aadhaar">Aadhaar Number *</label>
            <input
              type="text"
              id="aadhaar"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              placeholder="12-digit Aadhaar number"
              maxLength="12"
            />
            {errors.aadhaar && <p className="form-error">{errors.aadhaar}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength="10"
            />
            {errors.mobile && <p className="form-error">{errors.mobile}</p>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Address Information</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="state">State *</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
            >
              <option value="">Select State</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="karnataka">Karnataka</option>
              <option value="delhi">Delhi</option>
              <option value="tamil-nadu">Tamil Nadu</option>
              <option value="uttar-pradesh">Uttar Pradesh</option>
            </select>
            {errors.state && <p className="form-error">{errors.state}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="district">District *</label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
            >
              <option value="">Select District</option>
              <option value="district1">District 1</option>
              <option value="district2">District 2</option>
            </select>
            {errors.district && <p className="form-error">{errors.district}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="houseNumber">House Number *</label>
            <input
              type="text"
              id="houseNumber"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              placeholder="House/Building number"
            />
            {errors.houseNumber && <p className="form-error">{errors.houseNumber}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="street">Street *</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Street name"
            />
            {errors.street && <p className="form-error">{errors.street}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City name"
            />
            {errors.city && <p className="form-error">{errors.city}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="pin">PIN Code *</label>
            <input
              type="text"
              id="pin"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              placeholder="6-digit PIN code"
              maxLength="6"
            />
            {errors.pin && <p className="form-error">{errors.pin}</p>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="constituency">Constituency *</label>
          <select
            id="constituency"
            name="constituency"
            value={formData.constituency}
            onChange={handleChange}
          >
            <option value="">Select Constituency</option>
            <option value="const1">Constituency 1</option>
            <option value="const2">Constituency 2</option>
          </select>
          {errors.constituency && <p className="form-error">{errors.constituency}</p>}
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label>
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
            />
            {' '}I hereby declare that the information provided is true and accurate *
          </label>
          {errors.declaration && <p className="form-error">{errors.declaration}</p>}
        </div>

        <button type="submit" className="citizen-btn primary" style={{ marginTop: '24px' }}>
          Register as Voter
        </button>
      </form>
    </div>
  );
}

export default Register;
