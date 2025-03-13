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

  useEffect(() => {
    const handleResize = () => {
      if (modalInfo) {
        setModalInfo(null);
        setDropdownPosition(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [modalInfo]);

  const stages = [
    { label: "No Flood Stage", range: [0, 8], color: "#28a745", info: "Water level is below flood risk (0ft - 8ft)" },
    { label: "Action Stage", range: [8, 9], color: "#e9f502", info: "Flooding risk starts (8ft - 9ft)" },
    { label: "Minor Flood Stage", range: [9, 10], color: "#F4A100", info: "Flooding risk 9ft - 10ft" },
    { label: "Moderate Flood Stage", range: [10, 14], color: "#E2371D", info: "Flooding risk 10ft - 14ft" },
    { label: "Major Flood Stage", range: [14, Infinity], color: "#9419A3", info: "Flooding risk 14ft+" },
  ];

  const openDropdown = (event, stage) => {
    if (modalInfo && modalInfo.label === stage.label) {
      setModalInfo(null);
      setDropdownPosition(null);
    } else {
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
            border: `2.5px solid ${modalInfo.color}`,
          }}
          onClick={() => setModalInfo(null)}
        >
          <div className="modal-content">
            <p>{modalInfo.info}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const FloodBar = ({ waterLevel, openDropdown, stages }) => {
  const [hoveredStage, setHoveredStage] = useState(null);

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
              filter: isCurrentStage || hoveredStage === stage.label ? "none" : "grayscale(90%)",
            }}
            onClick={(event) => openDropdown(event, stage)}
            onMouseEnter={() => setHoveredStage(stage.label)}
            onMouseLeave={() => setHoveredStage(null)}
          >
            <span 
              className={`stage-label ${!isCurrentStage ? "normal-text" : "bold-text"}`}
            >
              {stage.label} {isCurrentStage && <span className="current-water-level"></span>}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default FloodStageBar;
