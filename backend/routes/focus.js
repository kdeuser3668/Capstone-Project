import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const user_id = req.query.user_id;
        if (!user_id) return res.status(400).json({ message: "Missing user_id" });

        const result = await pool.query(
            'SELECT id, user_id, course_id, event_name, (start_date + start_time::time)::timestamptz AS start, (end_date + end_time::time)::timestamptz AS end, notes FROM calendar_events WHERE user_id = $1 AND event_type = \'focus\' ORDER BY start_date, start_time',
            [user_id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/', async (req, res) => {
    try {
        const { user_id, title, start, end, course_id, notes } = req.body;

        if (!user_id || !title || !start || !end || !course_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const startDateObj = new Date(start);
        const endDateObj = new Date(end);

        const weekday = startDateObj.getDay();

        const start_time = startDateObj.toTimeString().slice(0, 8); // "HH:MM:SS"
        const end_time = endDateObj.toTimeString().slice(0, 8);
        const start_date = startDateObj.toISOString().slice(0, 10); // "YYYY-MM-DD"
        const end_date = endDateObj.toISOString().slice(0, 10);

        const query = `
            INSERT INTO calendar_events (
                user_id, course_id, event_name, recurring, weekday, 
                start_time, end_time, start_date, end_date, location, event_type, notes
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            RETURNING *
        `;

        const values = [
            user_id,
            course_id,
            title,
            false,        // recurring always false
            weekday,
            start_time,
            end_time,
            start_date,
            end_date,
            null,           // location always empty
            'focus',      // event_type
            notes || ''
        ];

        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
