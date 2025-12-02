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
                const raw = await res.json();

                const data = raw.map(t => ({
                    id: t.id,
                    courseId: t.course_id,
                    task: t.assignment_name,
                    priority: t.priority,
                    deadline: t.due_datetime,
                    done: t.completion
                }))

                const now = new Date();
                now.setHours(0,0,0,0);

                const total = data.length;
                const completed = data.filter(t => t.done).length;
                const remaining = data.filter(t => !t.done).length;

                const overdue = data.filter(t => {
                    const d = new Date(t.deadline);
                    d.setHours(0,0,0,0);
                    return !t.done && d < now;
                }).length;

                //locally store the timestamp of the completed task for completed today
                const completedTimeStamps = JSON.parse(localStorage.getItem("taskCompletionTimes") || "{}" )

                const completedToday = data.filter(t=> {
                    if (!t.done) return false;
                    const completedAt = completedTimeStamps[t.id];
                    if (!completedAt) return false;
                    const completedDate = new Date(completedAt);
                    completedDate.setHours(0,0,0,0);
                    return completedDate.getTime() === now.getTime();
                }).length;

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
        <h3 className="h3">Overdue:</h3>
        <h2 className="h2" style={{ textAlign: "center" }} >{stats.overdue}</h2>
        <h3 className="h3">Total Remaining:</h3>
        <h2 className="h2" style={{ textAlign: "center" }} >{stats.remaining}</h2>
        <h3 className="h3">Total Tasks:</h3>
        <h2 className="h2" style={{ textAlign: "center" }} >{stats.total}</h2>
      </div>
        )
    };

export default Progress;
