import React, { useEffect, useRef, useState } from "react";
import "./EventPopup.css";

const EventPopup = () => {
  const [visible, setVisible] = useState(true);
  const boxRef = useRef(null);

  // Close when clicking outside the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="flood-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flood-popup-title"
    >
      <div className="flood-popup-box" ref={boxRef}>
        <h2 id="flood-popup-title">Dashboard Feedback & Events</h2>

        <p className="evacuation-text">
          We’re seeking your feedback to help improve the Juneau Flood Dashboard. 
          Join one of the upcoming events or share your ideas through the online form.
        </p>

        <div className="button-wrapper">
          <a
            href="https://www.juneauflood.com/#/feedback"
            target="_blank"
            rel="noopener noreferrer"
            className="home-button"
          >
            See More Info
          </a>
        </div>

        <button
          className="popup-close-x"
          onClick={() => setVisible(false)}
          aria-label="Close popup"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default EventPopup;
