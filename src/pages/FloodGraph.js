import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./FloodGraph.css";

const S3_CSV_URL = "https://flood-events.s3.us-east-2.amazonaws.com/FloodEvents.csv";

const getFloodStageColor = (stage) => {
  if (stage < 9) return "#d4e157"; // Action Stage
  if (stage >= 9 && stage < 10) return "#fdae61"; // Minor Flood
  if (stage >= 10 && stage < 14) return "#d73027"; // Moderate
  return "#7b3294"; // Major Flood
};

const FloodGraph = () => {
  const [scatterData, setScatterData] = useState([]);
  const [eventCardData, setEventCardData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clickedOnPoint, setClickedOnPoint] = useState(false);
  const [eventCardColor, setEventCardColor] = useState("#00509e"); // Default trim color

  useEffect(() => {
    fetch(S3_CSV_URL)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setLoading(false);

            let scatterDataProcessed = [];
            let eventCardDataProcessed = [];

            result.data.forEach((row) => {
              const id = row["Crest Date"] + row["Crest Stage D.S. Gage (ft)"]; // Unique identifier

              const stage = parseFloat(row["Crest Stage D.S. Gage (ft)"]);
              const color = getFloodStageColor(stage);

              scatterDataProcessed.push({
                x: row["Crest Date"],
                y: stage,
                fill: color,
                id,
              });

              eventCardDataProcessed.push({
                id,
                releaseDate: row["Release Start Date"] || "Unknown",
                releaseStage: row["Release Stage D.S. Gage (ft)"] || "Unknown",
                crestDate: row["Crest Date"],
                crestStage: row["Crest Stage D.S. Gage (ft)"],
                impacts: row["Impacts"] || "No impacts reported",
                color, // Store the flood stage color for dynamic styling
              });
            });

            scatterDataProcessed = scatterDataProcessed.sort((a, b) => new Date(a.x) - new Date(b.x));

            setScatterData(scatterDataProcessed);
            setEventCardData(eventCardDataProcessed);
          },
        });
      })
      .catch((error) => {
        console.error("Error loading CSV from S3:", error);
        setLoading(false);
      });
  }, []);

  const handlePointClick = (dataPoint) => {
    const matchingEvent = eventCardData.find((event) => event.id === dataPoint.id);
    setSelectedEvent(matchingEvent);
    setClickedOnPoint(true);

    if (matchingEvent) {
      setEventCardColor(matchingEvent.color); // Set border & hover color dynamically
    }
  };

  const handleBackgroundClick = (e) => {
    if (!clickedOnPoint && !e.target.closest(".event-info-card") && !e.target.closest(".scatter-chart-wrapper")) {
      setSelectedEvent(null);
    }
    setClickedOnPoint(false);
  };

  const handleMouseEnter = (data) => {
    setHoveredPoint(data.id);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handleEventCardClick = () => {
    setSelectedEvent(null);
  };

  // Custom circle shape for scatter points
  const renderCustomShape = (props) => {
    const { cx, cy, fill, payload } = props;
    const isHovered = hoveredPoint === payload.id;
    const isSelected = selectedEvent && selectedEvent.id === payload.id;
  
    return (
      <circle
        cx={cx}
        cy={cy}
        r={isHovered ? 9 : isSelected ? 7 : 5}
        fill={fill}
        className="scatter-point"
      />
    );
  };
  
  return (
    <div className="flood-graph-container" onClick={handleBackgroundClick}>
      {loading ? (
        <div className="loading">Loading flood data...</div>
      ) : (
        <>
          <div className={`scatter-chart-wrapper ${selectedEvent ? "shift-left" : ""}`}>
            <h3 className="flood-graph-title">
              Mendenhall Glacial Lake Outburst Flood Events Over Time
            </h3>
            <h4 className="flood-graph-subtitle">Select Points To Explore The Data</h4>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
                <CartesianGrid />
                <XAxis
                  type="category"
                  dataKey="x"
                  name="Peak Water Level Date"
                  label={{
                    value: "Peak Water Level Date",
                    position: "bottom",
                    style: { fontWeight: "bold", fill: "black" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Peak Water Level Stage (ft)"
                  label={{
                    value: "Peak Water Level Stage (ft)",
                    angle: -90,
                    position: "outsideLeft",
                    dx: -25,
                    style: { fontWeight: "bold", fill: "black" },
                  }}
                />
                <Scatter
                  name="Flood Events"
                  data={scatterData}
                  shape={renderCustomShape}
                  onClick={(value) => handlePointClick(value)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  cursor="pointer"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
  
          {selectedEvent && (
            <div
              className="event-info-card"
              onClick={handleEventCardClick}
              style={{
                borderRight: `5px solid ${eventCardColor}`,
                "--hover-color": `${eventCardColor}20`,
              }}
            >
              <h3 className="event-title">Flood Event Info</h3>
              <p>
                <strong>Release Start Date:</strong> {selectedEvent.releaseDate}
              </p>
              <p>
                <strong>Starting Water Level:</strong> {selectedEvent.releaseStage} ft
              </p>
              <p>
                <strong>Peak Water Level Date:</strong> {selectedEvent.crestDate}
              </p>
              <p>
                <strong>Peak Water Level:</strong> {selectedEvent.crestStage} ft
              </p>
              <p>
                <strong>NWS Impacts:</strong> {selectedEvent.impacts}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
  
};

export default FloodGraph;
