import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET all courses for a user
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        const result = await pool.query(
            `SELECT id, course_name, course_code, instructor_name, 
                    course_semester, color_code
             FROM courses
             WHERE user_id = $1
             ORDER BY course_name`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// CREATE a course
router.post("/", async (req, res) => {
    try {
        const {
            course_name,
            course_code,
            instructor_name,
            course_semester,
            color_code,
            user_id
        } = req.body;

        const result = await pool.query(
            `INSERT INTO courses 
             (course_name, course_code, instructor_name, course_semester, color_code, user_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                course_name,
                course_code,
                instructor_name,
                course_semester,
                color_code,
                user_id
            ]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE a course
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            course_name,
            course_code,
            instructor_name,
            course_semester,
            color_code
        } = req.body;

        const result = await pool.query(
            `UPDATE courses
             SET course_name = $1,
                 course_code = $2,
                 instructor_name = $3,
                 course_semester = $4,
                 color_code = $5
             WHERE id = $6
             RETURNING *`,
            [
                course_name,
                course_code,
                instructor_name,
                course_semester,
                color_code,
                id
            ]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE a course
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM courses WHERE id = $1", [id]);

        res.json({ message: "Course deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
