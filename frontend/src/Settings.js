import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Calendar.css';

function Settings({ weekStart, setWeekStart }) {
  const navigate = useNavigate();
  const today = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dd = today.getDate();
  const mm = monthNames[today.getMonth()];
  const yyyy = today.getFullYear();
  const theDate = `${mm} ${dd}, ${yyyy}`;

    const [textColor, setTextColor] = useState(
        typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("textColor") || "#000000"
        : "#000000"
    );

    const [buttonColor, setButtonColor] = useState(
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage.getItem("buttonColor") || "#ee6dd5"
          : "#ee6dd5"
      );

    const [shadowColor, setShadowColor] = useState(
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage.getItem("shadowColor") || "0 4px 8px rgba(235, 89, 193, 0.6)"
          : "0 4px 8px rgba(235, 89, 193, 0.6)"
      );

    const [backgroundColor, setBackgroundColor] = useState(
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage.getItem("backgroundColor") || "white"
          : "white"
    );
    const [sidebarColor, setSidebarColor] = useState(
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage.getItem("sidebarColor") || "#f5f5f5"
          : "#f5f5f5"
    );

    //saves and applies text changes across all pages when using color: "var(--text-color)"
    const handleColorChange = (event) => {
        const newColor = event.target.value;
        setTextColor(newColor);
        window.localStorage.setItem("textColor", newColor);
        document.documentElement.style.setProperty("--text-color", newColor);
      };
    
      useEffect(() => {
        const savedColor = window.localStorage.getItem("textColor") || "#000000";
        document.documentElement.style.setProperty("--text-color", savedColor);
      }, []);

    
      //saves and applies button changes across all pages when using background: "var(--button-color, #ee6dd5)" the second color is a fallback color
    const handleButtonChange = (event) => {
        const newButtonColor = event.target.value;
        setButtonColor(newButtonColor);
        window.localStorage.setItem("buttonColor", newButtonColor);
        document.documentElement.style.setProperty("--button-color", newButtonColor);
      };
    
      useEffect(() => {
        const savedButtonColor = window.localStorage.getItem("buttonColor") || "#ee6dd5";
        document.documentElement.style.setProperty("--button-color", savedButtonColor);
      }, []);

    //saves and applies shadow changes across all pages when using boxShadow: "0 4px 8px var(--shadow-color, #eb59c199)" the second color is a fallback color
    const handleShadowChange = (event) => {
        const newShadowColor = event.target.value;
        setShadowColor(newShadowColor);
        window.localStorage.setItem("shadowColor", newShadowColor);
        document.documentElement.style.setProperty("--shadow-color", newShadowColor);
        };

    useEffect(() => {
        const savedShadowColor = window.localStorage.getItem("shadowColor") || "#eb59c199";
        document.documentElement.style.setProperty("--shadow-color", savedShadowColor);
        }, []);

    //saves and applies page color changes across all pages when using backgroundColor: "var(--background-color, #ffffff)" the second color is a fallback color
    const handleBackgroundChange = (event) => {
        const newBackgroundColor = event.target.value;
        setBackgroundColor(newBackgroundColor);
        window.localStorage.setItem("backgroundColor", newBackgroundColor);
        document.documentElement.style.setProperty("--background-color", newBackgroundColor);
        };

    useEffect(() => {
        const savedBackgroundColor = window.localStorage.getItem("backgroundColor") || "#ffffff";
        document.documentElement.style.setProperty("--background-color", savedBackgroundColor);
        }, []);
    
    //saves and applies page color changes across all pages when using backgroundColor: "var(--sidebar-color, #f5f5f5)" the second color is a fallback color
    const handleSidebarChange = (event) => {
        const newSidebarColor = event.target.value;
        setSidebarColor(newSidebarColor);
        window.localStorage.setItem("sidebarColor", newSidebarColor);
        document.documentElement.style.setProperty("--sidebar-color", newSidebarColor);
        };

    useEffect(() => {
        const savedSidebarColor = window.localStorage.getItem("sidebarColor") || "#f5f5f5";
        document.documentElement.style.setProperty("--sidebar-color", savedSidebarColor);
        }, []);

    // profile
        // change email/pass
    // font/font size
    // reset colors
    // notifications
    // categories
    // course management
    // privacy policy
        
return (
    <div style={styles.container}>
    <Sidebar />
        <div style={styles.mainContent}>
        <h1 style={styles.h1}>Settings</h1>
        <h3 style={styles.h3}>Customize your productivity app experience</h3>
            <div style={styles.grid}>
                <div style={styles.card}>
                <label htmlFor="textcolor" style={{ display: "block", marginTop: "1rem", color: textColor }}>
                    Select your text color:
                    </label>
                    <input type="color" id="textcolor" value={textColor} onChange={handleColorChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: textColor }}>{textColor}</strong>
                    </p>
                </div>
                <div style={styles.card}>
                <label htmlFor="buttoncolor" style={{ display: "block", marginTop: "1rem", color: textColor }}>
                    Select your button color:
                    </label>
                    <input type="color" id="buttonColor" value={buttonColor} onChange={handleButtonChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: buttonColor }}>{buttonColor}</strong>
                    </p>
                </div>
                <div style={styles.card}>
                <label htmlFor="shadowcolor" style={{ display: "block", marginTop: "1rem", color: textColor }}>
                    Select your drop shadow color:
                    </label>
                    <input type="color" id="shadowColor" value={shadowColor} onChange={handleShadowChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: shadowColor }}>{shadowColor}</strong>
                    </p>
                </div>
                <div style={styles.card}>
                <label htmlFor="backgroundColor" style={{ display: "block", marginTop: "1rem", color: textColor }}>
                    Select your background color:
                    </label>
                    <input type="color" id="backgroundColor" value={backgroundColor} onChange={handleBackgroundChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: backgroundColor }}>{backgroundColor}</strong>
                    </p>
                </div>
                <div style={styles.card}>
                <label htmlFor="sidebarColor" style={{ display: "block", marginTop: "1rem", color: textColor }}>
                    Select your sidebar color:
                    </label>
                    <input type="color" id="sidebarColor" value={sidebarColor} onChange={handleSidebarChange} style={{ marginTop: "0.5rem", cursor: "pointer" }}/>
                    <p style={{ marginTop: "1rem", color: textColor }}>Your selected color:{" "}<strong style={{ color: sidebarColor }}>{sidebarColor}</strong>
                    </p>
                </div>
            </div>
        </div>
      </div>
  );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "row", 
        height: "100vh", 
        width: "100vw", 
      },
    mainContent: {
        flex: 1, 
        padding: "2rem",
        backgroundColor: "var(--background-color, #ffffff)",
        overflowY: "auto", 
    },
    page: {
        flex: 1,
        padding: "2rem",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1.5rem",
        marginTop: "1rem",
    },
    button:{
        padding: ".5rem",
        fontSize: "1rem",
        backgroundColor: "var(--button-color, #ee6dd5)",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    h1:{
        textAlign: "left", 
        marginBottom: "0px", 
        color: "var(--text-color)"
    },
    h3:{
        color: "var(--text-color)",
        fontWeight: "normal",
        textAlign: "left", 
        marginTop: "0px",
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",    
        boxShadow: "0 4px 8px var(--shadow-color, #eb59c199)",
        textAlign: "center",
        maxWidth: "90%",        
        flexDirection: "column",
    }
}

export default Settings;
