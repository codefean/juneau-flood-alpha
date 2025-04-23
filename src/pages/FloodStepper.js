import React, { useState, useEffect, useCallback } from 'react';
import './FloodStepper.css';

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
const FloodStepper = ({
  mapRef,
  selectedFloodLevel,
  setSelectedFloodLevel,
  isMenuHidden,
  hideOnDesktop = false,
  hescoMode = false,
  onFloodLayerChange = () => {} // 👈 NEW: Callback to refresh hover logic
}) => {
  const floodLevel = selectedFloodLevel;
  const [isLayerVisible, setIsLayerVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const minFloodLevel = 9;
  const maxFloodLevel = 18;

  const currentBucket = hescoMode
    ? 'https://flood-data-hesco.s3.us-east-2.amazonaws.com'
    : "https://db41y1hte1zn7.cloudfront.net";

  // Detect mobile layout changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load or update current flood layer
  const updateFloodLayer = useCallback((level) => {
    if (!mapRef.current) return;

    const geojsonLevel = 65 + (level - 9);
    const layerId = `flood${geojsonLevel}-fill`;
    const sourceId = `flood${geojsonLevel}`;
    const newUrl = `${currentBucket}/${geojsonLevel}.geojson`;

    // Hide all flood layers
    const layers = mapRef.current.getStyle().layers || [];
    layers.forEach((layer) => {
      if (layer.id.includes('flood') && layer.id.endsWith('-fill')) {
        if (mapRef.current.getLayer(layer.id)) {
          mapRef.current.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      }
    });
    

    // Update source data if it exists
    if (mapRef.current.getSource(sourceId)) {
      mapRef.current.getSource(sourceId).setData(newUrl);
    }

    // Show the current layer
    if (mapRef.current.getLayer(layerId)) {
      mapRef.current.setLayoutProperty(layerId, 'visibility', 'visible');
    }

    // 👇 Rebind hover popup after the layer is updated
    onFloodLayerChange();
  }, [mapRef, currentBucket, onFloodLayerChange]);

  // Update map layer when flood level or HESCO mode changes
  useEffect(() => {
    if (selectedFloodLevel) {
      updateFloodLayer(selectedFloodLevel);
    }
  }, [selectedFloodLevel, hescoMode, updateFloodLayer]);

  // Handle + / − button press
  const changeFloodLevel = (direction) => {
    const newLevel = direction === 'up' ? floodLevel + 1 : floodLevel - 1;
    if (newLevel >= minFloodLevel && newLevel <= maxFloodLevel) {
      setSelectedFloodLevel(newLevel);
    }
  };

  const toggleFloodVisibility = () => {
    const geojsonLevel = 65 + (floodLevel - 9);
    const newVisibility = isLayerVisible ? 'none' : 'visible';
    const layerId = `flood${geojsonLevel}-fill`;
  
    setIsLayerVisible(!isLayerVisible);
  
    if (mapRef.current && mapRef.current.getLayer(layerId)) {
      mapRef.current.setLayoutProperty(layerId, 'visibility', newVisibility); // ✅ Fixed here
      onFloodLayerChange();
    }
  };
  

  // Hide on desktop if specified
  if (hideOnDesktop && !isMobile) return null;

  return (
    <div className="flood-stepper-wrapper">
      <div className={`stepper-container ${isMenuHidden ? 'menu-hidden' : ''}`}>
        <button
          className="stepper-button"
          onClick={() => changeFloodLevel('down')}
          disabled={floodLevel === minFloodLevel}
        >
          −
        </button>
        <div
  className={`flood-level-card ${isLayerVisible ? '' : 'dimmed'}`}
  style={{ backgroundColor: customColors[floodLevel - 9] }}
  onClick={() => {
    const layerId = `flood${65 + (floodLevel - 9)}-fill`;
    if (mapRef.current?.getLayer(layerId)) {
      toggleFloodVisibility();
    }
  }}
>
          <div className="water-text">Mendenhall Lake</div>
          {floodLevel} ft
        </div>
        <button
          className="stepper-button"
          onClick={() => changeFloodLevel('up')}
          disabled={floodLevel === maxFloodLevel}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default FloodStepper;
