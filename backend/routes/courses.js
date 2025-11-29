import express from "express";
import { pool } from "../db.js";

const router = express.Router();

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
        console.error("Get courses error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

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

        if (!user_id || !course_name) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await pool.query(
            `INSERT INTO courses 
             (course_name, course_code, instructor_name, course_semester, color_code, user_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [course_name, course_code, instructor_name, course_semester, color_code, user_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Create course error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

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
            [course_name, course_code, instructor_name, course_semester, color_code, id]
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

router.delete("/:id", async (req, res) => {
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
