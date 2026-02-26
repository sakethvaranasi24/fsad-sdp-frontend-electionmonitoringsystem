import React, { useEffect, useRef, useState } from 'react';

function SearchBar({
  value,
  onChange,
  onSubmit,
  suggestions,
  onSelectSuggestion,
  states,
  selectedState,
  onStateChange,
  districts,
  selectedDistrictId,
  onDistrictChange
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setIsOpen(Boolean(value && suggestions.length));
  }, [value, suggestions.length]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
      setIsOpen(false);
    }
  };

  return (
    <div className="search-card" ref={wrapperRef}>
      <div className="search-header">
        <div>
          <h2>District Intelligence Search</h2>
          <p>Find any district or polling station to load real-time monitoring data.</p>
        </div>
        <span className="live-badge">LIVE</span>
      </div>
      <div className="search-input">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by district name or polling station name"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          className="state-dropdown"
          value={selectedState}
          onChange={(event) => onStateChange(event.target.value)}
          aria-label="Select state"
        >
          {states.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          className="district-dropdown"
          value={selectedDistrictId}
          onChange={(event) => onDistrictChange(event.target.value)}
          aria-label="Select district"
        >
          {districts.map(district => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={onSubmit}>Search</button>
      </div>
      {isOpen && (
        <ul className="search-suggestions">
          {suggestions.map(suggestion => (
            <li key={`${suggestion.type}-${suggestion.id}`}>
              <button
                type="button"
                onClick={() => {
                  onSelectSuggestion(suggestion);
                  setIsOpen(false);
                }}
              >
                <span className={`suggestion-pill ${suggestion.type}`}>{suggestion.type}</span>
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
