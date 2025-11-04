import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./App.css";

function Notes(){
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
            <h1 className="h1">Notes</h1>
            <h3 className="h3">{theDate}</h3>
            <div>
                <MakeNotes />
            </div>
        </div>
    </div>
    );
}

function MakeNotes(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState([]);
    const [count, setCount] = useState(1);
    const [showForm, setShowForm] = useState(false);

    function remove(id) {
        setNotes(notes.filter((e) => e.key !== id));
    }

    function handleSubmit() {
        if (!title || !description) {
            window.alert("Incomplete input");
            return;
        }
        setNotes([...notes, { key: count, title: title, description:description}]);
        setCount(count + 1);
        setTitle("");
        setDescription("");
        setShowForm(false);
    }

    return (
        <div className="page" style={{ position: "relative" }}>
            <h2>Your Notes</h2>

            <button
                className="button"
                onClick={() => setShowForm(!showForm)}
                style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                }}
            >
                {showForm ? "Cancel" : "Create Note"}
            </button>


            {showForm && (
                <div className="card" style={{marginTop: "1rem", textAlign: "left"}}>
                    <h3>Add a New Note</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem"}}>
                        <input
                            type="text"
                            placeholder="Enter Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{padding: "0.5rem", fontSize: "1rem", borderRadius: "6px"}}
                        />
                        <textarea
                            placeholder="Enter note details"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            style={{
                                padding: "0.5rem",
                                fontSize: "1rem",
                                borderRadius: "6px",
                                resize: "none",
                            }}
                        ></textarea>
                        <button className="button" onClick={handleSubmit}>
                            Save Note
                        </button>
                    </div>
                </div>
            )}

            <div className="grid" style={{marginTop: "2rem"}}>
                {notes.length === 0 ? (
                    <p style={{textAlign: "center", color: "#555"}}>No Notes Yet</p>
                ) : (
                    notes.map((e) => (
                        <div className="card" key={e.key}>
                            <h4>{e.title}</h4>
                            <p styles={{textAlign: "left"}}>{e.description}</p>
                            <button className="button" style={{backgroundColor: "#ff7272", marginTop: "1rem", fontSize: "0.9rem"}} onClick={() => remove(e.key)}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


export default Notes;

//https://www.geeksforgeeks.org/reactjs/how-to-create-a-basic-notes-app-using-reactjs/