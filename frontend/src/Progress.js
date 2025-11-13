import { useEffect, useState } from "react";

export function Progress(){
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        remaining: 0,
        overdue: 0
    });

    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const completed = JSON.parse(localStorage.getItem('completedTasks')) || [];

        const total = tasks.length + completed.length;
        const completedCount = tasks.filter( (t) => new Date(t.deadline) == now && !t.done ).length;
        const remaining = tasks.length;

        const now = new Date();
        const overdue = tasks.filter( (t) => new Date(t.deadline) < now && !t.done ).length;

        setStats({
            total,
            completed: completedCount,
            remaining,
            overdue,
        });
    }, []);

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

export default Progress;