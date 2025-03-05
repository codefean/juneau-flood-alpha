import React, { useState, useEffect } from "react";
import "./FloodForecast.css";
import FloodPred from "./FloodPred";
import Tooltip from "./Tooltip";
import FloodStageBar from "./FloodStageBar";

const FloodPrediction = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [hydroGraphUrl, setHydroGraphUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [waterLevel, setWaterLevel] = useState(null);
  const [error, setError] = useState(null);
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

    // Fetch real-time Mendenhall Lake water levels from USGS
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
        console.error("Error fetching water level:", error);
        setError(error.message);
      }
    };
  
    useEffect(() => {
      fetchWaterLevels();
      const interval = setInterval(fetchWaterLevels, 60000); // Update every 60 seconds
      return () => clearInterval(interval);
    }, []);
  
    // Function to determine flood stage text based on water level
    const getFloodStage = (level) => {
      if (level === null) return "Loading...";
      if (level < 8) return `Current Flood Stage: No Flood Risk at ${level.toFixed(1)}ft of water`;
      if (level >= 8 && level < 9) return `Current Flood Stage: Action Stage at ${level.toFixed(1)}ft of water`;
      if (level >= 9 && level < 11) return `Current Flood Stage: Minor Flood Stage at ${level.toFixed(1)}ft of water`;
      if (level >= 11 && level < 14) return `Current Flood Stage: Moderate Flood Stage at ${level.toFixed(1)}ft of water`;
      if (level >= 14) return `Current Flood Stage: Major Flood Stage at ${level.toFixed(1)} ft`;
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
  <strong>Mendenhall Lake Monitoring:</strong> Water levels in Mendenhall Lake are continuously measured by the USGS at a point along the west shore of Mendenhall Lake. This real-time data helps assess flood potential by estimating the expected lake level if an outburst flood from Suicide Basin were to occur.
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
  Water level in Mendenhall Lake is measured continuously (every 15 minutes) by the US Geological Survey. 
  The NWS uses forecasts or precipitation, glacier melt, and water release from Suicide Basin to forecast 
  the water level in Mendenhall Lake for 5 days from present (graph, above left). When the water level is forecasted to exceed the flood stage, a 
  flood watch or warning is issued.
  </p>
  <p>
    During outburst floods, lake levels can rise rapidly, posing a significant flood risk. For example, in August 2024, 
    the water level surged by over 10ft in just two days. Such extreme fluctuations highlight the importance of continuous monitoring 
    and early warnings.
  </p>
  <p>When the Mendenhall Lake water level exceeds 9 ft, flooding can occur in Mendenhall Valley. Flood stages for Mendenhall Lake range from minor
     (9-10 ft) to major (14+ ft) and are color coded to highlight known impacts documented by the National Weather Service (above, right).</p>
  <button className="more-data-button" onClick={() => window.open("https://waterdata.usgs.gov/monitoring-location/15052500/")}>
    More Info
  </button>
</div>
        </div>
      </div>
      
      <div className="flood-stage-container">
  
 {/* Dynamic Flood Stage Display */}
 <div className="flood-stage-container">
            <FloodStageBar />
            <h2 className="current-flood-stage-title">
  <strong>Current Flood Stage:</strong> <span className="flood-stage-text">
    {error ? `Error: ${error}` : getFloodStage(waterLevel).replace("Current Flood Stage: ", "")}
  </span>
</h2>


          </div>
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
    <li><strong>Action Stage (8 - 9ft):</strong> Water levels are elevated but remain below the minor flood threshold. This stage serves as an early warning to monitor conditions closely.</li>
    <li><strong>Minor Flooding (9ft - 10ft):</strong> Low-lying areas may experience some water coverage, causing minor road flooding or inconvenience. Typically, property damage is minimal.</li>
    <li><strong>Moderate Flooding (10ft - 14ft):</strong> Water begins inundating structures and roads near the river. Some evacuations might be necessary, and transportation disruptions are likely.</li>
    <li><strong>Major Flooding (14ft+):</strong> Extensive flooding with a significant risk to homes, businesses, and infrastructure. Evacuations are often required, and severe damage may occur.</li>
  </ul>

  <p>
    Monitoring flood stages allows for proactive flood management, enabling timely warnings and preparedness measures to protect lives and property.
  </p>

  <button className="more-data-button" onClick={() => window.open('https://water.noaa.gov/gauges/MNDA2')}>
    More Info
  </button>
</div>

    </div> 
  );
};

export default FloodPrediction;
