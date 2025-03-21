import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navigation">
      <span className="menu-toggle" onClick={toggleMenu}>
        ☰
      </span>
      <ul className={isMenuOpen ? "open" : ""}>
        <li>
          <NavLink to="/flood-levels" activeClassName="active-link">
            Flood Map
          </NavLink>
        </li>
        <li>
          <NavLink to="/flood-forecast" activeClassName="active-link">
            Flood Forecasting
          </NavLink>
        </li>
        <li>
          <NavLink to="/flood-events" activeClassName="active-link">
            Flood Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/suicide-basin" activeClassName="active-link">
            Suicide Basin
          </NavLink>
        </li>
        <li>
          <a
            href="https://www.arcgis.com/apps/Cascade/index.html?appid=ad88fd5ccd7848139315f42f49343bb5"
            target="_blank"
            rel="noopener noreferrer"
            className="external-link"
          >
            The Flood Story
          </a>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Info
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
