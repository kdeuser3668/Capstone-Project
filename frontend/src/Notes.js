import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';


function Notes(){
    const navigate = useNavigate();
    var today = new Date();

    // Array of month names
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dd = today.getDate(); // Day of the month
    var mm = monthNames[today.getMonth()]; // Month name
    var yyyy = today.getFullYear();

    const theDate = mm + ' ' + dd + ', ' + yyyy;

    //use the task creation style and populate notes like 

return (
    <div className="container">
        <Sidebar />
        <div className="main-content">
            <h1 className="h1">Notes</h1>
            <h3 className="h3">{theDate}</h3>
        </div>
        <div className="card">
            <Notes />
        </div>
    </div>
    );
}

function Notes(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState([]);
    const [count, setCount] = useState(4);

    function remove(id) {
        setNotes(notes.filter((e) => e.key !== id));
    }

    function handle() {
        if (!title || !description) {
            window.alert("Incomplete input");
            return;
        }
        setNotes([...notes, { key: count, title: title, description:description}]);
        setCount(count + 1);
        setTitle("");
        setDescription("");
        console.log(notes);
    }

    return (
        <div classname="card">
            <div className="container">
                <h1>Notes</h1>
            </div>
            <div>
                {notes.map((e) => (
                    <div>
                        <div className="notes-item">
                            <h4> Title: {e.title}</h4>
                            <p>Note: {e.description}</p>
                        </div>
                        <button
                            type="input"
                            style={{
                                fontSize: "20px",
                                width: "8%",
                                height: "35px",
                                padding: "0 2% 0 2%",
                                color: "black",
                            }}
                            onClick={() => remove(e.key)}
                        > x </button>
                    </div>
                ))}
                <div>
                    <h3>Add Notes</h3>
                    <input
                        type="text"
                        id="title"
                        placeHolder="Add title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    ></input>
                    <input
                        type="text"
                        id="description"
                        placeholder="Notes"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    ></input>
                    <button type="submit" onClick={handle}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}


export default Dashboard;