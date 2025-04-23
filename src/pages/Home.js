import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';
import "./FloodForecast.css";

const cardData = [
  {
    title: 'Flood Map',
    link: '/flood-map',
    image: '/images/flood-map.jpg',
    description: 'View the glacial flood zone at various lake levels, with or without HESCO barriers.',
  },
  {
    title: 'Flood Forecasting',
    link: '/flood-forecast',
    image: '/images/flood-forecast.jpg',
    description: 'How to understand flood forecasts based on gage heights & image data.',
  },
  {
    title: 'Flood Events',
    link: '/flood-events',
    image: '/images/flood-events.jpg',
    description: 'Historical flood event data including impact reports & peak discharge statistics.',
  },
  {
    title: 'Suicide Basin',
    link: '/suicide-basin',
    image: '/images/suicide-basin.jpg',
    description: 'How Suicide Basin works & context for recent lake outburst events.',
  },
];

const faqData = [
  {
    question: "What is a GLOF?",
    answer: "Glacial lake outburst floods (GLOFs) happen when ice-dammed or moraine-dammed lakes suddenly release large volumes of water, often due to the failure of an ice dam...",
  },
  {
    question: "Why are GLOFs occurring annually in Suicide Basin?",
    answer: "Common causes include ice or rock avalanches into the lake, rapid snowmelt, heavy rainfall, or internal weakening of the dam structure...",
  },
  {
    question: "How does 1ft of additional water in Mendenhall Lake affect flooding at my house?",
    answer: "One foot of water in the lake does not equate to one foot of water at your home or property...",
  },
  {
    question: "How long does it take the water from Suicide Basin to Mendenhall Valley?",
    answer: "Once the glacial dam bursts and water is released from Suicide Basin, it takes approximately 40 hours to travel through the glacier...",
  },
  {
    question: "How will climate change affect glacial lake outburst floods?",
    answer: "Climate change is causing Alaska’s glaciers to thin and retreat, reducing the volume and frequency of some GLOFs...",
  },
  {
    question: "How is Suicide Basin monitored?",
    answer: "Suicide Basin is monitored through a combination of methods, including satellite imagery, time-lapse cameras, hydrology instruments, and aerial surveys...",
  },
  {
    question: "How long will the floods occur?",
    answer: "As long as there is enough ice to dam water in Suicide Basin, GLOFs may continue...",
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
            This tool provides mapping of flood impacts, real-time visuals of water levels, and insights about glacial lake outburst floods (GLOFs)
            from Suicide Basin. Use the cards above to explore live flood maps, forecasts, past events, and
            context on how these floods happen and impact the Juneau area. For the National Weather Service Suicide Basin monitoring page click below.
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
