import React, { useEffect, useState } from "react";
import "./EvacuationPopup.css";

const EvacuationPopup = ({ level = 17, autoClose = false, autoCloseDelay = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => setVisible(false), autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, visible]);

  if (!visible) return null;

  return (
    <div className="flood-popup-overlay" role="dialog" aria-modal="true" aria-labelledby="flood-popup-title">
      <div className="flood-popup-box">
        <h2 id="flood-popup-title">Current Flood Evacuation Zone</h2>
        <p></p>
        <p className="reduce-top-margin">
          Prepare to evacuate if you are within the 17ft lake stage (Without HESCOs)
        </p>
        <p className="reduce-top-margin">
          - City & Borough of Juneau
        </p>
        <button className="popup-close-button" onClick={() => setVisible(false)}>
          OK
        </button>
      </div>
    </div>
  );
};

export default EvacuationPopup;
