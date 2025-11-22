import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./App.css";

function Tasks() {
    const navigate = useNavigate();
    var today = new Date();

    // Array of month names
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dd = today.getDate(); // Day of the month
    var mm = monthNames[today.getMonth()]; // Month name
    var yyyy = today.getFullYear();

    const theDate = mm + ' ' + dd + ', ' + yyyy;

return (
  <div className="container">
    <Sidebar />
    <div className="main-content">
        <h1 className="h1">Task Manager</h1>
        <h3 className="h3">{theDate}</h3>
        <div>
        </div>
        <div>
          <TaskManager />
        </div>
    </div>
  </div>
  );
}


function TaskManager () {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("High");
    const [deadline, setDeadline] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);

    // Local storage 
    useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const savedComplete = JSON.parse(localStorage.getItem("completedTasks")) || [];
    setTasks(savedTasks);
    setCompletedTasks(savedComplete);
    }, []);

    useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    }, [completedTasks]);

    const addTask = () => {
    if (task.trim() === "" || deadline === "") {
        alert("Please enter a task and select a valid deadline.");
        return;
    }

    const selectedDate = new Date(deadline);
    const currentDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    
    if (selectedDate.getTime() < currentDate.getTime()) {
      alert("Please select today or a future date for the deadline.");
      return;
    }

    if (editingTaskId) {
      const updatedTasks = tasks.map((t) =>
        t.id === editingTaskId ? { ...t, task, priority, deadline} : t
      );
      setTasks(updatedTasks);
      setEditingTaskId(null);
    } else {
      const newTask = { id: Date.now(), task, priority, deadline, done: false };
      const updatedTasks = [...tasks, newTask].sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      );
      setTasks(updatedTasks);
    }

    setTask("");
    setPriority("High");
    setDeadline("");
  };

  const markDone = (id) => {
    const completedTask = tasks.find((t) => t.id === id);
    if (!completedTask) return;

    const updatedTask = { ...completedTask, done: true };
    const remainingTasks = tasks.filter((t) => t.id !== id);

    setTasks([...remainingTasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
    setCompletedTasks([...completedTasks, updatedTask].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
  };

  const deleteTask = (id, isCompleted = false) => {
    if (isCompleted) {
      setCompletedTasks(completedTasks.filter((t) => t.id !== id));
    } else {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((t) => t.id === id);
    if (!taskToEdit) return;

    const parts = taskToEdit.deadline.split("/");
    let isoDeadline = parts.length === 3
      ? `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`
      : taskToEdit.deadline;

    setTask(taskToEdit.task);
    setPriority(taskToEdit.priority);
    setDeadline(isoDeadline);
    setEditingTaskId(id);
    setShowForm(true);
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };  

  const upcomingTasks = tasks.filter((t) => !t.done);

  return (
    <div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1rem", position: "relative"}}>
        {!showForm && (
          <button className="button" onClick={() =>setShowForm(true)} style={{position: "absolute", right: "0", top: "0", cursor: "pointer",}}>{editingTaskId ? "Edit Task" : "Create Task"}</button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{maxWidth: "400px", margin: "1rem auto", textAlign: "center"}}>
          <h3>{editingTaskId ? "Edit Task" : "Create Task"}</h3>
          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <input
              type="text"
              placeholder="Task Name"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              style={{width: "100%", marginBottom: "0.5rem", padding: "0.5rem"}}
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{width: "100%", marginBottom: "0.5rem", padding: "0.5rem"}}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{width: "100%", marginBottom: "0.5rem", padding: "0.5rem"}}
            />
            <div style={{display: "flex", alignConent: "center", gap: "0.5rem"}}>
              <button className="button" onClick={addTask}>
                {editingTaskId ? "Save Changes" : "Add Task"}
              </button>
              <button 
                className="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingTaskId(null);
                  setTask("");
                  setPriority("High");
                  setDeadline("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {(tasks.length > 0 || completedTasks.length > 0) && (
        <div style={{display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem", width: "100%", maxWidth: "900px", marginLeft: "auto", marginRight: "auto"}}>
          <h2 style={{margin: "0"}}>Upcoming Tasks</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
            {upcomingTasks.map((t) => (
                <div key={t.id} style={{backgroundColor: "#fff", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"}}>
                  <div style={{ textAlign: "left", minWidth: "0"}}>
                    <h3 style={{margin: "0 0 .25rem 0", wordBreak: "break-word"}}>{t.task}</h3>
                    <div style={{display: "flex", gap: "1rem", fontSize: "0.95rem"}}>
                      <span>Priority: {t.priority}</span>
                      <span>Deadline: {formatDate(t.deadline)}</span>
                    </div>
                  </div>

                  <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end"}}>
                    {!t.done && (<button className="button" onClick={() => markDone(t.id)}>Mark Done</button>)}
                    <div style={{display: "flex", gap: "0.5rem"}}>
                      <button className="button" onClick={() => editTask(t.id)}>Edit</button>
                      <button className="button" onClick={() => deleteTask(t.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <h2 style={{margin: "0.75rem 0 0 0"}}>Completed Tasks</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
            {completedTasks.map((ct) => (
                <div key={ct.id} style={{backgroundColor: "#fff", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"}}>
                  <div style={{ textAlign: "left", minWidth: "0"}}>
                    <h3 style={{margin: "0 0 .25rem 0", wordBreak: "break-word"}}>{ct.task}</h3>
                    <div style={{display: "flex", gap: "1rem", fontSize: "0.95rem"}}>
                      <span>Priority: {ct.priority}</span>
                      <span>Deadline: {formatDate(ct.deadline)}</span>
                    </div>
                  </div>

                  <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end"}}>
                    <button className="button" onClick={() => deleteTask(ct.id, true)}>Delete</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
    );
}  

export default Tasks;
