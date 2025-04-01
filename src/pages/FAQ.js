import React, { useState } from "react";
import "./FAQ.css";
import ResourceLinksSection from "./ResourceLinksSection";

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
    question: "Does 1ft of additional water in Suicide Basin equate to 1ft of flooding at my house?",
    answer: "No.",
  },
  {
    question: "How long does it take the water from Suicide Basin to Mendenhall Valley?",
    answer:
      "Once the glacial dam bursts and water is released from Suicide Basin, it takes around 40 hours for the water to reach Mendenhall Valley.",
  },
  {
    question: "XYZ",
    answer: "123",
  },
  {
    question: "ABC",
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

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      toggleFAQ(index);
    }
  };

  return (
    <div className="FAQ-wrapper">
      {/* Left side: Main content */}
      <div className="FAQ-container">
        <h2 className="FAQ-title">Frequently Asked Questions</h2>
        <h3 className="FAQ-subheading">Additional Information & Resources</h3>

        <div className="FAQ-main-content">
          <div className="FAQ-left-inner">
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
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleFAQ(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="FAQ-question">
                    {faq.question}
                    <span className="FAQ-toggle-icon">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </div>
                  <div
                    id={`faq-answer-${index}`}
                    className="FAQ-answer"
                    hidden={openIndex !== index}
                  >
                    {faq.answer}
                  </div>
                  {index !== faqData.length - 1 && <div className="FAQ-divider" />}
                </div>
              ))}
            </div>

            {/* Mobile Resource Links */}
            <div className="FAQ-resource-links-mobile">
              <ResourceLinksSection title="Flood Safety Resources" links={resourceLinks} />
              <div className="faq-margin-top">
                <ResourceLinksSection title="Educational Resources" links={educationLinks} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="FAQ-fixed-sidebar-resources">
        <ResourceLinksSection title="Flood Safety Resources" links={resourceLinks} />
      </div>
      <div className="FAQ-fixed-sidebar-education">
        <ResourceLinksSection title="Educational Resources" links={educationLinks} />
      </div>
    </div>
  );
};

export default FAQ;
