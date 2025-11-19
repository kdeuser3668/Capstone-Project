import { useEffect, useState } from "react";

export function Courses(){



    return (
        <div>
        <h3 className="h3">Completed Today:</h3>
        <h2 className="h2" style={{ textAlign: "center" }} >{stats.completed}</h2>
        <h3 className="h3">Total Tasks:</h3>
        <h2 className="h2" style={{ textAlign: "center" }} >{stats.total}</h2>
        <h3 className="h3">Overdue:</h3>
        <h2 className="h2" style={{ textAlign: "center" }} >{stats.overdue}</h2>
        <h3 className="h3">Total Remaining:</h3>
        <h2 className="h2" style={{ textAlign: "center" }} >{stats.remaining}</h2>
      </div>
        )
    };

export default Courses;
