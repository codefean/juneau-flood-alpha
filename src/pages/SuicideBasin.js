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
    src: "https://basin-images.s3.us-east-2.amazonaws.com/GLOF_map.png",
    title: "Reaching the Valley",
    description:
      "Once the water is released from Suicide Basin, it reaches Mendenhall Lake within one to two days. Depending on the rate of release and water levels in Suicide Basin, the floodwaters can extend beyond Mendenhall Lake and River, causing severe impacts to surrounding infrastructure."
  },
  
  {
      src: "https://basin-images.s3.us-east-2.amazonaws.com/GLOF_orgin.png",
      title: "Formation of the Glacial Pool",
      description:
        "Suicide Basin, a subglacial basin, accumulates water from glacial melt and precipitation. A natural ice dam, formed by the Mendenhall Glacier, temporarily holds back the water (shown in next slide). As the water volume increases, pressure builds on the ice dam, making it susceptible to failure."
    },
    {
      src: "https://basin-images.s3.us-east-2.amazonaws.com/GLOF_icewall.png",
      title: "Sudden Water Release: The Outburst Flood",
      description:
        "Eventually the ice dam weakens and the stored water is suddenly released of the glacial lake towards Mendenhall Lake. Factors contributing to this release include ice in the lake melting, increased hydrostatic pressure, and basal lubrication, which destabilize the ice dam. The flood follows a predictable hydrograph pattern, peaking before water levels recede."
    },
    {
      src: "https://www.weather.gov/images/ajk/suicideBasin/archive/2023/SuicideBasinLoop_Raw_2023_Compressed.gif",
      title: "Suicide Basin's Record Outburst Flood",
      description:
        "This timelapse shows the basin filling and then releasing in 2023, highlighting changes in water levels over time due to ice melt and precipitation. This release event caused Mendenhall Lake to reach approximately 14.97ft of water, resulting in extensive damage. The factors controlling the speed of water release from the basin are currently unknown."
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
    Suicide Basin is a subglacial basin located alongside the Mendenhall Glacier in Juneau, Alaska. 
    It plays a crucial role in the formation of recurring Glacial Lake Outburst Floods (GLOFs), where meltwater accumulates behind a temporary ice dam. When the ice dam weakens or fails, millions of cubic meters of water are released, leading to flooding downstream.
    <br /><br />
    The storage capacity of Suicide Basin varies annually due to ongoing glacier dynamics, such as ice calving and melting. Scientists monitor these changes using drones, satellite imagery, and elevation models, but the exact mechanisms that control the rate of water release from Suicide Basin to Mendenhall Lake remain uncertain. Understanding these processes is essential for predicting and mitigating flood impacts in the surrounding communities.
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
