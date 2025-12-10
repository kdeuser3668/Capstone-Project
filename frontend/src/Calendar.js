import { useEffect, useState, useMemo, useCallback } from "react";
import Sidebar from './Sidebar';
import { DayPilotCalendar, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { DayPilot } from "@daypilot/daypilot-lite-react";
import './App.css';

function useCalendarEvents({ backendUrl, userId }) {
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);

  const courseColorMap = useMemo(() => {
    return Object.fromEntries(courses.map(c => [String(c.id), c.color_code]));
  }, [courses]);

  // Helpers
  const ensureIsoString = (v) => {
    if (!v && v !== 0) return null;

    // if it's already a Date object
    if (v instanceof Date) return v.toISOString();

    // if it's a number (timestamp)
    if (typeof v === "number") {
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d.toISOString();
    }

    // if it's an object with toISOString
    if (typeof v === "object" && typeof v.toISOString === "function") {
      return v.toISOString();
    }

    if (typeof v === "string") {
      let s = v.trim();

      // Common DB format "YYYY-MM-DD HH:MM:SS" -> normalize to "YYYY-MM-DDTHH:MM:SS"
      // Replace first space with T if it's between date and time.
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?/.test(s)) {
        s = s.replace(" ", "T");
      }

      // If there's no timezone info (no Z and no +HH:MM), assume UTC by appending Z
      if (!/[zZ]$/.test(s) && !/[+\-]\d{2}:\d{2}$/.test(s)) {
        s = s + "Z";
      }

      //test
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d.toISOString();
    }

    return null;
  };

  // Convert ISO (with timezone) -> value suitable for <input datetime-local>
  const isoToDatetimeLocal = (iso) => {
    if (!iso) return "";
    // Accept Date objects as well
    let normalizedIso = iso;
    if (iso instanceof Date) normalizedIso = iso.toISOString();
    const d = new Date(normalizedIso);
    if (isNaN(d.getTime())) return "";

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`; // seconds not required for inputs
  };

  // Convert datetime-local value (local wall-clock) to ISO string (UTC)
  const datetimeLocalToIso = (local) => {
    if (!local) return null;
    // local is like "YYYY-MM-DDTHH:MM" or "YYYY-MM-DDTHH:MM:SS"
    const d = new Date(local);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  };

  // Build a local "YYYY-MM-DDTHH:MM:SS" string (no timezone) for DayPilot to read as local time
  const buildLocalTimestamp = (dateStr, timeStr) => {
    if (!dateStr) return null;
    let time = timeStr || '00:00:00';
    if (time.length === 5) time = time + ':00';
    return `${dateStr}T${time}`; // no Z — interpreted as local
  };

  // Expand non-recurring DB row to DayPilot event
  const expandSingle = (row) => {
    const color = courseColorMap[String(row.course_id)] || '#a7d0fb';

    // if DB provided nonrecurring_start as a native string/ISO, pass it through;
    // if DayPilot prefers local timestamps, passing ISO with timezone preserves absolute instant.
    return [{
      id: `${row.id}`,
      text: row.event_name,
      start: row.nonrecurring_start || null,
      end: row.nonrecurring_end || row.nonrecurring_start || null,
      location: row.location,
      backColor: color,
      barColor: color,
      data: row // keep original DB row available under data
    }];
  };

  // Expand recurring DB row into instances
  const expandRecurring = (row) => {
    const out = [];
    const color = courseColorMap[String(row.course_id)] || '#a7d0fb';

    if (!row.start_date || !row.end_date || !row.weekday) return out;

    const start = new Date(row.start_date);
    const end = new Date(row.end_date);
    const weekday = parseInt(row.weekday, 10);

    let d = new Date(start);
    while (d <= end) {
      const jsWeek = d.getDay(); // 0 Sun
      const isoWeekday = jsWeek === 0 ? 7 : jsWeek;
      if (isoWeekday === weekday) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const startTime = row.start_time || '00:00:00';
        const endTime = row.end_time || startTime;

        out.push({
          id: `${row.id}-${dateStr}`,
          text: row.event_name,
          // use local timestamps (no timezone)
          start: buildLocalTimestamp(dateStr, startTime),
          end: buildLocalTimestamp(dateStr, endTime),
          location: row.location,
          backColor: color,
          barColor: color,
          data: row // original DB row included
        });
      }
      d.setDate(d.getDate() + 1);
    }

    return out;
  };

  const expandRowToInstances = (row) => {
    return row.recurring ? expandRecurring(row) : expandSingle(row);
  };

  // Load courses
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(`${backendUrl}/courses?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to load courses');
        const data = await res.json();
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    })();
  }, [backendUrl, userId]);

  // Load events from DB and expand
  const loadEvents = useCallback(async () => {
    if (!userId) {
      setEvents([]);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/calendar?userId=${userId}&_=${Date.now()}`);
      if (!res.ok) {
        console.error('Failed fetching calendar', await res.text());
        return;
      }
      const rows = await res.json();
      let instances = [];
      for (const r of rows) {
        instances = instances.concat(expandRowToInstances(r));
      }
      setEvents(instances);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  }, [backendUrl, userId, courseColorMap]);

  useEffect(() => {
    if (userId) {
      loadEvents();
    }
  }, [userId, loadEvents]);

  // Add event (DB handles storage)
  const addEvent = async (payload) => {
    if (!userId) throw new Error('No user');
    const res = await fetch(`${backendUrl}/calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    await loadEvents();
  };

  const updateEvent = async (id, payload) => {
    const res = await fetch(`${backendUrl}/calendar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    await loadEvents();
  };

  const deleteEvent = async (id) => {
    const res = await fetch(`${backendUrl}/calendar/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    await loadEvents();
  };

  return {
    events,
    setEvents,
    courses,
    setCourses,
    loadEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    // helpers for UI
    isoToDatetimeLocal,
    datetimeLocalToIso,
    buildLocalTimestamp,
    ensureIsoString
  };
}


function Calendar() {
  const backendUrl = "https://plannerpal-ex34i.ondigitalocean.app/capstone-project-backend";
  const rawUser = localStorage.getItem('user');
  let storedUser = null;
  try { storedUser = rawUser ? JSON.parse(rawUser) : null; } catch (e) { storedUser = null; }
  const userId = storedUser?.id || null;

  const now = new Date();
  const inOneHour = new Date(now.getTime() + 3600 * 1000);

  const [value, setValue] = useState(new Date());
  const [view, setView] = useState('month');
  const [showModal, setShowModal] = useState(false);
  const [newEventData, setNewEventData] = useState({});

  const {
    events,
    courses,
    loadEvents,
    addEvent: apiAddEvent,
    updateEvent: apiUpdateEvent,
    deleteEvent: apiDeleteEvent,
    isoToDatetimeLocal,
    datetimeLocalToIso,
    ensureIsoString
  } = useCalendarEvents({ backendUrl, userId });

  const addEvent = async () => {
    try {
      if (!userId) { alert('No user loaded'); return; }

      let body = { user_id: userId };

      if (newEventData.recurring) {
        if (!newEventData.weekday || !newEventData.start_date || !newEventData.end_date || !newEventData.start_time || !newEventData.end_time) {
          alert('Please fill recurring fields');
          return;
        }
        body = {
          ...body,
          event_name: newEventData.text,
          recurring: true,
          weekday: parseInt(newEventData.weekday, 10),
          start_time: newEventData.start_time.length === 5 ? newEventData.start_time + ':00' : newEventData.start_time,
          end_time: newEventData.end_time.length === 5 ? newEventData.end_time + ':00' : newEventData.end_time,
          start_date: newEventData.start_date,
          end_date: newEventData.end_date,
          location: newEventData.location,
          event_type: 'custom',
          notes: newEventData.notes,
          course_id: newEventData.course_id || null,
          nonrecurring_start: null,
          nonrecurring_end: null
        };
      } else {
        // convert local -> ISO for storage
        const ns = datetimeLocalToIso(newEventData.start);
        const ne = datetimeLocalToIso(newEventData.end);
        if (!ns || !ne) { alert('Invalid start or end time'); return; }
        if (new Date(ne) <= new Date(ns)) { alert('End must be after start'); return; }
        body = {
          ...body,
          event_name: newEventData.text,
          recurring: false,
          nonrecurring_start: ns,
          nonrecurring_end: ne,
          location: newEventData.location,
          event_type: 'custom',
          notes: newEventData.notes,
          course_id: newEventData.course_id || null
        };
      }

      await apiAddEvent(body);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Error saving event');
    }
  };

  const updateEvent = async () => {
    try {
      if (!newEventData.dbId) { alert('No event selected'); return; }

      let body = {};
      if (newEventData.recurring) {
        body = {
          event_name: newEventData.text,
          recurring: true,
          weekday: parseInt(newEventData.weekday, 10),
          start_time: newEventData.start_time.length === 5 ? newEventData.start_time + ':00' : newEventData.start_time,
          end_time: newEventData.end_time.length === 5 ? newEventData.end_time + ':00' : newEventData.end_time,
          start_date: newEventData.start_date,
          end_date: newEventData.end_date,
          location: newEventData.location,
          event_type: 'custom',
          notes: newEventData.notes,
          course_id: newEventData.course_id || null,
          nonrecurring_start: null,
          nonrecurring_end: null
        };
      } else {
        const ns = datetimeLocalToIso(newEventData.start);
        const ne = datetimeLocalToIso(newEventData.end);
        if (!ns || !ne) { alert('Invalid start or end time'); return; }
        if (new Date(ne) <= new Date(ns)) { alert('End must be after start'); return; }
        body = {
          event_name: newEventData.text,
          recurring: false,
          nonrecurring_start: ns,
          nonrecurring_end: ne,
          location: newEventData.location,
          event_type: 'custom',
          notes: newEventData.notes,
          course_id: newEventData.course_id || null
        };
      }

      await apiUpdateEvent(newEventData.dbId, body);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Error updating event');
    }
  };

  const deleteEvent = async () => {
    if (!newEventData.dbId) { alert('No event selected'); return; }
    if (!window.confirm('Delete this event? This will remove all instances of the event selected (includes recurring).')) return;
    try {
      await apiDeleteEvent(newEventData.dbId);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Error deleting event');
    }
  };

  // Modal defaults for Add Event
  const openAddModal = () => {
    setNewEventData({
      dbId: null,
      text: '',
      location: '',
      notes: '',
      start: isoToDatetimeLocal(now.toISOString()),
      end: isoToDatetimeLocal(inOneHour.toISOString()),
      recurring: false,
      weekday: '',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      course_id: ''
    });
    setShowModal(true);
  };

  // Handlers
  const onTimeRangeSelected = (args) => {
    // args.start/args.end might be Date objects or ISO strings depending on DayPilot
    const startIso = ensureIsoString(args.start?.toString ? args.start.toString() : args.start);
    const endIso = ensureIsoString(args.end?.toString ? args.end.toString() : args.end);

    setNewEventData({
      dbId: null,
      text: '',
      location: '',
      notes: '',
      start: isoToDatetimeLocal(startIso),
      end: isoToDatetimeLocal(endIso),
      recurring: false,
      course_id: ''
    });
    setShowModal(true);
  };

  // Use the original DB row (if present) when opening edit modal.
  const onEventClick = (args) => {
    // DayPilot may provide:
    // args.e.data -> the event instance (with .data = original row for recurring)
    // args.e.data.data -> original DB row (for recurring instances we added)
    // args.e -> sometimes contains the DB row directly
    const ev = args.e || args;
    const raw = ev?.data?.data || ev?.data || ev;

    // If raw is one of the expanded instances (has start/end but no DB fields),
    // try to fall back to the original row stored in ev.data
    const dbRow = ev?.data?.data ? ev.data.data : (raw && raw.event_name ? raw : (ev?.data || ev));

    const recurring = !!dbRow.recurring;

    if (recurring) {
      setNewEventData({
        dbId: dbRow.id,
        text: dbRow.event_name || "",
        location: dbRow.location || '',
        notes: dbRow.notes || '',
        recurring: true,
        weekday: dbRow.weekday ? String(dbRow.weekday) : '',
        start_date: dbRow.start_date || '',
        end_date: dbRow.end_date || '',
        start_time: dbRow.start_time ? dbRow.start_time.slice(0,5) : '',
        end_time: dbRow.end_time ? dbRow.end_time.slice(0,5) : '',
        course_id: dbRow.course_id || ''
      });
    } else {
      // Normalize value to ISO string first, then to datetime-local
      const ns = ensureIsoString(dbRow.nonrecurring_start);
      const ne = ensureIsoString(dbRow.nonrecurring_end || dbRow.nonrecurring_start);

      setNewEventData({
        dbId: dbRow.id,
        text: dbRow.event_name || "",
        location: dbRow.location || '',
        notes: dbRow.notes || '',
        start: isoToDatetimeLocal(ns),
        end: isoToDatetimeLocal(ne),
        recurring: false,
        course_id: dbRow.course_id || ''
      });
    }

    setShowModal(true);
  };

  // Navigation
  const handleNavigation = (direction) => {
    const newDate = new Date(value);
    if (direction === 'today') { setValue(new Date()); return; }
    if (view === 'day') newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    if (view === 'week') newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    if (view === 'month') newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setValue(newDate);
  };

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // Provide formatForDatetimeLocal for your unchanged JSX (it returns a valid datetime-local string when passed a Date)
  const formatForDatetimeLocal = (dateObj) => {
    if (!dateObj) return "";
    const d = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  // UI rendering
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        {/* Header */}
        <div style={styles.header}>
          <h1 className="h1">Calendar</h1>
          <h3 className="h3">
            {monthNames[value.getMonth()]} {value.getFullYear()}
          </h3>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "nowrap" // puts all buttons in line w/ each other
        }}>
          {/* left: nav buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="button" onClick={() => handleNavigation("prev")}>← Prev</button>
            <button className="button" onClick={() => handleNavigation("today")}>Today</button>
            <button className="button" onClick={() => handleNavigation("next")}>Next →</button>
          </div>

          {/* center: view tabs */}
          <div style={{ display: "flex", gap: "10px" }}>
            {["day", "week", "month"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`button ${view === v ? styles.activeView : ""}`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* right: add Event */}
          <div>
            <button
              className="button"
              onClick={() => {
                setNewEventData({
                  dbId: null,
                  text: "",
                  location: "",
                  notes: "",

                  start: formatForDatetimeLocal(now),
                  end: formatForDatetimeLocal(inOneHour),

                  recurring: false,
                  weekday: "",
                  start_date: "",
                  end_date: "",
                  start_time: "",
                  end_time: "",
                  course_id: ""
                });
                setShowModal(true);
              }}
            >
              + Add Event
            </button>
          </div>
        </div>


        {/* Main content */}
        <div style={styles.mainContent}>
          <div style={styles.calendarSection}>
            <div style={styles.dayPilotWrapper}>

              {view === "day" && (
                <DayPilotCalendar
                  viewType="Day"
                  events={{ list: events }}
                  startDate={value.toLocaleDateString("en-CA")}
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
                  startDate={value.toLocaleDateString("en-CA")}
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
                    startDate={value.toLocaleDateString("en-CA")}
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
