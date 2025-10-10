///PlannerPal dashboard
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


function Dashboard(){
    const navigate = useNavigate();
    var today = new Date();

    // Array of month names
    var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    var dd = today.getDate(); // Day of the month
    var mm = monthNames[today.getMonth()]; // Month name
    var yyyy = today.getFullYear();

    const theDate = mm + ' ' + dd + ', ' + yyyy;

    const handleLogout = async (e) => {
        e.preventDefault();
        
        if (handleLogout){
            localStorage.setItem('isAuthenticated', 'false');
            navigate('/')
        }
    }; 
return (
    <div>
        <h1>Dashboard</h1>
        <h3 style={styles.h3}>{theDate}</h3>
        <button type="submit" onClick={handleLogout} style={styles.button}>Log Out</button>
    </div>
    )
};

const styles = {
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
    },
}

export default Dashboard;