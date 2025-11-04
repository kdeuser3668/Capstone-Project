import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';


function Progress(){
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
            <h1 className="h1">Progress</h1>
            <h3 h3 className="h3">{theDate}</h3>
        </div>
    </div>
    )
};

export default Progress;