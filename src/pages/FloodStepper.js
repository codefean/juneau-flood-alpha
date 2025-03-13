import React, { useState, useEffect, useCallback } from 'react';
import './FloodStepper.css';

const customColors = [
  '#c3b91e', '#e68a1e', '#f4a700', '#23b7c8', '#0056d6',
  '#d63b3b', '#9b3dbd', '#d94a8c', '#3cb043', '#2abf72'
];

const FloodStepper = ({ mapRef, selectedFloodLevel, isMenuHidden, hideOnDesktop = false }) => {
  const [floodLevel, setFloodLevel] = useState(9);
  const [isLayerVisible, setIsLayerVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const minFloodLevel = 9;
  const maxFloodLevel = 18;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateFloodLayer = useCallback((level) => {
    if (!mapRef.current) return;
    const geojsonLevel = 65 + (level - 9); // Ensure correct mapping

    mapRef.current.getStyle().layers.forEach((layer) => {
      if (layer.id.includes('flood')) {
        mapRef.current.setLayoutProperty(layer.id, 'visibility', 'none');
      }
    });

    mapRef.current.setLayoutProperty(`flood${geojsonLevel}-fill`, 'visibility', 'visible');
  }, [mapRef]);

  // 🔹 Update when `selectedFloodLevel` changes
  useEffect(() => {
    if (selectedFloodLevel) {
      setFloodLevel(selectedFloodLevel);
      updateFloodLayer(selectedFloodLevel);
    }
  }, [selectedFloodLevel, updateFloodLayer]);

  // 🔹 Update when `floodLevel` changes (stepper buttons)
  useEffect(() => {
    updateFloodLayer(floodLevel);
  }, [floodLevel, updateFloodLayer]);

  const changeFloodLevel = (direction) => {
    setFloodLevel((prev) => {
      let newLevel = direction === 'up' ? prev + 1 : prev - 1;
      return newLevel < minFloodLevel || newLevel > maxFloodLevel ? prev : newLevel;
    });
  };

  const toggleFloodVisibility = () => {
    const geojsonLevel = 65 + (floodLevel - 9);
    const newVisibility = isLayerVisible ? 'none' : 'visible';

    setIsLayerVisible(!isLayerVisible);
    if (mapRef.current) {
      mapRef.current.setLayoutProperty(`flood${geojsonLevel}-fill`, 'visibility', newVisibility);
    }
  };

  if (hideOnDesktop && !isMobile) {
    return null;
  }

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
          onClick={toggleFloodVisibility}
        >
          {floodLevel} ft <span className="water-text">lake level</span>
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
