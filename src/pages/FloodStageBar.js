import React, { useState, useEffect } from "react";
import "./FloodStageBar.css";

const FloodStageBar = () => {
  const [waterLevel, setWaterLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalInfo, setModalInfo] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState(null);

  const fetchWaterLevels = async () => {
    const gageId = "15052500";
    const apiUrl = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${gageId}&parameterCd=00065&siteStatus=active`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      const timeSeries = data?.value?.timeSeries?.[0]?.values?.[0]?.value?.[0]?.value;
      
      if (!timeSeries) {
        throw new Error("No water level data available");
      }

      const level = parseFloat(timeSeries);
      if (isNaN(level)) throw new Error("Invalid water level data");

      setWaterLevel(level);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterLevels();
    const interval = setInterval(fetchWaterLevels, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    { label: "Action Stage", range: [0, 9], color: "#e9f502", info: "Flooding 0ft - 9ft" },
    { label: "Minor Flood Stage", range: [9, 10], color: "#F4A100", info: "Flooding 9ft - 10ft" },
    { label: "Moderate Flood Stage", range: [10, 14], color: "#E2371D", info: "Flooding 10ft - 14ft" },
    { label: "Major Flood Stage", range: [14, Infinity], color: "#9419A3", info: "Flooding 14ft+" },
  ];

  const openDropdown = (event, stage) => {
    if (modalInfo && modalInfo.label === stage.label) {
      // If the same stage is clicked again, close the dropdown
      setModalInfo(null);
      setDropdownPosition(null);
    } else {
      // Otherwise, open the dropdown and set its position
      const rect = event.currentTarget.getBoundingClientRect();
      setModalInfo(stage);
      setDropdownPosition({
        top: rect.bottom + window.scrollY, 
        left: rect.left + rect.width / 2,
        
      });
    }
  };

  return (
    <div className="flood-stage-container">
      {loading ? (
        <p>Loading water level data...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <FloodBar waterLevel={waterLevel} openDropdown={openDropdown} stages={stages} />
      )}

      {modalInfo && dropdownPosition && (
        <div 
          className="modal-dropdown" 
          style={{ 
            top: dropdownPosition.top, 
            left: dropdownPosition.left,
            border: `2.5px solid ${modalInfo.color}`, // Set border color dynamically
            
          }}
          onClick={() => setModalInfo(null)} // Clicking dropdown also closes it
        >
          <h3>{modalInfo.label}</h3>
          <p>{modalInfo.info}</p>
        </div>
      )}
    </div>
  );
};

const FloodBar = ({ waterLevel, openDropdown, stages }) => {
  return (
    <div className="flood-stage-bar">
      {stages.map((stage) => {
        const isCurrentStage = waterLevel >= stage.range[0] && waterLevel < stage.range[1];

        return (
          <div
            key={stage.label}
            className={`flood-stage-section ${isCurrentStage ? "highlight" : ""}`}
            style={{
              backgroundColor: stage.color,
              width: `${100 / stages.length}%`,
              filter: isCurrentStage ? "none" : "grayscale(70%)",
            }}
            onClick={(event) => openDropdown(event, stage)}
          >
            <span className="stage-label">
              {stage.label} {isCurrentStage && <span className="current-water-level">{waterLevel} ft</span>}
            </span>
            
          </div>
        );
      })}
    </div>
  );
};

export default FloodStageBar;
