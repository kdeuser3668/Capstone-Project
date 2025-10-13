import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';


function Settings(){
    const navigate = useNavigate();
    var today = new Date();
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

    // Array of month names
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dd = today.getDate(); // Day of the month
    var mm = monthNames[today.getMonth()]; // Month name
    var yyyy = today.getFullYear();

    const theDate = mm + ' ' + dd + ', ' + yyyy;

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
        
return (
    <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={styles.page}>
            <h1 style={{textAlign: "left", marginBottom: "0px", color: textColor}}>Settings</h1>
            <h3 style={styles.h3}>{theDate}</h3>
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
        </div>
    </div>
    )
};

const styles = {
    page: {
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "200vh",
        backgroundColor:"white",
        margin: '10px',
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
    h3:{
        color: "var(--text-color)",
        fontWeight: "normal",
        textAlign: "left", 
        padding: "10px",
        marginTop: "0px",
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",    
        boxShadow: "0 4px 8px var(--shadow-color, #eb59c199)",
        textAlign: "center",
        width: "300px",
        maxWidth: "90%",
        display: "flex",          
        flexDirection: "column",
        justifyContent: "center",
    }
}

export default Settings;