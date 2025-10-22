import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import "./App.css";


function Tasks(){
    const navigate = useNavigate();
    var today = new Date();

    // Array of month names
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dd = today.getDate(); // Day of the month
    var mm = monthNames[today.getMonth()]; // Month name
    var yyyy = today.getFullYear();

    const theDate = mm + ' ' + dd + ', ' + yyyy;


return (
    <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="main-content">
            <h1>Task Manager</h1>
            <h3>{theDate}</h3>
            <div className="page" style={{display: "flex", justifyContent: "center"}}>
                <div className="card" style={{maxWidth: "500px", width: "100%"}}>
                    <TaskManager />
                </div>
            </div>
        </div>
    </div>
    )
};

function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("High");
    const [deadline, setDeadline] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);

    useEffect(() =>{
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const savedComplete = JSON.parse(localStorage.getItem("completedTasks")) || [];
        setTasks(savedTasks);
        setCompletedTasks(savedComplete);
    }, []);

    useEffect(() =>{
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }, [tasks]);

    useEffect(() =>{
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks))
    }, [completedTasks]);

    const handleTaskChange = (e) => {setTask(e.target.value);};
    const handlePriorityChange = (e) => {setPriority(e.target.value);};
    const handleDeadlineChange = (e) => {setDeadline(e.target.value);};
    const normalizeDeadline = (dateStr) => {
        if (!dateStr) return ""; // if blank, just return empty
        const parsed = new Date(dateStr);
        return isNaN(parsed) ? "" : parsed.toISOString().split("T")[0];
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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`
    }

    const markDone = (id) => {

        const completedTask = tasks.find((t) => t.id === id);
        if (!completedTask) return;

        const updatedTask = {...completedTask, done:true};
        const remainingTasks = tasks.filter((t) => t.id !== id);

        const sortedRemaining = [...remainingTasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        setTasks(sortedRemaining);
        setCompletedTasks([...completedTasks, updatedTask].sort ((a, b) => new Date(a.deadline) - new Date(b.deadline)));

    };

    const deleteTask = (id, isCompleted = false) => {
        if (isCompleted){
            const updatedCompleted = completedTasks.filter((t) => t.id !== id);
            setCompletedTasks(updatedCompleted);
        }else{
            const updatedTasks = tasks.filter((t) => t.id !== id);
            setTasks(updatedTasks);
        }
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find((t) => t.id === id);
        if (!taskToEdit) return;
      
        // 🩹 Convert stored MM/DD/YYYY → YYYY-MM-DD for date input
        let isoDeadline = "";
        if (taskToEdit.deadline) {
          const parts = taskToEdit.deadline.split("/");
          if (parts.length === 3) {
            const [month, day, year] = parts;
            isoDeadline = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          } else {
            // if already ISO or empty, keep as is
            isoDeadline = taskToEdit.deadline;
          }
        }
      
        setTask(taskToEdit.task);
        setPriority(taskToEdit.priority);
        setDeadline(isoDeadline); // ✅ date input now valid
        setEditingTaskId(id);
        setShowForm(true);
      };
      

    const upcomingTasks = tasks.filter((t) => !t.done);

    return (
        <div style={{width: "100%", textAlign: "center"}}>
        {!showForm && (
            <button
            className="button"
            onClick={() => setShowForm(true)}
            style={{ marginBottom: "1rem" }}
            >
            {editingTaskId ? "Edit Task" : "Create Task"}
            </button>
        )}

            {showForm && (
                <div style={{ padding: ".5rem", borderRadius: "5px", margin: "1rem", display: "inline-block", width: "100%", maxWidth: "400px"}}>
                    <h3 style={{textAlign: "center"}}>{editingTaskId ? "Edit Task" : "Create Task"}</h3>
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={task}
                        onChange={handleTaskChange}
                        style={{width: "100%", marginBottom: "0.5rem", padding: "0.5rem"}}
                    />
                    <select
                        value={priority}
                        onChange={handlePriorityChange}
                        style={{width: "105%", marginBottom: "0.5rem", padding: "0.5rem"}}
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <input
                        type="date"
                        value={deadline}
                        onChange={handleDeadlineChange}
                        style={{width: "100%", marginBottom: "1rem", padding: "0.5rem"}}
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
                        }}
                        >
                        Cancel
                        </button>
                    </div>
                </div>
            )}

            {(tasks.length > 0 || completedTasks.length > 0) && (
                <>
                <h2 style={{marginTop: "0rem", color: "var(--button-color)"}}>Upcoming Tasks</h2>
                <table style={{marginTop: "1rem", width: "100%"}}>
                    <thead>
                        <tr style={{color: "var(--text-color)"}}>
                            <th>Task Name</th>
                            <th>Priority</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingTasks.map((t) => (
                            <tr key={t.id} style={{color: "var(--text-color)"}}>
                                <td>{t.task}</td>
                                <td>{t.priority}</td>
                                <td>{formatDate(t.deadline)}</td>
                                <td>{!t.done && <button className="button" style={{marginRight: "0.5rem"}} onClick={() => markDone(t.id)}>Mark Done</button>}
                                <button className="button" onClick={() => editTask(t.id)} style={{ marginRight: "0.3rem"}}>Edit</button>                 
                                <button className="button" style={{flex: 1}} onClick={() => deleteTask(t.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2 style={{color: "var(--button-color)"}}>Completed Tasks</h2>
                <table style={{marginTop: "1rem", width: "100%"}}>
                    <thead>
                        <tr style={{color: "var(--text-color)"}}>
                            <th>Task Name</th>
                            <th>Priority</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedTasks.map((ct) => (
                            <tr key={ct.id} style={{color: "var(--text-color)"}}>
                                <td>{ct.task}</td>
                                <td>{ct.priority}</td>
                                <td>{formatDate(ct.deadline)}</td>
                                <td><button className="button" style={{flex: 1}} onClick={() => deleteTask(ct.id, true)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </>
            )}
        </div>
    );
}


export default Tasks;

//Resources
//https://stackoverflow.com/questions/62240691/how-to-show-form-after-onclick-event-react
//https://www.geeksforgeeks.org/reactjs/task-scheduler-using-react/ 