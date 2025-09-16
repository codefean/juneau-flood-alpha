import React, { useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './Search.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwZmVhbiIsImEiOiJjbTNuOGVvN3cxMGxsMmpzNThzc2s3cTJzIn0.1uhX17BCYd65SeQsW1yibA';

// Bounding box and proximity for Juneau (~20-mile radius)
const bbox = '-135.147043,58.097567,-134.027043,58.677567';
const proximity = '-134.587043,58.387567';

const Search = ({ mapRef }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const searchMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?autocomplete=true&bbox=${bbox}&proximity=${proximity}&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (err) {
      console.error('Autocomplete error:', err);
    }
  };

  const handleSuggestionSelect = (feature) => {
    const [lng, lat] = feature.geometry.coordinates;

    if (searchMarkerRef.current) {
      searchMarkerRef.current.remove();
    }

    searchMarkerRef.current = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
    setAddress(feature.place_name);
    setSuggestions([]);
  };

  const searchAddress = async () => {
    setIsSearching(true);
    try {
      setErrorMessage('');
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?bbox=${bbox}&proximity=${proximity}&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;

        if (searchMarkerRef.current) {
          searchMarkerRef.current.remove();
        }

        searchMarkerRef.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        mapRef.current.flyTo({ center: [lng, lat], zoom: 17.5 });
      }
    } catch {
      setErrorMessage('Search failed. Try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // NEW: Handle geolocation
  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        // Remove old user marker if exists
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        // Add new blue marker for user
        userMarkerRef.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);

        mapRef.current.flyTo({ center: [longitude, latitude], zoom: 17.5 });
      },
      () => {
        alert('Unable to retrieve your location');
      }
    );
  };

  return (
    <div className="search-container">
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          className="search-bar"
          type="text"
          placeholder="Search address..."
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            fetchSuggestions(e.target.value);
          }}
        />
        {suggestions.length > 0 && (
          <ul className="autocomplete-dropdown">
            {suggestions.map((feature) => (
              <li key={feature.id} onClick={() => handleSuggestionSelect(feature)}>
                {feature.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* NEW: Geolocation button to the LEFT */}


      {/* Existing search button */}
      <button
        onClick={searchAddress}
        disabled={isSearching}
        className="search-button"
      >
        {isSearching ? '...' : 'Search'}
      </button>


      {errorMessage && <p style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</p>}
            <button title="Find my location" onClick={handleLocate} className="locate-button">
        📍
      </button>
    </div>
  );
};

export default Search;
