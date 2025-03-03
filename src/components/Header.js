import React from 'react';
import './Header.css';
import FloodWarn from './FloodWarn';

const Header = () => {
  return (
    <header className="header">
      <div>
        <h1>Juneau Glacial Flood Dashboard</h1>
      </div>
      <FloodWarn />
    </header>
  );
};

export default Header;
