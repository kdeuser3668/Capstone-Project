import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./App.css";

function Notes() {
  const navigate = useNavigate();
  const today = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];
  const theDate = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <h1>Notes</h1>
        <h3>{theDate}</h3>
        <div className="card">
          <MakeNotes />
        </div>
      </div>
    </div>
  );
}

function MakeNotes() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(1);

  function remove(id) {
    setNotes(notes.filter((e) => e.key !== id));
  }

  function handle() {
    if (!title || !description) {
      window.alert("Incomplete input");
      return;
    }
    setNotes([...notes, { key: count, title, description }]);
    setCount(count + 1);
    setTitle("");
    setDescription("");
  }

  return (
    <div className="page">
      <h3>Add a Note</h3>
      <input
        type="text"
        placeholder="Add title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Notes"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="button" onClick={handle}>Submit</button>

      <div className="grid" style={{ marginTop: "1.5rem" }}>
        {notes.map((e) => (
          <div className="card" key={e.key}>
            <h4>{e.title}</h4>
            <p>{e.description}</p>
            <button
              className="button"
              style={{ backgroundColor: "#ff7272" }}
              onClick={() => remove(e.key)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;