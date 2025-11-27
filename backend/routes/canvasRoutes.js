import express from "express";
import { pool } from "../db.js";
import fetch from "node-fetch";

const router = express.Router();

// ===== SAVE TOKEN =====
router.post("/save-token", async (req, res) => {
  const { userId, canvasToken } = req.body;

  console.log("Saving Canvas token for user:", userId);

  try {
    await pool.query(
      `INSERT INTO user_canvas_tokens (user_id, canvas_access_token)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET canvas_access_token = $2`,
      [userId, canvasToken]
    );

    res.status(200).json({ success: true, message: "Token stored successfully" });
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ success: false, error: "Database save failed" });
  }
});

// ===== GET USER COURSES (handles both check + fetch) =====
router.get("/courses/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT canvas_access_token FROM user_canvas_tokens WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0 || !result.rows[0].canvas_access_token) {
      return res.json({ success: false, error: "No Canvas token found" });
    }

    const token = result.rows[0].canvas_access_token;

    const response = await fetch(
      "https://canvas.instructure.com/api/v1/courses?enrollment_state=active&state[]=available",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const courses = await response.json();
    res.json({ success: true, courses });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ success: false, error: "Failed to fetch courses" });
  }
});

export default router;
