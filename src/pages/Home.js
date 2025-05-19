import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';
import "./FloodForecast.css";

const cardData = [
  {
    title: 'Flood Maps',
    link: '/flood-map',
    image: '/images/flood-map.jpg',
    description: 'View the glacial flood zone at various lake levels, with or without HESCO barriers',
  },
  {
    title: 'Flood Forecasting',
    link: '/flood-forecast',
    image: '/images/flood-forecast.jpg',
    description: 'Understand flood forecasts based on Suicide Basin & Mendenhall Lake water levels',
  },
  {
    title: 'Flood Events',
    link: '/flood-events',
    image: '/images/flood-events.jpg',
    description: 'Historical data from outburst floods, including peak water level and streamflow',
  },
  {
    title: 'Suicide Basin',
    link: '/suicide-basin',
    image: '/images/suicide-basin.jpg',
    description: 'Learn how Suicide Basin was formed and how it releases outburst floods',
  },
];

const faqData = [
  {
    question: "What is a Glacial lake outburst floods (GLOFs)?",
    answer: "Glacial lake outburst floods (GLOFs) happen when ice-dammed or moraine-dammed lakes release large volumes of water to downstream river systems.",
  },
  {
    question: "Why are GLOFs occurring annually in Suicide Basin?",
    answer: "Mendenhall Glacier acts as a dam that impounds melt water in Suicide Basin. Each summer, water fills the basin until it can lift the glacier and find a drainage channel underneath to flow into Mendenhall Lake. The release of water from Suicide Basin can cause flooding downstream in Mendenhall Lake and Mendenhall River.",
  },
  {
    question: "How does 1 ft of additional water level in Mendenhall Lake increase the level of flood waters downstream in Mendenhall Valley?",
    answer: "Changes in the water level in Mendenhall Lake are not equivalent to the changes in the level of flood waters downstream. Moderate increases in the water level in Mendenhall Lake can dramatically increase the volume of water flowing in Mendenhall River. For example, in the 2023 outburst flood, the water level in Mendenhall Lake peaked at 15 ft, which resulted in a streamflow of 34,200 cubic feet per second (cfs) in Mendenhall River. In 2024, the lake level peaked at 16 ft during the flood, which resulted in a streamflow of 42,700 cfs. Thus, the increase in lake level from 15 ft to 16 ft caused streamflow to increase by 25%. This substantial increase in streamflow is why the 1 ft increase in lake level caused the flood water peak in the valley to increase by multiple feet in 2024.",
  },
  {
    question: "How long does it take the water from Suicide Basin to reach Mendenhall Valley?",
    answer: "Once water starts flowing out of Suicide Basin underneath Mendenhall Glacier, it takes around 40 hours for the flood peak to reach Mendenhall Valley.",
  },
  {
    question: "How will the recession of Mendenhall Glacier affect glacial lake outburst floods from Suicide Basin?",
    answer: "The thinning and retreat of Mendenhall Glacier will decrease the threat of outburst floods from Suicide Basin in coming decades. Suicide Basin will no longer be capable of producing outburst floods once the glacier retreats above the opening of the basin. In the meantime, it is possible that the basin will expand outward into the Mendenhall Glacier, increasing its water holding capacity for a period of years before it eventually decreases and disappears.",
  },
  {
    question: "How long will the GLOFs occur at Mendenhall glacier?",
    answer: "As long as Mendenhall Glacier has enough ice to dam water in Suicide Basin, GLOFs may continue.",
  }
];

const resourceLinks = [
  {
    title: "City & Borough of Juneau",
    url: "https://juneau.org/manager/flood-response",
    icon: "",
    color: "#30964b",
  },
  {
    title: "National Weather Service",
    url: "https://www.weather.gov/safety/flood",
    icon: "",
    color: "#1f77b4",
  },
  {
    title: "State of Alaska",
    url: "https://ready.alaska.gov/Flood",
    icon: "",
    color: "#9467bd",
  },
];

const educationLinks = [
  {
    title: "What is a glacial lake outburst flood?",
    url: "https://www.usgs.gov/programs/climate-adaptation-science-centers/news/increased-understanding-alaskas-glacial-lake#:~:text=Over%20time%2C%20as%20the%20ice,of%20life%20and%20infrastructure%20worldwide.",
    icon: "",
    color: "#1f77b4",
  },
  {
    title: "The Flood Story (2019)",
    url: "https://www.arcgis.com/apps/Cascade/index.html?appid=ad88fd5ccd7848139315f42f49343bb5",
    icon: "",
    color: "#1f77b4",
  },
  {
    title: "2024 Suicide Basin Flood Report",
    url: "https://www.weather.gov/media/ajk/suicideBasin/08_2024%20-%20Mendenhall%20River%20Flooding.pdf",
    icon: "",
    color: "#1f77b4",
  },
];

const Home = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      toggleFAQ(index);
    }
  };


  return (
    <div className="home-container">
      
      <div className="card-grid">
        {cardData.map((card, index) => (
          <NavLink to={card.link} key={index} className="card">
            <img src={card.image} alt={card.title} className="card-image" />
            <div className="card-overlay">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-description">{card.description}</p>
            </div>
          </NavLink>
        ))}
      </div>
  
      <div className="home-intro">
        <div className="home-about-card">
          <h3>About</h3>
          <p>
          This dashboard provides interactive flood inundation maps for the Mendenhall Valley. It also contains information about about glacial lake outburst floods (GLOFs)
          from Suicide Basin. Use the cards above to explore flood maps, flood forecasting, past outburst flood events, and understand how outburst floods originate from
          Suicide Basin and impact the Juneau area. For the National Weather Service Suicide Basin monitoring page click below
          </p>

          <div className="button-wrapper">
            <a
              href="https://www.weather.gov/ajk/suicideBasin"
              target="_blank"
              rel="noopener noreferrer"
              className="home-button"
            >
              NWS Monitoring Page
            </a>
          </div>
        </div>

        {/* Flood Safety Resources */}
        <div className="resources-wrapper">
          <div className="home-about-card">
            <h3>Flood Safety Resources</h3>
            <ul className="resource-list">
              {resourceLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                    style={{ borderLeftColor: link.color }}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Educational Resources */}
          <div className="home-about-card">
            <h3>Educational Resources</h3>
            <ul className="resource-list">
              {educationLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                    style={{ borderLeftColor: link.color }}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="home-about-card">
          <h3>Frequently Asked Questions</h3>
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`faq-row ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggleFAQ(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={0}
              role="button"
              aria-expanded={openIndex === index}
            >
              <div className="faq-question">
                {faq.question}
                <span
                  className={`faq-toggle-icon ${openIndex === index ? 'rotated' : ''}`}
                >
                  {openIndex === index ? '−' : '+'}
                </span>
              </div>
              <div className={`faq-answer ${openIndex === index ? 'show' : ''}`}>
                {faq.answer}
              </div>
              {index !== faqData.length - 1 && <hr className="faq-divider" />}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="home-about-card">
          <h3>Contact Us</h3>
          <p>
            This website is currently in <em>beta testing</em> and is not yet complete.  
            For additional information, please contact: <br />
            <strong> Eran Hood</strong> at ewhood@alaska.edu or
            <strong> Sean Fagan</strong> at sfagan2@alaska.edu
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
