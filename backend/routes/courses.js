import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ message: "Missing User ID" });
        }

        const result = await pool.query(
            `SELECT id, course_name 
             FROM courses 
             WHERE user_id = $1 
             ORDER BY course_name`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Get courses error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.post('/', async (req, res) => {
    try {
        const { userId, course_name } = req.body;

        if (!userId || !course_name) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await pool.query(
            `INSERT INTO courses (user_id, course_name)
             VALUES ($1, $2)
             RETURNING id, course_name`,
            [userId, course_name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Create course error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { course_name } = req.body;

        if (!course_name) {
            return res.status(400).json({ message: "Missing course_name" });
        }

        const result = await pool.query(
            `UPDATE courses
             SET course_name = $1
             WHERE id = $2
             RETURNING id, course_name`,
            [course_name, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Update course error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM courses
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted" });
    } catch (err) {
        console.error("Delete course error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;