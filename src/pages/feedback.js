import React from "react";
import { NavLink } from "react-router-dom";
import "./feedback.css";
import "./FloodEvents.css";

const Feedback = ({ headers, data, loading, scatterData }) => {
  return (
    <div className="feedback-page">
      {/* === Flood Events Section === */}
      <div className="flood-events-container">
        <h2 className="flood-events-title">
          Feedback and Suggestions
        </h2>
        <h3 className="flood-events-subheading">
          Share Your Thoughts to Improve The Dashboard
        </h3>

        <div className="about-floods-card">
          <p>
            We’re seeking your feedback to help improve the Juneau Flood Dashboard. 
            Please join one of the upcoming events or share your ideas through the online feedback form below. 
            <br /><br />
            <strong>Evening at Egan: Researching the Mendenhall Outburst Flood — 2025 and Beyond</strong>
            <br />
            <em>Thursday, October 10th | 7:00–8:00 PM</em>
            <br />
            <em>UAS Egan Library</em>
            <br />
            Join researchers Eran Hood and Jason Amundson as they share updates on their work 
            studying the Mendenhall Outburst Flood and how the flood may evolve over time.
            <br /><br />

            <strong>Juneau Glacial Flood Dashboard Feedback Sessions</strong>
            <br />
            We want to hear from you! Help improve the Juneau Glacial Flood Dashboard and make it more useful for our community. 
            Come for the full session or drop in for a short presentation, discussion, and informal conversation.
            <br /><br />

            <strong>In-Person Feedback Session</strong>
            <br />
            <em>Sunday, October 12th | 3:30–5:00 PM</em>
            <br />
            <em>Mendenhall Valley Public Library</em>
            <br /><br />

            <strong>Virtual Feedback Session</strong>
            <br />
            <em>Tuesday, October 14th | 7:00–8:00 PM</em>
            <br />
            On Zoom: <a 
              href="https://tinyurl.com/JuneauFloodDashboard" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              tinyurl.com/JuneauFloodDashboard
            </a>
            <br /><br />

            <strong>Online Feedback</strong>
            <br />
            Available until <em>October 20th</em> at{" "}
            <a 
              href="https://juneauflood.com/#/feedback" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              juneauflood.com/#/feedback
            </a>
          </p>
        </div>
      </div>

      {/* === Feedback Form === */}
      <div className="feedback-container">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScpAxn2kehZVgTVavv0DLuR0tRNAMwqEQnGI-NzFGt831lS1A/viewform?usp=header"
          width="100%"
          height="800"
          title="Feedback Form"
        ></iframe>
      </div>
    </div>
  );
};

export default Feedback;
