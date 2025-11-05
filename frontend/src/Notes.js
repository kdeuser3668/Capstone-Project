import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./App.css";

const backendUrl = "http://localhost:5050"; // hits local backend, will be changed in deployment


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

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id;

  // Fetch existing notes on load
  useEffect(() => {
    fetch(`${backendUrl}/notes?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.map((note, index) => ({
          key: note.id || index,
          title: note.note_title,
          description: note.note_content,
          created: note.created
        })));
      })
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  function remove(id) {
    // Confirm before deleting note
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    const noteToDelete = notes.find((e) => e.key === id);
    if (!noteToDelete) return;

    const noteId = noteToDelete.key;

    fetch(`${backendUrl}/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete note");
        setNotes(notes.filter((e) => e.key !== id));
      })
      .catch((err) => {
        console.error(err);
        window.alert("Error deleting note");
      });
  }

  function handle() {
    if (!title || !description) {
      window.alert("Incomplete input");
      return;
    }

    const newNote = { userId, noteTitle: title, noteContent: description };

    fetch(`${backendUrl}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save note");
        return res.json();
      })
      .then(() => {
        setNotes([...notes, { key: count, title, description }]);
        setCount(count + 1);
        setTitle("");
        setDescription("");
      })
      .catch((err) => {
        console.error(err);
        window.alert("Error saving note");
      });
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
      <div className="card" style={{ marginTop: "1rem", textAlign: "left" }}>
        <h3>Add a New Note</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "0.5rem", fontSize: "1rem", borderRadius: "6px" }}
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
          <button className="button" onClick={handle}>
            Save Note
          </button>
        </div>
      </div>
    )}

    <div className="grid" style={{ marginTop: "2rem" }}>
      {notes.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No Notes Yet</p>
      ) : (
        notes.map((e) => (
          <div className="card" key={e.key}>
            <h4>{e.title}</h4>
            <p style={{ fontStyle: "italic", fontSize: "0.8rem", color: "#888" }}>
              {new Date(e.created).toLocaleString()}
            </p>
            <p>{e.description}</p>
            <button
              className="button"
              style={{
                backgroundColor: "#ff7272",
                marginTop: "1rem",
                fontSize: "0.9rem",
              }}
              onClick={() => remove(e.key)}
            >
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