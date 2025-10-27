import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { DayPilotCalendar, DayPilotMonth } from "@daypilot/daypilot-lite-react";


function Calendar({ weekStart }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [view, setView] = useState("month");


  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const shortMonthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/api/course-sessions")
      .then(res => res.json())
      .then(data => {
        console.log(data); // check what’s coming in
        setEvents(data);
      })
      .catch(err => console.error("Error fetching events:", err));
  }, []);

  const renderNavigationBar = () => {
  const handleNavigation = (direction) => {
    const newDate = new Date(value);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : direction === "prev" ? -1 : 0));
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : direction === "prev" ? -7 : 0));
    } else if (view === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : direction === "prev" ? -1 : 0));
    }
    setValue(newDate);
  };

  return (
    <div style={styles.navBar}>
      <button style={styles.navButton} onClick={() => handleNavigation("prev")}>← Prev</button>
      <button style={styles.navButton} onClick={() => handleNavigation("today")}>Today</button>
      <button style={styles.navButton} onClick={() => handleNavigation("next")}>Next →</button>
    </div>
  );
};

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Calendar</h1>
          <h3 style={styles.headerSubtitle}>
            {monthNames[value.getMonth()]} {value.getFullYear()}
          </h3>
        </div>

        <div style={styles.viewTabs}>
            {renderNavigationBar()}
          {["day", "week", "month", "year"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                ...styles.tabButton,
                ...(view === v ? styles.activeTab : {})
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.mainContent}>
          <div style={styles.calendarSection}>
            <div style={styles.dayPilotWrapper}>
         {view === "day" && (
        <DayPilotCalendar
            viewType="Day"
            events={events}
            startDate={value}
            durationBarVisible={false}
            onBeforeHeaderRender={args => {
            const date = new Date(args.header.start);
            const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
            const formatted = `${weekday}, ${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}.${date.getFullYear()}`;
            args.header.html = `<div style='font-weight:bold; font-size:1.1rem;'>${formatted}</div>`;
            }}
        />
        )}
        {view === "week" && (
        <DayPilotCalendar
            viewType="Week"
            events={events}
            startDate={value}
            durationBarVisible={false}
            onBeforeHeaderRender={args => {
            const date = new Date(args.header.start);
            const weekday = date.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue", etc.
            const day = date.getDate();
            args.header.html = `<div style='font-weight:bold; font-size:1rem;'>${weekday} ${day}</div>`;
            }}
        />
        )}
              {view === "month" && (
                <div>
                  <h3 style={styles.monthHeader}>
                    {monthNames[value.getMonth()]} {value.getFullYear()}
                  </h3>
                  <DayPilotMonth
                    events={events}
                    startDate={value.toISOString().split("T")[0]}
                    onBeforeCellRender={(args) => {
                        const date = new Date(args.cell.start);
                        const shortMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()];
                        const day = date.getDate();
                        args.cell.html = `<div style='font-weight:bold; margin-bottom:4px;'>${shortMonth} ${day}</div>`;
                    }}
                    />


                </div>
              )}
              {view === "year" && (
                <div style={styles.placeholder}>
                  <p>Year view coming soon...</p>
                </div>
              )}
            </div>
          </div>

          <div style={styles.sidePanel}>
            <div style={styles.agendaBox}>
              <h3>Agenda / Current Tasks</h3>
              <ul>
                <li>Finish math homework</li>
                <li>Submit history essay</li>
                <li>Prepare for science quiz</li>
              </ul>
            </div>
            <div style={styles.upcomingBox}>
              <h3>Upcoming Assignments / Events</h3>
              <ul>
                <li>Parent-teacher conference – Oct 16</li>
                <li>Field trip – Oct 18</li>
                <li>English project due – Oct 20</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100vh",
    width: "100%",
    backgroundColor: "white",
    padding: "20px",
    gap: "20px"
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "10px 0",
    marginBottom: "0"
  },
  headerTitle: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333"
  },
  headerSubtitle: {
    marginTop: "5px",
    fontSize: "1.2rem",
    fontWeight: "normal",
    color: "#666"
  },
  viewTabs: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    gap: "10px",
    marginBottom: "10px"
  },
  tabButton: {
    padding: "6px 14px",
    fontSize: "0.9rem",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "20px",
    cursor: "pointer",
    color: "#333"
  },
  activeTab: {
    backgroundColor: "#ee6dd5",
    color: "#fff",
    border: "1px solid #ee6dd5"
  },
  mainContent: {
    display: "flex",
    gap: "30px",
    alignItems: "flex-start",
    marginTop: "10px",
    width: "100%"
  },
  calendarSection: {
    flex: "2",
    maxWidth: "700px",
    width: "100%",
    overflow: "hidden",
    boxSizing: "border-box"
  },
  dayPilotWrapper: {
    width: "100%",
    minHeight: "500px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
    borderRadius: "8px",
    overflow: "hidden"
  },
  sidePanel: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  agendaBox: {
    backgroundColor: "#fce4ec",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)"
  },
  upcomingBox: {
    backgroundColor: "#e3f2fd",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)"
  },
  placeholder: {
    padding: "40px",
    textAlign: "center",
    color: "#888",
    fontStyle: "italic"
  },
  monthHeader: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px"
  },
  navBar: {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "10px"
},
navButton: {
  padding: "6px 12px",
  fontSize: "0.9rem",
  backgroundColor: "#e0e0e0",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  color: "#333"
}
};

export default Calendar;
