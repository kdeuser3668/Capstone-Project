///PlannerPal dashboard
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


function Dashboard(){
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        
        if (handleLogout){
            localStorage.setItem('isAuthenticated', 'false');
            navigate('/')
        }
    }; 
return (
    <div>
        <h1>Congrats, you logged input!</h1>
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
}

export default Dashboard;