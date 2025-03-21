import React from "react";
import "./Footer.css"; // Import Footer-specific styles

const Footer = () => {
  return (
    <footer className="footer">
       <div className="footer-logos">
        <img src="/logos/akcasc.png" alt="AK CASC Logo" className="footer-logo" />
        <img src="/logos/IARC.png" alt="IARC Logo" className="footer-logo" />
        <img src="/logos/UAA.png" alt="UAA Logo" className="footer-logo" />
        <img src="/logos/UAF.png" alt="UAF Logo" className="footer-logo" />
        <img src="/logos/UAS.png" alt="UAS Logo" className="footer-logo" />
        <img src="/logos/USGS.png" alt="USGS Logo" className="footer-logo" />
      </div>
      <p>
        AK CASC is a partnership between the University of Alaska and the USGS, and is hosted at the UAF International Arctic Research Center.
      </p>
      <p>
        <strong>University Host Location:</strong> UAF Troth Yeddha' Campus, 2160 Koyukuk Drive • PO Box 757245, Fairbanks, AK 99775-7245
      </p>
      <p>
        The <a href="https://www.alaska.edu/alaska" target="_blank" rel="noopener noreferrer"><strong>University of Alaska</strong></a> is an Equal Opportunity/Equal Access Employer and Educational Institution.
      </p>
      <p>
        The University is committed to a <a href="https://www.alaska.edu/nondiscrimination" target="_blank" rel="noopener noreferrer"><strong>policy of nondiscrimination</strong></a> against individuals on the basis of any legally protected status.
      </p>
      <p>
        UA is committed to providing accessible websites. <a href="https://www.alaska.edu/webaccessibility" target="_blank" rel="noopener noreferrer"><strong>Learn more about UA’s notice of web accessibility.</strong></a>
      </p>
      <p>© 2025 Alaska Climate Adaptation Science Center. <a href="mailto:info@akcasc.org"><strong>Contact AK CASC</strong></a></p>
    </footer>
  );
};

export default Footer;
