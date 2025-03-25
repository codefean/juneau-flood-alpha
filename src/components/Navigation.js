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
          <NavLink
            to="/flood-levels"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Flood Map
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/flood-forecast"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Flood Forecasting
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/flood-events"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Flood Events
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/suicide-basin"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Suicide Basin
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/FAQ"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            FAQ
          </NavLink>
        </li> */}
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

