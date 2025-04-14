import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';

const cardData = [
  {
    title: 'Flood Map',
    link: '/flood-map',
    image: '/images/flood-map.jpg',
    description:
      'View the glacial flood zone at various flood levels and with HESCO barriers.',
  },
  {
    title: 'Flood Forecasting',
    link: '/flood-forecast',
    image: '/images/flood-forecast.jpg',
    description:
      'How to understand flood forecasts based on gage heights & image data.',
  },
  {
    title: 'Flood Events',
    link: '/flood-events',
    image: '/images/flood-events.jpg',
    description:
      'Historical flood event data including impact reports & peak discharge statistics.',
  },
  {
    title: 'Suicide Basin',
    link: '/suicide-basin',
    image: '/images/suicide-basin.jpg',
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
      "Common causes include ice or rock avalanches into the lake, rapid snowmelt, heavy rainfall, or internal weakening of the dam structure. In Suicide Basin, the unique topography and ongoing glacier thinning have created conditions for recurring annual GLOFs.",
  },
  {
    question: "Does 1ft of additional water in Suicide Basin equate to 1ft of flooding at my house?",
    answer: "Not directly. One foot of water in the lake does not equate to one foot of water at your home or property. Flood risk depends on many factors including elevation, local topography, and how water flows through the valley. Even small increases in lake level can lead to localized flooding in low-lying areas.",
  },
  {
    question: "How long does it take the water from Suicide Basin to Mendenhall Valley?",
    answer:
      "Once the glacial dam bursts and water is released from Suicide Basin, it takes approximately 40 hours to travel through the glacier and emerge in Mendenhall Lake, eventually impacting the valley.",
  },
  {
    question: "How will climate change affect glacial lake outburst floods?",
    answer:
      "Climate change is causing Alaska’s glaciers to thin and retreat, reducing the volume and frequency of some GLOFs. However, as glaciers recede, new glacial lakes can form in unstable locations, potentially increasing risk in new areas. Even smaller GLOFs remain hazardous to infrastructure, ecosystems, and public safety.",
  },
  {
    question: "How is Suicide Basin monitored?",
    answer: "Suicide Basin is monitored through a combination of methods, including satellite imagery, time-lapse cameras, hydrology instruments, and aerial surveys. Researchers also use radar and ground-based sensors to measure ice movement, lake volume, and drainage events. These observations help improve flood forecasting and early warning systems.",
  },
  {
    question: "How long will the floods occur?",
    answer: "As long as there is enough ice to dam water in Suicide Basin, GLOFs may continue. However, the frequency and size of these events are expected to decline as the basin continues to evolve and the glacier thins. Long-term flood behavior will depend on how rapidly the glacier retreats and whether the basin stabilizes or drains completely.",
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
          <h3>About</h3>
          <p>
            This tool provides mapping of flood impacts, real-time visuals of water levels, and insights about glacial lake outburst floods (GLOFs)
            from Suicide Basin. Use the cards above to explore live flood maps, forecasts, past events, and
            context on how these floods happen and impact the Juneau area.
          </p>
        </div>
  
        {/* Resource Section: Safety + Education */}
        <div className="resources-wrapper">
          {/* Flood Safety */}
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

        <div className="home-about-card">
          <h3>Contact Us</h3>
          <p> This website is currently in <em>beta testing</em> and is not yet complete.  
          For additional information, please contact: <br></br>
          <strong> Eran Hood</strong> at <a href="mailto:ewhood@alaska.edu">ewhood@alaska.edu</a>  or 
      
          <strong> Sean Fagan</strong> at <a href="mailto:sfagan2@alaska.edu">sfagan2@alaska.edu</a>
        </p>

        </div>
      </div>
    </div>
  );
}  

export default Home;
