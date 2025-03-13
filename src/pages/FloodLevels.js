import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './FloodLevels.css';
import FloodStageMenu from './FloodStageMenu'; // Import the FloodStageMenu component
import FloodStepper from './FloodStepper';
import FloodInfoPopup from "./FloodInfoPopup";


// cd /Users/seanfagan/Desktop/juneau-flood-beta

const S3_BASE_URL = "https://flood-data.s3.us-east-2.amazonaws.com";

const customColors = [
  "#c3b91e", // Yellow-Green (9 ft)
  "#e68a1e", // Orange (10 ft)
  "#f4a700", // Bright Orange (11 ft)
  "#23b7c8", // Cyan (12 ft)
  "#0056d6", // Blue (13 ft)
  "#d63b3b", // Red (14 ft)
  "#9b3dbd", // Purple (15 ft)
  "#d94a8c", // Pink (16 ft)
  "#3cb043", // Green (17 ft)
  "#2abf72", // Light Green (18 ft)
];

const floodLevels = Array.from({ length: 10 }, (_, i) => {
  const floodLevel = 9 + i; // Start at 9 ft
  const geojsonLevel = 65 + i; // Start at 65.geojson for 9 ft

  return {
    id: `flood${geojsonLevel}`,
    name: `${floodLevel} ft`,
    geojson: `${S3_BASE_URL}/${geojsonLevel}.geojson`, // Fetch from S3
    color: customColors[i], // Apply colors correctly
  };
});



