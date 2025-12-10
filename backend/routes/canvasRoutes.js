import express from "express";
import { pool } from "../db.js";
import fetch from "node-fetch";

const router = express.Router();

// ===== SAVE TOKEN =====
router.post("/save-token", async (req, res) => {
  const { userId, canvasToken } = req.body;

  if (!userId || !canvasToken) {
    return res.status(400).json({ success: false, error: "Missing userId or canvasToken" });
  }

  console.log("Saving Canvas token for user:", userId);

  try {
    // Always upsert the token for this user
    await pool.query(
      `INSERT INTO user_canvas_tokens (user_id, canvas_access_token)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET canvas_access_token = EXCLUDED.canvas_access_token`,
      [userId, canvasToken]
    );

    res.status(200).json({ success: true, message: "Token stored successfully" });
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ success: false, error: "Database save failed" });
  }
});

// ===== GET USER COURSES + ASSIGNMENTS =====
router.get("/courses/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ success: false, error: "Missing userId" });
  }

  try {
    const result = await pool.query(
      `SELECT canvas_access_token FROM user_canvas_tokens WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0 || !result.rows[0].canvas_access_token) {
      return res.json({ success: false, error: "No Canvas token found" });
    }

    const token = result.rows[0].canvas_access_token;

    // Fetch courses from UMSystem Canvas domain
    const courseRes = await fetch(
      "https://umsystem.instructure.com/api/v1/courses?enrollment_state=active&state[]=available&per_page=50",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const courses = await courseRes.json();

    // Fetch assignments for each course (simplified fields)
    const coursesWithAssignments = await Promise.all(
      courses.map(async (course) => {
        try {
          const assignRes = await fetch(
            `https://umsystem.instructure.com/api/v1/courses/${course.id}/assignments?per_page=50`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const assignments = await assignRes.json();

          const simplifiedAssignments = Array.isArray(assignments)
            ? assignments.map((a) => ({
                id: a.id,
                name: a.name,
                due_at: a.due_at,
                html_url: a.html_url,
              }))
            : [];

          return { id: course.id, name: course.name, assignments: simplifiedAssignments };
        } catch (err) {
          console.error(`Error fetching assignments for course ${course.id}:`, err);
          return { id: course.id, name: course.name, assignments: [] };
        }
      })
    );

    res.json({ success: true, courses: coursesWithAssignments });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ success: false, error: "Failed to fetch courses" });
  }
});

export default router;
