import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";

const backendUrl = "http://localhost:5050"; // hits local backend, will be changed in deployment

function Focus(){
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
            <h1 className="h1">Focus</h1>
            <h3 className="h3">{theDate}</h3>

            <div style={styles.twoColumn}>
                <div style={styles.column}>
                    <div className="card">
                        <h3>Focus Timer</h3>
                        <hr style={{color: "#000000ff", width: "70%", borderWidth: "1px"}}/>
                        <Timer />  
                    </div>
                    <div className="card">
                        <h3>Music Selection</h3>
                        <MusicPlayer />
                    </div>
                </div>
                <div style={styles.column}>
                    <div className="card">
                        <FocusSession />
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

//Timer function
//Allows user to select preset options for time or custom time
//Can start, pause, and reset timer

export function Timer () {
    const intervalRef = useRef(null);
    const [remaining, setRemaining] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [hasStarted, setHasStarted] = useState(false);

    const getTime = (secs) => {
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const seconds = secs % 60;
        return `${hours.toString().padStart(1, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (isActive && remaining > 0) {
            intervalRef.current = setInterval(() => {
                setRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setIsActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    const startTimer = () => {
        if (!hasStarted) {
            const h = parseInt(hours, 10) || 0;
            const m = parseInt(minutes, 10) || 0;
            const totalSeconds = h * 3600 + m * 60

            if (totalSeconds > 0) {
                setRemaining(totalSeconds);
                setIsActive(true);
                setHasStarted(true);
                setHours("");
                setMinutes("");
            }
        } else {
            if (remaining > 0) {
                setIsActive(true);
            }
        }
        
    };

    const pauseTimer = () => {
        setIsActive(false);
        clearInterval(intervalRef.current);
    };

    const resetTimer = () => {
        setIsActive(false);
        clearInterval(intervalRef.current);
        setRemaining(0);
        setHasStarted(false);
    };

//Make timer selection in scroller/dropdown menu
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <div>
                <input
                    type="number"
                    placeholder="Hours"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Minutes"
                    min="0"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    style={styles.input}
                />

                <h2 style={{color: "#000000ff", fontSize: "50px"}}>{getTime(remaining)}</h2>
                {isActive ? (
                    <button style={{padding: "1rem", margin: ".5rem"}} className="button" onClick={pauseTimer}>Pause Timer</button>
                ) : (
                    <button style={{padding: "1rem", margin: ".5rem"}} className="button" onClick={startTimer}>Start Timer</button>
                )}
                <button style={{padding: "1rem", margin: ".5rem"}} className="button" onClick={resetTimer}> Reset Timer </button>
            </div>
            <hr style={{color: "#000000ff", width: "100%", borderWidth: "1px"}}/>
            <div style={styles.buttonGroup}>
                <button style={{padding: "1rem", margin: ".5rem"}} className="button" onClick={() => {setRemaining(15 * 60); setHasStarted(true); setIsActive(true);}}>Quick Study</button>
                <button style={{padding: "1rem", margin: ".5rem"}} className="button" onClick={() => {setRemaining(25 * 60); setHasStarted(true); setIsActive(true);}}>Pomodoro</button>
                <button style={{padding: "1rem", margin: ".5rem"}} className="button" onClick={() => {setRemaining(50 * 60); setHasStarted(true); setIsActive(true);}}>Deep Focus</button>
            </div>
        </div>
    );
}

//Music player function - could add an option to let users upload their own mp3 files
function MusicPlayer () {
    const audioRef = useRef(null);
    const [selectedTrack, setSelectedTrack] = useState("/Calm_Meditation_Music.mp3");

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}} >
            <select style={styles.select} value={selectedTrack} onChange={(e) => setSelectedTrack(e.target.value)}>
                <option>Select Track</option>
                <option value="/Calm_Meditation_Music.mp3">Calm Meditation</option>
                <option value="/Immersive_Meditation_Music.mp3">Immersive Meditation</option>
                <option value="/Lofi_Focus_Music.mp3">Lofi Focus</option>
                <option value="/Rainy_Cafe_Music.mp3">Rainy Cafe</option>
                <option value="/The_Longest_Journey.mp3">The Longest Journey</option>
            </select>

            <audio ref={audioRef} src={selectedTrack} loop controls/>
        </div>
    )
}
   
function FocusSession () {
    const [sessions, setSessions] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [form, setForm] = useState({
        title: "", 
        start: "", 
        end: "", 
        course_id: "", 
        notes: ""
    });
    const [showForm, setShowForm] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.id;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${backendUrl}/get-courses?userId=${userId}`);
                if (!response.ok) throw new Error("Failed to fetch courses");
                const data = await response.json();
                setUserCourses(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch(`${backendUrl}/focus?user_id=${userId}`);
                if (!response.ok) throw new Error("Failed to fetch sessions");
                const data = await response.json();
                const sessions = data.map(s => ({
                    ...s,
                    title: s.event_name || "Untitled Focus Session",
                    course: s.course_name || s.course_code || "No Course Set"
                }));
                setSessions(sessions);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSessions();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newSession = {
            user_id: userId,
            title: form.title,
            start: form.start,
            end: form.end,
            course_id: form.course_id,
            notes: form.notes
        };

        try {
            const response = await fetch(`${backendUrl}/focus`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSession)
            });

            if (!response.ok) throw new Error("Failed to save session");

            const savedSession = await response.json();
            setSessions([...sessions, savedSession]);
            setForm({ title: "", start: "", end: "", course_id: "", notes: "" });
            setShowForm(false);
        } catch (err) {
            console.error(err);
        }
    };

    const removeSession = async (id) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this session?");
            if (!confirmed) return;

            const response = await fetch(`${backendUrl}/focus/${id}`, { method: "DELETE" });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to delete session.");
            }

            setSessions((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Error deleting session:", err);
            alert("Failed to delete session. Please try again.");
        }
    };

    const upcomingSessions = sessions
        .filter((s) => new Date(s.nonrecurring_start) >= new Date())
        .sort((a, b) => new Date(a.nonrecurring_start) - new Date(b.nonrecurring_start));

    return (
        <div>
            <h3>Schedule Focus Session</h3>
            <hr></hr>

            <button
                className="button"
                style={{margin: "1rem"}}
                onClick={() => setShowForm(!showForm)}
            > 
                {showForm ? "Cancel" : "Create Focus Session"}
            </button>

            {showForm && (
                <div className="card" style={{marginTop: "1rem", marginBottom: "1rem", textAlign: "left", padding: "5px", alignContent: "center"}}>
                    <h3 className="h3">Schedule a Focus Session</h3>
                    <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                        <input 
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ... form, title: e.target.value})}
                            required
                            style={{padding: "0.5rem", fontSize: "1rem", borderRadius: "6px"}}
                        />
                        <input 
                            type="datetime-local"
                            value={form.start}
                            onChange={(e) => setForm({ ... form, start: e.target.value})}
                            required
                            style={{padding: "0.5rem", fontSize: "1rem", borderRadius: "6px"}}
                        />
                        <input 
                            type="datetime-local"
                            value={form.end}
                            onChange={(e) => setForm({ ... form, end: e.target.value})}
                            required
                            style={{padding: "0.5rem", fontSize: "1rem", borderRadius: "6px"}}
                        />
                        <select
                            value={form.course_id}
                            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                            required
                            style={{padding: "0.5rem", fontSize: "1rem", borderRadius: "6px"}}
                        >
                            <option value="">Select Course</option>
                            {userCourses.map(course => (
                                <option key={course.id} value={course.id}>{course.course_name}</option>
                            ))}
                        </select>
                        <textarea
                            placeholder="Notes"
                            value={form.notes}
                            onChange={(e) => setForm({ ... form, notes: e.target.value})}
                            rows={3}
                            style={{padding: "0.5rem", fontSize: "1rem", borderRadius: "6px"}}
                        ></textarea>
                        <button type="submit" className="button">Add Session</button>
                    </form>
                </div>
            )}

            <h3>Upcoming Focus Sessions</h3>
            <hr></hr>
            <div style={{marginTop: "2rem", padding: "3px", alignItems: "center"}}>
                {upcomingSessions.length === 0 ? (
                <p>No upcoming sessions yet.</p>
                ) : (
                upcomingSessions.map((s) => (
                    <div key={s.id} className="card" style={{padding: "10px", margin: "5px "}}>
                        <h4 style={{ padding: "0px", marginBottom: "1px" }}>{s.title}</h4>
                        <p className="p"><strong>Start:</strong> {new Date(s.nonrecurring_start).toLocaleString()}</p>
                        <p><strong>End:</strong> {new Date(s.nonrecurring_end).toLocaleString()}</p>
                        {s.course && <p><strong>Course:</strong> {s.course}</p>}
                        {s.notes && <p><strong>Notes:</strong> {s.notes}</p>}
                        <button className="button" style={{ backgroundColor: "#ff7272", marginTop: "1rem", fontSize: "0.9rem", }} onClick={() => removeSession(s.id)}>Delete</button>
                    </div>
                ))
                )}
            </div>
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
        marginLeft: "50px",
    },
    button:{
        padding: ".75rem",
        fontSize: "1rem",
        backgroundColor: "#b1b1b1ff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        margin: "5px",
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
    },
    h3:{
        fontWeight: "normal",
        textAlign: "left", 
        padding: "10px",
        marginTop: "0px",
    }, 
    cardContainer: {
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "20px", 
        marginTop: "20px",
        flexWrap: "wrap",
        width: "100%",
        boxSizing: "border-box",
    }, 
    buttonGroup: {
        border: "1px",
        color: "#fff",
        padding: "10px 24px", 
        cursor: "pointer", 
        float: "left",
    }, 
    select: {
        marginBottom: "20px",
        width: "60%",
        textAlign: "center",
    },
    input: {
        border: "1px",
        border: "solid",
        borderColor: "#b1b1b1ff",
        gap: "2px",
        textAlign: "center",
        padding: "2px",
        width: "30%",
        margin: "2px",
    }, 
    twoColumn: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
    },
    column: {
        flex: "1 1 400px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    }
}

export default Focus;

//Resources
//https://www.w3schools.com/howto/howto_css_button_group.asp - make button in horizontal line
//https://www.javascripttutorial.net/javascript-dom/javascript-select-box/ - dropdown menu
//https://pixabay.com/music/search/long%20study%20music/ - link to find more music
//