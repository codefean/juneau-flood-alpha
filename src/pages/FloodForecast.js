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
      { top: "19%", left: "51%", text: "Last recorded water level at Mendenhall Lake" },
      { top: "22%", left: "49%", text: "Current flood stage if the GLOF occurred. 9ft is the lowest flood stage. For all flood stages click here." },
      { top: "70%", left: "88%", text: "Today's observation." },
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
      if (level < 8) return `No Flood Risk at ${level.toFixed(1)}ft of water`;
      if (level >= 8 && level < 9) return `Action Stage at ${level.toFixed(1)}ft of water`;
      if (level >= 9 && level < 11) return `Minor Flood Stage at ${level.toFixed(1)}ft of water`;
      if (level >= 11 && level < 14) return `Moderate Flood Stage at ${level.toFixed(1)}ft of water`;
      if (level >= 14) return `Major Flood Stage at ${level.toFixed(1)} ft`;
    };
  

  return (
    <div className="flood-tracker" onClick={closeInfoBox}>
      {/* Flood Prediction Component Moved to the Top */}
      {showFloodPred && <FloodPred onClose={() => setShowFloodPred(false)} />}

      {/* Title & Subheading */}
      <h1 className="flood-forecasting-title">Explore Flood Forecasting</h1>
      <h3 className="flood-forecasting-subheading">Understanding Water Levels in Suicide Basin & Mendenhall Lake</h3>


{/* Suicide Basin Section */}
<div className="about-forecast-card">
<p>
    This page provides real-time monitoring information. The USGS monitors <strong>Suicide Basin</strong> using time-lapse cameras and laser range finders to track water levels — though readings may vary due to floating icebergs. <strong>Mendenhall Lake</strong> levels are also tracked along the west shore to evaluate rising water levels and potential downstream flood impacts following an outburst from Suicide Basin.
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
                <p className="image-caption">Latest USGS Image of Suicide Basin (Online Spring - Fall)</p>

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
              <p className="image-caption">Latest Water Elevation Chart for Suicide Basin Glacial Lake (Online Spring - Fall)</p>
            </div>
          </div>
        </div>
      </div>

       {/* Forecasting GLOFs Section */}
{/* Forecasting GLOFs Section */}
<div className="detail-card black-text">
  <h2>Forecasting Glacial Lake Outburst Floods (GLOFs)</h2>
  <p>
    Suicide Basin is a glacier-dammed lake that can suddenly release large volumes of water, triggering outburst floods that impact the Mendenhall Valley. Forecasting these floods requires constant monitoring of water levels and understanding changes in the basin’s structure over time. The USGS tracks Suicide Basin using time-lapse cameras with elevation scale bars and precise laser range finders. However, floating icebergs can skew readings by altering the visible water surface. Monitoring is active from spring through fall.
  </p>


  <ul>
    <li>
      <strong>Flood Potential:</strong> The volume of water and the release rate from Suicide Basin determine flooding severity. Researchers use drone-based surveys to create three-dimensional terrain models and estimate total water volume.
    </li>
    <li>
      <strong>Changing Water Elevations:</strong> The basin’s capacity evolves over time due to glacier thinning, iceberg calving, and internal ice melt—affecting how much water it can store before an outburst.
    </li>
    <li>
      <strong>Time to Prepare:</strong> Once drainage begins, floodwaters typically reach Mendenhall Lake within 1–2 days, offering a brief window for preparation.
    </li>
    <li>
      <strong>Flood Season:</strong> Outburst floods most commonly occur between June and October, with peak events typically in July and August.
    </li>
  </ul>

  <button
    className="more-data-button"
    onClick={() => window.open("https://www.weather.gov/ajk/suicideBasin")}
  >
    More Info
  </button>
</div>


      {/* Mendenhall Lake Level Section */}
      
      <div className="lake-level-content">
      <h2 className="section-title-lake">Mendenhall Lake Level</h2>
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
                  alt="Mendenhall lake water level hydrograph"
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
  <h2 style={{ textAlign: 'left' }}>Mendenhall Lake Level & Flood Conditions</h2>
  <p>
  Mendenhall Lake is a glacially-fed lake at the terminus of Mendenhall Glacier. Water levels fluctuate due to seasonal melting, precipitation, and outburst floods. The <a href="https://waterdata.usgs.gov/monitoring-location/15052500/#dataTypeId=continuous-00065--1654777834&period=P7D&showMedian=false" target="_blank" rel="noopener noreferrer">
        USGS monitors water levels
      </a> along the lake’s west shore to track these changes in real time.
  </p>
  <p>
  The water level in Mendenhall Lake is measured every 15 minutes by a sensor in the lake. The NWS uses forecasts of rainfall,
  glacier melt, and water release from Suicide Basin to forecast water levels
  in Mendenhall Lake (graph, left). During outburst floods, lake levels can rise rapidly, posing a significant flood risk.
  For example, in August 2024, the water level in Mendenhall Lake surged by over 10 ft in just two days. Such extreme fluctuations
  highlight the importance of continuous monitoring and early warnings.
  </p>
  <p>
  When the water level in Mendenhall Lake is forecasted to exceed the flood stage, a flood watch or warning is issued. When the water
  level exceeds 8 ft, flooding can occur in Mendenhall Valley. Flood stages for Mendenhall Lake range from minor (9-10 ft) to major (14+ ft)
  and are color coded to highlight known impacts documented by the NWS (below).
  </p>

</div>
        </div>
      </div>
      
      <div className="flood-stage-container">
  
 {/* Dynamic Flood Stage Display */}
 <div className="flood-stage-container">
            <FloodStageBar />
            <h2 className="current-flood-stage-title">
  Current Flood Stage:{" "}
  <span className="flood-stage-text">
    {error ? `Error: ${error}` : getFloodStage(waterLevel)}
  </span>
</h2>

  </div>
  </div>


      
<div className="detail-card black-text">
  <h2>Understanding Flood Stages</h2>
  <p>
    Flood stages indicate the severity of flooding based on lake water levels. These stages help 
    communities, emergency responders, and individuals assess potential risks and take necessary precautions. 
    The National Weather Service defines four primary flood categories: Action Stage, Minor, Moderate, and Major Flooding. The current flood stage and water level is shown above.
  </p>

  <div>
    <strong>Action Stage (8 - 9ft):</strong> Water levels have reached flood potential. Residents should begin to take mitigation actions for flooding events based on their location.
    <ul>
      <li><strong>8 ft:</strong> No visible flooding.</li>
    </ul>
  </div>

  <div>
    <strong>Minor Flooding (9 - 10ft):</strong> Low-lying areas may experience some water coverage, causing minor road flooding or inconvenience. Typically, property damage is minimal.
    <ul>
      <li><strong>9 ft:</strong> Water starts covering Skaters Cabin Road.</li>
      <li><strong>9.5 ft:</strong> Minor yard flooding on View Dr; 0.5 ft of water on Skaters Cabin Road. Campsite 7 floods.</li>
      <li><strong>10 ft:</strong> Mendenhall Campground low areas submerged up to 3 ft. Skaters Cabin Road under 1.5 ft of water. Some sections of West Glacier Trail impassable.</li>
    </ul>
  </div>

  <div>
    <strong>Moderate Flooding (10 - 14ft):</strong> Water begins inundating structures and roads near the river. Some evacuations might be necessary, and transportation disruptions are likely.
    <ul>
      <li><strong>11 ft:</strong> View Dr impassable. Severe bank erosion below Back Loop Bridge. Hazardous river navigation.</li>
      <li><strong>12.5 ft:</strong> Meander Way (river side) under 2–4 ft of water. Flooding at Dredge Lake Trail System. Severe bank erosion.</li>
      <li><strong>13 ft:</strong> View Dr backyards flood (1–4 ft). Meander Way, Stream Ct, and Northland St begin flooding. Storm drain backups on Riverside and Riverwood Dr.</li>
      <li><strong>14 ft:</strong> Northland St, Turn St, Parkview & Center Ct flood. Meander Way under 1–2 ft of water.</li>
    </ul>
  </div>

  <div>
    <strong>Major Flooding (14ft+):</strong> Extensive flooding with a significant risk to homes, businesses, and infrastructure. Evacuations are often required, and severe damage may occur.
    <ul>
      <li><strong>14.5 ft:</strong> Meander Way under 2–4 ft of water. Significant flooding on View Dr.</li>
      <li><strong>15 ft:</strong> Killewich Dr covered with up to 2 ft of water. Marion Dr backyards flood. 1.5 ft of water on Rivercourt Way, Lakeview Ct, Center Ct, Parkview Ct, Turn St & Northland St.</li>
      <li><strong>15.5+ ft:</strong> Riverside Dr at Tournure St under 1 ft of water. Severe flooding impacts multiple homes.</li>
    </ul>
  </div>
</div>



  <button className="more-data-button" onClick={() => window.open('https://water.noaa.gov/gauges/MNDA2')}>
    More Info
  </button>
</div>


  );
};

export default FloodPrediction;
