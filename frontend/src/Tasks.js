import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';


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
        <div style={styles.page}>
            <h1 style={{textAlign: "left", padding: "10px", marginBottom: "0px"}}>Task Manager</h1>
            <h3 style={styles.h3}>{theDate}</h3>
        </div>
        <div style={{ ...styles.card, }}>
            <TaskManager />
        </div>
    </div>
    )
};

function TaskManager() {
    const [tasks, setTasks] = useState([
        {
            id: 1, 
            text: 'Doctor Appt.',
            completed: true
        },
        {
            id: 2,
            text: 'School Meeting',
            completed: false
        }
    ]);

    const [text, setText] = useState('');
    function addTask(text) {
        const newTask = {
            id: Date.now(),
            text,
            completed: false
        };
        setTasks([...tasks, newTask]);
        setText('');
    }

    function deleteTask(id) {
        setTasks(tasks.filter(task => task.id !== id));
    }

    function toggleCompleted(id) {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                return {...task, completed: !task.completed};
            } else {
                return task;
            }
        }));
    }
    return (
        <div className="todo-list">
            {tasks.map(task => (
                <TodoItem 
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                toggleCompleted={toggleCompleted}
                />
            ))}
            <input
            value={text}
            onChange={e => setText(e.target.value)}
            />
            <button onClick={() => addTask(text)}>Add</button>
        </div>
    );
}

function TodoItem({ task, deleteTask, toggleCompleted }) {
    function handleChange() {
        toggleCompleted(task.id);
    }

    return (
        <div className="todo-item">
            <input
                type="checkbox"
                check={task.completed}
                onChange={handleChange}
            />
            <p>{task.text}</p>
            <button onClick={() => deleteTask(task.id)}>
                X
            </button>
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