const FloodLevels = () => {
  const mapContainerRef = useRef(null);
  const [selectedFloodLevel, setSelectedFloodLevel] = useState(9);
  const [menuOpen, setMenuOpen] = useState(true);
  const mapRef = useRef(null);
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [waterLevels, setWaterLevels] = useState([]);
  const toggleMenu = () => {setMenuOpen((prev) => !prev);};

  // Fetch water levels from USGS API
  useEffect(() => {
    const fetchWaterLevels = async () => {
      const gages = [{ id: '15052500', name: 'Mendenhall Lake Stage Level' }];

      try {
        const fetchedLevels = await Promise.all(
          gages.map(async (gage) => {
            try {
              const response = await fetch(
                `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${gage.id}&parameterCd=00065&siteStatus=active`
              );

              if (!response.ok) {
                console.warn(`Error fetching data for ${gage.id}: ${response.status}`);
                throw new Error(`HTTP status ${response.status}`);
              }

              const data = await response.json();
              const timeSeries = data?.value?.timeSeries?.[0];
              const values = timeSeries?.values?.[0]?.value;

              if (values && values.length > 0) {
                const latest = values[values.length - 1];

                // Convert to Alaska Time (AKST/AKDT)
                const options = { timeZone: 'America/Anchorage', timeStyle: 'short', dateStyle: 'medium' };
                const alaskaTime = new Intl.DateTimeFormat('en-US', options).format(new Date(latest.dateTime));

                return {
                  id: gage.id,
                  name: gage.name,
                  value: parseFloat(latest.value) > 0 ? latest.value : 'N/A',
                  dateTime: alaskaTime,
                  status: 'Online',
                };
              }

              return {
                id: gage.id,
                name: gage.name,
                value: 'N/A',
                dateTime: 'N/A',
                status: 'Offline',
              };
            } catch (error) {
              console.error(`Error processing gage ${gage.id}:`, error);
              return {
                id: gage.id,
                name: gage.name,
                value: 'N/A',
                dateTime: 'N/A',
                status: 'Offline',
              };
            }
          })
        );

        setWaterLevels(fetchedLevels);
      } catch (error) {
        console.error('Error fetching water levels:', error);
      }
    };

    fetchWaterLevels();
    const interval = setInterval(fetchWaterLevels, 60000);

    return () => clearInterval(interval);
  }, []);

// Initialize Mapbox map
useEffect(() => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWFwZmVhbiIsImEiOiJjbTNuOGVvN3cxMGxsMmpzNThzc2s3cTJzIn0.1uhX17BCYd65SeQsW1yibA';

  if (!mapRef.current) {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-134.572823, 58.397411],
      zoom: 11,
    });

    mapRef.current.on('load', () => {
      // Add flood levels as geojson layers
      floodLevels.forEach((flood) => {
        mapRef.current.addSource(flood.id, {
          type: 'geojson',
          data: flood.geojson,
        });

        mapRef.current.addLayer({
          id: `${flood.id}-fill`,
          type: 'fill',
          source: flood.id,
          layout: {},
          paint: {
            'fill-color': flood.color,
            'fill-opacity': 0.5,
          },
        });

        mapRef.current.setLayoutProperty(`${flood.id}-fill`, 'visibility', 'none');
      });

      // Add hover popup logic
      const hoverPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 10,
        className: 'hover-popup',
      });

      mapRef.current.on('mousemove', (e) => {
        const features = mapRef.current.queryRenderedFeatures(e.point, {
          layers: floodLevels.map((flood) => `${flood.id}-fill`),
        });

        if (features.length > 0) {
          const feature = features[0];
          const depth = feature.properties?.DN || 'Unknown'; // Adjust the property key as needed

          hoverPopup
            .setLngLat(e.lngLat)
            .setHTML(`<b>Water Depth: ${depth} ft</b>`)
            .addTo(mapRef.current);
        } else {
          hoverPopup.remove();
        }
      });

      mapRef.current.on('mouseleave', () => {
        hoverPopup.remove();
      });

      // Add custom markers
      const markerCoordinates = [
        {
          lat: 58.4293972,
          lng: -134.5745592,
          popupContent: `
      
            <a href="https://waterdata.usgs.gov/monitoring-location/15052500/#dataTypeId=continuous-00065--1654777834&period=P7D&showMedian=false" target="_blank">
              <b>Mendenhall Lake Water Gage</b>
            </a>
          `,
        },
        {
          lat: 58.4595556,
          lng: -134.5038333,
          popupContent: `
            <a href="https://waterdata.usgs.gov/monitoring-location/1505248590/#dataTypeId=continuous-00020-0&period=P7D&showMedian=true" target="_blank">
              <b>Suicide Basin Glacial Pool Water Gage</b>
            </a>
          `,
        },
      ];

      markerCoordinates.forEach((coord) => {
        // Create a marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'usgs-marker';

        // Add the marker to the map
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([coord.lng, coord.lat])
          .addTo(mapRef.current);

        // Add popup if popupContent is provided
        if (coord.popupContent) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(coord.popupContent);

          marker.setPopup(popup); // Attach the popup to the marker
        }
      });
    });
  }
}, []);



  const searchAddress = async () => {
    setIsSearching(true);
    try {
      setErrorMessage('');
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;

        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 14,
        });
      } else {
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('');
    } finally {
      setIsSearching(false);
    }
  };


  return (
    <div>
      {/* Desktop pop-up for instructions */}
      <FloodInfoPopup /> 
  
      <div id="map" ref={mapContainerRef} style={{ height: '90vh', width: '100vw' }} />
  
      {/* Toggle Button */}
      <button onClick={toggleMenu} className="menu-toggle-button">
        {menuOpen ? 'Hide Menu' : 'Show Menu'}
      </button>
  
      <div className={`flood-stepper-container`}>
        <FloodStepper mapRef={mapRef} selectedFloodLevel={selectedFloodLevel} hideOnDesktop={true} />
      </div>
  
      {/* Menu Container */}
      {menuOpen && (
        <div id="controls" style={{ position: 'absolute', top: '160px', left: '15px', zIndex: 1 }}>
          <div style={{ marginTop: '10px' }}>
            <div className="search-container">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  searchAddress();
                }}
              ></form>
              <input
                type="text"
                id="search-address"
                name="searchAddress"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address..."
                className="search-bar"
                autoComplete="on"
              />
              <button onClick={searchAddress} disabled={isSearching} className="search-button">
                {isSearching ? 'Search' : 'Search'}
              </button>
            </div>
            
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
          </div>
  
          <div>
            <FloodStepper mapRef={mapRef} selectedFloodLevel={selectedFloodLevel} isMenuHidden={!menuOpen} />
          </div>
  
          {menuOpen && <FloodStageMenu setFloodLevelFromMenu={setSelectedFloodLevel} />}
  
          <div style={{ marginTop: '20px' }}>
          <div>
  {waterLevels.map((level) => (
    <div key={level.id} className="level-card">
      <p>
        <a 
          href="https://waterdata.usgs.gov/monitoring-location/15052500/#dataTypeId=continuous-00065--1654777834&period=P7D&showMedian=false" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{color: 'black'}}
        >
          Current Lake Level:
        </a> 
        {` ${level.value} ft`}
      </p>
      <p>
        <a 
          href="https://water.noaa.gov/gauges/jsbA2" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{color: 'black' }}
        >
          Forecasted Lake Level:
        </a> 
        {` NA`}
      </p>
      <p style={{ fontSize: '0.85rem' }}>
  {level.dateTime ? new Date(level.dateTime).toLocaleString() : 'N/A'}
</p>
    </div>
  ))}
</div>

          </div>
        </div>
      )}
    </div>
  );  
};

export default FloodLevels;
