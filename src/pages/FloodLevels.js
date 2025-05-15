import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './FloodLevels.css';
import FloodStageMenu from './FloodStageMenu';
import FloodStepper from './FloodStepper';
import FloodInfoPopup from "./FloodInfoPopup";
import { getFloodStage } from './utils/floodStages';
import Search from './Search.js';

// cd /Users/seanfagan/Desktop/juneau-flood-alpha
// git add. git commit -m "Updated FloodLevels.js" git push origin main

const customColors = [
  "#c3b91e", // 1 - Mustard yellow (unchanged)
  "#e68a1e", // 2 - Pumpkin orange (unchanged)
  "#31a354", // 3 - Vivid green (replacing soft green)
  "#3182bd", // 4 - Medium blue (richer than sky blue)
  "#08306b", // 5 - Deep navy blue (stronger than standard blue)
  "#d63b3b", // 6 - Red (unchanged)
  "#9b3dbd", // 7 - Purple (unchanged)
  "#d13c8f", // 8 - Vibrant magenta
  "#c2185b", // 9 - Raspberry (replaces green)
  "#756bb1"  // 10 - Deep violet
];

const FloodLevels = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedFloodLevel, setSelectedFloodLevel] = useState(9);
  const [menuOpen, setMenuOpen] = useState(true);
  const [hescoMode, setHescoMode] = useState(false);
  const [errorMessage] = useState('');
  const [waterLevels, setWaterLevels] = useState([]);
  const [loadingLayers, setLoadingLayers] = useState(false);


  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const setupHoverPopup = useCallback((activeLayerId) => {
    if (!mapRef.current) return;
  
    const map = mapRef.current;
  
    if (!activeLayerId) {
      console.error("activeLayerId is undefined or empty. Cannot set up hover popup.");
      return;
    }
    
    if (!map.getLayer(activeLayerId)) {
      console.warn(`Layer "${activeLayerId}" not found. Deferring hover popup setup.`);
      setTimeout(() => setupHoverPopup(activeLayerId), 250);
      return;
    }    
  
    // Remove previous listeners for this layer
    map.off('mousemove', activeLayerId);
    map.off('mouseleave', activeLayerId);
  
    const hoverPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10,
      className: 'hover-popup',
    });
  
    map.on('mousemove', activeLayerId, (e) => {
      const feature = e.features?.[0];
      const depth = feature?.properties?.DN || 'Unknown';
      hoverPopup.setLngLat(e.lngLat).setHTML(`<b>Water Depth: ${depth} ft</b>`).addTo(map);
    });
  
    map.on('mouseleave', activeLayerId, () => {
      hoverPopup.remove();
    });
  }, []);
  

  const updateFloodLayers = (mode) => {
    setLoadingLayers(true);
  
    const newBucket = mode
      ? "https://flood-data-hesco.s3.us-east-2.amazonaws.com"
      : "https://flood-data.s3.us-east-2.amazonaws.com";
  
    if (!mapRef.current) return;
  
    const floodLevels = Array.from({ length: 10 }, (_, i) => {
      const floodLevel = 9 + i;
      const geojsonLevel = 65 + i;
      return {
        id: `flood${geojsonLevel}`,
        name: `${floodLevel} ft`,
        geojson: `${newBucket}/${geojsonLevel}.geojson`,
        color: customColors[i],
      };
    });
  
    // Step 1: Remove existing layers and sources
    floodLevels.forEach((flood) => {
      const layerId = `${flood.id}-fill`;
      const sourceId = flood.id;
  
      if (mapRef.current.getLayer(layerId)) {
        mapRef.current.removeLayer(layerId);
      }
      if (mapRef.current.getSource(sourceId)) {
        mapRef.current.removeSource(sourceId);
      }
    });
  
    // Step 2: Add them back after short delay to let map "settle"
    setTimeout(() => {
      let loadedCount = 0;
      const totalFloods = floodLevels.length;
  
      floodLevels.forEach((flood, index) => {
        const layerId = `${flood.id}-fill`;
        const sourceId = flood.id;
  
        fetch(flood.geojson)
          .then((response) => {
            if (!response.ok) throw new Error("GeoJSON not found");
            return response.json();
          })
          .then((data) => {
            if (!mapRef.current.getSource(sourceId)) {
              mapRef.current.addSource(sourceId, { type: "geojson", data });
              mapRef.current.addLayer({
                id: layerId,
                type: "fill",
                source: sourceId,
                layout: {visibility: "none", },
                paint: {
                  "fill-color": flood.color,
                  "fill-opacity": 0.5,
                },
              });
              mapRef.current.setLayoutProperty(
                layerId,
                "visibility",
                flood.id === `flood${65 + (selectedFloodLevel - 9)}`
                  ? "visible"
                  : "none"
              );
            }
          })
          .catch((err) => {
            console.warn(`Could not load ${flood.geojson}:`, err.message);
          })
          .finally(() => {
            loadedCount++;
            if (loadedCount === totalFloods) {
              setLoadingLayers(false);
              const activeLayerId = `flood${65 + (selectedFloodLevel - 9)}-fill`;
              setupHoverPopup(activeLayerId); // pass the currently visible layer
            }            
          });
      });
    }, 300); 
  };
  

  const toggleHescoMode = () => {
    setHescoMode((prev) => {
      const newMode = !prev;
  
      const isMobile = window.innerWidth < 768;
  
      if (!newMode && isMobile) {
        // If HESCO is being turned OFF on mobile, refresh to prevent overload
        window.location.reload();
      } else {
        updateFloodLayers(newMode);
        // After flood layers are updated, reattach popup to visible layer
        const visibleLayerId = `flood${65 + (selectedFloodLevel - 9)}-fill`;
        setTimeout(() => setupHoverPopup(visibleLayerId), 300);
      }
  
      return newMode;
    });
  };
  
  

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

              if (!response.ok) throw new Error(`HTTP status ${response.status}`);
              const data = await response.json();
              const timeSeries = data?.value?.timeSeries?.[0];
              const values = timeSeries?.values?.[0]?.value;
              if (values && values.length > 0) {
                const latest = values[values.length - 1];
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
              return { id: gage.id, name: gage.name, value: 'N/A', dateTime: 'N/A', status: 'Offline' };
            } catch {
              return { id: gage.id, name: gage.name, value: 'N/A', dateTime: 'N/A', status: 'Offline' };
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

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwZmVhbiIsImEiOiJjbTNuOGVvN3cxMGxsMmpzNThzc2s3cTJzIn0.1uhX17BCYd65SeQsW1yibA';

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-134.572823, 58.397411],
        zoom: 11,
      });

      mapRef.current.on('load', () => {
        setLoadingLayers(true); // Start spinner
      
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
      
        // Use Promise.all to wait until all layers are loaded
        Promise.all(
          floodLevels.map((flood) =>
            fetch(flood.geojson)
              .then((res) => res.json())
              .then((data) => {
                mapRef.current.addSource(flood.id, { type: 'geojson', data });
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
              })
              .catch((err) => {
                console.warn(`Error loading ${flood.geojson}:`, err.message);
              })
          )
        ).then(() => {
          setupHoverPopup();
          setTimeout(() => {
            setLoadingLayers(false); // Stop spinner after slight delay
          }, 300);
        });

        const markerCoordinates = [
          {
            lat: 58.4293972,
            lng: -134.5745592,
            popupContent: `
              <a href="https://waterdata.usgs.gov/monitoring-location/15052500/" target="_blank">
                <b>USGS Mendenhall Lake Level Gage</b>
              </a>`,
          },
          {
            lat: 58.4595556,
            lng: -134.5038333,
            popupContent: `
              <a href="https://waterdata.usgs.gov/monitoring-location/1505248590/" target="_blank">
                <b>USGS Suicide Basin Level Gage</b>
              </a>`,
          },
        ];

        markerCoordinates.forEach((coord) => {
          const markerEl = document.createElement('div');
          markerEl.className = 'usgs-marker';

          const marker = new mapboxgl.Marker(markerEl)
            .setLngLat([coord.lng, coord.lat])
            .addTo(mapRef.current);

          if (coord.popupContent) {
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(coord.popupContent);
            marker.setPopup(popup);
          }
        });
      });
    }
  }, [hescoMode, setupHoverPopup]);



  const handleFloodLayerChange = useCallback(() => {
    if (!selectedFloodLevel || isNaN(selectedFloodLevel)) return;
  
    const layerId = `flood${65 + (selectedFloodLevel - 9)}-fill`;
  
    if (mapRef.current?.getLayer(layerId)) {
      setupHoverPopup(layerId);
    } else {
      console.warn(`Layer ${layerId} not found when setting up hover`);
    }
  }, [selectedFloodLevel, mapRef, setupHoverPopup]);


  useEffect(() => {
    if (hescoMode && selectedFloodLevel < 14) {
      setHescoMode(false);
      updateFloodLayers(false); // Switch back to non-HESCO
    }
  }, [selectedFloodLevel, hescoMode]);
  

  return (
    <div>
      <FloodInfoPopup />
      <div id="map" ref={mapContainerRef} style={{ height: '90vh', width: '100vw' }} />
      <button onClick={toggleMenu} className="menu-toggle-button">
        {menuOpen ? 'Hide Menu' : 'Show Menu'}
      </button>

      <div className="flood-stepper-container">
        <FloodStepper
          mapRef={mapRef}
          selectedFloodLevel={selectedFloodLevel}
          setSelectedFloodLevel={setSelectedFloodLevel}
          isMenuHidden={!menuOpen}
          hideOnDesktop={true}
          hescoMode={hescoMode}
          onFloodLayerChange={handleFloodLayerChange}

        />
      </div>

      {menuOpen && (
        <div id="controls" style={{ position: 'absolute', top: '160px', left: '15px', zIndex: 1 }}>
          <Search mapRef={mapRef} />


          {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}

          <FloodStepper
            mapRef={mapRef}
            selectedFloodLevel={selectedFloodLevel}
            setSelectedFloodLevel={setSelectedFloodLevel}
            isMenuHidden={!menuOpen}
            hideOnDesktop={false}
            hescoMode={hescoMode}
            onFloodLayerChange={handleFloodLayerChange}

          />

          <button
            title={
              selectedFloodLevel < 14
                ? 'HESCO maps are only available for 14ft and above'
                : 'HESCO maps assuming fully functional barriers'
            }
            onClick={() => {
              if (selectedFloodLevel >= 14) {
                toggleHescoMode();
              }
            }}
            className={`hesco-toggle-button ${hescoMode ? 'hesco-on' : 'hesco-off'}`}
            disabled={loadingLayers || selectedFloodLevel < 14}
          >
            {loadingLayers
              ? 'Loading HESCO Data…'
              : hescoMode
              ? 'HESCO Barriers ON'
              : 'HESCO Barriers OFF (14ft+)'}
          </button>


          <FloodStageMenu 
          setFloodLevelFromMenu={setSelectedFloodLevel} 
          onFloodLayerChange={() => setupHoverPopup(`flood${65 + (selectedFloodLevel - 9)}-fill`)}/>

          <div style={{ marginTop: '20px' }}>
            {waterLevels.map((level) => {
              const currentStage = getFloodStage(level.value);
              return (
                <div key={level.id} className="level-card">
                  <p>
                    <a
                      href="https://waterdata.usgs.gov/monitoring-location/15052500/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'black' }}
                    >
                      Current Lake Level:
                    </a>{' '}
                    <strong>{` ${level.value} ft`}</strong>
                  </p>
                  <p>
                    <span style={{ color: currentStage?.color || 'black' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {currentStage?.label || 'Unknown'}
                  </span>
                    </span>
                  </p>
                  <p style={{ fontSize: '0.85rem' }}>
                    {level.dateTime || 'N/A'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

        {loadingLayers && (
          <div className="map-loading-overlay">
            <div className="spinner" />
          </div>
        )}

    </div>
  );
};

export default FloodLevels;
