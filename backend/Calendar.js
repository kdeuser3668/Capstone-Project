import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';


function Calendar() {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [weekStart, setWeekStart] = useState('sunday');

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dd = value.getDate();
  const mm = monthNames[value.getMonth()];
  const yyyy = value.getFullYear();
  const theDate = `${mm} ${dd}, ${yyyy}`;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={styles.page}>
        {/* Header with title, date, and toggle */}
        <div style={styles.header}>
          <div>
            <h1 style={{ marginBottom: "0px" }}>Calendar</h1>
            <h3 style={styles.h3}>{theDate}</h3>
          </div>
        <div className="toggle-box">
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

        </div>

        {/* Calendar display */}
        <div style={styles.calendarWrapper}>
          <CalendarComponent
            onChange={setValue}
            value={value}
            locale={weekStart === 'sunday' ? 'en-US' : 'en-GB'}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100vh",
    width: "100%",
    backgroundColor: "white",
    padding: "20px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    marginBottom: "10px"
  },
  h3: {
    fontWeight: "normal",
    textAlign: "left",
    padding: "10px",
    marginTop: "0px",
  },
  calendarWrapper: {
    padding: "20px",
    maxWidth: "1000px",
    width: "100%",
    margin: "0 auto",
  },
  button: {
    padding: ".5rem",
    fontSize: "1rem",
    backgroundColor: "#ee6dd5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "20px"
  },
  toggleLabel: {
  fontSize: "1rem",
  color: "#333"
    }
};

export default Calendar;
