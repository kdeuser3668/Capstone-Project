import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';


function Settings(){
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
            <h1 style={{textAlign: "left", padding: "10px", marginBottom: "0px"}}>Settings</h1>
            <h3 style={styles.h3}>{theDate}</h3>
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
        fontWeight: "normal",
        textAlign: "left", 
        padding: "10px",
        marginTop: "0px",
    }
}

export default Settings;