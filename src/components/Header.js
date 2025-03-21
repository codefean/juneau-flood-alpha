import React from 'react';
import './Header.css';
import FloodWarn from './FloodWarn';

const Header = () => {
  return (
    <header className="header">
      <div className="header-image">
        <img src="/ACASC2.png" alt="Alaska Climate Adaptation Science Center Logo" />
      </div>
      <div className="header-title">
        <h1>Juneau Glacial Flood Dashboard</h1>
      </div>
      <FloodWarn />
    </header>
  );
};

export default Header;
