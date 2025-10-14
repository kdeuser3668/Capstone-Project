import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Calendar.css';

function Settings({ weekStart, setWeekStart }) {
  const navigate = useNavigate();
  const today = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dd = today.getDate();
  const mm = monthNames[today.getMonth()];
  const yyyy = today.getFullYear();
  const theDate = `${mm} ${dd}, ${yyyy}`;

  const [textColor, setTextColor] = useState(
    typeof window !== "undefined" && window.localStorage
      ? window.localStorage.getItem("textColor") || "#000000"
      : "#000000"
  );

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setTextColor(newColor);
    window.localStorage.setItem("textColor", newColor);
    document.documentElement.style.setProperty("--text-color", newColor);
  };

  useEffect(() => {
    const savedColor = window.localStorage.getItem("textColor") || "#000000";
    document.documentElement.style.setProperty("--text-color", savedColor);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={styles.page}>
        <h1 style={{ textAlign: "left", marginBottom: "0px", color: textColor }}>Settings</h1>
        <h3 style={styles.h3}>{theDate}</h3>

        <div className="toggle-box" style={{ padding: "20px" }}>
          <label style={styles.toggleLabel}>
            Week starts on: <strong>{weekStart === 'sunday' ? 'Sunday' : 'Monday'}</strong>
          </label>
          <label className="switch">
            <input
              type="checkbox"
              checked={weekStart === 'monday'}
              onChange={() => setWeekStart(weekStart === 'sunday' ? 'monday' : 'sunday')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div style={styles.card}>
          <label htmlFor="textcolor" style={{ display: "block", marginTop: "1rem", color: textColor }}>
            Select your text color:
          </label>
          <input
            type="color"
            id="textcolor"
            value={textColor}
            onChange={handleColorChange}
            style={{ marginTop: "0.5rem", cursor: "pointer" }}
          />
          <p style={{ marginTop: "1rem", color: textColor }}>
            Your selected color: <strong style={{ color: textColor }}>{textColor}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "200vh",
    backgroundColor: "white",
    margin: '10px',
  },
  button: {
    padding: ".5rem",
    fontSize: "1rem",
    backgroundColor: "#ee6dd5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  h3: {
    color: "var(--text-color)",
    fontWeight: "normal",
    textAlign: "left",
    padding: "10px",
    marginTop: "0px",
  },
  toggleLabel: {
    fontSize: "1rem",
    color: "#333"
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(235, 89, 193, 0.6)",
    textAlign: "center",
    width: "300px",
    maxWidth: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  }
};

export default Settings;
