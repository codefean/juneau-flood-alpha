import React, { useState, useEffect } from "react";
import "./FloodForecast.css";
import FloodPred from "./FloodPred";
import Tooltip from "./Tooltip";
import FloodStageBar from './FloodStageBar';

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
      <h3 className="flood-forecasting-subheading">Understanding Water Levels in Suicide Basin & Mendenhall Lake</h3>

      {/* Suicide Basin Section */}
      <div className="detail-card black-text large-text">
      <p>
  <strong>Suicide Basin Monitoring:</strong> The US Geological Survey (USGS) utilizes time-lapse cameras to capture daily images, with an elevation scale bar to track water levels visually. Additionally, a laser range finder provides an independent and precise measurement of water elevation. However, floating icebergs can cause sudden fluctuations in readings, either raising or lowering recorded levels due to their varying heights.  
  <br /><br />
  <strong>Mendenhall Lake Monitoring:</strong> Water levels in Mendenhall Lake are continuously measured by the USGS using streamflow data (cubic feet per second, CFS), which is then converted to elevation in feet (ft). This real-time data helps assess flood potential by estimating the expected lake level if an outburst flood from Suicide Basin were to occur.
</p>

      </div>

      {/* Image Section */}
      
      <div className="flood-content">
      <h2 className="section-title">Suicide Basin Water Level</h2>
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
                style={{ width: "92%", maxWidth: "900px", height: "auto" }}
                onError={(e) => (e.target.src = "/fallback-image.jpg")}
              />
              <p className="image-caption">Latest Water Elevation Chart for Suicide Basin Glacial Lake</p>
            </div>
          </div>
        </div>
      </div>

       {/* Forecasting GLOFs Section */}
       <div className="detail-card black-text">
        <h2>Forecasting Glacial Lake Outburst Floods (GLOFs)</h2>
        <p>
          Suicide Basin is a glacier-dammed lake that has released floods, impacting Mendenhall Valley. 
          Monitoring water levels helps predict flood timing and peak magnitude, allowing mitigation efforts.
        </p>

        <ul>
          <li>
            <strong>Flood Potential:</strong> The volume of water and the release rate determine flooding severity.
            3D terrain models from aerial drone surveys help estimate water volume.
          </li>
          <li>
            <strong>Changing Water Elevations:</strong> The basin’s holding capacity changes as the Mendenhall Glacier
            thins and expands outward due to iceberg calving.
          </li>
          <li>
            <strong>Time to Prepare:</strong> Once drainage begins, floodwaters reach Mendenhall Lake in 1-2 days.
          </li>
          <li>
            <strong>Flood Season:</strong> Outburst floods have occurred from June to October, peaking in July-August.
          </li>
        </ul>

        <button className="more-data-button" onClick={() => window.open("https://www.weather.gov/ajk/suicideBasin")}>
          More Info
        </button>
      </div>

      {/* Mendenhall Lake Level Section */}
      
      <div className="lake-level-content">
      <h2 className="section-title">Mendenhall Lake Water Level & Flood Stage</h2>
        {/* Flex container for Hydrograph & Text */}
        <div className="lake-level-wrapper">
          
          {/* NOAA Hydrograph */}
          <div className="image-wrapper">
            {loading ? (
              <p>Loading graph...</p>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="detail-card black-text flooding-info">
  <h2>Mendenhall Lake Level and Flood Conditions</h2>
  <p>
    Mendenhall Lake is a glacially-fed lake at the terminus of Mendenhall Glacier. Water levels fluctuate due to seasonal 
    melting, precipitation, and outburst floods. The USGS continuously monitors water levels along the lake’s west shore 
    to track these changes in real time.
  </p>
  <p>
    Water levels in Mendenhall Lake are measured using streamflow data (cubic feet per second, CFS), which is then converted 
    to elevation in feet (ft). This real-time data helps assess flood potential by estimating the expected lake level if an 
    outburst flood from Suicide Basin were to occur.
  </p>
  <p>
    During outburst floods, lake levels can rise rapidly, posing a significant flood risk. For example, in August 2024, 
    the water level surged by over 10 feet in just two days. Such extreme fluctuations highlight the importance of continuous monitoring 
    and early warnings.
  </p>
  <br /><br />
  <button className="more-data-button" onClick={() => window.open("https://waterdata.usgs.gov/monitoring-location/15052500/")}>
    More Info
  </button>
</div>
        </div>
      </div>
      
      <div className="flood-stage-container">
  
      <FloodStageBar />
<h2 className="current-flood-stage-title">Current Flood Stage</h2>
</div>



      
{/* New Info Card: Understanding Flood Stages */}
<div className="detail-card black-text">
  <h2>Understanding Flood Stages</h2>
  <p>
    Flood stages indicate the severity of flooding based on lake or river levels. These stages help 
    communities, emergency responders, and individuals assess potential risks and take necessary precautions. 
    The National Weather Service defines four primary flood categories: Action Stage, Minor, Moderate, and Major Flooding. The current flood stage and water level is shown above.
  </p>

  <ul>
    <li><strong>Action Stage (less than 9 ft):</strong> Water levels are elevated but remain below the minor flood threshold. This stage serves as an early warning to monitor conditions closely.</li>
    <li><strong>Minor Flooding (9ft - 10ft):</strong> Low-lying areas may experience some water coverage, causing minor road flooding or inconvenience. Typically, property damage is minimal.</li>
    <li><strong>Moderate Flooding (10ft - 14ft):</strong> Water begins inundating structures and roads near the river. Some evacuations might be necessary, and transportation disruptions are likely.</li>
    <li><strong>Major Flooding (14ft+):</strong> Extensive flooding with a significant risk to homes, businesses, and infrastructure. Evacuations are often required, and severe damage may occur.</li>
  </ul>

  <p>
    Monitoring flood stages allows for proactive flood management, enabling timely warnings and preparedness measures to protect lives and property.
  </p>

  <button className="more-data-button" onClick={() => window.open('https://water.weather.gov/ahps/')}>
    More Info
  </button>
</div>

    </div> 
  );
};

export default FloodPrediction;
