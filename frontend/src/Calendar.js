import { useEffect, useState, useMemo } from "react";
import Sidebar from './Sidebar';
import { DayPilotCalendar, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { DayPilot } from "@daypilot/daypilot-lite-react";
import './App.css';

function Calendar() {
  const [value, setValue] = useState(new Date());
  const [view, setView] = useState("month");

  const backendUrl = "https://plannerpal-ex34i.ondigitalocean.app/capstone-project-backend";
  const rawUser = localStorage.getItem("user");
  let storedUser = null;

  try {
    storedUser = rawUser ? JSON.parse(rawUser) : null;
  } catch (err) {
    console.error("Invalid user JSON:", rawUser);
    storedUser = null;
  }

  const userId = storedUser?.id || null;


  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);

  const courseColorMap = useMemo(() => {
    return Object.fromEntries(courses.map(c => [String(c.id), c.color_code]));
  }, [courses]);

  useEffect(() => {
    if (!userId) return;
    fetch(`${backendUrl}/courses?userId=${userId}`)
      .then(r => r.json())
      .then(setCourses)
      .catch(e => console.error("failed to load courses", e));
  }, [userId]);

  // ensure course colors stay updated when courses change
  useEffect(() => {
    if (courses.length && events.length) {
      setEvents(prevEvents =>
        prevEvents.map(ev => ({
          ...ev,
          backColor: courseColorMap[String(ev.course_id)] || "#a7d0fb",
          barColor: courseColorMap[String(ev.course_id)] || "#a7d0fb",
        }))
      );
    }
  }, [courses, courseColorMap]);

  useEffect(() => {
  try {
    const raw = localStorage.getItem("events");
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      setEvents(parsed);
    }
  } catch (err) {
    console.error("Invalid events JSON:", err);
    setEvents([]);
  }
  }, []);

  
  useEffect(() => {
  if (!userId) return;
  if (courses.length > 0) {
    loadEventsFromDB();
  }
  }, [userId, courses]);

  


  const [showModal, setShowModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    dbId: null,         // ID of calendar row (for editing)
    text: "",
    location: "",
    notes: "",
    // one-off:
    start: "",
    end: "",
    // recurring:
    recurring: false,
    weekday: "",       // 1..7
    start_date: "",
    end_date: "",
    start_time: "",    // "HH:MM"
    end_time: "",      // "HH:MM"
    course_id: "",
    color_code: ""
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helpers: time & instance expansion
  function normalizeTime(t) {
    if (!t) return "00:00:00";
    return String(t).split(".")[0];
  }

  // make ISO "YYYY-MM-DDTHH:MM:SS"
  function makeIso(dateStr, timeStr) {
    if (!dateStr) return null;
    let t = timeStr || "00:00:00";
    if (t.length === 5) t = t + ":00";
    const d = new Date(`${dateStr}T${t}`);
    return d.toISOString();  //DayPilot-friendly
  }

  // Convert datetime-local value (YYYY-MM-DDTHH:mm) to ISO string
  function dtLocalToIso(dtLocal) {
    if (!dtLocal) return null;
    // create Date from local string and convert to ISO (timestamptz)
    const d = new Date(dtLocal);
    return d.toISOString();
  }

  // Convert ISO to "YYYY-MM-DDTHH:mm" for <input datetime-local>
  const formatForDatetimeLocal = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  //function to format time correctly in input section on calendar
  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return "";
    if (timeStr.length >= 5) return timeStr.slice(0,5);
    return timeStr;
  }

  // weekday mapping helper: JS getDay() -> ISO weekday (1=Mon..7=Sun)
  function isoWeekdayOf(jsDate) {
    const d = jsDate.getDay(); // 0 = Sun
    return d === 0 ? 7 : d;
  }

  // Expands a DB row into one or more DayPilot instances
  function expandRowToInstances(row) {
    const out = [];

    // get course color
    const courseColor = courseColorMap[String(row.course_id)] || "#a7d0fb";

    // ONE-OFF (nonrecurring) stored with timestamptz
    if (!row.recurring) {
      if (row.nonrecurring_start) {
        // Use the DB-provided timestamptz directly (it will include tz)
        out.push({
          id: `${row.id}`, // unique
          text: row.event_name,
          start: new Date(row.nonrecurring_start).toISOString(),
          end: row.nonrecurring_end
            ? new Date(row.nonrecurring_end).toISOString()
            : new Date(row.nonrecurring_start).toISOString(),
          location: row.location,
          backColor: courseColor,
          barColor: courseColor,
          data: row
        });
      }
      return out;
    }

    // RECURRING: expand between start_date and end_date for the given weekday
    // weekday is stored as integer 1-7 (1=Mon)
    if (row.start_date && row.end_date && row.weekday) {
      const start = new Date(row.start_date);
      const end = new Date(row.end_date);
      const weekday = parseInt(row.weekday, 10);

      let d = new Date(start);
      while (d <= end) {
        if (isoWeekdayOf(d) === weekday) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          const dateStr = `${yyyy}-${mm}-${dd}`;

          // row.start_time / end_time expected as "HH:MM:SS" or "HH:MM"
          let startTime = row.start_time || "00:00:00";
          let endTime = row.end_time || startTime;

          // ensure seconds
          if (startTime.length === 5) startTime = startTime + ":00";
          if (endTime.length === 5) endTime = endTime + ":00";

          out.push({
            id: `${row.id}-${dateStr}`, // unique per instance
            text: row.event_name,
            start: makeIso(dateStr, startTime),
            end: makeIso(dateStr, endTime),
            location: row.location,
            backColor: courseColor,
            barColor: courseColor,
            data: row
          });
        }
        d.setDate(d.getDate() + 1);
      }
    } else {
      // fallback single instance using start_date/start_time (if present)
      if (row.start_date) {
        let st = row.start_time || "00:00:00";
        let et = row.end_time || st;
        if (st.length === 5) st += ":00";
        if (et.length === 5) et += ":00";
        out.push({
          id: `${row.id}`,
          text: row.event_name,
          start: makeIso(row.start_date, st),
          end: makeIso(row.start_date, et),
          location: row.location,
          backColor: courseColor,
          barColor: courseColor,
          data: row
        });
      }
    }

    return out;
  }

  // Load events from DB and expand recurring rows to instances
  async function loadEventsFromDB() {
    if (!userId) {
      setEvents([]);
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/calendar?userId=${userId}&_=${Date.now()}`);
      if (!res.ok) {
        console.error("Failed fetching calendar", await res.text());
        return;
      }
      const rows = await res.json();
      let instances = [];
      for (const r of rows) {
        const ins = expandRowToInstances(r);
        instances = instances.concat(ins);
      }
      //testing statements
      //console.log("RAW rows:", rows);
      //console.log("EXPANDED instances:", instances);

      setEvents(instances);
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  }

  useEffect(() => {
    if (userId) loadEventsFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Navigation handler
  const handleNavigation = (direction) => {
    const newDate = new Date(value);

    if (direction === "today") {
      setValue(new Date());
      return;
    }

    if (view === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : direction === "prev" ? -1 : 0));
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : direction === "prev" ? -7 : 0));
    } else if (view === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : direction === "prev" ? -1 : 0));
    }

    setValue(newDate);
  };

  // Event interactions: selection, click, add, update, delete
  // on selection: open modal prefilled for one-off
  const onTimeRangeSelected = (args) => {
    // args.start / args.end may be DayPilot objects or ISO strings depending on version.
    const startIso = args.start ? (args.start.toString ? args.start.toString() : args.start) : "";
    const endIso = args.end ? (args.end.toString ? args.end.toString() : args.end) : "";

    setNewEventData({
      dbId: null,
      text: "",
      location: "",
      notes: "",
      start: formatForDatetimeLocal(args.start), // store local-usable format
      end: formatForDatetimeLocal(args.end),
      recurring: false,
      weekday: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      course_id: ""
    });
    setShowModal(true);
  };

  // on event click: open modal for editing (loads DB row via event.data)
  const onEventClick = (args) => {
    const ev = args.e?.data || args.e || args;
    const row = ev.data || ev;
    const recurring = !!row.recurring;
    const course = courses.find(c => c.id === row.course_id);
    const courseColor = course?.color_code || "#a7d0fb";

    if (recurring) {
      setNewEventData({
        dbId: row.id,
        text: row.event_name,
        location: row.location || "",
        notes: row.notes || "",
        start: "",
        end: "",
        recurring: true,
        weekday: row.weekday ? String(row.weekday) : "",
        start_date: row.start_date || "",
        end_date: row.end_date || "",
        start_time: row.start_time ? row.start_time.slice(0,5) : "",
        end_time: row.end_time ? row.end_time.slice(0,5) : "",
        course_id: row.course_id || "",
        course_color: courseColor
      });
    } else {
      setNewEventData({
        dbId: row.id,
        text: row.event_name,
        location: row.location || "",
        notes: row.notes || "",
        start: row.nonrecurring_start ? formatForDatetimeLocal(row.nonrecurring_start) : "",
        end: row.nonrecurring_end ? formatForDatetimeLocal(row.nonrecurring_end) : "",
        recurring: false,
        weekday: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        course_id: row.course_id || "",
        color_code: courseColor
      });
    }

    setShowModal(true);
  };

  // Add a new event (recurring or one-off)
  const addEvent = async () => {
    try {
      if (!userId) {
        alert("No user loaded");
        return;
      }

      let body = { user_id: userId };

      if (newEventData.recurring) {
        if (!newEventData.weekday || !newEventData.start_date || !newEventData.end_date || !newEventData.start_time || !newEventData.end_time) {
          alert("Please fill recurring fields: weekday, start/end date and start/end times.");
          return;
        }

        // ensure times are stored as HH:MM:SS
        const st = newEventData.start_time.length === 5 ? newEventData.start_time + ":00" : newEventData.start_time;
        const et = newEventData.end_time.length === 5 ? newEventData.end_time + ":00" : newEventData.end_time;

        body = {
          ...body,
          event_name: newEventData.text,
          recurring: true,
          weekday: parseInt(newEventData.weekday, 10),
          start_time: st,
          end_time: et,
          start_date: newEventData.start_date,
          end_date: newEventData.end_date,
          location: newEventData.location,
          event_type: "custom",
          notes: newEventData.notes,
          course_id: newEventData.course_id || null,
          nonrecurring_start: null,
          nonrecurring_end: null,
        };
      } else {
        let startIso = newEventData.start;
        let endIso = newEventData.end;

        // Fix reversed ranges
        if (new Date(endIso) < new Date(startIso)) {
          endIso = startIso;
        }

        body = {
          ...body,
          event_name: newEventData.text,
          recurring: false,
          nonrecurring_start: startIso,
          nonrecurring_end: endIso,
          location: newEventData.location,
          event_type: "custom",
          notes: newEventData.notes,
          course_id: newEventData.course_id || null
        };
      }
      
      console.log("AddEvent called, userId:", userId);
      console.log("Event body:", body);


      const res = await fetch(`${backendUrl}/calendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        console.error("Failed to save event:", await res.text());
        alert("Failed to save event");
        return;
      }

      setShowModal(false);
      await loadEventsFromDB();
    } catch (err) {
      console.error(err);
      alert("Error saving event");
    }
  };

  // Update existing DB row (PUT)
  const updateEvent = async () => {
    if (!newEventData.dbId) {
      alert("No event selected to update");
      return;
    }

    try {
      let body = {};

      if (newEventData.recurring) {
        const st = newEventData.start_time.length === 5 ? newEventData.start_time + ":00" : newEventData.start_time;
        const et = newEventData.end_time.length === 5 ? newEventData.end_time + ":00" : newEventData.end_time;

        body = {
          event_name: newEventData.text,
          recurring: true,
          weekday: parseInt(newEventData.weekday, 10),
          start_time: st,
          end_time: et,
          start_date: newEventData.start_date,
          end_date: newEventData.end_date,
          location: newEventData.location,
          event_type: "custom",
          notes: newEventData.notes,
          course_id: newEventData.course_id || null,
          nonrecurring_start: null,
          nonrecurring_end: null
        };
      } else {
        body = {
          event_name: newEventData.text,
          recurring: false,
          nonrecurring_start: newEventData.start,
          nonrecurring_end: newEventData.end,
          location: newEventData.location,
          event_type: "custom",
          notes: newEventData.notes,
          course_id: newEventData.course_id || null
        };
      }

      const res = await fetch(`${backendUrl}/calendar/${newEventData.dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        console.error("Failed to update event:", await res.text());
        alert("Failed to update event");
        return;
      }

      setShowModal(false);
      await loadEventsFromDB();
    } catch (err) {
      console.error(err);
      alert("Error updating event");
    }
  };

  // Delete existing event row (DELETE)
  const deleteEvent = async () => {
    if (!newEventData.dbId) {
      alert("No event selected to delete");
      return;
    }

    if (!window.confirm("Delete this event? This will remove the DB row (all instances for recurring events).")) return;

    try {
      const res = await fetch(`${backendUrl}/calendar/${newEventData.dbId}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        console.error("Failed to delete:", await res.text());
        alert("Failed to delete event");
        return;
      }
      setShowModal(false);
      await loadEventsFromDB();
    } catch (err) {
      console.error(err);
      alert("Error deleting event");
    }
  };

  // UI rendering
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content page">
        {/* Header */}
        <div style={styles.header}>
          <h1 className="h1">Calendar</h1>
          <h3 className="h3">
            {monthNames[value.getMonth()]} {value.getFullYear()}
          </h3>
        </div>

        {/* Navigation */}
        <div style={styles.controlsWrapper}>
          <div style={styles.navBar}>
            <button className="button" onClick={() => handleNavigation("prev")}>← Prev</button>
            <button className="button" onClick={() => handleNavigation("today")}>Today</button>
            <button className="button" onClick={() => handleNavigation("next")}>Next →</button>
          </div>

          <div style={styles.viewTabs}>
            {["day", "week", "month"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`button ${view === v ? styles.active-view : ""}`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Add Event button */}
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <button
            className="button"
            onClick={() => {
              setNewEventData({
                dbId: null,
                text: "",
                location: "",
                notes: "",
                start: formatForDatetimeLocal(new Date().toISOString()),
                end: formatForDatetimeLocal(new Date(Date.now() + 3600 * 1000).toISOString()),
                recurring: false,
                weekday: "",
                start_date: "",
                end_date: "",
                start_time: "",
                end_time: "",
                course_id: ""
              });
              setShowModal(true);
            }}>
            + Add Event
          </button>
        </div>

        {/* Main content */}
        <div style={styles.mainContent}>
          <div style={styles.calendarSection}>
            <div style={styles.dayPilotWrapper}>

              {view === "day" && (
                <DayPilotCalendar
                  viewType="Day"
                  events={{ list: events }}
                  startDate={value.toISOString().split("T")[0]}
                  durationBarVisible={false}
                  onTimeRangeSelected={onTimeRangeSelected}
                  onEventClick={onEventClick}
                  {...{ key: value }}
                />
              )}

              {view === "week" && (
                <DayPilotCalendar
                  viewType="Week"
                  events={{ list: events }}
                  startDate={value.toISOString().split("T")[0]}
                  durationBarVisible={false}
                  onTimeRangeSelected={onTimeRangeSelected}
                  onEventClick={onEventClick}
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
                    onEventClick={onEventClick}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
              <h3>{newEventData.dbId ? "Edit Event" : "Add New Event"}</h3>

              <label style={modalStyles.label}>Event Name *</label>
              <input
                type="text"
                placeholder="Event name"
                value={newEventData.text}
                onChange={e => setNewEventData({ ...newEventData, text: e.target.value })}
                style={modalStyles.input}
              />

              {/* Course dropdown (optional for both one-off & recurring) */}
              <label style={modalStyles.label}>Course (optional)</label>
              <select
                style={modalStyles.input}
                value={newEventData.course_id}
                onChange={e => setNewEventData({ ...newEventData, course_id: e.target.value })}
              >
                <option value="">No Course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
              </select>

              {/* Recurring toggle */}
              <label style={modalStyles.label}>
                <input
                  type="checkbox"
                  checked={newEventData.recurring}
                  onChange={e => setNewEventData({ ...newEventData, recurring: e.target.checked })}
                  style={{ marginRight: 8 }}
                />
                Recurring Event
              </label>

              {/* Recurring fields */}
              {newEventData.recurring ? (
                <>
                  <label style={modalStyles.label}>Weekday</label>
                    <select
                      style={modalStyles.input}
                      value={newEventData.weekday}
                      onChange={e =>
                        setNewEventData({ ...newEventData, weekday: e.target.value })
                      }
                    >
                      <option value="">Select day</option>
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thursday</option>
                      <option value="5">Friday</option>
                      <option value="6">Saturday</option>
                      <option value="7">Sunday</option>
                    </select>
                  <label style={modalStyles.label}>Start Date</label>
                  <input
                    type="date"
                    value={newEventData.start_date}
                    onChange={e => setNewEventData({ ...newEventData, start_date: e.target.value })}
                    style={modalStyles.input}
                  />

                  <label style={modalStyles.label}>End Date</label>
                  <input
                    type="date"
                    value={newEventData.end_date}
                    onChange={e => setNewEventData({ ...newEventData, end_date: e.target.value })}
                    style={modalStyles.input}
                  />

                  <label style={modalStyles.label}>Start Time</label>
                  <input
                    type="time"
                    value={newEventData.start_time}
                    onChange={e => setNewEventData({ ...newEventData, start_time: e.target.value })}
                    style={modalStyles.input}
                  />

                  <label style={modalStyles.label}>End Time</label>
                  <input
                    type="time"
                    value={newEventData.end_time}
                    onChange={e => setNewEventData({ ...newEventData, end_time: e.target.value })}
                    style={modalStyles.input}
                  />
                </>
              ) : (
                <>
                  <label style={modalStyles.label}>Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={newEventData.start}
                    onChange={e => setNewEventData({ ...newEventData, start: e.target.value })}
                    style={modalStyles.input}
                  />

                  <label style={modalStyles.label}>End Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={newEventData.end}
                    onChange={e => setNewEventData({ ...newEventData, end: e.target.value })}
                    style={modalStyles.input}
                  />
                </>
              )}

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
                {newEventData.dbId ? (
                  <>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="button" onClick={updateEvent}>Save Changes</button>
                      <button className="button" onClick={deleteEvent} style={{ backgroundColor: "#f44336", color: "white" }}>Delete</button>
                    </div>
                  </>
                ) : (
                  <button type="button" onClick={addEvent} className="button">Add Event</button>
                )}
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
    justifyContent: "center",
    width: "100%",
    marginTop: "10px"
  },
  calendarSection: {
    width: "100%",
    maxWidth: "900px"
  },
  dayPilotWrapper: {
    width: "100%",
    minHeight: "500px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
    borderRadius: "8px",
    overflow: "hidden"
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
  activeView: {
    backgroundColor: "#ee6dd5",
    color: "white",
    borderColor: "#ee6dd5"
  }
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
    width: "360px",
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
