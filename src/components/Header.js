import React from 'react';
import './Header.css';
import FloodWarn from './FloodWarn';

const Header = () => {
  return (
    <header className="header">
      <div className="header-image">
      <a href="https://akcasc.org/" target="_blank" rel="noopener noreferrer">
        <img src="/ACASC2.png" alt="Alaska Climate Adaptation Science Center Logo" />
        </a>
      </div>
      <div className="header-title">
      <h1 onClick={() => window.location.href = 'https://www.juneauflood.com/#/flood-levels'} style={{ cursor: 'pointer' }}>
  Juneau Glacial Flood Dashboard
</h1>

      </div>
      <FloodWarn />
    </header>
  );
};

export default Header;
