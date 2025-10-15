///PlannerPal dashboard
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';


function Dashboard(){
    const navigate = useNavigate();
    var today = new Date();


    // Array of month names
    var monthNamesDate = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var ddd = today.getDate(); // Day of the month
    var mmm = monthNamesDate[today.getMonth()]; // Month name
    var yyyyy = today.getFullYear();

    const theDate = mmm + ' ' + ddd + ', ' + yyyyy;

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <h1 className="h1">
          Dashboard
        </h1>
        <h3 className="h3">{theDate}</h3>
      </div>
    </div>
  );
}

export default Dashboard;