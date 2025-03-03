import React, { useState, useEffect } from "react";
import "./FloodForecast.css";
import FloodPred from "./FloodPred";
import Tooltip from "./Tooltip";
import FloodStageMenu from "./StageInfo"; 

const FloodPrediction = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [hydroGraphUrl, setHydroGraphUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeInfo, setActiveInfo] = useState(null);
  const [showFloodPred, setShowFloodPred] = useState(true);

  useEffect(() => {
    const updateImages = () => {
      setImageUrl(
        `https://www.weather.gov/images/ajk/suicideBasin/current.jpg?timestamp=${Date.now()}`
      );
      setHydroGraphUrl(
        `https://water.noaa.gov/resources/hydrographs/mnda2_hg.png?timestamp=${Date.now()}`
      );
      setLoading(false);
    };

    updateImages();
    const interval = setInterval(updateImages, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkerClick = (marker, event, imageId) => {
    const wrapperRect = event.target.closest(".image-wrapper").getBoundingClientRect();
    const markerRect = event.target.getBoundingClientRect();

    if (activeInfo && activeInfo.imageId === imageId && activeInfo.text === marker.text) {
      setActiveInfo(null);
    } else {
      setActiveInfo({
        imageId,
        text: marker.text,
        top: markerRect.top - wrapperRect.top + markerRect.height + 5,
        left: markerRect.left - wrapperRect.left + markerRect.width / 2,
      });
    }
  };

  const closeInfoBox = (e) => {
    if (!e.target.closest(".info-box") && !e.target.closest(".info-marker")) {
      setActiveInfo(null);
    }
  };

  const markers = {
    suicideBasin: [
      { top: "76.5%", left: "82.5%", text: "This website pulls the most recent image of Suicide Basin." },
      { top: "55%", left: "19.5%", text: "Current glacial lake water levels" },
      { top: "70%", left: "48.5%", text: "Movement of floating ice can impact water level measurements on the hydrograph." },
    ],
    mendenhallLake: [
      { top: "19%", left: "52%", text: "Last recorded water level at Mendenhall Lake" },
      { top: "22%", left: "48.5%", text: "Current flood stage if the GLOF occurred. 9ft is the lowest flood stage. For all flood stages click here." },
      { top: "70%", left: "90%", text: "Today's observation." },
    ],
  };

  return (
    <div className="flood-tracker" onClick={closeInfoBox}>
    {/* Flood Prediction Component Moved to the Top */}
    {showFloodPred && <FloodPred onClose={() => setShowFloodPred(false)} />}

    {/* Title & Subheading */}
    <h1 className="flood-forecasting-title">Explore Flood Forecasting</h1>
    <h3 className="flood-forecasting-subheading">How to Understand Water Level Data</h3>

      {/* Image Section */}
      <div className="flood-content">
        <div className="image-pair-container">
          
          {/* Suicide Basin Image */}
          <div className="image-container suicide-basin-container">
            {loading ? (
              <p>Loading image...</p>
            ) : (
              <div className="image-wrapper suicide-basin-wrapper">
                <img
                  src={imageUrl}
                  alt="Live view of Suicide Basin glacial pool"
                  className="flood-image suicide-basin-image"
                  onError={(e) => (e.target.src = "/fallback-image.jpg")}
                />
                <p className="image-caption">Latest Image of Suicide Basin</p>

                <Tooltip
                  markers={markers.suicideBasin}
                  handleMarkerClick={handleMarkerClick}
                  activeInfo={activeInfo}
                  imageId="suicideBasin"
                />
              </div>
            )}
          </div>

          {/* NOAA Hydrograph Image */}
          <div className="image-container additional-image-container">
            <div className="image-wrapper additional-image-wrapper">
              <img
                src="https://water.noaa.gov/resources/hydrographs/jsba2_hg.png"
                alt="NOAA Hydrograph"
                className="flood-image additional-image"
                onError={(e) => (e.target.src = "/fallback-image.jpg")}
              />
              <p className="image-caption">Latest Water Elevation Chart for Suicide Basin Glacial Lake</p>
            </div>
          </div>

        </div>
      </div>

      {/* Forecasting Details */}
      <div className="detail-card black-text">
        <h2>Forecasting Glacial Lake Outburst Floods</h2>
        <p>
          Suicide Basin is a glacial-dammed lake that annually drains, causing flooding in the Mendenhall Valley.
          Monitoring the basin helps predict potential floods to mitigate risks to the surrounding community.
        </p>

        <ul>
          <li><strong>Flood Potential:</strong> The volume of lake water and the rate of release during a GLOF determine the severity of flooding.</li>
          <li><strong>Changing Elevation:</strong> As the basin expands, peak water elevation levels vary yearly.</li>
          <li><strong>Time to Prepare:</strong> Floodwaters take 1-2 days to reach Mendenhall Lake once drainage begins.</li>
          <li><strong>Flood Season:</strong> From Summer to early Fall.</li>
          <strong>(NOT FINISHED)</strong>
        </ul>

        <button className="more-data-button" onClick={() => window.open('https://www.weather.gov/ajk/suicideBasin')}>
          More Info
        </button>
      </div>

      {/* Mendenhall Lake Level Section */}
      <div className="lake-level-content">
        
        {/* Mendenhall Lake Image */}
        <div className="flood-stage-menu-wrapper">
          {loading ? (
            <p>Loading graph...</p>
          ) : (
            <div className="image-wrapper" onClick={(e) => e.stopPropagation()}>
              <img
                src={hydroGraphUrl}
                alt="Mendenhall Lake water level hydrograph"
                className="mendenhall-lake-image"
                onError={(e) => (e.target.src = "/fallback-graph.jpg")}
              />
              <p className="image-caption">Latest NOAA Hydrograph for Mendenhall Lake</p>
              <Tooltip
                markers={markers.mendenhallLake}
                handleMarkerClick={handleMarkerClick}
                activeInfo={activeInfo}
                imageId="mendenhallLake"
              />
            </div>
          )}
        </div>

        {/* Flood Stage Menu */}
        <div className="flood-stage-menu-wrapper">
          <FloodStageMenu />
          <p className="image-caption">Flood Stage Levels Correspond to Mendenhall Lake Water Levels</p>
        </div>

      </div>

      {/* Additional Information */}
      <div className="detail-card black-text">
        <h2>About Flooding from Mendenhall Lake</h2>
        <p>Mendenhall Lake is a glacially-fed lake at the terminus of Mendenhall Glacier... (NOT FINISHED)</p>
        <button className="more-data-button" onClick={() => window.open('https://waterdata.usgs.gov/monitoring-location/15052500/')}>
          More Info
        </button>
      </div>

    </div>
  );
};

export default FloodPrediction;
