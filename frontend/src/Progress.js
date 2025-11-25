import { useEffect, useState } from "react";


export function Progress(){
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        remaining: 0,
        overdue: 0
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?.id;

        if (!userId) return;

        const fetchStats = async() => {
            try{
                const res = await fetch(`http://localhost:5050/tasks?userId=${userId}`);
                const data = await res.json();

                const now = new Date();
                now.setHours(0,0,0,0);

                const total = data.length;
                const completed = data.filter(t => t.completion).length;
                const remaining = data.filter(t => !t.completion).length;

                const overdue = data.filter(t => {
                    const deadline = new Date(t.due_datetime);
                    deadline.setHours(0,0,0,0);
                    return !t.completion && deadline < now;
                }).length;

                const completedToday = data.filter(t=> {
                    if (!t.completion) return false;
                    const deadline = new Date(t.due_datetime);
                    deadline.setHours(0,0,0,0);
                    return deadline.getTime() === now.getTime();
                }).length

                setStats({
                    total,
                    completed: completedToday,
                    remaining,
                    overdue,
                });

            }catch (err){
                console.error("Progress stats failed to fetch", err)
            }
        };
        fetchStats();
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
