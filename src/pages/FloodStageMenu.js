import React, { useState } from 'react';
import './FloodStageMenu.css';

const FloodStageMenu = ({ setFloodLevelFromMenu }) => {
  const [expanded, setExpanded] = useState(null);

  const toggleAccordion = (section, floodLevel) => {
    setExpanded(expanded === section ? null : section);
    if (floodLevel && setFloodLevelFromMenu) {
      setFloodLevelFromMenu(floodLevel);
    }
  };

  return (
    <div className="accordion-container">
      {/* Action Stage */}
      <div
        className={`accordion-section action-stage ${expanded === 'action' ? 'expanded' : ''}`}
        onClick={() => toggleAccordion('action', 9)} 
      >
        <h4>Action Stage (8 - 9ft)</h4>
        {expanded === 'action' && (
          <div className="accordion-content">
            <p>Water levels have reached flood potential. Residents should begin to take mitigation actions for flooding events based on their location.</p>
          </div>
        )}
      </div>

      {/* Minor Flood Stage */}
      <div
        className={`accordion-section minor-stage ${expanded === 'minor' ? 'expanded' : ''}`}
        onClick={() => toggleAccordion('minor', 10)} 
      >
        <h4>Minor Flood Stage (9 - 10ft)</h4>
        {expanded === 'minor' && (
          <div className="accordion-content">
            <p><strong>9 ft:</strong> Water starts covering Skaters Cabin Road.</p>
            <p><strong>9.5 ft:</strong> Minor yard flooding on View Dr; 0.5 ft of water on Skaters Cabin Road. Campsite 7 floods.</p>
            <p><strong>10 ft:</strong> Mendenhall Campground low areas submerged up to 3 ft. Skaters Cabin Road under 1.5 ft of water. Some sections of West Glacier Trail impassable.</p>
          </div>
        )}
      </div>

      {/* Moderate Flood Stage */}
      <div
        className={`accordion-section moderate-stage ${expanded === 'moderate' ? 'expanded' : ''}`}
        onClick={() => toggleAccordion('moderate', 14)} 
      >
        <h4>Moderate Flood Stage (10 - 14ft)</h4>
        {expanded === 'moderate' && (
          <div className="accordion-content">
            <p><strong>11 ft:</strong> View Dr impassable. Severe bank erosion below Back Loop Bridge. Hazardous river navigation.</p>
            <p><strong>12.5 ft:</strong> Meander Way (river side) under 2-4 ft of water. Flooding at Dredge Lake Trail System. Severe bank erosion.</p>
            <p><strong>13 ft:</strong> View Dr backyards flood (1-4 ft). Meander Way, Stream Ct, and Northland St begin flooding. Storm drain backups on Riverside and Riverwood Dr.</p>
            <p><strong>14 ft:</strong> Northland St, Turn St, Parkview & Center Ct flood. Meander Way under 1-2 ft of water.</p>
          </div>
        )}
      </div>

      {/* Major Flood Stage */}
      <div
        className={`accordion-section major-stage ${expanded === 'major' ? 'expanded' : ''}`}
        onClick={() => toggleAccordion('major', 15)} 
      >
        <h4>Major Flood Stage (14ft+)</h4>
        {expanded === 'major' && (
          <div className="accordion-content">
            <p><strong>14.5 ft:</strong> Meander Way under 2-4 ft of water. Significant flooding on View Dr.</p>
            <p><strong>15 ft:</strong> Killewich Dr covered with up to 2 ft of water. Marion Dr backyards flood. 1.5 ft of water on Rivercourt Way, Lakeview Ct, Center Ct, Parkview Ct, Turn St & Northland St.</p>
            <p><strong>15.5+ ft:</strong> Riverside Dr at Tournure St under 1 ft of water. Severe flooding impacts multiple homes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloodStageMenu;
