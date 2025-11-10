import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from './Sidebar';
import { DayPilotCalendar, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { DayPilot } from "@daypilot/daypilot-lite-react";

function Calendar() {
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

  const [events, setEvents] = useState([
    { id: 1, text: "Math Homework", start: "2024-06-10T10:00:00", end: "2024-06-10T12:00:00" },
    { id: 2, text: "Science Quiz", start: "2024-06-11T09:00:00", end: "2024-06-11T10:00:00" },
  ]);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Form state for new event
  const [newEventData, setNewEventData] = useState({
    text: "",
    location: "",
    notes: "",
    start: null,
    end: null
  });

  // Month names for header
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Navigation handler
  const handleNavigation = (direction) => {
    let newDate = new Date(value);
    if (direction === "today") {
      newDate = new Date();
    } else if (direction === "prev") {
      if (view === "day") newDate.setDate(newDate.getDate() - 1);
      else if (view === "week") newDate.setDate(newDate.getDate() - 7);
      else if (view === "month") newDate.setMonth(newDate.getMonth() - 1);
      else if (view === "year") newDate.setFullYear(newDate.getFullYear() - 1);
    } else if (direction === "next") {
      if (view === "day") newDate.setDate(newDate.getDate() + 1);
      else if (view === "week") newDate.setDate(newDate.getDate() + 7);
      else if (view === "month") newDate.setMonth(newDate.getMonth() + 1);
      else if (view === "year") newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setValue(newDate);
  };

  // Open modal when selecting time range in calendar
  const onTimeRangeSelected = (args) => {
    setNewEventData({
      text: "",
      location: "",
      notes: "",
      start: args.start.toString(),
      end: args.end.toString()
    });
    setShowModal(true);
  };

  // Add new event from modal
  const addEvent = () => {
    if (!newEventData.text || !newEventData.start || !newEventData.end) {
      alert("Please fill in at least Event Name, Start and End time.");
      return;
    }

    // Create new event object
   const newEvent = {
  id: DayPilot.guid(),
  text: newEventData.text,
  start: newEventData.start.length === 16 ? newEventData.start + ":00" : newEventData.start,
  end: newEventData.end.length === 16 ? newEventData.end + ":00" : newEventData.end,
  location: newEventData.location,
  notes: newEventData.notes,
};


    setEvents((prev) => [...prev, newEvent]);
    setShowModal(false);
  };

  // Format a Date string to YYYY-MM-DDTHH:mm for input[type=datetime-local]
  const formatForDatetimeLocal = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const iso = d.toISOString();
    return iso.substring(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Calendar</h1>
          <h3 style={styles.headerSubtitle}>
            {monthNames[value.getMonth()]} {value.getFullYear()}
          </h3>
        </div>

        {/* Navigation */}
        <div style={styles.controlsWrapper}>
          <div style={styles.navBar}>
            <button style={styles.navButton} onClick={() => handleNavigation("prev")}>← Prev</button>
            <button style={styles.navButton} onClick={() => handleNavigation("today")}>Today</button>
            <button style={styles.navButton} onClick={() => handleNavigation("next")}>Next →</button>
          </div>

          <div style={styles.viewTabs}>
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
        </div>

        {/* Main content */}
        <div style={styles.mainContent}>
          <div style={styles.calendarSection}>
            <div style={styles.dayPilotWrapper}>

              {/* Show calendar based on view */}
              {view === "day" && (
                <DayPilotCalendar
                  viewType="Day"
                  events={{ list: events }}
                  startDate={value}
                  durationBarVisible={false}
                  onTimeRangeSelected={onTimeRangeSelected}
                />
              )}

              {view === "week" && (
                <DayPilotCalendar
                  viewType="Week"
                  events={{ list: events }}
                  startDate={value}
                  durationBarVisible={false}
                  onTimeRangeSelected={onTimeRangeSelected}
                />
              )}

              {view === "month" && (
                <>
                  <h3 style={styles.monthHeader}>
                    {monthNames[value.getMonth()]} {value.getFullYear()}
                  </h3>
                  <DayPilotMonth
                    events={{ list: events }}
                    startDate={value.toISOString().split("T")[0]}
                    onTimeRangeSelected={onTimeRangeSelected}
                  />
                </>
              )}

              {view === "year" && (
                <div style={styles.placeholder}>
                  <p>Year view coming soon!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar tasks */}
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

        {/* Modal */}
        {showModal && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
              <h3>Add New Event</h3>

              <label style={modalStyles.label}>Event Name *</label>
              <input
                type="text"
                placeholder="Event name"
                value={newEventData.text}
                onChange={e => setNewEventData({ ...newEventData, text: e.target.value })}
                style={modalStyles.input}
              />

              <label style={modalStyles.label}>Start Time *</label>
              <input
                type="datetime-local"
                value={formatForDatetimeLocal(newEventData.start)}
                onChange={e => setNewEventData({ ...newEventData, start: e.target.value })}
                style={modalStyles.input}
              />

              <label style={modalStyles.label}>End Time *</label>
              <input
                type="datetime-local"
                value={formatForDatetimeLocal(newEventData.end)}
                onChange={e => setNewEventData({ ...newEventData, end: e.target.value })}
                style={modalStyles.input}
              />

              <label style={modalStyles.label}>Location</label>
              <input
                type="text"
                placeholder="Location"
                value={newEventData.location}
                onChange={e => setNewEventData({ ...newEventData, location: e.target.value })}
                style={modalStyles.input}
              />

              <label style={modalStyles.label}>Notes</label>
              <textarea
                placeholder="Notes"
                value={newEventData.notes}
                onChange={e => setNewEventData({ ...newEventData, notes: e.target.value })}
                style={{ ...modalStyles.input, height: "80px" }}
              />

              <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                <button onClick={addEvent} style={modalStyles.addButton}>Add Event</button>
                <button onClick={() => setShowModal(false)} style={modalStyles.cancelButton}>Cancel</button>
              </div>
            </div>
          </div>
        )}
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
  },
  controlsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "20px"
  },
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "320px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
  },
  label: {
    display: "block",
    marginTop: "10px",
    marginBottom: "4px",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  addButton: {
    backgroundColor: "#ee6dd5",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#333",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Calendar;
