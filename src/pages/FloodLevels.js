// FloodLevels.js (updated to use Mapbox HESCO tilesets only)

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './FloodLevels.css';
import FloodStageMenu from './FloodStageMenu';
import FloodStepper from './FloodStepper';
import FloodInfoPopup from "./FloodInfoPopup";
import { getFloodStage } from './utils/floodStages';
import Search from './Search.js';

const customColors = [
  "#c3b91e", "#e68a1e", "#31a354", "#3182bd", "#08306b",
  "#d63b3b", "#9b3dbd", "#d13c8f", "#c2185b", "#756bb1"
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
    if (!mapRef.current || !activeLayerId) return;
    const map = mapRef.current;
    if (!map.getLayer(activeLayerId)) {
      setTimeout(() => setupHoverPopup(activeLayerId), 250);
      return;
    }
    map.off('mousemove', activeLayerId);
    map.off('mouseleave', activeLayerId);
    const hoverPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 10, className: 'hover-popup' });
    map.on('mousemove', activeLayerId, (e) => {
      const feature = e.features?.[0];
      const depth = feature?.properties?.DN || 'Unknown';
      hoverPopup.setLngLat(e.lngLat).setHTML(`<b>Water Depth: ${depth} ft</b>`).addTo(map);
    });
    map.on('mouseleave', activeLayerId, () => hoverPopup.remove());
  }, []);

  const tilesetMap = {
    base: {
      65: "3z7whbfp",
      66: "8kk8etzn",
      67: "akq41oym",
      68: "5vsqqhd8",
      69: "awu2n97c",
      70: "a2ttaa7t",
      71: "0rlea0ym",
      72: "44bl8opr",
      73: "65em8or7",
      74: "9qrkn8pk",
    },
    hesco: {
      70: "cjs05ojz",
      71: "1z6funv6",
      72: "9kmxxb2g",
      73: "4nh8p66z",
      74: "cz0f7io4",
    },
  };
  

const updateFloodLayers = (mode) => {
  setLoadingLayers(true);
  const validLevels = Array.from({ length: 10 }, (_, i) => 65 + i);

  validLevels.forEach((level) => {
    const layerId = `flood${level}-fill`;
    const sourceId = `flood${level}`;
    if (mapRef.current.getLayer(layerId)) {
      mapRef.current.removeLayer(layerId);
    }
    if (mapRef.current.getSource(sourceId)) {
      mapRef.current.removeSource(sourceId);
    }
  });

  let loadedCount = 0;

  validLevels.forEach((level) => {
    const floodId = `flood${level}`;
    const layerId = `${floodId}-fill`;
    const visible = floodId === `flood${65 + (selectedFloodLevel - 9)}`;

    const tilesetId = mode
      ? tilesetMap.hesco[level]
      : tilesetMap.base[level];

    if (mode && !tilesetId) {
      loadedCount++;
      return;
    }

    const sourceLayerName = mode ? `flood${level}` : String(level);

    mapRef.current.addSource(floodId, {
      type: 'vector',
      url: `mapbox://mapfean.${tilesetId}`,
    });

    mapRef.current.addLayer({
      id: layerId,
      type: 'fill',
      source: floodId,
      'source-layer': sourceLayerName,
      layout: {
        visibility: visible ? 'visible' : 'none',
      },
      paint: {
        'fill-color': customColors[level - 65],
        'fill-opacity': 0.5,
      },
    });

    loadedCount++;
    if (loadedCount === validLevels.length) {
      setLoadingLayers(false);
      setupHoverPopup(`${floodId}-fill`);
    }
  });
};
  

  const toggleHescoMode = () => {
    setHescoMode((prev) => {
      const newMode = !prev;
      if (!newMode && window.innerWidth < 768) {
        window.location.reload();
      } else {
        updateFloodLayers(newMode);
        const visibleLayerId = `flood${65 + (selectedFloodLevel - 9)}-fill`;
        setTimeout(() => setupHoverPopup(visibleLayerId), 300);
      }
      return newMode;
    });
  };

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwZmVhbiIsImEiOiJjbTNuOGVvN3cxMGxsMmpzNThzc2s3cTJzIn0.1uhX17BCYd65SeQsW1yibA';
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-134.572823, 58.397411],
        zoom: 11,
      });
      mapRef.current.on('load', () => updateFloodLayers(hescoMode));
    }
  }, [hescoMode]);

  useEffect(() => {
    if (hescoMode && selectedFloodLevel < 14) {
      setHescoMode(false);
      updateFloodLayers(false);
    }
  }, [selectedFloodLevel, hescoMode]);

  const handleFloodLayerChange = useCallback(() => {
    const layerId = `flood${65 + (selectedFloodLevel - 9)}-fill`;
    if (mapRef.current?.getLayer(layerId)) {
      setupHoverPopup(layerId);
    }
  }, [selectedFloodLevel, setupHoverPopup]);

  useEffect(() => {
    const fetchWaterLevels = async () => {
      const gages = [{ id: '15052500', name: 'Mendenhall Lake Stage Level' }];
      try {
        const fetchedLevels = await Promise.all(
          gages.map(async (gage) => {
            try {
              const response = await fetch(`https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${gage.id}&parameterCd=00065&siteStatus=active`);
              if (!response.ok) throw new Error(`HTTP status ${response.status}`);
              const data = await response.json();
              const values = data?.value?.timeSeries?.[0]?.values?.[0]?.value;
              if (values?.length > 0) {
                const latest = values[values.length - 1];
                const alaskaTime = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Anchorage', timeStyle: 'short', dateStyle: 'medium' }).format(new Date(latest.dateTime));
                return { id: gage.id, name: gage.name, value: parseFloat(latest.value) > 0 ? latest.value : 'N/A', dateTime: alaskaTime, status: 'Online' };
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
            title={selectedFloodLevel < 14 ? 'HESCO maps are only available for 14ft and above' : 'HESCO maps assuming fully functional barriers'}
            onClick={() => { if (selectedFloodLevel >= 14) toggleHescoMode(); }}
            className={`hesco-toggle-button ${hescoMode ? 'hesco-on' : 'hesco-off'}`}
            disabled={loadingLayers || selectedFloodLevel < 14}
          >
            {loadingLayers ? 'Loading HESCO Data…' : hescoMode ? 'HESCO Barriers ON' : 'HESCO Barriers OFF (14ft+)'}
          </button>
          <FloodStageMenu setFloodLevelFromMenu={setSelectedFloodLevel} onFloodLayerChange={() => setupHoverPopup(`flood${65 + (selectedFloodLevel - 9)}-fill`)} />
          <div style={{ marginTop: '20px' }}>
            {waterLevels.map((level) => {
              const currentStage = getFloodStage(level.value);
              return (
                <div key={level.id} className="level-card">
                  <p>
                    <a href="https://waterdata.usgs.gov/monitoring-location/15052500/" target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>Current Lake Level:</a>
                    <strong>{` ${level.value} ft`}</strong>
                  </p>
                  <p>
                    <span style={{ color: currentStage?.color || 'black' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{currentStage?.label || 'Unknown'}</span>
                    </span>
                  </p>
                  <p style={{ fontSize: '0.85rem' }}>{level.dateTime || 'N/A'}</p>
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