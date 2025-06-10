import React, { useState } from "react";
import CompareImage from "react-compare-image";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import arrow icons
import "./SuicideBasin.css";

const SuicideBasin = () => {
  const beforeImage = "https://basin-images.s3.us-east-2.amazonaws.com/1893_glacier.jpg";
  const afterImage = "https://basin-images.s3.us-east-2.amazonaws.com/2018_glacier.jpg";



// AWS S3 Image URLs for GLOF slider
const images = [
 
  
  {
      src: "https://basin-images.s3.us-east-2.amazonaws.com/GLOF_orgin.png",
      title: "1. Formation of the Glacial Pool",
      description:
        "Suicide Basin accumulates water from glacial melt and precipitation. A natural ice dam, formed by the Mendenhall Glacier, temporarily holds back the water (shown in next slide). During summer, the water level in the basin can increase by more than 6 ft per day. Much of the lake is not visible but is hidden beneath floating icebergs."
    },
    {
      src: "https://basin-images.s3.us-east-2.amazonaws.com/GLOF_icewall.png",
      title: "2. Sudden Water Release: The Outburst Flood",
      description:
        "As the water volume in Suicide Basin increases, buoyant pressure builds on the ice dam, eventually allowing water to escape underneath the glacier in the form of drainage channels. As water flows through these subglacial channels, it creates friction which causes the drainage channels beneath the glacier to melt and grow wider. As a result, the rate at which water is released from the basin increases during drainage events."
    },
    {
      src: "https://www.climate.gov/sites/default/files/2024-08/SuicideBasinOutburst2024.gif",
      title: "3. Suicide Basin's Record Outburst Flood",
      description:
        "This timelapse animation shows the water level in the basin from late April through mid-September, 2024. The largest glacier outburst flood on record at Mendenhall occurred on August 5-7, 2024. More than 15 billion gallons of water were released from Suicide Basin, and the water level in Mendenhall Lake reached a record level of 15.99 ft."
    },
    {
      src: "https://basin-images.s3.us-east-2.amazonaws.com/GLOF_map.png",
      title: "4. Reaching the Valley",
      description:
        "Once meltwater is released from Suicide Basin, it reaches Mendenhall Lake within one to two days. The extent of flooding in Mendenhall Valley is determined by the volume of water stored in the basin and the rate at which it flows under Mendenhall Glacier and into Mendenhall Lake, raising the lake level."
    },

  ];


  
  

  // Track current slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  // Custom Arrow Components
  const NextArrow = ({ onClick }) => (
    <div className="slider-arrow next" onClick={onClick}>
      <FaArrowRight />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="slider-arrow prev" onClick={onClick}>
      <FaArrowLeft />
    </div>
  );

  // Slider settings with custom arrows
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

const timestamp = new Date().getTime(); // for cache busting

const timelapse1Url = `https://usgs-nims-images.s3.amazonaws.com/overlay/AK_Glacial_Lake_2_and_half_miles_North_of_Nugget_Creek_near_Auke_Bay/AK_Glacial_Lake_2_and_half_miles_North_of_Nugget_Creek_near_Auke_Bay___2024-11-23T17-05-08Z.jpg?cb=${timestamp}`;

const timelapse2Url = `https://usgs-nims-images.s3.amazonaws.com/overlay/AK_Glacial_Lake_near_Nugget_LOOKING_UPSTREAM_GLACIER_VIEW/AK_Glacial_Lake_near_Nugget_LOOKING_UPSTREAM_GLACIER_VIEW___2025-06-09T17-05-22Z.jpg?cb=${timestamp}`;

  return (
    
    <div className="suicide-basin-container">
      {/* Title Section */}
      <div className="suicide-basin">
        <h2>Explore Suicide Basin</h2>
      </div>
      <p className="suicide-basin-subheading">
        Understand The Glacial Lake Outburst Floods Origin
      </p>
      

      {/* Image Comparison Section */}
      <div className="image-comparison-container">
        <CompareImage leftImage={beforeImage} rightImage={afterImage}
        handle={
          <div style={{
            backgroundColor: "#1E90FF",  // Handle fill color
            border: "3px solid white",   // Contrast outline
            borderRadius: "50%",         // Make it round
            width: "18px",               // Width of the handle
            height: "18px",              // Height of the handle
          }} />
        } />
      </div>
      <p className="basin-image-caption">
        Slide to see the Mendenhall Glacier and Suicide Basin from 1893 - 2018
      </p>
      {/* Suicide Basin Info Card */}
<div className="suicide-basin-info-card">
  <h3 className="suicide-basin-info-title">What is Suicide Basin?</h3>
  <p>
  Suicide Basin is an over-deepened bedrock basin located approximately 3km up the Mendenhall Glacier in Juneau, Alaska. It was formed by the retreat of the Suicide Glacier,
  which left an open space alongside the Mendenhall Glacier (above). Suicide Basin plays a crucial role in the formation of recurring glacial lake outburst floods (GLOFs) because
  Mendenhall Glacier acts as a dam that allows meltwater to accumulate in the basin. When water stored in the basin escapes beneath the ice dam, billions of gallons of water can
  be released into Mendenhall Lake, leading to flooding downstream.
    <br /><br />
    The storage capacity of Suicide Basin varies annually due to ongoing changes in Mendenhall Glacier, such as ice calving and melting. Scientists monitor these changes using
    drones, satellite imagery, and elevation models, but the exact mechanisms that control the rate of water release from Suicide Basin to Mendenhall Lake remain uncertain. Understanding
    these processes is essential for predicting and mitigating flood impacts in the surrounding communities.
  </p>
</div>


      {/* GLOF Image Slider Section */}
      <h2 className="glof-h2">Glacial Lake Outburst Flood Process</h2>
      <p className="suicide-basin-subheading">How Suicide Basin Floods The Mendenhall Valley</p>
      <div className="glof-content">
        <div className="glof-slider">
          <Slider {...settings}>
            {images.map((image, index) => (
              <div key={index} className="glof-slide">
                <img src={image.src} alt={image.title} className="glof-image" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="glof-info-card">
          <h3>{images[currentSlide].title}</h3>
          <p>{images[currentSlide].description}</p>
        </div>


<div className="text-center mt-10">
  <h2 className="glof-h2">Live View: Suicide Basin & Mendenhall Glacier</h2>
  <p className="suicide-basin-subheading">
    Real-time USGS Images <span> - Updates from Spring to Fall</span>
  </p>
</div>

        <div className="live-view-container">
        <div className="live-image">
          <img src={timelapse1Url} alt="Live view of glacial lake near Nugget Creek" />
          <a href="https://waterdata.usgs.gov/monitoring-location/1505248590/#dataTypeId=continuous-00020-0&period=P7D&showMedian=true" target="_blank" rel="noopener noreferrer">
          <h3>Suicide Basin</h3>
          </a>
        </div>

        <div className="live-image">
          <img src={timelapse2Url} alt="Live upstream view of Mendenhall Glacier" />
          <a href="https://waterdata.usgs.gov/monitoring-location/1505248590/#dataTypeId=continuous-00020-0&period=P7D&showMedian=true" target="_blank" rel="noopener noreferrer">
          <h3>Mendenhall Glacier from Suicide Basin</h3>
          </a>

          

        </div>

        
        </div>

      </div>



    </div>
  );
};

export default SuicideBasin;
