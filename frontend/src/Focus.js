import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';

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
            <h3 h3 className="h3">{theDate}</h3>

            <div style={styles.cardContainer}>
                <div className="card">
                    <h3 style={{textAlign: "center"}}>Focus Timer</h3>
                    <hr style={{color: "#000000ff", width: "70%", borderWidth: "1px"}}/>
                    <Timer />  
                </div>

                <div className="card">
                    <h3 style={{textAlign: "center"}}>Music Selection</h3>
                    <MusicPlayer />
                </div>
            </div>
        </div>
    </div>
    );
}

//Timer function

//To-do: 
//Make cards adjustable depending on screen size
//add number wheels to select time, 
//add default options for quick selection - done but need to format
//add styles for select dropdown menu

function Timer () {
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
   
function focusSession () {
    //add function to create focus sessions and add them to calendar
    //also have upcoming focus sessions displayed
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
        gap: "40px", 
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
    }
}

export default Focus;

//Resources
//https://www.w3schools.com/howto/howto_css_button_group.asp - make button in horizontal line
//https://www.javascripttutorial.net/javascript-dom/javascript-select-box/ - dropdown menu
//https://pixabay.com/music/search/long%20study%20music/ - link to find more music
//