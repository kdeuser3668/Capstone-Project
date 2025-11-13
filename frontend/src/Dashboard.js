import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useEffect } from "react";
import { TaskManager } from "./Tasks";
import { Progress } from "./Progress";
import { Timer } from "./Focus";
import './App.css';
import LoginForm from "./LoginForm";

function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();

  const monthNamesDate = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const formattedDate = `${monthNamesDate[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  const [showForm, setShowForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

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
            <button onClick={() => setShowForm(true)} className="button">
              {editingCourseId ? "" : "Add Course"}
            </button>
          )}
          </div>

        <div className="grid" style={{ flex: "flex" }}>

          <div className="card">
            <h2 className="h2">Your Day</h2>
            <h3 className="h3">Tasks</h3>
            <p style={{ fontSize: "1.2rem", color: "gray", textAlign: "center " }}>Coming soon...</p>
            <h3 className="h3">Calendar</h3>
            <p style={{ fontSize: "1.2rem", color: "gray", textAlign: "center " }}>Coming soon...</p>
          </div>


          <div className="card">
            <h2 className="h2">Progress</h2>
            <Progress />
          </div>


          <div className="card">
            <h2 className="h2">Completed Today</h2>
            <p style={{ fontSize: "1.2rem", color: "gray", textAlign: "center " }}>Coming soon...</p>
          </div>


          <div className="card">
            <h2 className="h2">Focus Timer</h2>
            <Timer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
