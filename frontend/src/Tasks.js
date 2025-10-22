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

        const newTask = { id: Date.now(), task, priority, deadline, done: false};
        const updatedTasks = [...tasks, newTask].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setTasks(updatedTasks);

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
        return `${month}-${day}-${year}`
    }


    const markDone = (id) => {
        //const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, done: true } : t));
        //setTasks(updatedTasks);

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

    const upcomingTasks = tasks.filter((t) => !t.done);

    return (
        <div style={{width: "100%", textAlign: "center"}}>
            {!showForm && (
            <button className="button" onClick={() => setShowForm(true)}>
                Create Task
            </button>
            )}

            {showForm && (
                <div style={{ padding: ".5rem", borderRadius: "5px", marginTop: "1rem", display: "inline-block", width: "100%", maxWidth: "400px"}}>
                    <h3 className="h3" style={{textAlign: "center"}}>Create Task</h3>
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
                        style={{width: "100%", marginBottom: "0.5rem", padding: "0.5rem"}}
                    />
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <button className="button" onClick={addTask} style={{flex: 1, marginRight: "0.5rem"}}>
                            Add Task
                        </button>
                        <button className="button" onClick={() => setShowForm(false)} style={{flex: 1, backgroundColor: "#ccc", color: "#000"}}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {(tasks.length > 0 || completedTasks.length > 0) && (
                <>
                <h2>Upcoming Tasks</h2>
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
                                <button className="button" style={{flex: 1, backgroundColor: "#ccc", color: "#000"}} onClick={() => deleteTask(t.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Completed Tasks</h2>
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
                                <td><button className="button" style={{flex: 1, backgroundColor: "#ccc", color: "#000", marginLeft: "0.5rem"}} onClick={() => deleteTask(ct.id, true)}>Delete</button></td>
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