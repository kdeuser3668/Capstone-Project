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
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "var(--background-color, #fafafa)",
    }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
      }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}>
          <div>
            <h1 style={{ margin: 0, color: "var(--text-color)" }}>Dashboard</h1>
            <h3 style={{ margin: 0, color: "gray" }}>{formattedDate}</h3>
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
        </header>

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
            <p style={{ fontSize: "1.2rem", color: "gray" }}>Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
