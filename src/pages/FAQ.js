import React, { useState } from "react";
import "./FAQ.css";
import ResourceLinksSection from "./ResourceLinksSection"; // Import reusable component

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
    title: "What is a GLOF? (USGS)",
    url: "https://www.usgs.gov/news/national-news-release/usgs-researchers-track-glacier-lake-outburst-floods",
    icon: "",
    color: "#1f77b4",
  },
  {
    title: "Suicide Basin Research",
    url: "https://blogs.agu.org/thefield/2023/07/31/suicide-basin-glacier-dynamics/",
    icon: "",
    color: "#1f77b4",
  },
  {
    title: "Glacier Terminology",
    url: "https://nsidc.org/learn/parts-cryosphere/glaciers/glacier-terminology",
    icon: "",
    color: "#1f77b4",
  },
];



const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileLinksOpen, setMobileLinksOpen] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    setTimeout(() => {
      const el = document.getElementById(`faq-answer-${index}`);
      if (el && openIndex !== index) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 10);
  };
  

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      toggleFAQ(index);
    }
  };

  return (
    <div className="FAQ-wrapper">
      {/* Desktop Sidebar */}
      <div className="FAQ-fixed-sidebar desktop">
        <ResourceLinksSection title="Safety Resources" links={resourceLinks} />
        <div className="faq-margin-top">
          <ResourceLinksSection
            title="Educational Resources"
            links={educationLinks}
            className="FAQ-fixed-sidebar-education"
          />
        </div>
      </div>

      {/* Main FAQ Content */}
      <div className="FAQ-container">
        <h2 className="FAQ-title">Frequently Asked Questions</h2>
        <h3 className="FAQ-subheading">Additional Information & Resources</h3>

        <div className="FAQ-main-content">
          <div className="FAQ-left">
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
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="FAQ-mobile-toggle"
          onClick={() => setMobileLinksOpen(!mobileLinksOpen)}
        >
          {mobileLinksOpen ? "Close Resources" : "Open Additional Resources"}
        </button>

        {/* Mobile Resource Sections */}
        {mobileLinksOpen && (
          <>
            <ResourceLinksSection
              title="Safety Resources"
              links={resourceLinks}
              className="mobile"
            />
            <ResourceLinksSection
              title="Educational Resources"
              links={educationLinks}
              className="mobile"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FAQ;
