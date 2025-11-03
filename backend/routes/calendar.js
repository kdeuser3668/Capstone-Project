import express from "express";
import { pool } from "../db.js";
import { google } from "googleapis";

const router = express.Router();

// -------------------- Local DB routes --------------------

// GET all events
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET events for a specific date (YYYY-MM-DD)
router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const result = await pool.query(
      "SELECT * FROM events WHERE date = $1 ORDER BY id ASC",
      [date]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events by date:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST new event
router.post("/", async (req, res) => {
  try {
    const { title, description, date, time } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await pool.query(
      "INSERT INTO events (title, description, date, time) VALUES ($1, $2, $3, $4)",
      [title, description || null, date, time || null]
    );

    res.status(201).json({ message: "Event added successfully" });
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE event by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM events WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully", event: result.rows[0] });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------- Google Calendar routes --------------------

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

// Generate Google OAuth URL
router.get("/google/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.json({ url });
});

// Fetch Google events using access token
router.get("/google/events", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Missing token" });

  try {
    oauth2Client.setCredentials({ access_token: token });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const eventsResponse = await calendar.events.list({
      calendarId: "primary",
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });
    res.json(eventsResponse.data.items);
  } catch (err) {
    console.error("Error fetching Google events:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Handle Google OAuth callback
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("No code provided");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.json({ tokens });
  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
