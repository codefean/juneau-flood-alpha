import React from "react";
import "./FAQ.css";

const faqData = [
  {
    question: "What is a Glacial Lake Outburst Flood (GLOF)?",
    answer:
      "A GLOF occurs when the ice dam containing a glacial lake fails, causing a sudden release of water.",
  },
  {
    question: "What can cause a GLOF?",
    answer:
      "Common causes include ice or rock avalanches into the lake, rapid snowmelt, heavy rainfall, or internal weakening of the dam structure.",
  },
  {
    question: "Does 1ft of additional water in Suicide Basin equate to 1ft of flooding at my house?",
    answer:
      "No.",
  },
  {
    question: "How long does it take the water from Suicide Basin to Mendenhall Valley?",
    answer:
      "Once the glacial dam bursts and water is released from Suicide Basin, it takes around 40 hours for the water to reach Mendenhall Valley.",
  },
];

const FAQ = () => {
  return (
    <div className="FAQ-container">
      <h2 className="FAQ-title">Frequently Asked Questions</h2>
      <h3 className="FAQ-subheading">
        Additional Information about Glacial Lake Outburst Floods in Juneau
      </h3>
      <div className="about-FAQ-card">
        <p>
        This page provides information regarding glacial lake outburst floods (GLOFs), ongoing research in Suicide Basin, and additional resources.
        </p>
      </div>
      <div className="FAQ-list">
        {faqData.map((faq, index) => (
          <div key={index} className="FAQ-entry">
            <div className="FAQ-question-static">{faq.question}</div>
            <div className="FAQ-answer-static">{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
