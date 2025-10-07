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
          We’re seeking your feedback to help improve the Juneau Flood Dashboard. Please join one of the event sessions listed below or share your thoughts 
          through this feedback form below. 
          
           <br /><br /> <strong> Evening at Egan Researching the Outburst Flood @ UAS Egan Library: Friday October 10th | 7:00-8:00pm
</strong>

<br /><strong>In-Person Dashboard Feedback Session @ Mendenhall Valley Public Library: Sunday, October 12th | 3:30–5:00</strong>

<br /><strong>Virtual Dashboard Feedback Session on Zoom: Tuesday, October 14th | 7:00–8:00 PM</strong>


          
<br /><br />For additional questions, contact us at 
          <strong> UAS-GLOF-info@alaska.edu</strong>.
          </p>
        </div>


      </div>

      {/* === Feedback Form === */}
      <div className="feedback-container">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScpAxn2kehZVgTVavv0DLuR0tRNAMwqEQnGI-NzFGt831lS1A/viewform?usp=header"
          width="100%"
          height="720"
          allowFullScreen
          allow="geolocation"
          title="Feedback Form"
        ></iframe>
      </div>
    </div>
  );
};

export default Feedback;
