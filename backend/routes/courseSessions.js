import express from "express";
import { db } from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.request().query(`
      SELECT 
        cs.id,
        c.course_name AS title,
        cs.weekday,
        cs.start_time,
        cs.end_time,
        cs.start_date,
        cs.end_date
      FROM course_sessions cs
      JOIN courses c ON cs.course_id = c.id
    `);

    const events = [];

    for (const row of result.recordset) {
      if (!row.start_date || !row.end_date || !row.start_time || !row.end_time) continue;

      // Parse start/end dates
      const startDate = new Date(row.start_date);
      const endDate = new Date(row.end_date);

      // JS getDay(): 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const targetWeekday = row.weekday;

      // Parse times to HH:MM:SS strings
      const startTimeStr = row.start_time.toString().substr(0, 8);
      const endTimeStr = row.end_time.toString().substr(0, 8);

      // Loop through each day between startDate and endDate
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (d.getDay() === targetWeekday) {
          // Build ISO strings without modifying local time
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");

          const startDateTime = `${yyyy}-${mm}-${dd}T${startTimeStr}`;
          const endDateTime = `${yyyy}-${mm}-${dd}T${endTimeStr}`;

          events.push({
            id: `${row.id}-${yyyy}-${mm}-${dd}`,
            text: row.title,
            start: startDateTime,
            end: endDateTime,
          });
        }
      }
    }

    res.json(events);
  } catch (err) {
    console.error("Error fetching course sessions:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;