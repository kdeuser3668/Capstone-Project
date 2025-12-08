import { use, useState } from "react";
import Sidebar from './Sidebar';
import { useEffect } from "react";
import { TaskManager } from "./Tasks";
import { useNavigate } from 'react-router-dom';
import { Progress } from "./Progress";
import { Timer } from "./Focus";
import { Courses } from "./Courses";
import './App.css';

const backendUrl = "https://plannerpal-ex34i.ondigitalocean.app/capstone-project-backend";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingCourse, setEditingCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  //const [courseColor, setCourseColor] = useState(editingCourse?.color_code || "#a7d0fb");
  const [showPopup, setShowPopup] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  // get local "YYYY-MM-DD" for today
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const todayStr = `${yyyy}-${mm}-${dd}`;

// parse stored events safely
const rawEvents = localStorage.getItem("events");
let savedEvents = [];
try {
  savedEvents = rawEvents ? JSON.parse(rawEvents) : [];
} catch (e) {
  console.error("Bad events JSON in localStorage:", rawEvents);
  savedEvents = [];
}

// filter events for today (local date)
const eventsToday = savedEvents.filter(ev => {
  if (!ev.start) return false;
  const evDate = new Date(ev.start);
  const evYear = evDate.getFullYear();
  const evMonth = String(evDate.getMonth() + 1).padStart(2, "0");
  const evDay = String(evDate.getDate()).padStart(2, "0");
  const evLocalDateStr = `${evYear}-${evMonth}-${evDay}`;
  return evLocalDateStr === todayStr;
});


  function to12Hour(time){
    let [hour, minute] = time.split(":");
    hour = parseInt(hour);

    const ampm = hour >= 12 ? "PM":"AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`
  }

  //load tasks for your day
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    if (!userId) return;
  
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${backendUrl}/tasks?userId=${userId}&_=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("raw backend tasks:", data);
        const mapped = data.map(t => ({
          id: t.id,
          task: t.assignment_name,
          deadline: t.due_datetime,
          priority: t.priority,
          courseId: t.course_id,
          done: t.completion
        }));
        setTasks(mapped);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    };
  
    fetchTasks();
  }, [userId]);

  const todayDate = new Date();
  const tasksDueToday = tasks.filter(t => {
    if (!t.deadline) return false;
    const taskDate = new Date(t.deadline);
    return (
      taskDate.getFullYear() === todayDate.getFullYear() &&
      taskDate.getMonth() === todayDate.getMonth() &&
      taskDate.getDate() === todayDate.getDate() &&
      !t.done
    );
  });

  //stop getting the wrong time (previously showed +6 hours)
  function formatTaskTime(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString); // converts UTC → local
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes.toString().padStart(2, "0");
    return `${hours}:${minutes} ${ampm}`;
  }
  

//loads courses
useEffect(() => {
    if (!userId) return;

    fetch(`${backendUrl}/courses?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
          console.log("Fetched courses:", data);
          setCourses(Array.isArray(data) ? data : []); // fallback to empty array
      })
      .catch(err => console.error("Failed to load courses:", err));
}, [userId]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  async function saveCourse(course) {
  try {
    const courseToSave = {
      ...course,
      user_id: userId
    };

    console.log("SAVECOURSE SENDS:", courseToSave);

    let saved;

    if (course.id) {
      // UPDATE
      const res = await fetch(`${backendUrl}/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseToSave),
      });
      saved = await res.json();
      setCourses(prev => prev.map(c => (c.id === saved.id ? saved : c)));
    } else {
      // CREATE
      const res = await fetch(`${backendUrl}/courses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseToSave),
      });
      saved = await res.json();
      setCourses(prev => [...prev, saved]);
    }

    setShowPopup(false);
    setEditingCourse(null);
  } catch (err) {
    console.error("Failed to save course:", err);
    alert("Failed to save course");
  }
  }



  async function deleteCourse(id) {
    await fetch(`${backendUrl}/courses/${id}`, {method:"DELETE"});
    setCourses(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="container">
    <Sidebar />
      <div className="main-content">
      <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}>
          <div>
            <h1 className="h1">Dashboard</h1>
            <h3 className="h3">Hello, {username || "User"}!</h3>
          </div>

          {!showForm && (
            <button onClick={() => {setEditingCourse(null); setShowPopup(true);}} className="button">
              + Add Course
            </button>
          )}
          </div>

        <div className="grid">

          <div className="card" style={{ flex: "1",  }}>
            <h2 className="h2">Your Day</h2>
            <h3 className="h3">Tasks</h3>
            {tasksDueToday.length === 0 ? (
                <p className="p">No tasks due today.</p>
              ) : (
                <div>
                  {tasksDueToday.map(task => (
                    <p className="p" key={task.id} style={{ marginBottom: "1rem" }}>
                      <div className="card" style={{ border: "solid 1px lightgrey", boxShadow: "none", padding: '1rem'}}>
                      <strong>{task.task}</strong><br />
                      Priority: {task.priority}<br />
                      Due: {formatTaskTime(task.deadline)}
                      </div>
                    </p>
                  ))}
                </div>
              )}
            <h3 className="h3">Calendar</h3>
            {eventsToday.length === 0? (
              <p className="p">No events today.</p>
            ): (
              <div>
                {eventsToday.map(ev => (
                  <p className="p" key={ev.id}>
                    <div className="card" style={{ border: "solid 1px lightgrey", boxShadow: "none", padding: '1rem'}}>
                    <strong>{ev.text}</strong><br />
                    {to12Hour(ev.start.split("T")[1].slice(0,5))} - {to12Hour(ev.end.split("T")[1].slice(0,5))}
                    </div>
                  </p>
                ))}
              </div>
            )}
          </div>


          <div className="card">
            <h2 className="h2">Progress</h2>
            <Progress />
          </div>


          <div className="card">
            <h2 className="h2">Focus Timer</h2>
            <Timer />
          </div>

          <div className="card">
            <h2 className="h2">{username || "User"}'s Courses</h2>
            {courses.length === 0 && <p className="p" style={{color: "gray"}}>No courses added yet.</p>}
                {courses.map(c => (
                <div>
                  <p className="p" key={c.id}>
                  <div className="card" style={{ border: "solid 1px lightgrey", boxShadow: "none", padding: '1rem'}}>
                    <strong>{c.course_name}</strong>
                    <br />
                    {c.course_code}
                    <br />
                    {c.instructor_name}
                    <br />
                    {c.course_semester}
                    <br />
                    <button className="button" style={{margin: ".5rem"}} onClick={() => {setEditingCourse(c); setShowPopup(true);}}>Edit</button>
                    <button className="button" style={{margin: ".5rem"}} onClick={() => {deleteCourse(c.id)}}>Delete</button>
                    </div>
                  </p>
                </div>
                ))}
            </div>
            <Courses 
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            saveCourse={saveCourse}
            editingCourse={editingCourse}
            deleteCourse={deleteCourse}
          /> 
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
