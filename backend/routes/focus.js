import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const user_id = req.query.user_id;
        if (!user_id) return res.status(400).json({ message: "Missing user ID. Try logging out and back in." });

        const result = await pool.query(
            `SELECT
                e.id,
                e.user_id,
                c.course_name,
                c.course_code,
                e.event_name,
                e.nonrecurring_start,
                e.nonrecurring_end,
                e.notes
            FROM calendar_events e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = $1 AND e.event_type = 'focus'
            ORDER BY e.nonrecurring_start`,
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

        //const startUTC = new Date(start);
        //const endUTC = new Date(end);

        const query = `
            INSERT INTO calendar_events (
                user_id, course_id, event_name, recurring,
                nonrecurring_start, nonrecurring_end, location, event_type, notes
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *
        `;

        const values = [
            user_id,
            course_id,
            title,
            false,          // recurring always false
            start,
            end,
            null,           // location always empty
            'focus',        // event_type
            notes || ''
        ];

        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Missing event ID.' });
    }

    await pool.query('DELETE FROM calendar_events WHERE id = $1', [id]);
    res.status(200).json({ message: 'Session deleted successfully.' });
  } catch (error) {
    console.error('Session DELETE error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, start, end, course_id, notes } = req.body;

        if (!title || !start || !end || !course_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await pool.query(
            `UPDATE calendar_events
             SET event_name = $1,
                 nonrecurring_start = $2,
                 nonrecurring_end = $3,
                 course_id = $4,
                 notes = $5
             WHERE id = $6
             RETURNING *`,
            [title, start, end, course_id, notes || '', id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
