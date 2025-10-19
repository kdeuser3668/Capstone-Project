import { useState } from "react";
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
                <div className="card" style={{maxWidth: "600px", width: "100%"}}>
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
    const [priority, setPriority] = useState("top");
    const [deadline, setDeadline] = useState("");
    const [showForm, setShowForm] = useState(false);

    const handleTaskChange = (e) => {
        setTask(e.target.value);
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleDeadlineChange = (e) => {
        setDeadline(e.target.value);
    };

    const addTask = () => {
        if (task.trim() === "" || deadline === "") {
            alert("Please enter a task and select a valid deadline.");
            return;
        }

        const selectedDate = new Date(deadline);
        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            alert("Please select a future date for the deadline.");
            return;
        }

        const newTask = { id: tasks.length + 1, task, priority, deadline, done: false};
        setTasks([...tasks, newTask]);

        setTasks([...tasks, newTask]);
        setTask("");
        setPriority("top");
        setDeadline("");
    };

    const markDone = (id) => {
        const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, done: true } : t));
        setTasks(updatedTasks);

        const completedTask = tasks.find((t) => t.id === id);
        if (completedTask) {
            setCompletedTasks([...completedTasks, completedTask]);
        }
    };

    const upcomingTasks = tasks.filter((t) => !t.done);

    return (
        <div style={{width: "100%", textAlign: "center"}}>
            {!showForm && (
            <button className="button" onClick={() => setShowForm(true)}>
                Create Task
            </button>
            )}

            {showForm && (
                <div style={{ padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px", marginTop: "1rem", display: "inline-block", textAlign: "left", width: "100%", maxWidth: "400px"}}>
                    <h3>Create Task</h3>
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
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        style={{width: "100%", marginBottom: "0.5rem", padding: "0.5rem"}}
                    />
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <button className="button" onClick={addTask} style={{flex: 1, marginRight: "0.5rem"}}>
                            Add Task
                        </button>
                        <button className="button" onClick={() => setShowForm(false)} style={{flex: 1, backgroundColor: "#ccc", color: "#000"}}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {tasks.lenth > 0 && (
                <>
                <h2>Upcoming Tasks</h2>
                <table style={{marginTop: "1rem", width: "100%"}}>
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Priority</th>
                            <th>Deadline</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingTasks.map((t) => (
                            <tr key={t.id}>
                                <td>{t.task}</td>
                                <td>{t.priority}</td>
                                <td>{t.deadline}</td>
                                <td>{!t.done && <button onClick={() => markDone(t.id)}>Mark Done</button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Completed Tasks</h2>
                <table style={{marginTop: "1rem", width: "100%"}}>
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Priority</th>
                            <th>Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedTasks.map((ct) => (
                            <tr key={ct.id}>
                                <td>{ct.task}</td>
                                <td>{ct.priority}</td>
                                <td>{ct.deadline}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </>
            )}
        </div>
    );
}


const styles = {
    page: {
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "200vh",
        backgroundColor:"white",
    },
    button:{
        padding: ".5rem",
        fontSize: "1rem",
        backgroundColor: "#ee6dd5",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    h3:{
        fontWeight: "normal",
        textAlign: "left", 
        padding: "10px",
        marginTop: "0px",
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",      
        boxShadow: "0 4px 8px rgba(235, 89, 193, 0.6)",
        textAlign: "center",
        width: "80%",
        maxWidth: "600px",
        display: "flex",          
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "15px"
    }
}

export default Tasks;

//Resources
//https://stackoverflow.com/questions/62240691/how-to-show-form-after-onclick-event-react
//https://www.geeksforgeeks.org/reactjs/task-scheduler-using-react/ 