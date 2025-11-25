import React, { useState } from "react";
import "./AboutMap.css";
import Model from './Model';

const AboutMap = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flood-records-container2 ${isHovered ? "expanded" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered ? (
        <span className="tooltip-icon2">About Flood Maps</span>
      ) : (
        <div className="tooltip-title2">
          <h2>About Flood Maps</h2>
          <Model />
          <div className="tooltip-text3">
Flood inundation maps show potential impacts. Maps with HESCO barriers assume optimal performance.
<p></p>
GLOFs can vary in magnitude from year to year. A 20-foot event would require an atmospheric river occurring in parallel with a significant flood event.
          </div>

        </div>
      )}
    </div>
  );
};

export default AboutMap;

