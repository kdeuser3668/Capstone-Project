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
    const [content, setContent] = useState("");
    const [notes, setNotes] = useState([]);
    const [count, setCount] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);

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
          content: note.note_content,
          created: note.created,
          edited: note.edited
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

  //edit a note
  const editNote = (id) => {
    const n = notes.find((note) => note.key === id);
    if (!n) {
      console.error("Note not found");
      return;
    }
    setTitle(n.title);
    setContent(n.content);
    setEditingNoteId(id);
    setShowForm(true);
  };

  function handle() {
    if (!title || !content) {
      window.alert("Incomplete input");
      return;
    }
    if (editingNoteId){
      const updatedNote = { updatedTitle: title, updatedContent: content };

      fetch(`${backendUrl}/update-notes/${editingNoteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update note");
          return res.json();
        })
        .then(() => {
          setNotes((prev) =>
            prev.map((n) =>
              n.key === editingNoteId
                ? { ...n, title, content }
                : n
            )
          );
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          alert("Error updating note");
        });
    
    }else{

      const newNote = { userId, noteTitle: title, noteContent: content };

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
          setNotes([...notes, { key: count, title, content }]);
          setCount(count + 1);
          setTitle("");
          setContent("");
        })
        .catch((err) => {
          console.error(err);
          window.alert("Error saving note");
        });
      }
  }

  function resetForm() {
    setTitle("");
    setContent("");
    setEditingNoteId(null);
    setShowForm(false);
  }

  return (
  <div className="page" style={{ position: "relative" }}>
    <h2>Your Notes</h2>

  <button
    className="button"
    onClick={() => {
      if (!showForm) {
        resetForm();
        setShowForm(true);
      } else {
        resetForm();
        setShowForm(false);
      }
    }}
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
        <h3>{ editingNoteId ? "Edit Note" : "Add a New Note"}</h3>
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: "6px",
              resize: "none",
            }}
          ></textarea>
          <button className="button" onClick={handle}>
            { editingNoteId ? "Update Note" : "Save Note"}
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
            <h4 style={{ color: "var(--text-color)" }}>{e.title}</h4>
            <p style={{ fontSize: "0.8rem" }}>
              {new Date(e.created).toLocaleString()}
            </p>
            {e.edited && e.edited !== e.created ? (
              <p style={{ fontStyle: "italic", fontSize: "0.8rem", color: "#888" }}>
                edited {new Date(e.edited).toLocaleString()}
              </p>
            ) : (
              <p style={{ margin: 0, visibility: "hidden" }}>placeholder</p>
            )}
            <p style={{ color: "var(--text-color)", textAlign: "left" }}>{e.content}</p>
            <button className="button" style={{ margin: ".25rem" }} onClick={() => remove(e.key)} >
              Delete
            </button>
            <button className="button" style={{ margin: ".25rem" }} onClick={() => editNote(e.key)} >
              Edit
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);

}


export default Notes;