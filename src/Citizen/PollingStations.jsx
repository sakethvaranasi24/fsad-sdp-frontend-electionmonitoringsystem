import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function normalizeStations(payload) {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.response)
      ? payload.response
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return items.map((station, index) => ({
    id: station.id || station.stationId || `station-${index}`,
    name: station.stationName || station.name || 'Polling Station',
    location: station.location || station.address || station.area || '-',
    district: station.district || '-',
    state: station.state || '-',
    facilities: Array.isArray(station.facilities) ? station.facilities : []
  }));
}

function PollingStations({ preferredState = '', preferredDistrict = '' }) {
  const [selectedState, setSelectedState] = useState(preferredState);
  const [selectedDistrict, setSelectedDistrict] = useState(preferredDistrict);
  const [searchTerm, setSearchTerm] = useState('');
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    setSelectedState(preferredState);
    setSelectedDistrict(preferredDistrict);
  }, [preferredState, preferredDistrict]);

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      setFetchError('');

      try {
        const endpoint = selectedDistrict
          ? `${API_URL}/citizenapi/polling-stations/by-district?district=${encodeURIComponent(selectedDistrict)}`
          : `${API_URL}/citizenapi/polling-stations/all`;
        const response = await axios.get(endpoint);
        const responseData = response.data;
        setStations(normalizeStations(responseData));
      } catch (error) {
        const apiMessage =
          typeof error?.response?.data === 'string'
            ? error.response.data
            : error?.response?.data?.message;
        setFetchError(apiMessage || 'Unable to load polling stations.');
        setStations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, [selectedDistrict]);

  const availableStates = useMemo(
    () => [...new Set(stations.map((station) => station.state).filter(Boolean))],
    [stations]
  );

  const availableDistricts = useMemo(
    () => [...new Set(stations.map((station) => station.district).filter(Boolean))],
    [stations]
  );

  const filteredStations = stations.filter(station => {
    const matchState = !selectedState || station.state === selectedState;
    const matchDistrict = !selectedDistrict || station.district === selectedDistrict;
    const matchSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       station.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchState && matchDistrict && matchSearch;
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
          <label htmlFor="stateFilter">Filter by State</label>
          <select
            id="stateFilter"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">All States</option>
            {availableStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="districtFilter">Filter by District</label>
          <select
            id="districtFilter"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {availableDistricts.map(district => (
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

      {fetchError && (
        <div style={{ marginBottom: '16px', color: '#dc2626' }}>
          {fetchError}
        </div>
      )}

      {isLoading && (
        <div style={{ marginBottom: '16px', color: '#1d4ed8' }}>
          Loading polling stations...
        </div>
      )}

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
                <p style={{ margin: '4px 0', fontSize: '0.95rem', color: '#5a6c7d' }}>
                  <strong>State:</strong> {station.state}
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
