import React, { useState, useEffect } from "react";
import "./FloodPred.css";

const FloodPred = ({ onClose }) => {  
  const [nwsFloodForecast, setNwsFloodForecast] = useState("Loading...");
  const [nwsAlertUrl, setNwsAlertUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissible, setIsDismissible] = useState(false); // Controls dismiss ability

  useEffect(() => {
    const fetchFloodData = async () => {
      try {
        const nwsRes = await fetch("https://api.weather.gov/alerts/active?zone=AKZ025", {
          headers: { "User-Agent": "JuneauFloodApp (https://github.com/codefean/juneau-flood-beta)" },
        });
        const nwsData = await nwsRes.json();

        if (nwsData.features.length > 0) {
          const alert = nwsData.features[0].properties;
          const alertTitle = alert.headline || alert.event || "Flood Advisory Issued";
          const alertUrl = alert.web || null; 

          setNwsFloodForecast(alertTitle);
          setNwsAlertUrl(alertUrl);
          setIsDismissible(false); // Do not allow dismissal when there is an alert
        } else {
          setNwsFloodForecast("No active flood alerts.");
          setNwsAlertUrl(null);
          setIsDismissible(true); // Allow dismissal when no alerts
        }
      } catch (error) {
        console.error("Error fetching flood data:", error);
        setNwsFloodForecast("Data unavailable. Check NWS website.");
        setNwsAlertUrl("https://www.weather.gov/ajk/");
        setIsDismissible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFloodData();
    const interval = setInterval(fetchFloodData, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  // Handle click event for dismissing (only if no active alert)
  const handleDismiss = () => {
    if (!isDismissible) return; // Prevent dismissal when active alert is present

    setIsVisible(false); // Start fade-out animation
    setTimeout(() => {
      onClose(); // Remove after animation
    }, 300);
  };

  return (
    <div className="flood-prediction">
      {loading ? (
        <p>Loading forecast...</p>
      ) : (
        <div className={`flood-pred-details ${isVisible ? "visible" : "hidden"}`}>
          <div 
            className={`flood-pred-card alert ${isDismissible ? "clickable" : "non-dismissible"}`} 
            onClick={isDismissible ? handleDismiss : null}
          >
            {/* Close Button (Only if dismissible) */}
            {isDismissible && <button className="close-btn" onClick={handleDismiss}>✖</button>}
            
            <h2>National Weather Service Flood Forecast</h2>
            <p>{nwsFloodForecast}</p>

            {nwsAlertUrl && (
              <a href={nwsAlertUrl} target="_blank" rel="noopener noreferrer">
                <button className="more-info-btn">View Alert</button>
              </a>
            )}

            <div className="more-info-container">
              <a href="https://water.noaa.gov/gauges/mnda2" target="_blank" rel="noopener noreferrer">
                <button className="more-info-btn">NWS Flood Forecast</button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloodPred;
