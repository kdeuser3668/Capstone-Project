import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Tasks from "./Tasks";
import Progress from "./Progress";
import './App.css';

function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();

  const monthNamesDate = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formattedDate = `${monthNamesDate[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  // Local state (optional for later use)
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  return (
    <div className="container">
    <Sidebar />
      <div className="main-content">
          <div>
            <h1 className="h1">Dashboard</h1>
            <h3 className="h3">{formattedDate}</h3>
          </div>

          {/* Add Task Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "0.5rem 1.2rem",
                fontSize: "1rem",
                backgroundColor: "var(--button-color, #ee6dd5)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {editingTaskId ? "Edit Task" : "Create Task"}
            </button>
          )}

        <div className="grid" style={{ flex: "flex" }}>

          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}>
            <h2 style={{ color: "var(--text-color)" }}>Progress</h2>
          </div>


          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}>
            <h2 style={{ color: "var(--text-color)" }}>Your Tasks</h2>
          </div>


          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}>
            <h2 style={{ color: "var(--text-color)" }}>Completed Today</h2>
            <p style={{ fontSize: "1.2rem", color: "gray", textAlign: "center " }}>Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
