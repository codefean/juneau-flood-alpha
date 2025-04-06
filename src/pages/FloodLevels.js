import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './FloodLevels.css';
import FloodStageMenu from './FloodStageMenu'; // Import the FloodStageMenu component
import FloodStepper from './FloodStepper';
import FloodInfoPopup from "./FloodInfoPopup";

//cd /Users/seanfagan/Desktop/juneau-flood-alpha


const customColors = [
  "#c3b91e", "#e68a1e", "#f4a700", "#23b7c8", "#0056d6",
  "#d63b3b", "#9b3dbd", "#d94a8c", "#3cb043", "#2abf72"
];

const FloodLevels = () => {
  const mapContainerRef = useRef(null);
  const [selectedFloodLevel, setSelectedFloodLevel] = useState(9);
  const [menuOpen, setMenuOpen] = useState(true);
  const [hescoMode, setHescoMode] = useState(false); // 
  const [floodLayersLoaded, setFloodLayersLoaded] = useState(false); //
  const mapRef = useRef(null);
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [waterLevels, setWaterLevels] = useState([]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

const toggleHescoMode = () => {
  const newMode = !hescoMode;
  setHescoMode(newMode);
  setFloodLayersLoaded(false);

  const newBucket = newMode
    ? "https://flood-data-hesco.s3.us-east-2.amazonaws.com"
    : "https://flood-data.s3.us-east-2.amazonaws.com";

  if (mapRef.current) {
    // Always clear current flood layers
    floodLevels.forEach((flood) => {
      const layerId = `${flood.id}-fill`;
      const sourceId = flood.id;

      if (mapRef.current.getLayer(layerId)) {
        mapRef.current.removeLayer(layerId);
      }
      if (mapRef.current.getSource(sourceId)) {
        mapRef.current.removeSource(sourceId);
      }

      // Build GeoJSON URL from the other bucket
      const geojsonLevel = flood.id.replace("flood", "");
      const newGeojsonUrl = `${newBucket}/${geojsonLevel}.geojson`;

      // Fetch and add new layer from the updated bucket
      fetch(newGeojsonUrl)
        .then((response) => {
          if (!response.ok) throw new Error("GeoJSON not found");

          return response.json();
        })
        .then((data) => {
          mapRef.current.addSource(sourceId, {
            type: "geojson",
            data: data,
          });

          mapRef.current.addLayer({
            id: layerId,
            type: "fill",
            source: sourceId,
            layout: {},
            paint: {
              "fill-color": flood.color,
              "fill-opacity": 0.5,
            },
          });

          if (flood.id === `flood${65 + (selectedFloodLevel - 9)}`) {
            mapRef.current.setLayoutProperty(layerId, 'visibility', 'visible');
          } else {
            mapRef.current.setLayoutProperty(layerId, 'visibility', 'none');
          }
        })
        .catch((err) => {
          console.warn(`Could not load ${newGeojsonUrl}:`, err.message);
        });
    });
  }
};

  
  

  const currentBucket = hescoMode
    ? "https://flood-data-hesco.s3.us-east-2.amazonaws.com"
    : "https://flood-data.s3.us-east-2.amazonaws.com";

  const floodLevels = Array.from({ length: 10 }, (_, i) => {
    const floodLevel = 9 + i;
    const geojsonLevel = 65 + i;
    return {
      id: `flood${geojsonLevel}`,
      name: `${floodLevel} ft`,
      geojson: `${currentBucket}/${geojsonLevel}.geojson`,
      color: customColors[i],
    };
  });

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
      // Inside the mapRef.current.on('load') function, remove previous layers
floodLevels.forEach((flood) => {
  // Check if the layer already exists
  if (mapRef.current.getLayer(`${flood.id}-fill`)) {
    mapRef.current.removeLayer(`${flood.id}-fill`);
    mapRef.current.removeSource(flood.id); // Remove source as well
  }

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
              <b>USGS Mendenhall Lake Level Gage</b>
            </a>
          `,
        },
        {
          lat: 58.4595556,
          lng: -134.5038333,
          popupContent: `
            <a href="https://waterdata.usgs.gov/monitoring-location/1505248590/#dataTypeId=continuous-00020-0&period=P7D&showMedian=true" target="_blank">
              <b>USGS Suicide Basin Level Gage</b>
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
      <FloodInfoPopup /> 
  
      <div id="map" ref={mapContainerRef} style={{ height: '90vh', width: '100vw' }} />
  
      {/* Toggle Button */}
      <button onClick={toggleMenu} className="menu-toggle-button">
        {menuOpen ? 'Hide Menu' : 'Show Menu'}
      </button>
  
      <div className={`flood-stepper-container`}>
      <FloodStepper
  mapRef={mapRef}
  selectedFloodLevel={selectedFloodLevel}
  setSelectedFloodLevel={setSelectedFloodLevel} // ✅ New
  isMenuHidden={!menuOpen}
  hideOnDesktop={true}
  hescoMode={hescoMode}
/>


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
                placeholder="Enter address (optional)"
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
                  <FloodStepper
          mapRef={mapRef}
          selectedFloodLevel={selectedFloodLevel}
          setSelectedFloodLevel={setSelectedFloodLevel} // ✅ New
          isMenuHidden={!menuOpen}
          hideOnDesktop={false}
          hescoMode={hescoMode}
        />

          </div>

        
          <button
  onClick={toggleHescoMode}
  className={`hesco-toggle-button ${hescoMode ? 'hesco-on' : 'hesco-off'}`}
>
  {hescoMode ? 'HESCO Barriers ON' : 'HESCO Barriers OFF'}
</button>


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
