import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import FloodGraph from "./FloodGraph";
import FloodTable from "./FloodTable";
import FloodImages from "./FloodImages";
import "./FloodEvents.css";

const S3_CSV_URL =
  "https://juneauflood-basin-images.s3.us-west-2.amazonaws.com/FloodEvents.csv";

// Rename specific CSV headers for clarity and UI display
const COLUMN_NAME_MAPPING = {
  "Release Stage D.S. Gage (ft)": "Release Start Stage at Mendenhall Lake (ft)",
  "D.S. Gage Release Flow (cfs)": "Release Flow Rate at Mendenhall Lake (cfs)",
  "Crest Date": "Peak Water Level Date",
  "Crest Stage D.S. Gage (ft)": "Peak Water Level at Mendenhall Lake (ft)",
  "D.S. Gage Crest Flow (cfs)": "Peak Water Level Flow Rate (cfs)",
  Impacts: "NWS Impacts",
};

const EXCLUDED_COLUMNS = [
  "Remarks",
  "Lake Peak Stage (ft)",
  "Release Volume (ac-ft)",
];

const FloodEvents = () => {
  const [data, setData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestFloodEvent, setLatestFloodEvent] = useState(null);
  const [largestFloodEvent, setLargestFloodEvent] = useState(null);
  const [totalEvents, setTotalEvents] = useState(0);

  const Stat = ({ target, label, tooltip, showPlus = false }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Detect numeric targets
  const isNumeric = typeof target === "number" && !isNaN(target);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Animate only for numeric targets
  useEffect(() => {
    if (isVisible && isNumeric) {
      let current = 0;
      const increment = Math.ceil(target / 200);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCount(current);
      }, 20);
      return () => clearInterval(timer);
    }
  }, [isVisible, target, isNumeric]);

  return (
    <div
      className="stat"
      ref={ref}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="stat-number">
        {isNumeric ? (
          <>
            {count}
            {showPlus && "+"}
          </>
        ) : (
          target || "—"
        )}
      </span>

      <p className="stat-label">{label}</p>

      {showTooltip && tooltip && (
        <div className="stat-tooltip">
          <div className="stat-tooltip-content">
            <p>{tooltip}</p>
          </div>
        </div>
      )}
    </div>
  );
};


  // === Fetch and parse CSV data ===
  useEffect(() => {
    fetch(S3_CSV_URL, { cache: "no-cache" })
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setLoading(false);

            // Filter & rename headers
            const filteredHeaders = result.meta.fields
              .filter((header) => !EXCLUDED_COLUMNS.includes(header))
              .map((header) => COLUMN_NAME_MAPPING[header] || header);
            setHeaders(filteredHeaders);

            // Clean and remap data
            const filteredData = result.data.map((row) => {
              const filteredRow = {};
              Object.keys(row).forEach((key) => {
                if (!EXCLUDED_COLUMNS.includes(key)) {
                  const newKey = COLUMN_NAME_MAPPING[key] || key;
                  filteredRow[newKey] = row[key] === "-" ? "" : row[key];
                }
              });
              return filteredRow;
            });

            setData(filteredData);

            // === STATS ===
            setTotalEvents(filteredData.length);

            if (filteredData.length > 0) {
              // Latest flood (assumes newest first)
              setLatestFloodEvent(filteredData[0]);

              // Largest flood event
              const largest = filteredData.reduce((max, row) => {
                const currentPeak = parseFloat(
                  row["Peak Water Level at Mendenhall Lake (ft)"]
                );
                const maxPeak = parseFloat(
                  max["Peak Water Level at Mendenhall Lake (ft)"]
                );
                return !isNaN(currentPeak) && currentPeak > (maxPeak || 0)
                  ? row
                  : max;
              }, filteredData[0]);
              setLargestFloodEvent(largest);
            }

            // Scatter graph data
            const scatterPoints = filteredData
              .filter(
                (row) =>
                  row["Peak Water Level Date"] &&
                  row["Peak Water Level at Mendenhall Lake (ft)"]
              )
              .map((row) => ({
                x: row["Peak Water Level Date"],
                y: parseFloat(row["Peak Water Level at Mendenhall Lake (ft)"]),
              }));

            setScatterData(scatterPoints);
          },
        });
      })
      .catch((error) => {
        console.error("Error loading CSV from S3:", error);
        setLoading(false);
      });
  }, []);

  // === UI ===
  return (
    <div className="about-container">
      {/* === Stats Bar === */}
      <div className="stats-bar">
        <div className="stats-overlay">

                    <Stat
            target="7/19/11"
            label="First Flood Event Recorded"
            tooltip="First documented flood event at Suicide Basin from NWS above 8ft (Minor Flood Stage)."
          />
          {/* Stat 1: Total Flood Events */}
          <Stat
            target={totalEvents}
            label="Total Flood Events Recorded"
            tooltip="Documented flood events from NWS above 8ft (Minor Flood Stage)."
          />

          {/* Stat 2: Largest Flood Event */}
          {largestFloodEvent && (
            <Stat
              target={parseFloat(
                largestFloodEvent["Peak Water Level at Mendenhall Lake (ft)"]
              )}
              label="Largest Flood Peak Recorded (ft)"
              tooltip={`Occurred on ${largestFloodEvent["Peak Water Level Date"]}. Based on Mendenhall Lake water level data.`}
            />
          )}

          {/* Stat 3: Most Recent Flood Event */}
          {latestFloodEvent && (
            <Stat
              target={latestFloodEvent["Peak Water Level Date"]}
              label="Most Recent Flood Event"
              tooltip={`Peak Water Level Recorded ${latestFloodEvent["Peak Water Level at Mendenhall Lake (ft)"]} (ft)`}
            />
          )}

        </div>
      </div>

      {/* === Main Flood Data === */}
      <div className="flood-events-container">
        <h2 className="flood-events-title">Historical Flood Data for Suicide Basin</h2>
        <h2 className="flood-events-subheading">
          Learn About Past Glacial Outburst Flood Events
        </h2>

        <div className="about-floods-card">
          <p>
            This page provides historical data on glacial lake outburst flood
            events that raised water levels at Mendenhall Lake to over 8ft
            (Action Stage). You can explore past flood events, visualize trends,
            and view important details such as peak water levels and flow rates
            in Mendenhall River.
          </p>
        </div>

      

        {/* === Table + Graph === */}
        <div className="visuals-container">
          <FloodTable headers={headers} data={data} loading={loading} />
          <FloodGraph scatterData={scatterData} />
        </div>
      </div>
    </div>
  );
};

export default FloodEvents;
