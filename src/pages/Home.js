import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';

const cardData = [
  {
    title: 'Flood Map',
    link: '/flood-map',
    image: '/images/flood-map.png',
    description:
      'View the glacial flood zone at various flood levels and with HESCO barriers.',
  },
  {
    title: 'Flood Forecasting',
    link: '/flood-forecast',
    image: '/images/flood-forecast.png',
    description:
      'How to understand flood forecasts based on gage heights & image data.',
  },
  {
    title: 'Flood Events',
    link: '/flood-events',
    image: '/images/flood-events.png',
    description:
      'Historical flood event data including impact reports & peak discharge statistics.',
  },
  {
    title: 'Suicide Basin',
    link: '/suicide-basin',
    image: '/images/suicide-basin.png',
    description:
      'How Suicide Basin works & context for recent lake outburst events.',
  },
];

const faqData = [
  {
    question: "What is a GLOF?",
    answer:
      "Glacial lake outburst floods (GLOFs) happen when ice-dammed or moraine-dammed lakes suddenly release large volumes of water, often due to the failure of an ice dam. Ice dams are particularly prone to sudden collapse as water pressure builds and carves a path beneath or around the glacier, triggering rapid drainage and flooding downstream.",
  },
  {
    question: "Why are GLOFs occurring annually in Suicide Basin?",
    answer:
      "Common causes include ice or rock avalanches into the lake, rapid snowmelt, heavy rainfall, or internal weakening of the dam structure.",
  },
  {
    question: "Does 1ft of additional water in Suicide Basin equate to 1ft of flooding at my house?",
    answer: "No.",
  },
  {
    question: "How long does it take the water from Suicide Basin to Mendenhall Valley?",
    answer:
      "Once the glacial dam bursts and water is released from Suicide Basin, it takes around 40 hours for the water to reach Mendenhall Valley.",
  },
  {
    question: "How will climate change affect glacial lake outburst floods?",
    answer:
      "Climate change is causing Alaska's glaciers to thin and recede, reducing the size and volume of ice-dammed lakes and leading to fewer or smaller GLOFs over time. However, new glacial lakes may form in different areas as glaciers retreat, and even small GLOFs can pose serious threats to nearby communities and ecosystems.",
  },
  {
    question: "How is Suicide Basin monitored?",
    answer: "789",
  },
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
    title: "What is a GLOF?",
    url: "https://www.usgs.gov/news/national-news-release/usgs-researchers-track-glacier-lake-outburst-floods",
    icon: "",
    color: "#1f77b4",
  },
  {
    title: "The Flood Story",
    url: "https://www.arcgis.com/apps/Cascade/index.html?appid=ad88fd5ccd7848139315f42f49343bb5",
    icon: "",
    color: "#1f77b4",
  },
  {
    title: "Glacier Terminology",
    url: "https://pubs.usgs.gov/of/2004/1216/",
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
          <h3>About This Dashboard</h3>
          <p>
            This tool provides real-time visualizations and data about glacial lake outburst floods (GLOFs)
            from Suicide Basin. Use the cards above to explore live flood maps, forecasts, past events, and
            context on how these floods happen and impact the Juneau area.
          </p>
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

        {/* Resource Links */}
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
    </div>
  );
};

export default Home;
