import { useState } from "react";
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

    // Array of month names
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dd = today.getDate(); // Day of the month
    var mm = monthNames[today.getMonth()]; // Month name
    var yyyy = today.getFullYear();

    const theDate = mm + ' ' + dd + ', ' + yyyy;

    //not saving or applying changed across all pages, need to adjust this.
    const handleColorChange = (event) => {
        const newColor = event.target.value;
        setTextColor(newColor);
        window.localStorage.setItem("textColor", newColor);
      };
    


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
        backgroundColor: "#ee6dd5",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    h3:{
        color: "textColor",
        fontWeight: "normal",
        textAlign: "left", 
        padding: "10px",
        marginTop: "0px",
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",    
        boxShadow: "0 4px 8px rgba(235, 89, 193, 0.6)",
        textAlign: "center",
        width: "300px",
        maxWidth: "90%",
        display: "flex",          
        flexDirection: "column",
        justifyContent: "center",
    }
}

export default Settings;