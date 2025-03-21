import React from 'react';
import './Contact.css'; // optional if you want to style it separately

const Contact = () => {
  return (
    <div className="contact-container">


<p className="contact-text">
        <strong>The Juneau Glacial Flood Dashboard is currently in beta testing and is not complete.</strong>
      </p>

      <p className="contact-text">
        For questions or comments, email{' '}
        <a href="mailto:ewhood@alaska.edu" className="contact-link">
        ewhood@alaska.edu
        </a> or <a href="mailto:sfagan2@alaska.edu" className="contact-link">
        sfagan2@alaska.edu
        </a>
      </p>

      <p className="contact-text">
        This project is funded for by the Climate Adaptation Science Center
      </p>
    </div>
  );
};

export default Contact;
