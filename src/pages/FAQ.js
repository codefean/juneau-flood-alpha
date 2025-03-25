import React, { useState } from "react";
import "./FAQ.css";

const faqData = [
  {
    question: "What is a GLOF?",
    answer:
      "A glacial lake outburst flood occurs when the ice dam containing a glacial lake fails, causing a sudden release of water.",
  },
  {
    question: "What causes the annual GLOFs in Suicide Basin?",
    answer:
      "Common causes include ice or rock avalanches into the lake, rapid snowmelt, heavy rainfall, or internal weakening of the dam structure.",
  },
  {
    question:
      "Does 1ft of additional water in Suicide Basin equate to 1ft of flooding at my house?",
    answer: "No.",
  },
  {
    question: "How long does it take the water from Suicide Basin to Mendenhall Valley?",
    answer:
      "Once the glacial dam bursts and water is released from Suicide Basin, it takes around 40 hours for the water to reach Mendenhall Valley.",
  },
];

const resourceLinks = [
  {
    title: "USGS Suicide Basin Monitoring",
    url: "https://www.usgs.gov/centers/asc/science/suicide-basin-glacial-lake-outburst-floods",
  },
  {
    title: "City & Borough of Juneau Emergency Alerts",
    url: "https://juneau.org/emergency",
  },
  {
    title: "National Weather Service – Juneau Flood Forecasts",
    url: "https://www.weather.gov/ajk/",
  },
  {
    title: "Alaska Division of Geological & Geophysical Surveys",
    url: "https://dggs.alaska.gov/",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="FAQ-container">
      <h2 className="FAQ-title">Frequently Asked Questions</h2>
      <h3 className="FAQ-subheading">
        Additional Information & Resources
      </h3>
      <div className="about-FAQ-card">
        <p>
          This page provides information regarding glacial lake outburst floods (GLOFs), ongoing
          research in Suicide Basin, and additional resources.
        </p>
      </div>
      <div className="FAQ-table-card">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className={`FAQ-row ${openIndex === index ? "open" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="FAQ-question">{faq.question}</div>
            <div className="FAQ-answer">{faq.answer}</div>
            {index !== faqData.length - 1 && <div className="FAQ-divider" />}
          </div>
        ))}
      </div>

      {/* Helpful Links Section */}
      <div className="FAQ-links-section">
        <h3 className="FAQ-subheading">Links</h3>
        <ul className="FAQ-links-list">
          {resourceLinks.map((link, idx) => (
            <li key={idx} className="FAQ-link-item">
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FAQ;
