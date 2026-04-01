import React, { useState } from 'react';

function PollingStations() {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const mockStations = [
    { id: 1, name: 'Central High School', location: 'Downtown', district: 'District 1', facilities: ['Wheelchair Access', 'Drinking Water', 'Rest Area'] },
    { id: 2, name: 'Community Center', location: 'North Zone', district: 'District 1', facilities: ['Wheelchair Access', 'Parking'] },
    { id: 3, name: 'City Library', location: 'South Zone', district: 'District 2', facilities: ['Drinking Water', 'Rest Area'] },
    { id: 4, name: 'Government School', location: 'East Zone', district: 'District 2', facilities: ['Wheelchair Access', 'Drinking Water'] }
  ];

  const districts = ['District 1', 'District 2'];

  const filteredStations = mockStations.filter(station => {
    const matchDistrict = !selectedDistrict || station.district === selectedDistrict;
    const matchSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       station.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDistrict && matchSearch;
  });

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2>Polling Stations</h2>
          <p>Find your nearest polling station location and facilities</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="form-group">
          <label htmlFor="districtFilter">Filter by District</label>
          <select
            id="districtFilter"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="searchStation">Search Station</label>
          <input
            type="text"
            id="searchStation"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredStations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#5a6c7d' }}>
          <p>📍 No polling stations found</p>
          <p>Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredStations.map(station => (
            <div
              key={station.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                borderLeft: '4px solid #667eea'
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>{station.name}</h4>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: '4px 0', fontSize: '0.95rem', color: '#5a6c7d' }}>
                  <strong>Location:</strong> {station.location}
                </p>
                <p style={{ margin: '4px 0', fontSize: '0.95rem', color: '#5a6c7d' }}>
                  <strong>District:</strong> {station.district}
                </p>
              </div>
              <div>
                <p style={{ margin: '8px 0 4px 0', fontSize: '0.9rem', fontWeight: '600', color: '#2d3748' }}>Available Facilities:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {station.facilities.map(facility => (
                    <span key={facility} className="status-badge" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.85rem' }}>
                      ✓ {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PollingStations;
