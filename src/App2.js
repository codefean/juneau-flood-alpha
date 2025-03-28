import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/App2.css";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import FloodLevels from "./pages/FloodLevels";
import FloodForecast from "./pages/FloodForecast";
import FloodEvents from "./pages/FloodEvents";
import SuicideBasin from "./pages/SuicideBasin";
import FAQ from "./pages/FAQ";
import ContactPage from "./pages/Contact";
import Footer from "./components/Footer";

// Custom hook for setting the document title
const useDocumentTitle = (title) => {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
};

// Wrapper components to set the title for each route
const FloodLevelsPage = () => {
  useDocumentTitle("Juneau Flood Risk");
  return <FloodLevels />;
};

const FloodPredictionPage = () => {
  useDocumentTitle("Flood Forecast");
  return <FloodForecast />;
};

const FloodEventsPage = () => {
  useDocumentTitle("Flood Events");
  return <FloodEvents />;
};

const SuicideBasinPage = () => {
  useDocumentTitle("Suicide Basin");
  return <SuicideBasin />;
};

const FAQPage = () => {
  useDocumentTitle("FAQ");
  return <FAQ />;
};


const App2 = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Navigation />
        <div className="main-content">
        <Routes>
        <Route path="/" element={<Navigate to="/flood-levels" />} />
        <Route path="/flood-levels" element={<FloodLevelsPage />} />
        <Route path="/flood-forecast" element={<FloodPredictionPage />} />
        <Route path="/flood-events" element={<FloodEventsPage />} />
        <Route path="/suicide-basin" element={<SuicideBasinPage />} />
        <Route path="/FAQ" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App2;

