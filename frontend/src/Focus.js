import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';


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
    <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={styles.page}>
            <h1 style={{textAlign: "left", padding: "10px", marginBottom: "0px"}}>Focus</h1>
            <h3 style={styles.h3}>{theDate}</h3>
            <Timer /> 
        </div>
    </div>
    );
}

//Timer function

//To-do: 
//add number wheels to select time, 
//add default options for quick selection - done but need to format

function Timer () {
    const intervalRef = useRef(null);
    const [remaining, setRemaining] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [inputSeconds, setInputSeconds] = useState("");

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

    const handleStart = () => {
        let secs = parseInt(inputSeconds, 10);
        if (!isNaN(secs) && secs > 0) {
            setRemaining(secs);
            setIsActive(true);
        }
    };

    const handlePause = () => {
        setIsActive(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const handleResume = () => {
        if (remaining > 0) {
            setIsActive(true);
        }
    };

    const handleReset = () => {
        setIsActive(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRemaining(0);
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <input 
                    type="number"
                    placeholder="Enter Time (Seconds)"
                    value={inputSeconds}
                    onChange={(e) => setInputSeconds(e.target.value)}
                />
                <button onClick={handleStart}>Start Timer</button>

                <h2>{getTime(remaining)}</h2>
                {isActive ? (
                    <button onClick={handlePause}>Pause Timer</button>
                ) : (
                    <button onClick={handleResume} disabled={remaining === 0}> Resume timer </button>
                )}
                <button onClick={handleReset}> Reset Timer </button>
            </div>
            <div style={{ ...styles.card, width: "10%"}}>
                <button onClick={() => setRemaining(15 * 60)}>Quick Study</button>
                <button onClick={() => setRemaining(25 * 60)}>Pomodoro</button>
                <button onClick={() => setRemaining(50 * 60)}>Deep Focus</button>
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
        padding: ".5rem",
        fontSize: "1rem",
        backgroundColor: "#ee6dd5",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",      
        boxShadow: "0 4px 8px rgba(235, 89, 193, 0.6)",
        textAlign: "center",
        width: "50%",
        maxWidth: "800px",
        display: "flex",          
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "15px", 
    },
    h3:{
        fontWeight: "normal",
        textAlign: "left", 
        padding: "10px",
        marginTop: "0px",
    }
}

export default Focus;