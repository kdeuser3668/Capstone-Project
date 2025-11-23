import { use, useState } from "react";
import Sidebar from './Sidebar';
import { useEffect } from "react";
import { TaskManager } from "./Tasks";
import { useNavigate } from 'react-router-dom';
import { Progress } from "./Progress";
import { Timer } from "./Focus";
import { Courses } from "./Courses";
import './App.css';

const backendUrl = "http://localhost:5050";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingCourse, setEditingCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  //load events
  const today = new Date().toISOString().split("T")[0];
  const savedEvents = JSON.parse(localStorage.getItem("events")) || [];

  const eventsToday = savedEvents.filter(ev => {
    const evDate = ev.start.split("T")[0];
    return evDate === today;
  })

  //load tasks
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks)
  }, []);
  //const today = new Date().toISOString().split("T")[0];
  const tasksDueToday = tasks.filter( t => t.deadline === today && !t.done );

  //loads courses
  useEffect(() => {
    if (!userId) return;
    fetch(`${backendUrl}/courses?userID=${userId}`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Failed to load courses:", err));
  }, [userId]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  async function saveCourse(course) {
    try{
      let saved;
      if (course.id){
        //update
        const res = await fetch(`${backendUrl}/course/${course.id}`,{
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(course),
        });
        saved = await res.json();
        setCourses(prev => prev.map(c => c.id === saved.id ? saved : c));

      }else{
        //new
        const res = await fetch(`${backendUrl}/course/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({...course, user_id: userId})
        });
        saved = await res.json();
        setCourses(prev => [...prev, saved]);
      }

      setShowPopup(false);
      setEditingCourse(null);
    }catch(err){
      console.error("Failed to save course:", err);
      alert("Failed to save course")
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
              Add Course
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
              <ul className="ul">
              {tasksDueToday.map(task => (
                <li className="li" key={task.id}>
                  <strong>{task.task}</strong>
                  <br />
                  Priority: {task.priority}
                  <br />
                  Due: {task.deadline}
                </li>
              ))}
            </ul>
            )}
            <h3 className="h3">Calendar</h3>
            {eventsToday.length === 0? (
              <p className="p">No events today.</p>
            ): (
              <ul className="ul">
                {eventsToday.map(ev => (
                  <li className="li" key={ev.id}>
                    <strong>{ev.text}</strong><br />
                    {ev.start.split("T")[1].slice(0,5)} - {ev.end.split("T")[1].slice(0,5)}
                  </li>
                ))}
              </ul>
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
                  <p className="p" key={c.id}>
                    {c.id} 
                    <strong>{c.course_name}</strong>
                    <br />
                    {c.course_code}
                    <br />
                    {c.instructor_name}
                    <br />
                    {c.course_semester}
                    <br />
                    <button className="button" onClick={() => {setEditingCourse(c); setShowPopup(true);}}>Edit</button>
                    <button className="button" onClick={() => {deleteCourse(c.id)}}>Delete</button>
                  </p>
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
