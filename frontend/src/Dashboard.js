///PlannerPal dashboard
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';


function Dashboard(){
    const navigate = useNavigate();
    var today = new Date();


    // Array of month names
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dd = today.getDate(); // Day of the month
    var mm = monthNames[today.getMonth()]; // Month name
    var yyyy = today.getFullYear();

    const theDate = mm + ' ' + dd + ', ' + yyyy;

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <h1 style={styles.h1}>
          Dashboard
        </h1>
        <h3 style={styles.h3}>{theDate}</h3>
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
        padding: "10px",
        marginTop: "0px",
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",    
        boxShadow: "0 4px 8px var(--shadow-color, #eb59c199)",
        textAlign: "center",
        maxWidth: "90%",
        display: "flex",          
        flexDirection: "column",
    }
}

export default Dashboard;