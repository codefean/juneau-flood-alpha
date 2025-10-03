import React from 'react';
import { NavLink } from 'react-router-dom';
import './feedback.css';

const Feedback = () => {
  return (
    <div className="feedback-container">
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLScpAxn2kehZVgTVavv0DLuR0tRNAMwqEQnGI-NzFGt831lS1A/viewform?usp=header"
        width="100%"
        height="720px"
        allowFullScreen
        allow="geolocation"
        title="Feedback Form"
      ></iframe>
      </div>
  );
};

export default Feedback;
