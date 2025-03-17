import React, { useState } from "react";
import CompareImage from "react-compare-image";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import arrow icons
import "./SuicideBasin.css";

const SuicideBasin = () => {
  const beforeImage = "https://basin-images.s3.us-east-2.amazonaws.com/1893_glacier.png";
  const afterImage = "https://basin-images.s3.us-east-2.amazonaws.com/2018_glacier.png";

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
        "As the water volume in Suicide Basin increases, buoyant pressure builds on the ice dam, eventually allowing water to escape underneath the glacier. As water flows beneath the Mendenhall Glacier, it creates friction which causes the drainage channels beneath the glacier to melt and grow wider. As a result, the rate at which water is released from the basin increases during drainage events."
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

  // Live View Image URLs
  const timelapse1Url =
    "https://usgs-nims-images.s3.amazonaws.com/720/AK_Glacial_Lake_2_and_half_miles_North_of_Nugget_Creek_near_Auke_Bay/AK_Glacial_Lake_2_and_half_miles_North_of_Nugget_Creek_near_Auke_Bay___2024-11-08T17-05-23Z.jpg";
  const timelapse2Url =
    "https://usgs-nims-images.s3.amazonaws.com/720/AK_Glacial_Lake_near_Nugget_LOOKING_UPSTREAM_GLACIER_VIEW/AK_Glacial_Lake_near_Nugget_LOOKING_UPSTREAM_GLACIER_VIEW___2024-11-07T17-05-03Z.jpg";


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
        <CompareImage leftImage={beforeImage} rightImage={afterImage} />
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
      </div>



    </div>
  );
};

export default SuicideBasin;
