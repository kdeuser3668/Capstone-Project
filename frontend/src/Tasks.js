import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./App.css";

//update the date, hardcode in a +1 for the date
//try just having the date typed in manually, don't know if it would work if it interferes with calendar

function Tasks() {
    const navigate = useNavigate();
    const today = new Date();
    const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    const theDate = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

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

    const normalizeDeadline = (dateStr) => {
        if (!dateStr) return "";
        const parsed = new Date(dateStr);
        if (isNaN(parsed)) return "";
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const day = String(parsed.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`; 
      };

    const addTask = () => {
    if (task.trim() === "" || deadline === "") {
        alert("Please enter a task and select a valid deadline.");
        return;
    }

    const selectedDate = new Date(deadline);
    const currentDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    //wont let you select the current day, gives alert
    if (selectedDate < currentDate) {
      alert("Please select a future date for the deadline.");
      return;
    }

    const normalizedDeadline = normalizeDeadline(deadline);

    if (editingTaskId) {
      const updatedTasks = tasks.map((t) =>
        t.id === editingTaskId ? { ...t, task, priority, deadline: normalizedDeadline } : t
      );
      setTasks(updatedTasks);
      setEditingTaskId(null);
    } else {
      const newTask = { id: Date.now(), task, priority, deadline: normalizedDeadline, done: false };
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
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };  

  const upcomingTasks = tasks.filter((t) => !t.done);

  return (
    <div style={{ display: "flex" }}>
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
            <h1 style={{ margin: 0 }}>Task Manager</h1>
            <h3 style={{ margin: 0 }}>{theDate}</h3>
          </div>
          {!showForm && (
            <button
              className="button"
              onClick={() => setShowForm(true)}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              {editingTaskId ? "Edit Task" : "Create Task"}
            </button>
          )}
        </div>

        <div style={{ width: "100%", textAlign: "center" }}>
          {showForm && (
            <div
              style={{
                padding: ".5rem",
                borderRadius: "5px",
                margin: "1rem auto",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              <h3 style={{ textAlign: "center" }}>{editingTaskId ? "Edit Task" : "Create Task"}</h3>
              <input
                type="text"
                placeholder="Task Name"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: "105%", marginBottom: "0.5rem", padding: "0.5rem" }}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
              />
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
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
                  }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {(tasks.length > 0 || completedTasks.length > 0) && (
            <div className= "">
              <h2 style={{ marginTop: "0rem", color: "var(--button-color)" }}>Upcoming Tasks</h2>
              <table style={{ marginTop: "1rem", width: "100%" }}>
                <thead>
                  <tr style={{ color: "var(--text-color)" }}>
                    <th>Task Name</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTasks.map((t) => (
                    <tr key={t.id} style={{ color: "var(--text-color)" }}>
                      <td>{t.task}</td>
                      <td>{t.priority}</td>
                      <td>{formatDate(t.deadline)}</td>
                      <td>
                        {!t.done && (
                          <button className="button" style={{margin: ".5rem"}} onClick={() => markDone(t.id)}>
                            Mark Done
                          </button>
                        )}
                        <button className="button" style={{margin: ".5rem"}} onClick={() => editTask(t.id)}>Edit</button>
                        <button className="button" style={{margin: ".5rem"}} onClick={() => deleteTask(t.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2 style={{ color: "var(--button-color)" }}>Completed Tasks</h2>
              <table style={{ marginTop: "1rem", width: "100%" }}>
                <thead>
                  <tr style={{ color: "var(--text-color)" }}>
                    <th>Task Name</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTasks.map((ct) => (
                    <tr key={ct.id} style={{ color: "var(--text-color)" }}>
                      <td>{ct.task}</td>
                      <td>{ct.priority}</td>
                      <td>{formatDate(ct.deadline)}</td>
                      <td>
                        <button className="button" onClick={() => deleteTask(ct.id, true)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
